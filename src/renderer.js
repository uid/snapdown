'use strict';

function createSVG(tag, classes) {
  let elt = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (classes) { elt.classList.add(classes); }
  return elt;
}

function createSVGRoot() {
  let root = createSVG('svg');
  root.insertAdjacentHTML('afterbegin', `
    <defs>
      <marker id="snap-arrowhead" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
        <path d="M0,8 L8,4 L0,0"/>
      </marker>
      <filter id="snap-double">
        <feMorphology in="SourceGraphic" result="Doubled" operator="dilate" radius="1"/>
        <feComposite in="SourceGraphic" in2="Doubled" result="Out" operator="xor"/>
      </filter>
    </defs>
    <style>
    rect.snap-obj { stroke: black; fill: none; }
    path.snap-arrow { stroke: black; fill: none; marker-end: url(#snap-arrowhead); }
    #snap-arrowhead { stroke: black; fill: none; }
    .snap-immutable { filter: url(#snap-double); }
    text { font-family: sans-serif; font-size: 12pt; text-anchor: start; alignment-baseline: hanging; }
    </style>
  `);
  return root;
}

const metrics = createSVGRoot();

const makeID = function() {
  let counter = 0;
  return function makeID(type) {
    return `${type}${counter++}`;
  };
}();

function drawable(snap) {
  document.body.append(metrics);
  let graph = {
    id: 'diagram',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.edgeRouting': 'POLYLINE',
      'elk.hierarchyHandling': 'INCLUDE_CHILDREN',
    },
    children: [ drawableHeap(snap.heap) ],
  }
  document.body.removeChild(metrics);
  return graph;
}

function drawableHeap(heap) {
  let graph = {
    id: 'heap',
    children: [],
    edges: [],
  }
  heap.forEach(e => incorporate(e, graph));
  return graph;
}

function incorporate(e, graph, showHashRefs=false) {
  // pointer
  if (e.name) {
    let nodeSpacing = 20;
    let isHashRef = e.name.ref.startsWith('#');
    if (e.name.ref && isHashRef && !showHashRefs) { return; } // TODO can we unnest name: { ref: x } to name: x somewhere?
    let ptr = Object.assign({
      id: makeID('ptr'),
      layoutOptions: {
        'elk.nodeLabels.placement': 'INSIDE V_TOP H_CENTER',
        'elk.nodeSize.constraints': 'MINIMUM_SIZE',
        'elk.position': `(${nodeSpacing * graph.children.length}, 0)`,
      },
      labels: isHashRef ? [] : makeLabels(e.name.ref)
    }, e);
    graph.children.push(ptr);
    graph.edges.push(Object.assign({ id: makeID('edge'), sources: [ ptr.id ], targets: [ ptr.target.to ] }, e));
    return;
  }
  
  // object
  if (e.object) {
    let labels = makeLabels(e.object);
    let obj = Object.assign({
      id: makeID('obj'),
      layoutOptions: {
        'elk.nodeLabels.placement': 'INSIDE V_TOP H_CENTER',
        'elk.nodeSize.constraints': 'NODE_LABELS MINIMUM_SIZE',
        'elk.layered.crossingMinimization.semiInteractive': true,
      },
      labels,
      children: [],
      edges: [],
    }, e);
    if(obj.fields.length) {
      // TODO understand WTF is going on here
      // the axes are flipped for nodes w/ childen vs. w/o, so only do this when there are fields?!
      Object.assign(obj.layoutOptions, {
        'elk.nodeSize.minimum': `0,${Math.max.apply(null, labels.map(l => l.width))}`,
      });
    }
    graph.children.push(obj);
    obj.fields.forEach(f => incorporate(f, obj, true));
    return;
  }
  
  // array
  if (e.array) {
    let arr = Object.assign({
      id: makeID('arr'),
      children: [],
      edges: [],
    }, e);
    graph.children.push(arr);
    // TODO order matters, push cell children instead
    arr.array.forEach(f => incorporate(f, arr));
    return;
  }
  
  // primitive:
  if (e.val !== undefined) {
    graph.children.push(Object.assign({
      id: makeID('val'),
      layoutOptions: {
        'elk.nodeLabels.placement': 'INSIDE V_TOP H_CENTER',
      },
      labels: makeLabels(e.val),
    }, e));
    return;
  }
  
  throw new Error('Snapdown cannot incorporate: ' + Object.keys(e));
}

function makeLabels(text) {
  if (text === undefined) { return []; }
  let elt = createSVG('text');
  elt.textContent = text = `${text}`;
  metrics.append(elt);
  let { width, height } = elt.getBoundingClientRect();
  metrics.removeChild(elt);
  return [ { text, width, height } ];
}

function draw(nearby, graph, id) {
  let root = createSVGRoot();
  root.id = id;
  nearby.parentNode.insertBefore(root, nearby.nextSibling);
  [ 'width', 'height' ].forEach(attr => root.setAttribute(attr, graph[attr]));
  
  graph.children.forEach(drawAtom.bind(null, root));
}

function drawAtom(parent, atom) {
  let group = createSVG('g');
  group.setAttribute('transform', 'translate(' + atom.x + ',' + atom.y + ')');
  
  // object
  if (atom.object) {
    let rect = createSVG('rect', 'snap-obj');
    [ 'width', 'height' ].forEach(attr => rect.setAttribute(attr, atom[attr]));
    rect.setAttribute('rx', 20);
    if (atom.immutable) { rect.classList.add('snap-immutable'); }
    group.append(rect);
  }
  
  atom.labels && atom.labels.forEach(drawLabel.bind(null, group));
  atom.children && atom.children.forEach(drawAtom.bind(null, group));
  atom.edges && atom.edges.forEach(drawEdge.bind(null, group));
  parent.append(group);
}

function drawLabel(parent, label) {
  let text = createSVG('text');
  [ 'x', 'y' ].forEach(attr => text.setAttribute(attr, label[attr]));
  text.textContent = label.text;
  parent.append(text);
}

function drawEdge(parent, edge) {
  // TODO https://github.com/OpenKieler/klayjs-svg/blob/master/klayjs-svg.js#L176
  var path = createSVG('path', 'snap-arrow');
  if (edge.immutable) { path.classList.add('snap-immutable'); }
  path.setAttribute('d', edge.sections.map(s => [
    'M', s.startPoint.x, s.startPoint.y,
    ...(s.bendPoints || []).map(bend => `L ${bend.x} ${bend.y}`),
    'L', s.endPoint.x, s.endPoint.y,
  ].join(' ')).join(' '));
  parent.append(path);
}

module.exports = { drawable, draw };