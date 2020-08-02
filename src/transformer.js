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
    heap: transformHeap(spec.heap.map(x => Object.assign({}, x, { id: identify(x) }))),
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
      return [ Object.assign({}, e, { target: { to: lookupRef(e.target.ref, ancestors, []) } }) ];
    }
    return [ Object.assign({}, e, { target: { to: identify(e.target) } }), ...flatten(e.target, ancestors) ];
  }
  
  // object: flatten fields
  if (e.object) {
    let fields = flattenAll(e.fields.map(f => {
      // create blank pointers for non-pointer, non-primitive fields
      if ( ! f.name && (f.object || f.array)) { return { name: {}, target: f }; }
      if (f.val && !(f.object || f.array)) { return Object.assign({}, f, { inside: true }); }
      return f;
    }), ancestors);
    return [ Object.assign({}, e, { fields: fields.filter(f => f.name || f.inside) }), ...fields.filter(f => ! f.name && !f.inside) ];
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

function lookupRef(ref, ancestors, visited) {
  let defn = ancestors.find(a => a.name && a.name.ref === ref);
  if ( ! defn) {
    let fieldsFound = false;
    for (var elt of ancestors) {
      if (elt.target && elt.target.fields) {
        defn = elt.target.fields.find(a => a.name && a.name.ref === ref);
        if (defn) {
          fieldsFound = true;
          break;
        }
      }
    }
    if ( ! fieldsFound) {
      throw new Error(`Snapdown cannot lookup: ${ref}`);
    }
  }

  let id = identify(defn.target);
  if (defn.target.ref && !visited.includes(id)) {
    // if this target hasn't been visited, keep going
    return lookupRef(defn.target.ref, ancestors, [ id, ...visited ]);
  } else if (visited.includes(id)) {
    // if we're caught in a "cycle", just point at this definition, no matter what it is
    return identify(defn);
  } else {
    return id;
  }
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
