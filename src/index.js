"use strict";

const elkjs = require("elkjs");
const yamlfront = require("yaml-front-matter");

const transformer = require("./transformer");
const renderer = require("./renderer");
const sidebar = require("./sidebar");
const pathfinding = require("./pathfinding");
const animation = require("./animation");

const scriptSelector = 'script[type="application/snapdown"]';
const jsonSelector = 'script[type="application/snapdown+json"]';

let randomId = "Unknown";

let showPathfinding = true;

// lazy initialization of ELK singleton
const elk = {
  get instance() {
    delete this.instance;
    return (this.instance = new elkjs({
      workerUrl: URL.createObjectURL(
        new Blob([`importScripts('${ELK_WORKER_URL}');`], {
          type: "application/javascript",
        })
      ),
    }));
  },
};

function randomString() {
  return (Math.random() + 1).toString(36).substring(7);
}

// parse Snapdown text into transform into JSON
function parseText(scriptElement) {
  if (!scriptElement.matches(scriptSelector)) {
    throw new Error(
      `Snapdown.parseText: expected input to be a ${scriptSelector}`
    );
  }
  let script = yamlfront.safeLoadFront(scriptElement.text);
  let text = script.__content;
  let spec = transformer.parse(text);

  return animation.specToDiagrams(spec);
}

// TODO lay out all diagrams (but don't render)

// TODO getMasterDiagram:
// from list of diagrams, get a "master diagram"
// for each ref, get max width/height recursively

// TODO getIndividualDiagrams:
// from master diagram, get each individual diagram
// replace big things with smaller ones per diagram

function transformSpec(scriptElement, spec) {
  let snap = transformer.transform(spec);

  let jsonElement = document.createElement("script");
  jsonElement.text = JSON.stringify(snap);
  jsonElement.type = "application/snapdown+json";
  jsonElement.className = "no-markdown";
  jsonElement.id = scriptElement.id + "-json-" + randomString();
  jsonElement.setAttribute(
    "percentSize",
    scriptElement.getAttribute("percentSize") || 100
  );
  scriptElement.parentNode.insertBefore(jsonElement, scriptElement);
  return jsonElement;
}

// TODO: move to renderer?
function pathfindCombineDraw(id, jsonElement, graphsAfterLayout) {
  // console.log(graphsAfterLayout);

  let drawn = [];
  let paths = pathfinding.layoutRoughEdges(graphsAfterLayout);

  graphsAfterLayout.forEach((graph) => {
    drawn.push(renderer.draw(jsonElement, graph, id));
  });

  let styleId;
  let combined = renderer.createSVGRoot((x) => {
    styleId = x;
  });
  combined.setAttribute(
    "width",
    drawn
      .map((g) => parseInt(g.getAttribute("width")))
      .reduce((x, y) => x + y, 0)
  );
  combined.setAttribute(
    "height",
    Math.max(...drawn.map((g) => parseInt(g.getAttribute("height"))))
  );

  let translate = 0;
  for (let i = drawn.length - 1; i >= 0; i--) {
    ["defs", "style"].forEach((x) => {
      let styleInfo = drawn[i].getElementsByTagName(x)[0].cloneNode(true);
      combined.appendChild(styleInfo);
    });

    let clone = drawn[i].getElementsByTagName("g")[0].cloneNode(true);
    clone.setAttribute(
      "transform",
      "translate(" +
        (graphsAfterLayout[i].x + translate) +
        "," +
        graphsAfterLayout[i].y +
        ")"
    );
    translate += graphsAfterLayout[i].width;
    combined.appendChild(clone);
  }

  drawn.forEach((x) => x.remove());
  combined.id = id;

  if (showPathfinding) {
    paths.forEach((pathInfo) => {
      let { path, crossed } = pathInfo;
      let arrow = renderer.createSVG("path", `snap-arrow-${styleId}`);
      let desc = [];
      for (let i = 0; i < path.length; i++) {
        if (i == 0) {
          desc.push(`M ${path[i][0]} ${path[i][1]}`);
        } else {
          desc.push(`L ${path[i][0]} ${path[i][1]}`);
        }
      }
      arrow.setAttribute("d", desc.join(" "));
      combined.append(arrow);
      if (crossed) {
        renderer.addCross(combined, arrow);
      }
    });
  }

  // rescale svg as necessary
  combined.setAttribute(
    "viewBox",
    `0 0 ${combined.getAttribute("width")} ${combined.getAttribute("height")}`
  );
  ["width", "height"].map((x) => {
    combined.setAttribute(
      x,
      (parseInt(combined.getAttribute(x)) *
        parseInt(jsonElement.getAttribute("percentSize"))) /
        100
    );
  });

  return combined;
}

// layout and render Snapdown JSON
function renderJSON(jsonElement, id) {
  return new Promise((resolve, reject) => {
    if (!jsonElement.matches(jsonSelector)) {
      throw new Error(
        `Snapdown.renderJSON: expected input to be a ${jsonSelector}`
      );
    }
    let snap = JSON.parse(jsonElement.text);
    let graphs = renderer.drawable(snap);

    let graphsAfterLayout = [],
      promises = [];
    graphs.forEach((graph) => {
      promises.push(
        elk.instance.layout(graph).then((graph) => {
          graphsAfterLayout.push(graph);
        })
      );
    });

    Promise.all(promises).then(() => {
      let combined = pathfindCombineDraw(id, jsonElement, graphsAfterLayout);
      resolve(combined);
    });
  });
}

function renderText(text, callback) {
  let elt = document.createElement("script");
  elt.type = "application/snapdown";
  let diagrams = parseText(elt);
  let created = [],
    promises = [],
    graphs = [];

  for (let spec of diagrams) {
    let jsonElement = transformSpec(elt, spec);
    created.push(jsonElement.id);
    let id = jsonElement.id + "-svg-" + randomString();
    created.push(id);
    promises.push(
      renderJSON(jsonElement, id).then((graph) => {
        graphs.push(graph);
      })
    );
  }

  Promise.all(promises).then(() => {
    if (callback) {
      callback(graphs);
    }
  });

  return created;
}

function render(elt, callback) {
  let created = [],
    promises = [],
    graphs = [];

  if (elt.matches(scriptSelector)) {
    let diagrams = parseText(elt);

    for (let spec of diagrams) {
      let jsonElement = transformSpec(elt, spec);
      created.push(jsonElement.id);
      let id = jsonElement.id + "-svg-" + randomString();
      created.push(id);
      promises.push(
        renderJSON(jsonElement, id).then((graph) => {
          jsonElement.parentNode.insertBefore(graph, jsonElement.nextSibling);
          graphs.push(graph);
        })
      );
    }
  }

  Promise.all(promises).then(() => {
    if (callback) {
      callback(graphs);
    }
  });

  return created;
}

// returns IDs of all newly-created elements
// i.e., the JSON and SVG elements
function renderAll(shouldThrow = true, callback) {
  let scriptElements = Array.from(document.querySelectorAll(scriptSelector));
  let created = [],
    promises = [],
    graphs = [];
  scriptElements.map((x) => {
    try {
      let diagrams = parseText(x);

      for (let spec of diagrams) {
        let jsonElement = transformSpec(x, spec);
        created.push(jsonElement.id);
        let id = jsonElement.id + "-svg-" + randomString();
        created.push(id);
        promises.push(
          renderJSON(jsonElement, id).then((graph) => {
            jsonElement.parentNode.insertBefore(graph, jsonElement.nextSibling);
            graphs.push(graph);
          })
        );
      }
    } catch (err) {
      if (shouldThrow) {
        throw err;
      }
    }
  });

  Promise.all(promises).then(() => {
    if (callback) {
      callback(graphs);
    }
  });

  return created;
}

function populateHelp(location) {
  let snapdownHelp = document.createElement("div");
  snapdownHelp.innerHTML = sidebar.sidebarHTML;
  if (location) {
    document.body.insertBefore(snapdownHelp, document.getElementById(location));
  } else {
    document.body.appendChild(snapdownHelp);
  }
}

function showHelp() {
  document.getElementById("snapdownHelp").className = "sidenav";
}

function hideHelp() {
  document.getElementById("snapdownHelp").className = "hidenav";
}

function setRandomId(id) {
  randomId = id;
}

function showExample(id) {
  let helpTextElem = document.getElementById(id + "-helptext");
  let helpStates = ["(click to expand)", "(click to hide)"];
  let curText = helpTextElem.innerHTML;
  helpTextElem.innerHTML = helpStates[1 - helpStates.indexOf(curText)];

  let contentElem = document.getElementById(id + "-content");
  let contentStates = ["none", "block"];
  let curDisplay = contentElem.style.display;

  // curDisplay = none means a section has been opened
  // curDisplay = block means a section has been closed
  const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLScrnC_kfr9p8-ePZ2im9Ok62WbjMZEpILP_mzRyEQMv-qnYSA/formResponse?usp=pp_url&entry.1879725271=${encodeURIComponent(
    randomId
  )}&entry.1376962994=${id}-${curDisplay}&submit=Submit`;

  try {
    fetch(googleFormUrl, {
      method: "POST",
      mode: "no-cors",
    });
  } catch (err) {
    if (console && console.error) console.error(err);
  }

  contentElem.style.display =
    contentStates[1 - contentStates.indexOf(curDisplay)];
}

module.exports = {
  renderText,
  render,
  renderAll,
  populateHelp,
  showHelp,
  hideHelp,
  showExample,
  setRandomId,
};
