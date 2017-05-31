'use strict';

const fs = require('fs');
const dir = 'test/unit/';
const ext = '.snap';
const unit_tests = {};
fs.readdirSync(dir).filter(f => f.endsWith(ext)).forEach(f => unit_tests[f] = fs.readFileSync(`${dir}${f}`, 'utf8'));
console.log('unit_tests=', unit_tests);
console.log('generated=', +new Date());
