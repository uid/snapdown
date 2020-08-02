'use strict';

const elkjs = require('elkjs');
const yamlfront = require('yaml-front-matter');

const transformer = require('./transformer');
const renderer = require('./renderer');

const scriptSelector = 'script[type="application/snapdown"]';
const jsonSelector = 'script[type="application/snapdown+json"]';

// lazy initialization of ELK singleton
const elk = { get instance() {
  delete this.instance;
  return this.instance = new elkjs({ workerUrl: URL.createObjectURL(new Blob([
    `importScripts('${ELK_WORKER_URL}');`
  ], { type: 'application/javascript' })) });
} };

// parse Snapdown text into transform into JSON
function parseText(scriptElement) {
  if ( ! scriptElement.matches(scriptSelector)) {
    throw new Error(`Snapdown.parseText: expected input to be a ${scriptSelector}`);
  }
  let script = yamlfront.safeLoadFront(scriptElement.text);
  let text = script.__content;
  let spec = transformer.parse(text);
  let snap = transformer.transform(spec);

  let jsonElement = document.createElement("script");
  jsonElement.text = JSON.stringify(snap);
  jsonElement.type = 'application/snapdown+json';
  jsonElement.id = (Math.random() + 1).toString(36).substring(7);
  scriptElement.parentNode.append(jsonElement);
  return jsonElement;
}

// layout and render Snapdown JSON
function renderJSON(jsonElement) {
  if ( ! jsonElement.matches(jsonSelector)) {
    throw new Error(`Snapdown.renderJSON: expected input to be a ${jsonSelector}`);
  }
  let snap = JSON.parse(jsonElement.text);
  let graph = renderer.drawable(snap);
  let id = (Math.random() + 1).toString(36).substring(7);
  elk.instance.layout(graph).then(graph => {
    renderer.draw(jsonElement, graph, id);
  });
  return id;
}

function render(elt) {
  if (elt.matches(scriptSelector)) { parseText(elt); }
  renderJSON(elt);
}

// returns IDs of all newly-created elements
// i.e., the JSON and SVG elements
function renderAll() {
  let scriptElements = Array.from(document.querySelectorAll(scriptSelector));
  let created = [];
  scriptElements.map(x => {
    let y = parseText(x);
    created.push(y.id);
    let graphId = renderJSON(y);
    created.push(graphId);
  });

  return created;
}

module.exports = { render, renderAll };
