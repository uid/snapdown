"use strict";

// FIXME: how to make this work in development?
const PF = require("pathfinding");

const granularity = 10;

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

function getRoughEdgeList(graph, objInfo, grid) {
  let roughEdgeList = [];
  if (!graph.children) return roughEdgeList;

  if (graph.roughEdges) {
    graph.roughEdges.forEach((roughEdge) => {
      // TODO are all these actually needed?
      if (roughEdge.source && roughEdge.target && roughEdge.target.to) {
        let sourceId = roughEdge.source;
        let targetId = roughEdge.target.to[0].id;
        // TODO are these actually needed?
        if (sourceId in objInfo && targetId in objInfo) {
          let sourceInfo = objInfo[sourceId];
          let targetInfo = objInfo[targetId];
          roughEdgeList.push({
            edge: [
              Math.ceil((sourceInfo.x + sourceInfo.width) / granularity),
              Math.ceil(sourceInfo.y / granularity),
              Math.floor(targetInfo.x / granularity),
              Math.floor(targetInfo.y / granularity),
            ],
            target: [targetInfo.x, targetInfo.y],
          });
        }
      }
    });
  }

  graph.children.forEach((child) => {
    roughEdgeList.push(...getRoughEdgeList(child, objInfo, grid));
  });

  return roughEdgeList;
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
          type: "node",
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
            type: "node",
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
        if (graph.id in objInfo && objInfo[graph.id].type == "node") {
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

function getPFGrid(gridSize, obstacleInfo, objInfo) {
  // TODO: eventually deal with edges?
  let grid = new PF.Grid(
    Math.ceil(gridSize.x / granularity),
    Math.ceil(gridSize.y / granularity)
  );

  obstacleInfo.forEach((obstacle) => {
    if (obstacle.type == "node") {
      let minX = obstacle.x,
        maxX = obstacle.x + obstacle.width;
      let minY = obstacle.y,
        maxY = obstacle.y + obstacle.height;

      // y-indices to "punch holes" at
      let holeYs = (objInfo[obstacle.id].labels || []).map((label) =>
        Math.floor(label.y / granularity)
      );

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
        if (holeYs.includes(row)) continue;

        grid.setWalkableAt(Math.floor(maxX / granularity), row, false);
      }
    } else if (obstacle.type == "edge") {
      // don't worry about edges for now.
      // TODO
    }
  });

  return grid;
}

function inflatePath(path) {
  return path.map((x) => x.map((y) => y * granularity));
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

  // get grid from obstacles
  // and get rough edge list + their starts and ends
  let grid = getPFGrid(gridSize, obstacles, objInfo);

  let roughEdgeList = [];
  graphs.forEach((graph) => {
    roughEdgeList.push(...getRoughEdgeList(graph, objInfo, grid));
  });

  // TODO best finder?
  let finder = new PF.AStarFinder({ allowDiagonal: true });
  let paths = [];
  roughEdgeList.forEach((roughEdge) => {
    let { edge, target } = roughEdge;
    let gridBackup = grid.clone();
    let path = finder.findPath(...edge, gridBackup);
    paths.push(inflatePath(PF.Util.smoothenPath(gridBackup, path)));
  });

  return paths;
}

module.exports = { layoutRoughEdges };
