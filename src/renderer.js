"use strict";

function createSVG(tag, classes) {
  let elt = document.createElementNS("http://www.w3.org/2000/svg", tag);
  if (classes) {
    elt.classList.add(classes);
  }
  return elt;
}

function createSVGRoot(setStyleId) {
  let root = createSVG("svg", ["no-markdown"]);
  let id = (Math.random() + 1).toString(36).substring(7);
  root.insertAdjacentHTML(
    "afterbegin",
    `
    <defs>
      <marker id="snap-arrowhead-${id}" markerWidth="10" markerHeight="8" refX="8" refY="4" orient="auto">
        <path d="M0,8 L8,4 L0,0"/>
      </marker>
      <filter id="snap-double-${id}" x="-150%" y="-150%" width="300%" height="300%" filterUnits="userSpaceOnUse">
        <feMorphology in="SourceGraphic" result="Doubled" operator="dilate" radius="1"/>
        <feComposite in="SourceGraphic" in2="Doubled" result="Out" operator="xor"/>
      </filter>
    </defs>
    <style>
    rect.snap-obj { stroke: black; fill: none; }
    path.snap-separator { stroke: black; fill: none; }
    path.snap-container { stroke: black; fill: none; }
    path.snap-arrow-${id} { stroke: black; fill: none; marker-end: url(#snap-arrowhead-${id}); }
    path.snap-x { stroke: red; stroke-width: 2; fill: none }
    #snap-arrowhead-${id} { stroke: black; fill: none; }
    .snap-immutable-${id} { filter: url(#snap-double-${id}); }
    text.object { font-family: sans-serif; font-size: 10pt; text-anchor: middle; transform: translateY(1.5ex); }
    text.value { font-family: sans-serif; font-size: 12pt; text-anchor: start; transform: translateY(1.5ex); }
    </style>
  `
  );
  if (setStyleId) setStyleId(id);
  return root;
}

const metrics = createSVGRoot();

const makeID = (function () {
  let counter = 0;
  return function makeID(type) {
    return `${type}${counter++}`;
  };
})();

function drawable(snap) {
  document.body.append(metrics);
  let graph = {
    id: "diagram",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "DOWN",
      "elk.edgeRouting": "POLYLINE",
      "elk.hierarchyHandling": "INCLUDE_CHILDREN",
    },
    children: [drawableHeap(snap.heap), drawableHeap(snap.stack)],
  };
  document.body.removeChild(metrics);
  return graph;
}

function drawableHeap(heap) {
  let graph = {
    id: "heap",
    children: [],
    edges: [],
  };
  heap.forEach((e) => incorporate(e, graph));
  return graph;
}

function incorporate(e, graph, showHashRefs = false) {
  const nodeSpacing = 20;

  // pointer
  if (e.name) {
    let isHashRef = e.name.ref && e.name.ref.startsWith("#");
    if (e.name.ref && isHashRef && !showHashRefs) {
      return;
    } // TODO can we unnest name: { ref: x } to name: x somewhere?
    let ptr = Object.assign(
      {
        id: e.source,
        labels: isHashRef || !e.independent ? [] : makeLabels(e.name.ref),
      },
      e
    );

    if (!ptr.layoutOptions) ptr.layoutOptions = {};
    ptr.layoutOptions = Object.assign(
      {
        "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
        "elk.nodeSize.constraints": "MINIMUM_SIZE",
      },
      ptr.layoutOptions
    );

    graph.children.push(ptr);
    for (var to of ptr.target.to) {
      let edge = Object.assign(
        { id: makeID("edge"), sources: [ptr.source], targets: [to.id] },
        e
      );
      graph.edges.push(Object.assign(edge, to.options));
    }
    return;
  }

  // objects and functions
  if (e.object || e.func) {
    let labels = makeLabels(e.object || e.func);
    let obj = Object.assign(
      {
        id: makeID("obj"),
        layoutOptions: {
          "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
          "elk.nodeSize.constraints": "NODE_LABELS MINIMUM_SIZE",
          "elk.layered.crossingMinimization.semiInteractive": true,
        },
        labels,
        children: [],
        edges: [],
      },
      e
    );
    if (obj.fields.length) {
      // TODO understand WTF is going on here
      // the axes are flipped for nodes w/ childen vs. w/o, so only do this when there are fields?!
      Object.assign(obj.layoutOptions, {
        "elk.nodeSize.minimum": `0,${Math.max.apply(
          null,
          labels.map((l) => l.width)
        )}`,
      });
    }
    graph.children.push(obj);
    obj.fields.forEach((f, i) => {
      // assign default position to each field
      if (!f.layoutOptions) f.layoutOptions = {};
      f.layoutOptions = Object.assign(
        {
          "elk.position": `(${nodeSpacing * i}, 0)`,
        },
        f.layoutOptions
      );
      incorporate(f, obj, true);
    });
    return;
  }

  // array
  if (e.array) {
    let arr = Object.assign(
      {
        id: makeID("arr"),
        layoutOptions: {
          "elk.layered.crossingMinimization.semiInteractive": true,
        },
        children: [],
        edges: [],
      },
      e
    );
    if (!e.inside) {
      graph.children.push(arr);
    }
    arr.array.forEach((f, i) => {
      // assign default position to each field
      if (!f.layoutOptions) f.layoutOptions = {};
      if (e.inside) {
        f.group = arr.id;
        f.layoutOptions = Object.assign(e.layoutOptions, f.layoutOptions);
        incorporate(f, graph, true);
      } else {
        f.layoutOptions = Object.assign(
          {
            "elk.position": `(${nodeSpacing * i}, 0)`,
          },
          f.layoutOptions
        );
        incorporate(f, arr, true);
      }
    });
    return;
  }

  // primitive:
  if (e.val !== undefined) {
    graph.children.push(
      Object.assign(
        {
          id: makeID("val"),
          layoutOptions: {
            "elk.nodeLabels.placement": "INSIDE V_TOP H_CENTER",
          },
          labels: makeLabels(e.val),
        },
        e
      )
    );
    return;
  }

  throw new Error("Snapdown cannot incorporate: " + Object.keys(e));
}

function getTextBounds(text) {
  let sections = text.split("\n");
  let dimensions = sections.map((x) => {
    let elt = createSVG("text");
    elt.textContent = x;
    metrics.append(elt);
    let { width, height } = elt.getBoundingClientRect();
    return { width, height };
    metrics.removeChild(elt);
  });

  return {
    width: Math.max(...dimensions.map((x) => x.width)),
    height: dimensions.reduce((a, b) => a + b.height, 0),
  };
}

function makeLabels(text) {
  if (text === undefined) {
    return [];
  }
  text = `${text}`.split("#")[0];
  let { width, height } = getTextBounds(text);
  return [{ text, width, height }];
}

function draw(nearby, graph, id) {
  let styleId;
  let root = createSVGRoot((x) => {
    styleId = x;
  });
  root.id = id;
  nearby.parentNode.insertBefore(root, nearby.nextSibling);
  ["width", "height"].forEach((attr) => root.setAttribute(attr, graph[attr]));

  document.body.append(metrics);
  graph.children.forEach(drawAtom.bind(null, root, styleId));
  document.body.removeChild(metrics);

  // rescale svg as necessary
  root.setAttribute(
    "viewBox",
    `0 0 ${root.getAttribute("width")} ${root.getAttribute("height")}`
  );
  ["width", "height"].map((x) => {
    root.setAttribute(
      x,
      (parseInt(root.getAttribute(x)) *
        parseInt(nearby.getAttribute("percentSize"))) /
        100
    );
  });
}

function drawAtom(parent, styleId, atom) {
  let group = createSVG("g");
  group.setAttribute("transform", "translate(" + atom.x + "," + atom.y + ")");

  // objects, arrays, and functions
  if (atom.object || atom.array || atom.func) {
    let rect = createSVG("rect", "snap-obj");
    ["width", "height"].forEach((attr) => rect.setAttribute(attr, atom[attr]));
    if (atom.object) {
      rect.setAttribute("rx", 20);
    }
    if (atom.array) {
      for (let i = 1; i < atom.children.length; i++) {
        drawSeparator(
          group,
          i * (atom.width / atom.children.length),
          atom.height
        );
      }
    }
    if (atom.immutable) {
      rect.classList.add(`snap-immutable-${styleId}`);
    }
    group.append(rect);
  }

  atom.labels && atom.labels.forEach(drawLabel.bind(null, group, atom));
  atom.children && atom.children.forEach(drawAtom.bind(null, group, styleId));
  atom.edges && atom.edges.forEach(drawEdge.bind(null, group, styleId));

  if (atom.children && atom.children.length) {
    let curGroup = atom.children[0].group,
      idx = 0;
    for (let i = 0; i < atom.children.length; i++) {
      if (atom.children[i].group != curGroup) {
        if (curGroup) {
          drawContainer(
            group,
            atom.children[idx].x,
            atom.children[i - 1].x,
            atom.height,
            atom.children[idx]
          );
        }
        curGroup = atom.children[i].group;
        idx = i;
      }
    }
    if (curGroup && idx != atom.children.length - 1) {
      drawContainer(
        group,
        atom.children[idx].x,
        atom.children[atom.children.length - 1].x,
        atom.height,
        atom.children[idx]
      );
    }
  }

  parent.append(group);
}

function drawContainer(parent, start, end, bottom, child) {
  let { width, height } = child;
  let path = createSVG("path", "snap-container");
  let yTop = bottom - (3 * height) / 2,
    yBot = bottom - height / 2,
    xLeft = start,
    xRight = end + width;
  path.setAttribute(
    "d",
    `M ${xLeft} ${yTop} L ${xLeft} ${yBot} L ${xRight} ${yBot} L ${xRight} ${yTop} L ${xLeft} ${yTop}`
  );
  parent.append(path);
}

function drawSeparator(parent, x, height) {
  let path = createSVG("path", "snap-separator");
  path.setAttribute("d", `M ${x} ${0} L ${x} ${height}`);
  parent.append(path);
}

function drawLabel(parent, atom, label) {
  let text = createSVG("text");
  ["x", "y"].forEach((attr) => text.setAttribute(attr, label[attr]));

  let textContent = label.text.split("#")[0];

  if (atom.object) {
    text.classList.add("object");
    text.setAttribute("x", atom.width / 2);
    text.textContent = textContent;
  } else {
    text.classList.add("value");
    let sections = textContent.split("\n");
    let dy = 0;

    for (var section of sections) {
      let tspan = createSVG("tspan");

      metrics.append(text);
      tspan.textContent = section;
      tspan.setAttribute("x", label["x"]);
      tspan.setAttribute("dy", dy);
      text.append(tspan);
      metrics.removeChild(text);

      let line = createSVG("text");
      line.textContent = section;
      metrics.append(line);
      dy = line.getBoundingClientRect().height;
      metrics.removeChild(line);
    }
  }

  parent.append(text);
}

function drawEdge(parent, styleId, edge) {
  // TODO https://github.com/OpenKieler/klayjs-svg/blob/master/klayjs-svg.js#L176
  let path = createSVG("path", `snap-arrow-${styleId}`);
  if (edge.immutable) {
    path.classList.add(`snap-immutable-${styleId}`);
  }
  path.setAttribute(
    "d",
    edge.sections
      .map((s) => {
        let desc = [`M ${s.startPoint.x} ${s.startPoint.y}`];
        let bendPoints = s.bendPoints || [];
        bendPoints.push(s.endPoint);
        for (let i = 0; i < bendPoints.length; ) {
          let pointsLeft = bendPoints.length - i;
          if (pointsLeft > 3) {
            let nextThree = [0, 1, 2].map(
              (j) => `${bendPoints[i + j].x} ${bendPoints[i + j].y}`
            );
            desc.push(`C ${nextThree.join(" ")}`);
            i += 3;
          } else if (pointsLeft > 2) {
            let nextTwo = [0, 1].map(
              (j) => `${bendPoints[i + j].x} ${bendPoints[i + j].y}`
            );
            desc.push(`Q ${nextTwo.join(" ")}`);
            i += 2;
          } else {
            desc.push(`L ${bendPoints[i].x} ${bendPoints[i].y}`);
            i += 1;
          }
        }
        return desc.join(" ");
      })
      .join(" ")
  );
  parent.append(path);

  if (edge.crossed) {
    var midpoint = path.getPointAtLength(path.getTotalLength() / 2);
    var cross = createSVG("path", "snap-x");

    const crossSize = 5;
    const pointTypes = ["M", "L", "M", "L"];
    const crossXs = [-crossSize, crossSize, -crossSize, crossSize];
    const crossYs = [-crossSize, crossSize, crossSize, -crossSize];

    cross.setAttribute(
      "d",
      [].concat
        .apply(
          [],
          [...Array(4).keys()].map((i) => [
            pointTypes[i],
            midpoint.x + crossXs[i],
            midpoint.y + crossYs[i],
          ])
        )
        .join(" ")
    );
    parent.append(cross);
  }
}

module.exports = { drawable, draw };
