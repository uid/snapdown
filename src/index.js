'use strict';

const klay = require('klayjs');

const parser = require('snapdown-parser');

const scriptSelector = 'script[type="text/snapdown"]';

function parse(text) {
  try {
    return parser.parse(text);
  } catch(e) {
    if (e.location) {
      e.message += ` (line ${e.location.start.line} col ${e.location.start.column})`;
    }
    e.input = text;
    throw e;
  }
};

function createSVG() {
  let root = createElementInSVG('svg');
  root.insertAdjacentHTML('afterbegin', `
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
      <path d="M0,8 L8,4 L0,0"/>
    </marker>
    <filter id="double">
      <feMorphology in="SourceGraphic" result="Dilated" operator="dilate" radius="1"/>
      <feComposite in="SourceGraphic" in2="Dilated" result="Out" operator="xor"/>
    </filter>
  </defs>
  <style>
    g.object > rect {
      stroke: black;
      fill: none;
    }
    g.array > rect {
      stroke: black;
      fill: none;
    }
    path.arrow {
      stroke: black;
      fill: none;
      marker-end: url(#arrowhead);
    }
    #arrowhead {
      stroke: black;
      fill: none;
      filter: none;
    }
    g.object.immutable > rect, 
    path.arrow.immutable {
      filter: url(#double);
    }
    text {
      font-family: sans-serif;
      font-size: 12pt;
      text-anchor: middle;
      dominant-baseline: middle;
    }
  </style>`);
  return root;
}

function createElementInSVG(tag) {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
}

const metrics = createSVG();

const makeID = function() {
  let counter = 0;
  return function makeID(type) {
    return `${type}${counter++}`;
  };
}();

function transform(spec) {
  let env = {
    labels: {},
    values: {},
  };
  document.body.append(metrics);
  let graph = {
    children: [],
    edges: [],
  };
  transform.all(spec, graph, graph, env);
  document.body.removeChild(metrics);
  graph.edges.filter(edge => edge.target.ref).forEach(edge => {
    edge.target = env.values[edge.target.ref].id;
  });
  return graph;
}
transform.all = function(obj, graph, parent, env) {
  if (typeof obj === 'string') {
    return [ { id: { ref: obj } } ];
  } else if (obj instanceof Array) {
    return obj.map(elt => transform.all(elt, graph, parent, env));
  } else if (typeof obj === 'object') {
    return Object.keys(obj).map(key => transform[key](obj[key], graph, parent, env));
  } else {
    throw new Error('transform: encountered ' + typeof obj + ' ' + obj);
  }
};
transform.heap = function(heap, graph, parent, env) {
  return transform.all(heap, graph, parent, env);
};
transform.stacks = function(stacks, graph, parent, env) {
  return []; // TODO
};
transform.pointer = function(pointer, graph, parent, env) {
  let target = transform.all(pointer.target, graph, graph, env)[0];
  if (pointer.source.text || pointer.source.blank) {
    let source = transform.label(pointer.source.text, graph, parent, env);
    let edge = {
      id: makeID('arrow'),
      source: source.id,
      target: target.id,
      classes: [ 'arrow', pointer.mutable ? 'mutable' : 'immutable', pointer.broken ? 'broken' : '_' ],
      bendPoints: [],
    };
    graph.edges.push(edge);
  }
  if (pointer.source.name) {
    env.values[pointer.source.name] = target;
  }
  return target;
};
transform.object = function(object, graph, parent, env) {
  let child = {
    id: makeID('object'),
    labels: makeLabels(object.type),
    properties: {
      nodeLabelPlacement: 'INSIDE V_TOP H_CENTER',
      sizeConstraint: 'NODE_LABELS MINIMUM_SIZE',
      crossMin: 'INTERACTIVE',
    },
    classes: [ 'object', object.mutable ? 'mutable' : 'immutable' ],
    children: [],
  };
  transform.all(object.fields, graph, child, env);
  graph.children.push(child);
  return child;
};
transform.array = function(array, graph, parent, env) {
  let child = {
    id: makeID('array'),
    properties: {
      crossMin: 'INTERACTIVE',
    },
    classes: [ 'array' ],
    children: [],
  };
  transform.all(array, graph, parent, env).forEach(elt => {
    let cell = {
      id: makeID('cell'),
      labels: [],
      classes: [ 'cell' ],
    };
    child.children.push(cell);
    graph.edges.push({
      id: makeID('element'),
      source: cell.id,
      target: elt[0].id,
      classes: [ 'arrow', 'mutable' ],
      bendPoints: [],
    });
  });
  graph.children.push(child);
  return child;
}
transform.pair = function(pair, graph, parent, env) {
  // TODO FIXME de-duplicate vs. above, but notice change of graph/parent
  let child = {
    id: makeID('array'),
    properties: {
      crossMin: 'INTERACTIVE',
    },
    classes: [ 'array' ],
    children: [],
  };
  transform.all([ pair.left, pair.right ], graph, graph, env).forEach(elt => {
    let cell = {
      id: makeID('cell'),
      labels: [],
      classes: [ 'cell' ],
    };
    child.children.push(cell);
    graph.edges.push({
      id: makeID('element'),
      source: cell.id,
      target: elt[0].id,
      classes: [ 'arrow', 'mutable' ],
      bendPoints: [],
    });
  });
  parent.children.push(child);
  return child;
};
// TODO FIXME object fields and locals (incorrectly) share a namespace.
// TODO FIXME absolutely no support for duplicate names!
transform.label = function(name, graph, parent, env) {
  if (name && env.labels[name]) { return env.labels[name]; }
  const elt = {
    id: makeID('label'),
    labels: makeLabels(name || ''),
    properties: {
      nodeLabelPlacement: 'INSIDE V_CENTER H_CENTER',
      sizeConstraint: 'NODE_LABELS MINIMUM_SIZE',
    },
    classes: [ 'label' ],
  };
  parent.children.push(elt);
  if (name) { env.labels[name] = elt; }
  return elt;
}
transform.string = function(string, graph, parent, env) {
  let child = {
    id: makeID('string'),
    labels: makeLabels(`"${string}"`),
    properties: {
      nodeLabelPlacement: 'INSIDE V_CENTER H_CENTER',
      sizeConstraint: 'NODE_LABELS MINIMUM_SIZE',
    },
    classes: [ 'string' ],
  };
  parent.children.push(child);
  return child;
}
transform.primitive = function(primitive, graph, parent, env) {
  let child = {
    id: makeID('primitive'),
    labels: makeLabels(`${primitive}`),
    properties: {
      nodeLabelPlacement: 'INSIDE V_CENTER H_CENTER',
      sizeConstraint: 'NODE_LABELS MINIMUM_SIZE',
    },
    classes: [ 'primitive' ],
  };
  graph.children.push(child);
  return child;
};

function makeLabels(text) {
  let elt = createElementInSVG('text');
  elt.textContent = text;
  metrics.append(elt);
  let { width, height } = elt.getBoundingClientRect();
  metrics.removeChild(elt);
  return [ { text, width, height } ];
}

function TODO(parent) {
  let child = {
    id: makeID('TODO'),
    labels: makeLabels('TODO'),
    properties: {
      nodeLabelPlacement: 'INSIDE V_CENTER H_CENTER',
      sizeConstraint: 'NODE_LABELS MINIMUM_SIZE',
    },
    classes: [ 'TODO' ],
  };
  parent.children.push(child);
  return child;
}

function draw(scriptElement, graph) {
  const root = createSVG();
  scriptElement.parentNode.insertBefore(root, scriptElement.nextSibling);
  [ 'width', 'height' ].forEach(attr => root.setAttribute(attr, graph[attr]));
  
  const parents = new Map();
  
  graph.children.forEach(drawAtom.bind(null, root, parents));
  
  graph.edges.forEach(function(edge) {
    // TODO FIXME https://github.com/OpenKieler/klayjs-svg/blob/master/klayjs-svg.js#L176
    var path = createElementInSVG('path');
    edge.classes.forEach(clazz => path.classList.add(clazz));
    var desc = [];
    desc.push('M', edge.sourcePoint.x, edge.sourcePoint.y);
    edge.bendPoints && edge.bendPoints.forEach(bend => desc.push('L', bend.x, bend.y));
    desc.push('L', edge.targetPoint.x, edge.targetPoint.y);
    path.setAttribute('d', desc.join(' '));
    (parents[edge.source] || root).append(path);
  });
}
function drawAtom(parent, parents, atom) {
  if (atom.children) {
    drawObject(parent, parents, atom);
  } else {
    drawLabel(parent, parents, atom);
  }
}
function drawObject(parent, parents, obj) {
  var group = createElementInSVG('g');
  group.setAttribute('transform', 'translate('+obj.x+','+obj.y+')');
  obj.classes.forEach(clazz => group.classList.add(clazz));
  
  obj.labels && obj.labels.forEach(function(atom) {
    var text = createElementInSVG('text');
    text.classList.add('type');
    text.setAttribute('x', atom.x + atom.width/2);
    text.setAttribute('y', atom.y + atom.height/2);
    text.textContent = atom.text;
    group.append(text);
  });
  
  var rect = createElementInSVG('rect');
  [ 'width', 'height' ].forEach(attr => rect.setAttribute(attr, obj[attr]));
  if (obj.classes.indexOf('object') >= 0) {
    rect.setAttribute('rx', 20);
  }
  group.append(rect);
  
  obj.children && obj.children.forEach(drawAtom.bind(null, group, parents));
  
  parent.append(group);
}
function drawLabel(parent, parents, label) {
  parents[label.id] = parent;
  var text = createElementInSVG('text');
  label.classes.forEach(clazz => text.classList.add(clazz));
  text.setAttribute('x', label.x + label.width/2);
  text.setAttribute('y', label.y + label.height/2);
  text.textContent = label.labels.map(label => label.text).join('\n');
  parent.append(text);
}

function render(scriptElement) {
  if ( ! scriptElement.matches(scriptSelector)) {
    throw new Error('render: expected input', scriptElement, 'to be a', scriptSelector);
  }
  const snap = {}; // TODO yaml_front_matter.parse(scriptElement.text);
  const text = scriptElement.text; // TODO snap.__content;
  const spec = window.spec = parse(text);
  const graph = window.graph = transform(spec);
  klay.layout({
    graph,
    options: {
      algorithm: 'de.cau.cs.kieler.klay.layered',
      direction: 'DOWN',
      edgeRouting: 'POLYLINE',
    },
    success: draw.bind(null, scriptElement),
    error: err => console.log(err),
  });
}

function renderAll() {
  Array.prototype.slice.call(document.querySelectorAll(scriptSelector)).forEach(render);
};

module.exports = { parser, render, renderAll };
