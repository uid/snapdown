'use strict';

function require(module) {
  switch (module) {
    case 'elkjs': return ELK;
    case 'yaml-front-matter': return yamlFront;
    case '../dist/snapdown-parser': return peg.generate(Grammar);
    case './transformer': return Transformer;
    case './renderer': return Renderer;
  }
  throw module;
}

var module = {};
