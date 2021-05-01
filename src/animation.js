"use strict";

const transformer = require("./transformer");
const $ = require("jquery");

function replaceRefInDiagram(diffPart, diagram, snap, iter, grow = false) {
  let newDiagram = $.extend(true, {}, diagram);
  let newSnap = $.extend(true, {}, snap);
  diffPart.usedIter = iter;

  let ref = diffPart.name.ref;

  // this might prove useful
  let lookupIds = [];
  try {
    lookupIds = transformer
      .lookupRef(ref, newDiagram.heap, [])
      .ids.map((x) => x.id);
  } catch (e) {}

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

  if (grow && id.length) diffPart.hyper = true;

  if (id.length) {
    // field already exists in diagram, remove all instances & replace
    let resolved = false;
    for (let i = 0; i < id.length; i++) {
      let toDeleteElems = [];
      let shouldPush = false;
      for (let j = 0; j < newDiagram.heap.length; j++) {
        let hasTargetFields =
          newDiagram.heap[j].target &&
          newDiagram.heap[j].target.fields &&
          newDiagram.heap[j].target.id == id[i];
        let hasFields =
          newDiagram.heap[j].fields && newDiagram.heap[j].id == id[i];

        // is of type "add"
        if (
          diffPart.add &&
          newDiagram.heap[j].target &&
          newDiagram.heap[j].target.fields &&
          (lookupIds.includes(newDiagram.heap[j].id) ||
            lookupIds.includes(newDiagram.heap[j].target.id))
        ) {
          let modifiedDiffPart = $.extend(true, {}, diffPart);
          let fields = newDiagram.heap[j].target.fields;
          modifiedDiffPart.name = modifiedDiffPart.fieldname;
          fields.push(modifiedDiffPart);
          resolved = true;
        } else if (
          !diffPart.add &&
          !fieldId[i] &&
          newDiagram.heap[j].id == id[i]
        ) {
          // independent: resolve by replacing heap element
          if (indep[i]) {
            if (!grow) {
              newDiagram.heap[j].hyper = true;
              diffPart.hyper = false;
              shouldPush = true;
              newDiagram.heap[j].erased = true;
            } else {
              newDiagram.heap[j].hyper = true;
              diffPart.hyper = false;
              shouldPush = true;
            }
            delete newDiagram.heap[j].independent;
            if (diffPart.target === null && newDiagram.heap[j].target) {
              diffPart.target = { to: [{ id: newDiagram.heap[j].target.id }] };
            }
            resolved = true;
          }
          // not independent: delete heap element
          else toDeleteElems.push(j);
        } else if (
          //diffPart.add &&
          fieldId[i] &&
          (hasTargetFields || hasFields)
        ) {
          let fields = hasTargetFields
            ? newDiagram.heap[j].target.fields
            : newDiagram.heap[j].fields;
          let toDeleteFields = [];
          let shouldPushField = false;
          for (let k = 0; k < fields.length; k++) {
            if (fields[k].id != fieldId[i]) continue;
            if (indep[i]) {
              if (!grow) {
                fields[k].hyper = true;
                diffPart.hyper = false;
                shouldPushField = true;
                fields[k].erased = true;
              } else {
                fields[k].hyper = true;
                diffPart.hyper = false;
                shouldPushField = true;
              }
              delete fields[k].independent;
              if (diffPart.target === null && fields[k].target) {
                diffPart.target = { to: [{ id: fields[k].target.id }] };
              }
              resolved = true;
            } else toDeleteFields.push(k);
          }
          if (shouldPushField) {
            fields.push(diffPart);
          }
          toDeleteFields.reverse();
          if (!grow) for (let f of toDeleteFields) fields[f].erased = true;
        }
      }
      if (shouldPush) {
        newDiagram.heap.push($.extend(true, {}, diffPart));
      }
      toDeleteElems.reverse();
      if (!grow) for (let e of toDeleteElems) newDiagram.heap[e].erased = true;
    }
    // if still unresolved, just add the diff part
    if (!resolved) {
      newDiagram.heap.push($.extend(true, {}, diffPart));
    }
  } else {
    // easiest case: ref hasn't been defined yet
    newDiagram.heap.push($.extend(true, {}, diffPart));
  }

  return [newDiagram, newSnap];
}

function specToDiagrams(spec, grow = false) {
  if (spec.length == 1) {
    return spec;
  }
  let curDiagram = $.extend(true, {}, spec[0]);
  let curSnap = transformer.transform(curDiagram);
  let diagrams = [curDiagram];

  // process each diff after initial state
  for (let i = 1; i < spec.length; i++) {
    let diff = spec[i].heap;

    // process each part of the diff
    for (let j = 0; j < diff.length; j++) {
      if (diff[j].name.ref) {
        [curDiagram, curSnap] = replaceRefInDiagram(
          diff[j],
          curDiagram,
          curSnap,
          i,
          grow
        );
      }
    }

    curSnap = transformer.transform(curDiagram, false);
    diagrams.push($.extend(true, {}, curDiagram));
  }

  return diagrams;
}

function modifyMaster(master, graphs) {
  master = $.extend(true, {}, master);

  function getIds(graph) {
    let children = graph.children || [];
    let edges = graph.edges || [];

    let childIds = [],
      edgeIds = [];

    if (children.length) {
      for (let child of children) {
        let ids = getIds(child);
        edgeIds = [...edgeIds, ...ids.edgeIds];
        childIds = [...childIds, child.id, ...ids.childIds];
      }
    }
    if (edges.length) {
      for (let edge of edges) {
        if (edge.erased) {
          continue;
        }
        // TODO: better way to encode edge ID / source / target?
        edgeIds = [
          ...edgeIds,
          `${edge.id}-${edge.sources[0]}-${edge.targets[0]}-${Boolean(
            edge.crossed
          )}`,
        ];
      }
    }

    return { childIds, edgeIds };
  }

  function removeNonIds(graph, ids) {
    let children = graph.children || [];
    let edges = graph.edges || [];

    let { childIds, edgeIds } = ids;

    let childrenToRemove = [],
      edgesToRemove = [];
    for (let i = 0; i < children.length; i++) {
      if (!childIds.includes(children[i].id)) {
        childrenToRemove.push(i);
      } else {
        removeNonIds(children[i], ids);
      }
    }
    for (let i = childrenToRemove.length - 1; i >= 0; i--) {
      children.splice(childrenToRemove[i], 1);
    }

    for (let i = 0; i < edges.length; i++) {
      // TODO
      if (
        !edgeIds.includes(
          `${edges[i].id}-${edges[i].sources[0]}-${
            edges[i].targets[0]
          }-${Boolean(edges[i].crossed)}`
        )
      ) {
        edgesToRemove.push(i);
      }
    }
    for (let i = edgesToRemove.length - 1; i >= 0; i--) {
      edges.splice(edgesToRemove[i], 1);
    }
  }

  let ids = getIds(graphs);
  removeNonIds(master, ids);

  return master;
}

module.exports = { specToDiagrams, modifyMaster };
