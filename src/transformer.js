"use strict";

const parser = require("../dist/snapdown-parser");

const identify = (function () {
  let counter = 0;
  return function identify(e) {
    return e.id || (e.id = ++counter);
  };
})();

let claimed = {},
  unclaimed = {},
  ptrCounter = 0;

const identifyPtrSource = (function () {
  return function identifyPtrSource(e) {
    let newId = e.id || (e.id = `ptr${++ptrCounter}`);

    // does this pointer need "claiming", i.e. is it crossed-out or
    // intentionally specified to ignore name-binding?
    let needsClaiming = e.crossed;
    if (needsClaiming) {
      if (e.name.ref in claimed) return claimed[e.name.ref];
      else if (e.name.ref in unclaimed) return unclaimed[e.name.ref];
      else {
        e.independent = true;
        return (unclaimed[e.name.ref] = newId);
      }
    } else {
      if (e.name.ref in claimed) {
        e.independent = true;
        return newId;
      } else if (e.name.ref in unclaimed) {
        claimed[e.name.ref] = unclaimed[e.name.ref];
        delete unclaimed[e.name.ref];
        return claimed[e.name.ref];
      } else {
        e.independent = true;
        return (claimed[e.name.ref] = newId);
      }
    }
  };
})();

function transform(spec) {
  // hack: each time this function is called, clear the globals...
  claimed = {};
  unclaimed = {};
  ptrCounter = 0;

  let heapElts = spec.heap.map((x) =>
    Object.assign({}, x, { id: identify(x) })
  );
  let stackElts = spec.stack.map((x) =>
    Object.assign({}, x, { id: identify(x) })
  );

  return {
    heap: transformHeap(heapElts, stackElts),
    stack: transformHeap(stackElts, heapElts),
  };
}

function transformHeap(roots, others = null) {
  let flat = flattenAll(roots, others || []);
  return flat;
}

function flattenAll(arr, ancestors) {
  return arr.reduce((flat, e) => {
    let x = flatten(e, [...arr, ...ancestors]);
    if (flat) return flat.concat(x);
    else return [x];
  }, []);
}

function flatten(e, ancestors) {
  // pointer: lookup reference or flatten inline target
  if (e.name) {
    if (e.target.ref) {
      return [
        Object.assign({}, e, {
          source: identifyPtrSource(e),
          target: { to: lookupRef(e.target.ref, ancestors, []).ids },
        }),
      ];
    }
    return [
      Object.assign({}, e, {
        source: identifyPtrSource(e),
        target: { to: [{ id: identify(e.target) }] },
      }),
      ...flatten(e.target, ancestors),
    ];
  }

  // objects and functions: flatten fields
  if (e.object || e.func) {
    let fields = flattenAll(
      e.fields.map((f) => {
        // create blank pointers for non-pointer, non-primitive, non-inside fields
        if (!f.inside && !f.name && (f.object || f.array)) {
          return { name: {}, target: f };
        }
        if (f.val && !(f.object || f.array)) {
          return Object.assign({}, f, { inside: true });
        }
        return f;
      }),
      ancestors
    );
    return [
      Object.assign({}, e, {
        fields: fields.filter((f) => f.name || f.inside),
      }),
      ...fields.filter((f) => !f.name && !f.inside),
    ];
  }

  // array: TODO DUPLICATED object.fields -> array.array
  if (e.array) {
    let fields = flattenAll(
      e.array.map((f) => {
        // create blank pointers for non-pointer fields
        if (!f.name) {
          return { name: {}, target: f };
        }
        return f;
      }),
      ancestors
    );
    return [
      Object.assign({}, e, { array: fields.filter((f) => f.name) }),
      ...fields.filter((f) => !f.name),
    ];
  }

  // primitive
  if (e.val !== undefined) {
    return [e];
  }

  throw new Error(`Snapdown cannot flatten: ${Object.keys(e)}`);
}

function lookupRef(ref, ancestors, visited) {
  let matches = [];

  // look for direct matches in ancestors or fields of ancestors
  for (var elt of ancestors) {
    if (elt.name && elt.name.ref === ref) matches.push(elt);

    let fields = elt.fields || (elt.target && elt.target.fields) || [];
    for (var defn of fields) {
      if (defn.name && defn.name.ref === ref) matches.push(defn);
    }
  }
  if (!matches.length) {
    throw new Error(`Snapdown cannot lookup: ${ref}`);
  }

  let giveUpIds = [];
  let ids = [];
  for (var match of matches) {
    let id = identify(match.target);
    // TODO other options for a pointer to this target
    let independent = !match.crossed;
    let options = { crossed: match.crossed, group: match.group };
    if (match.target.ref && !visited.includes(id)) {
      // if this target hasn't been visited, keep going
      let result = lookupRef(match.target.ref, ancestors, [id, ...visited]);
      if (result.loop) giveUpIds = result.ids;
      else if (!ids.length || !independent) ids.push(...result.ids);
    } else if (visited.includes(id)) {
      // if we're caught in a "cycle", set the "give-up IDs"
      giveUpIds = [{ id: identify(match), options }];
    } else if (!ids.length || !independent) {
      ids.push({ id, options });
    }
  }

  // if every single possible definition has led to a cycle
  if (!ids.length) return { ids: giveUpIds, loop: true };

  return { ids, loop: false };
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
