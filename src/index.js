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
  scriptElement.text = JSON.stringify(snap);
  scriptElement.type = 'application/snapdown+json';
}

// layout and render Snapdown JSON
function renderJSON(jsonElement) {
  if ( ! jsonElement.matches(jsonSelector)) {
    throw new Error(`Snapdown.renderJSON: expected input to be a ${jsonSelector}`);
  }
  let snap = JSON.parse(jsonElement.text);
  let graph = renderer.drawable(snap);
  elk.instance.layout(graph).then(graph => {
    renderer.draw(jsonElement, graph);
  });
}

function render(elt) {
  if (elt.matches(scriptSelector)) { parseText(elt); }
  renderJSON(elt);
}

function renderAll() {
  Array.prototype.slice.call(document.querySelectorAll(scriptSelector)).forEach(parseText);
  Array.prototype.slice.call(document.querySelectorAll(jsonSelector)).forEach(renderJSON);
}

module.exports = { render, renderAll };
