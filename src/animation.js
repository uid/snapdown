"use strict";

const transformer = require("./transformer");
const $ = require("jquery");

function replaceRefInDiagram(diffPart, diagram, snap, iter) {
  let newDiagram = $.extend(true, {}, diagram);
  let newSnap = $.extend(true, {}, snap);
  diffPart.usedIter = iter;

  let ref = diffPart.name.ref;

  // these three arrays will always be the same length
  let id = [],
    fieldId = [],
    indep = [];
  let usedIndep = false;

  function checkElem(elem) {
    return elem.name && elem.name.ref == ref && !(elem.usedIter === iter);
  }

  function resolveElem(elem, elemId, elemFieldId) {
    if (!elem.independent || !usedIndep) {
      id.push(elemId);
      fieldId.push(elemFieldId);
      indep.push(Boolean(elem.independent));
      elem.usedIter = iter;
    }
    if (elem.independent) usedIndep = true;
  }

  // first look through snap for ref
  for (let elem of newSnap.heap) {
    if (checkElem(elem)) {
      resolveElem(elem, elem.id, null);
    } else if (elem.fields) {
      for (let field of elem.fields) {
        if (checkElem(field)) {
          resolveElem(field, elem.id, field.id);
        }
      }
    }
  }

  if (id.length) {
    // field already exists in diagram, remove all instances & replace
    let resolved = false;
    for (let i = 0; i < id.length; i++) {
      let toDeleteElems = [];
      for (let j = 0; j < newDiagram.heap.length; j++) {
        if (!fieldId[i] && newDiagram.heap[j].id == id[i]) {
          // independent: resolve by replacing heap element
          if (indep[i]) {
            newDiagram.heap[j] = diffPart;
            resolved = true;
          }
          // not independent: delete heap element
          else toDeleteElems.push(j);
        } else if (
          fieldId[i] &&
          newDiagram.heap[j].target &&
          newDiagram.heap[j].target.fields &&
          newDiagram.heap[j].target.id == id[i]
        ) {
          let fields = newDiagram.heap[j].target.fields;
          let toDeleteFields = [];
          for (let k = 0; k < fields.length; k++) {
            if (indep[i]) {
              fields[k] = diffPart;
              resolved = true;
            } else toDeleteFields.push(k);
          }
          for (let f of toDeleteFields) fields.splice(f, 1);
        }
      }
      for (let e of toDeleteElems) newDiagram.heap.splice(e, 1);
    }
    // if still unresolved, just add the diff part
    if (!resolved) {
      newDiagram.heap.push(diffPart);
    }
  } else {
    // easiest case: ref hasn't been defined yet
    newDiagram.heap.push(diffPart);
  }

  return [newDiagram, newSnap];
}

function specToDiagrams(spec) {
  if (spec.length == 1) {
    return spec;
  }
  let diagrams = [spec[0]];
  let curDiagram = $.extend(true, {}, spec[0]);

  // process each diff after initial state
  for (let i = 1; i < spec.length; i++) {
    let diff = spec[i].heap;
    let curSnap = transformer.transform(curDiagram);

    // process each part of the diff
    for (let j = 0; j < diff.length; j++) {
      if (diff[j].name.ref) {
        [curDiagram, curSnap] = replaceRefInDiagram(
          diff[j],
          curDiagram,
          curSnap,
          i
        );
      }
    }
    diagrams.push($.extend(true, {}, curDiagram));
  }

  return diagrams;
}

module.exports = { specToDiagrams };
