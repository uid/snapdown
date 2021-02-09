"use strict";

// FIXME: how to make this work in development?
const PF = require("pathfinding");

const granularity = 5;
const nodeTopSpace = 10,
  nodeBottomSpace = 25;

// hack: get offset of heap from top-left
function getHeapOffset(graphs) {
  // TODO: remove magic numbers
  // TODO: why does graphs[0] get drawn to the right of graphs[1]?!?!
  // TODO: this is now outdated, given that both diagrams are drawn in one grid
  // TODO: this needs to keep in mind that we can have multiple stacks / more than two SVGs combined
  return {
    x: graphs[1].width,
    y: 0, //Math.max(0, graphs[1].height - graphs[0].height),
  };
}

// hack
function getGridSize(graphs) {
  return {
    x: graphs[0].width + graphs[1].width,
    y: Math.max(graphs[0].height, graphs[1].height),
  };
}

function getRoughEdgeList(graph, objInfo) {
  let roughEdgeList = [];
  let sourceIds = [];
  if (!graph.children) return [roughEdgeList, sourceIds];

  if (graph.roughEdges) {
    graph.roughEdges.forEach((roughEdge) => {
      // TODO are all these actually needed?
      if (roughEdge.source && roughEdge.target && roughEdge.target.to) {
        let sourceId = roughEdge.source;
        sourceIds.push(sourceId);
        let targetId = roughEdge.target.to[0].id;
        // TODO are these actually needed?
        if (sourceId in objInfo && targetId in objInfo) {
          let sourceInfo = objInfo[sourceId];
          let targetInfo = objInfo[targetId];
          roughEdgeList.push({
            edge: [
              Math.ceil((sourceInfo.x + sourceInfo.width) / granularity + 1),
              Math.ceil(sourceInfo.y / granularity),
              Math.floor(targetInfo.x / granularity - 1),
              Math.floor((targetInfo.y + targetInfo.height / 2) / granularity),
            ],
            source: [
              sourceInfo.x + sourceInfo.width,
              sourceInfo.y + sourceInfo.height / 2,
            ],
            target: [targetInfo.x, targetInfo.y + targetInfo.height / 2],
            sourceId,
            targetId,
            crossed: Boolean(roughEdge.crossed),
          });
        }
      }
    });
  }

  graph.children.forEach((child) => {
    let [a, b] = getRoughEdgeList(child, objInfo);
    roughEdgeList.push(...a);
    sourceIds.push(...b);
  });

  return [roughEdgeList, sourceIds];
}

// { obstacles: <OBSTACLES>, objInfo: <OBJINFO> }
// <OBSTACLES> = [ { type: "node|edge", <INFO> }, ... ]
// if node: <INFO> consists of x, y, width, height
// if edge: <INFO> consists of list of sections
// <OBJINFO> = { id: { x, y, width, height } }, only applies to objects
function getObstaclesAndObjInfo(graph, parentObjInfo, offset) {
  let obstacles = [];
  let objInfo = Object.assign({}, parentObjInfo);
  if (!graph.children && !graph.edges) return { obstacles, objInfo };

  if (graph.children) {
    graph.children.forEach((obj) => {
      // TODO reduce duplicate code
      if (obj.object || obj.func) {
        let info = {
          type: obj.object ? "node" : "func",
          x: obj.x + offset.x,
          y: obj.y + offset.y,
          width: obj.width,
          height: obj.height,
          id: obj.id,
        };
        obstacles.push(info);
        objInfo[obj.id] = info;
      } else if (obj.labels) {
        let info = {};
        let labels = [];
        obj.labels.forEach((label) => {
          info = {
            type: "label",
            x: obj.x + label.x + offset.x,
            y: obj.y + label.y + offset.y,
            width: label.width,
            height: label.height,
            id: obj.id,
          };
          obstacles.push(info);
          labels.push(info);
        });
        // TODO can there be more than one info for a value?
        if (graph.id in objInfo && objInfo[graph.id].type == "func") {
          let parentLabels = objInfo[graph.id].labels || [];
          objInfo[graph.id] = Object.assign(objInfo[graph.id], {
            labels: parentLabels.concat(labels),
          });
        }
        objInfo[obj.id] = info;
      } else if (obj.x && obj.y && obj.width && obj.height && obj.id) {
        let info = {
          type: "other",
          x: obj.x + offset.x,
          y: obj.y + offset.y,
          width: obj.width,
          height: obj.height,
          id: obj.id,
        };
        objInfo[obj.id] = info;
      }

      let childResult = getObstaclesAndObjInfo(obj, objInfo, {
        x: obj.x + offset.x,
        y: obj.y + offset.y,
      });
      obstacles.push(...childResult.obstacles);
      objInfo = Object.assign(objInfo, childResult.objInfo);
    });
  }

  if (graph.edges) {
    graph.edges.forEach((edge) => {
      obstacles.push({
        type: "edge",
        sections: edge.sections,
        offset: offset,
        id: edge.id,
      });
    });
  }

  return { obstacles, objInfo };
}

function getPFGrid(gridSize, obstacleInfo, objInfo, sourceIds) {
  // TODO: eventually deal with edges?
  let grid = new PF.Grid(
    Math.ceil(gridSize.x / granularity),
    Math.ceil(gridSize.y / granularity) + 5
  );

  let holeInfo = {};

  obstacleInfo.forEach((obstacle) => {
    if (
      obstacle.type == "node" ||
      obstacle.type == "func" ||
      obstacle.type == "label"
    ) {
      // bottomSpace is used to indicate that arrows should not go between
      // nodes & things their fields point at
      const topSpace = obstacle.type == "node" ? nodeTopSpace : 0;
      const bottomSpace = obstacle.type == "node" ? nodeBottomSpace : 0;
      let minX = obstacle.x,
        maxX = obstacle.x + obstacle.width;
      let minY = Math.max(obstacle.y - topSpace, 0),
        maxY = Math.min(obstacle.y + obstacle.height + bottomSpace, gridSize.y);

      // y-indices to "punch holes" at
      let labels = objInfo[obstacle.id].labels || [];
      let holeYs = [];
      let holeYsToIds = {};
      for (let label of labels) {
        let y = Math.floor(label.y / granularity);
        holeYs.push(y);
        holeYsToIds[y] = label.id;
      }

      // coarse grid that only blocks out the borders
      for (let i = minX; i <= maxX; i += granularity) {
        let column = Math.floor(i / granularity);

        grid.setWalkableAt(column, Math.ceil(minY / granularity), false);
        grid.setWalkableAt(column, Math.floor(maxY / granularity), false);
      }
      for (let i = minY; i <= maxY; i += granularity) {
        let row = Math.floor(i / granularity);

        grid.setWalkableAt(Math.ceil(minX / granularity), row, false);

        // "punch a hole" to the right of each label
        // TODO: both sides?
        if (holeYs.includes(row)) {
          holeInfo[holeYsToIds[row]] = [Math.floor(maxX / granularity), row];
        }

        grid.setWalkableAt(Math.floor(maxX / granularity), row, false);
      }
    } else if (obstacle.type == "edge") {
      // don't worry about edges for now.
      // TODO
    }
  });

  return { grid, holeInfo };
}

function inflatePath(path, source, target, numEdgesFrom) {
  numEdgesFrom[source] = (numEdgesFrom[source] || 0) + 2;
  let inflatedPath = path.map((x) => [
    x[0] * granularity,
    (x[1] + numEdgesFrom[source] - 2) * granularity,
  ]);
  return inflatedPath;
}

function layoutRoughEdges(graphs) {
  let gridSize = getGridSize(graphs);
  let heapOffset = getHeapOffset(graphs);

  // get all obstacles in this diagram
  // and get x/y/width/height for every laid-out object in this diagram
  let obstacles = [];
  let objInfo = {};
  graphs.forEach((parentGraph) => {
    // TODO hack: diagram => heap, stackDiagram => stack
    let graph = parentGraph.children[0];

    let offset = heapOffset;
    // TODO
    if (graph.id == "stack") offset = { x: 0, y: 0 };
    // TODO
    graph.x = 0;
    graph.y = 0;

    let graphResult = getObstaclesAndObjInfo(graph, {}, offset);
    obstacles.push(...graphResult.obstacles);
    objInfo = Object.assign(objInfo, graphResult.objInfo);
  });

  let roughEdgeList = [],
    sourceIds = [];
  graphs.forEach((graph) => {
    let [a, b] = getRoughEdgeList(graph, objInfo);
    roughEdgeList.push(...a);
    sourceIds.push(...b);
  });

  // get grid from obstacles
  // and get rough edge list + their starts and ends
  let { grid, holeInfo } = getPFGrid(gridSize, obstacles, objInfo, sourceIds);

  // TODO best finder?
  let finder = new PF.AStarFinder({ allowDiagonal: true });
  let paths = [];
  let numEdgesFrom = {};
  roughEdgeList.forEach((roughEdge) => {
    let { edge, source, target, sourceId } = roughEdge;
    let holeXY = holeInfo[sourceId];
    let gridBackup = grid.clone();
    gridBackup.setWalkableAt(holeXY[0], holeXY[1], true);
    let path = finder.findPath(...edge, gridBackup);
    paths.push({
      path: inflatePath(
        PF.Util.smoothenPath(gridBackup, path),
        source,
        target,
        numEdgesFrom
      ),
      crossed: roughEdge.crossed,
    });
  });

  return paths;
}

module.exports = { layoutRoughEdges };
