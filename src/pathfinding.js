"use strict";

// FIXME: how to make this work in development?
const PF = require("pathfinding");

// hack: get offset of heap from top-left
function getHeapOffset(graphs) {
  // TODO: remove magic numbers
  // TODO: why does graphs[0] get drawn to the right of graphs[1]?!?!
  return {
    x: graphs[1].width,
    y: Math.max(0, graphs[1].height - graphs[0].height),
  };
}

// hack
function getGridSize(graphs) {
  return {
    x: graphs[0].width + graphs[1].width,
    y: Math.max(graphs[0].height, graphs[1].height),
  };
}

// hack
function getClosestWalkable(grid, x1, y1, x2, y2) {
  // TODO: don't give up so easily if we run out of bounds
  while (grid.isInside(x1, y1) && !grid.isWalkableAt(x1, y1)) x1++;
  while (grid.isInside(x2, y2) && !grid.isWalkableAt(x2, y2)) x2--;
  return [x1, y1, x2, y2];
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
          roughEdgeList.push(
            getClosestWalkable(
              grid,
              ...[
                Math.ceil(sourceInfo.x),
                Math.ceil(sourceInfo.y),
                Math.floor(targetInfo.x),
                Math.floor(targetInfo.y),
              ]
            )
          );
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
function getObstaclesAndObjInfo(graph, offset) {
  let obstacles = [];
  let objInfo = {};
  if (!graph.children && !graph.edges) return { obstacles, objInfo };

  if (graph.children) {
    graph.children.forEach((obj) => {
      // TODO reduce duplicate code
      if (obj.val) {
        let info = {};
        obj.labels.forEach((label) => {
          info = {
            type: "node",
            x: obj.x + label.x + offset.x,
            y: obj.y + label.y + offset.y,
            width: label.width,
            height: label.height,
          };
          obstacles.push(info);
        });
        // TODO can there be more than one info for a value?
        objInfo[obj.id] = info;
      } else if (obj.object || obj.func) {
        let info = {
          type: "node",
          x: obj.x + offset.x,
          y: obj.y + offset.y,
          width: obj.width,
          height: obj.height,
        };
        obstacles.push(info);
        objInfo[obj.id] = info;
      } else if (obj.x && obj.y && obj.width && obj.height && obj.id) {
        let info = {
          type: "other",
          x: obj.x + offset.x,
          y: obj.y + offset.y,
          width: obj.width,
          height: obj.height,
        };
        objInfo[obj.id] = info;
      }

      let childResult = getObstaclesAndObjInfo(obj, {
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
      });
    });
  }

  return { obstacles, objInfo };
}

function getPFGrid(gridSize, obstacleInfo) {
  // TODO: eventually deal with edges?
  let grid = new PF.Grid(Math.ceil(gridSize.x), Math.ceil(gridSize.y));

  obstacleInfo.forEach((obstacle) => {
    if (obstacle.type == "node") {
      let minX = Math.floor(obstacle.x),
        maxX = Math.ceil(obstacle.x + obstacle.width);
      let minY = Math.floor(obstacle.y),
        maxY = Math.ceil(obstacle.y + obstacle.height);

      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          grid.setWalkableAt(i, j, false);
        }
      }
    } else if (obstacle.type == "edge") {
      // don't worry about edges for now.
      // TODO
    }
  });

  return grid;
}

function layoutRoughEdges(graphs) {
  let gridSize = getGridSize(graphs);
  let heapOffset = getHeapOffset(graphs);

  // get all obstacles in this diagram
  // and get x/y/width/height for every laid-out object in this diagram
  let obstacles = [];
  let objInfo = {};
  graphs.forEach((graph) => {
    let offset = heapOffset;
    // TODO
    if (graph.id == "stackDiagram") offset = { x: 0, y: 0 };
    let graphResult = getObstaclesAndObjInfo(graph, offset);
    obstacles.push(...graphResult.obstacles);
    objInfo = Object.assign(objInfo, graphResult.objInfo);
  });

  // get grid from obstacles
  // and get rough edge list + their starts and ends
  let grid = getPFGrid(gridSize, obstacles);

  let roughEdgeList = [];
  graphs.forEach((graph) => {
    roughEdgeList.push(...getRoughEdgeList(graph, objInfo, grid));
  });

  // TODO best finder?
  let finder = new PF.AStarFinder();
  let paths = [];
  roughEdgeList.forEach((roughEdge) => {
    var gridBackup = grid.clone();
    paths.push(finder.findPath(...roughEdge, gridBackup));
  });

  return paths;
}

module.exports = { layoutRoughEdges };
