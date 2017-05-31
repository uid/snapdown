'use strict';

const module = {};
function require(module) {
  switch (module) {
    case 'klayjs': return window.$klay;
    case 'snapdown-parser': return PEG.buildParser(snapdown_grammar);
  }
  throw module;
}
