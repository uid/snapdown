'use strict';

const cytoscape = require('cytoscape');

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

const makeid = function() {
  let counter = 0;
  return function makeid(type) {
    return `${type}${counter++}`;
  };
}();

function transform(spec) {
  return transform.all(spec, undefined, {});
};
transform.all = function(obj, parent, env) {
  if (obj.length) {
    return obj.map(elt => transform.all(elt, parent, env)).reduce((a, b) => a.concat(b), []);
  }
  return Object.keys(obj).map(key => transform[key](obj[key], parent, env)).reduce((a, b) => a.concat(b), []);
};
transform.heap = function(heap, parent, env) {
  return transform.all(heap);
};
transform.stacks = function(stacks, parent, env) {
  return []; // TODO
};
transform.pointer = function(pointer, parent, env) {
  let source = {
    group: 'nodes',
    data: { id: makeid('label'), parent, label: pointer.source },
    classes: 'label',
  };
  let targets = transform.all(pointer.target);
  return [
    source,
    ...targets,
    {
      group: 'edges',
      data: { source: source.data.id, target: targets[0].data.id },
      classes: `arrow ${pointer.mutable ? '' : 'im' }mutable`,
    },
  ];
};
transform.object = function(object, parent, env) {
  let id = makeid('object');
  return [
    {
      group: 'nodes',
      data: { id, type: object.type },
      classes: `object ${object.mutable ? '' : 'im' }mutable`,
    },
    ...transform.all(object.fields, id, env),
  ];
};
transform.primitive = function(primitive, parent, env) {
  return {
    group: 'nodes',
    data: { id: makeid('primitive'), value: primitive },
    classes: 'primitive',
  };
};

function render(scriptElement) {
  if ( ! scriptElement.matches(scriptSelector)) {
    throw new Error('render: expected input', scriptElement, 'to be a', scriptSelector);
  }
  const snap = {}; // TODO yaml_front_matter.parse(scriptElement.text);
  const text = scriptElement.text; // TODO snap.__content;
  const spec = parse(text);
  const elements = transform(spec);
  
  const container = document.createElement('div');
  scriptElement.parentNode.insertBefore(container, scriptElement.nextSibling);
  container.style.width = snap.width || '300px';
  container.style.height = snap.height || '300px';
  cytoscape({
    container,
    elements,
    style: [
      { selector: '.label', style: { width: 'label', height: 'label', content: 'data(label)', 'background-opacity': 0, 'text-valign': 'center', 'text-halign': 'center' } },
      { selector: '.arrow', style: { 'width': 1, 'line-color': 'black', 'target-arrow-shape': 'triangle' } },
      { selector: '.object', style: { content: 'data(type)', 'background-opacity': 0, 'border-width': 1, 'border-color': 'black', shape: 'ellipse', 'text-valign': 'top', 'text-halign': 'center' } },
      { selector: '.primitive', style: { width: 'label', height: 'label', content: 'data(value)', 'background-opacity': 0, 'text-valign': 'center', 'text-halign': 'center' } },
      
      { selector: '.object.immutable', style: { 'border-style': 'double' } },
      { selector: '.arrow.immutable', style: { 'line-style': 'dashed' } },
    ],
  });
};

function renderAll() {
  Array.prototype.slice.call(document.querySelectorAll(scriptSelector)).forEach(render);
};

module.exports = { parser, render, renderAll };
