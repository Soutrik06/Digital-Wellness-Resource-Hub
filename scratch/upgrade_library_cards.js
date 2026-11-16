const fs = require('fs');
const path = require('path');

// 1. Update library.js
const libPath = path.join(__dirname, '..', 'js/modules/library.js');
let libCode = fs.readFileSync(libPath, 'utf8').replace(/\r\n/g, '\n');

libCode = libCode.replace(
  '<article class="card-wellness p-6 flex flex-col justify-between"',
  '<article class="card-wellness card-joyful-3d p-6 flex flex-col justify-between group"'
);

fs.writeFileSync(libPath, libCode.replace(/\n/g, '\r\n'), 'utf8');
console.log("Upgraded library.js cards with card-joyful-3d");

// 2. Update matcher.js
const matchPath = path.join(__dirname, '..', 'js/modules/matcher.js');
let matchCode = fs.readFileSync(matchPath, 'utf8').replace(/\r\n/g, '\n');

matchCode = matchCode.replace(
  '<div class="card-wellness p-5 flex flex-col justify-between">',
  '<div class="card-wellness card-joyful-3d p-5 flex flex-col justify-between group">'
);

fs.writeFileSync(matchPath, matchCode.replace(/\n/g, '\r\n'), 'utf8');
console.log("Upgraded matcher.js cards with card-joyful-3d");
