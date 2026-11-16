const fs = require('fs');
const path = require('path');

// 1. Add script tag to index.html
const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

const scriptTarget = '  <script src="js/modules/duoCompanion.js"></script>\n  <script src="js/main.js"></script>';
const scriptReplace = '  <script src="js/modules/duoCompanion.js"></script>\n  <script src="js/modules/birdGuide.js"></script>\n  <script src="js/main.js"></script>';

if (!html.includes(scriptTarget)) {
  console.error('Script target not found in index.html');
  process.exit(1);
}

html = html.replace(scriptTarget, scriptReplace);
fs.writeFileSync(indexPath, html.replace(/\n/g, '\r\n'), 'utf8');
console.log('Added birdGuide.js script tag to index.html');

// 2. Add initBirdGuide to main.js
const mainPath = path.join(__dirname, '..', 'js/main.js');
let main = fs.readFileSync(mainPath, 'utf8').replace(/\r\n/g, '\n');

const mainTarget = "    if (typeof initDuoCompanion === 'function') initDuoCompanion();";
const mainReplace = "    if (typeof initDuoCompanion === 'function') initDuoCompanion();\n    if (typeof initBirdGuide === 'function') initBirdGuide();";

if (!main.includes(mainTarget)) {
  console.error('main.js target not found');
  process.exit(1);
}

main = main.replace(mainTarget, mainReplace);
fs.writeFileSync(mainPath, main.replace(/\n/g, '\r\n'), 'utf8');
console.log('Added initBirdGuide() call to main.js');
