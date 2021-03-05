"use strict";

const parser = require("../dist/snapdown-parser");
const $ = require("jquery");

let counter = 0;
const identify = (function () {
  return function identify(e) {
    return e.id || (e.id = ++counter);
  };
})();

function incrementId() {
  ++counter;
}

let claimed = {},
  unclaimed = {},
  ptrCounter = 0;

const identifyPtrSource = (function () {
  return function identifyPtrSource(e) {
    let newId = e.id || (e.id = `ptr${++ptrCounter}`);

    // does this pointer need "claiming", i.e. is it crossed-out or
    // intentionally specified to ignore name-binding?
    let needsClaiming = e.crossed || e.hyper;
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

function transform(spec, shouldClear = true) {
  // hack: each time this function is called, clear the globals...
  if (shouldClear) {
    claimed = {};
    unclaimed = {};
    ptrCounter = 0;
    counter = 0;
  }

  let stackElts = (spec.stack || []).map((x) =>
    Object.assign({}, x, { id: identify(x) })
  );
  let heapElts = spec.heap;

  let transformed = {
    stack: transformHeap(stackElts, heapElts),
    heap: transformHeap(
      (spec.heap || []).map((x) => Object.assign({}, x, { id: identify(x) })),
      stackElts
    ),
  };

  // move all non-funcs from stack to heap
  let newStack = [];
  for (let i = 0; i < transformed.stack.length; i++) {
    if (!transformed.stack[i].func) {
      transformed.heap.push(transformed.stack[i]);
    } else {
      newStack.push(transformed.stack[i]);
    }
  }
  transformed.stack = newStack;
  return transformed;
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
    if (e.erased) {
      // TODO: do we want this?
      // e.target.erased = true;
    }

    // already have a target ID for this
    if (e.target.to) {
      return [
        Object.assign({}, e, {
          source: identifyPtrSource(e),
          target: { to: e.target.to },
        }),
      ];
    }

    if (e.target.ref) {
      let lookupIds = lookupRef(e.target.ref, ancestors, []).ids;
      let filteredIds = lookupIds;

      if (!e.target.ref.startsWith("#")) {
        let filteredIds = lookupIds.filter(
          (x) => !x.options.crossed && !x.options.erased
        );
        if (!filteredIds.length && lookupIds.length) {
          filteredIds = lookupIds.filter((x) => !x.options.erased);
        }
        if (!filteredIds.length && lookupIds.length) {
          filteredIds = lookupIds;
        }
        filteredIds = [filteredIds[0]];
        delete filteredIds[0].options.crossed;
        delete filteredIds[0].options.erased;

        e.target.to = filteredIds;
      }

      return [
        Object.assign({}, e, {
          source: identifyPtrSource(e),
          target: { to: filteredIds },
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
          identify(f); // TODO wtf? this managed to fix inside-value animation
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
    let independent = !match.crossed && !match.hyper;
    let options = {
      crossed: match.crossed,
      hyper: match.hyper,
      group: match.group,
      erased: match.erased,
    };
    if (match.target.ref && !visited.includes(id)) {
      // if this target hasn't been visited, keep going
      let result = lookupRef(match.target.ref, ancestors, [id, ...visited]);
      if (result.loop) giveUpIds = result.ids;
      else {
        ids.push(...result.ids.map((elt) => Object.assign(elt, { options })));
      }
    } else if (visited.includes(id)) {
      // if we're caught in a "cycle", set the "give-up IDs"
      giveUpIds = [{ id: identify(match), options }];
    } else {
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

module.exports = {
  parse,
  transform,
  identify,
  identifyPtrSource,
  lookupRef,
};
