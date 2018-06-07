'use strict';

const parser = require('../dist/snapdown-parser');

const identify = function() {
  let counter = 0;
  return function identify(e) {
    return e.id || (e.id = ++counter)
  };
}();

function transform(spec) {
  return {
    heap: transformHeap(spec.heap),
  };
}

function transformHeap(roots) {
  let flat = flattenAll(roots, []);
  return flat;
}

function flattenAll(arr, ancestors) {
  return arr.reduce((flat, e) => flat.concat(flatten(e, [ ...arr, ...ancestors ])), []);
}

function flatten(e, ancestors) {
  // pointer: lookup reference or flatten inline target
  if (e.name) {
    if (e.target.ref) {
      return [ Object.assign({}, e, { target: { to: lookupRef(e.target.ref, ancestors) } }) ];
    }
    return [ Object.assign({}, e, { target: { to: identify(e.target) } }), ...flatten(e.target, ancestors) ];
  }
  
  // object: flatten fields
  if (e.object) {
    let fields = flattenAll(e.fields.map(f => {
      // create blank pointers for non-pointer fields
      if ( ! f.name) { return { name: {}, target: f }; }
      return f;
    }), ancestors);
    return [ Object.assign({}, e, { fields: fields.filter(f => f.name) }), ...fields.filter(f => ! f.name) ];
  }
  
  // array: TODO DUPLICATED object.fields -> array.array
  if (e.array) {
    let fields = flattenAll(e.array.map(f => {
      // create blank pointers for non-pointer fields
      if ( ! f.name) { return { name: {}, target: f }; }
      return f;
    }), ancestors);
    return [ Object.assign({}, e, { array: fields.filter(f => f.name) }), ...fields.filter(f => ! f.name) ];
  }
  
  // primitive
  if (e.val !== undefined) { return [ e ]; }
  
  throw new Error(`Snapdown cannot flatten: ${Object.keys(e)}`);
}

function lookupRef(ref, ancestors) {
  let defn = ancestors.find(a => a.name && a.name.ref === ref);
  if ( ! defn) { throw new Error(`Snapdown cannot lookup: ${ref}`); }
  if (defn.target.ref) { return lookupRef(defn.target.ref, ancestors); }
  return identify(defn.target);
}

function parse(text) {
  try {
    return parser.parse(text);
  } catch (e) {
    if (e.location) {
      e.message += ` (line ${e.location.start.line} col ${e.location.start.column})`;
    }
    e.input = text;
    throw e;
  }
}

module.exports = { parse, transform };
