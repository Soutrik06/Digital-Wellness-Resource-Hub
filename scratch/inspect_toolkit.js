const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);
lines.forEach((l, i) => {
  if (l.includes('id="toolkit"')) console.log("Toolkit at line:", i + 1);
});
