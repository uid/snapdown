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

const $ = require("jquery");

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

  let master = animation.specToDiagrams(spec, true);

  return {
    master: master[master.length - 1],
    individual: animation.specToDiagrams(spec, false),
  };
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

function displayDiagrams(results, masterJson, graphs, step = 1) {
  let thisEltDiagrams = [];
  let widths = [];
  results.forEach((result) => {
    let { combined } = result;
    masterJson.parentNode.insertBefore(combined, masterJson.nextSibling);
    widths.push(combined.getBBox().width);
    combined.style.display = "none";
    graphs.push(combined);
    thisEltDiagrams.push(combined);
  });

  if (step > results.length) step = results.length;

  if (results.length > 1) {
    let br = document.createElement("br");
    br.id = `br${randomString()}`;
    masterJson.parentNode.insertBefore(br, masterJson.nextSibling);
    graphs.push(br);
    let sliderContent = document.createElement("div");
    sliderContent.id = `${masterJson.id}-sliderContent`;
    let sliderId = `${masterJson.id}-slider`,
      textId = `${masterJson.id}-text`;
    sliderContent.innerHTML = `<b id=${textId}>Step ${step}</b><br /><input id=${sliderId} type="range" min="1" max="${results.length}" value="${step}">`;
    masterJson.parentNode.insertBefore(sliderContent, masterJson.nextSibling);

    document.getElementById(sliderId).onchange = function () {
      let slider = document.getElementById(sliderId),
        text = document.getElementById(textId);
      let i = slider.value;
      thisEltDiagrams.forEach((diagram) => {
        diagram.style.display = "none";
      });
      thisEltDiagrams[i - 1].style.display = "block";
      text.innerHTML = `Step ${i}`;

      // apply styling
      let sliderStart = (widths[0] - slider.width) / 3;
      slider.style.marginLeft = `${sliderStart}px`;
      let sliderWidth = slider.getBoundingClientRect().width,
        textWidth = text.getBoundingClientRect().width;
      text.style.marginLeft = `${
        sliderStart +
        ((i - 1) * sliderWidth) / (results.length - 1) -
        textWidth / 2
      }px`;
    };

    graphs.push(sliderContent);

    document.getElementById(sliderId).onchange();
  }

  thisEltDiagrams[step - 1].style.display = "block";
}

// layout and render Snapdown JSON
function renderJSON(jsonElement, id, master) {
  return new Promise((resolve, reject) => {
    if (!jsonElement.matches(jsonSelector)) {
      throw new Error(
        `Snapdown.renderJSON: expected input to be a ${jsonSelector}`
      );
    }
    let snap = JSON.parse(jsonElement.text);
    let graphs = renderer.drawable(snap);

    if (!master) {
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
        resolve({ combined: null, graphsAfterLayout });
      });
    } else {
      // just do stuff with graphs and master
      let newMaster = master.map((x) => {
        return $.extend(true, {}, x);
      });
      newMaster[0] = animation.modifyMaster(newMaster[0], graphs[0]);

      // let graphsAfterLayout = [],
      //   promises = [];
      // graphs.forEach((graph) => {
      //   promises.push(
      //     elk.instance.layout(graph).then((graph) => {
      //       graphsAfterLayout.push(graph);
      //     })
      //   );
      // });

      // Promise.all(promises).then(() => {
      //   let combined = pathfindCombineDraw(id, jsonElement, graphsAfterLayout);
      //   resolve({ combined, graphsAfterLayout });
      // });

      // edit master to reflect stuff in graphs
      let combined = pathfindCombineDraw(id, jsonElement, newMaster);
      resolve({ combined, graphsAfterLayout: newMaster });
    }
  });
}

function render(elt, callback, step = 1) {
  let created = [],
    promises = [],
    graphs = [];

  if (elt.matches(scriptSelector)) {
    let { individual, master } = parseText(elt);

    let masterJson = transformSpec(elt, master);
    created.push(masterJson.id);
    let id = masterJson.id + "-svg-" + randomString();
    created.push(id);
    graphs.push(masterJson);
    promises.push(
      renderJSON(masterJson, id)
        .then((value) => {
          let { combined, graphsAfterLayout } = value;
          return Promise.all(
            individual.map((spec) => {
              let jsonElement = transformSpec(elt, spec);
              graphs.push(jsonElement);
              return renderJSON(
                jsonElement,
                id + randomString(),
                graphsAfterLayout
              );
            })
          );
        })
        .then((results) => displayDiagrams(results, masterJson, graphs, step))
    );
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
      let { individual, master } = parseText(x);

      let masterJson = transformSpec(x, master);
      created.push(masterJson.id);
      let id = masterJson.id + "-svg-" + randomString();
      created.push(id);
      promises.push(
        renderJSON(masterJson, id)
          .then((value) => {
            let { combined, graphsAfterLayout } = value;
            return Promise.all(
              individual.map((spec) => {
                let jsonElement = transformSpec(x, spec);
                return renderJSON(
                  jsonElement,
                  id + randomString(),
                  graphsAfterLayout
                );
              })
            );
          })
          .then((results) => displayDiagrams(results, masterJson, graphs))
      );
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
  render,
  renderAll,
  populateHelp,
  showHelp,
  hideHelp,
  showExample,
  setRandomId,
};
