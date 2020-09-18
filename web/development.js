"use strict";

function require(module) {
  switch (module) {
    case "elkjs":
      return ELK;
    case "yaml-front-matter":
      return yamlFront;
    case "../dist/snapdown-parser":
      return peg.generate(Grammar);
    case "./transformer":
      return Transformer;
    case "./renderer":
      return Renderer;
    case "./sidebar":
      return Sidebar;
    case "../web/examples":
      return Examples;
  }
  throw module;
}

var module = {};
