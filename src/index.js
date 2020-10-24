"use strict";

const elkjs = require("elkjs");
const yamlfront = require("yaml-front-matter");

const transformer = require("./transformer");
const renderer = require("./renderer");
const { sidebarHTML } = require("./sidebar");

const scriptSelector = 'script[type="application/snapdown"]';
const jsonSelector = 'script[type="application/snapdown+json"]';

let randomId = "Unknown";

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
  let snap = transformer.transform(spec);

  let jsonElement = document.createElement("script");
  jsonElement.text = JSON.stringify(snap);
  jsonElement.type = "application/snapdown+json";
  jsonElement.className = "no-markdown";
  jsonElement.id = scriptElement.id + "-json";
  jsonElement.setAttribute(
    "percentSize",
    scriptElement.getAttribute("percentSize") || 100
  );
  scriptElement.parentNode.insertBefore(jsonElement, scriptElement);
  return jsonElement;
}

// layout and render Snapdown JSON
function renderJSON(jsonElement) {
  if (!jsonElement.matches(jsonSelector)) {
    throw new Error(
      `Snapdown.renderJSON: expected input to be a ${jsonSelector}`
    );
  }
  let snap = JSON.parse(jsonElement.text);
  let graph = renderer.drawable(snap);
  let id = jsonElement.id + "-svg";
  elk.instance.layout(graph).then((graph) => {
    renderer.draw(jsonElement, graph, id);
  });
  return id;
}

function render(elt) {
  let created = [];
  if (elt.matches(scriptSelector)) {
    let jsonElement = parseText(elt);
    created.push(jsonElement.id);
    created.push(renderJSON(jsonElement));
  }
  return created;
}

// returns IDs of all newly-created elements
// i.e., the JSON and SVG elements
function renderAll(shouldThrow = true) {
  let scriptElements = Array.from(document.querySelectorAll(scriptSelector));
  let created = [];
  scriptElements.map((x) => {
    try {
      let y = parseText(x);
      created.push(y.id);
      let graphId = renderJSON(y);
      created.push(graphId);
    } catch (err) {
      if (shouldThrow) {
        throw err;
      }
    }
  });

  return created;
}

function populateHelp(location) {
  let snapdownHelp = document.createElement("div");
  snapdownHelp.innerHTML = sidebarHTML;
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

  const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLScI8DPu2A-QH-djXcl1_GMfk1R1E7ioYfzFWgri74UyR5CH2A/formResponse?usp=pp_url&entry.632602489=${encodeURIComponent(
    randomId
  )}&entry.382138263=${id}-${curDisplay}&submit=Submit`;

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
