const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split(/\r?\n/);
lines.forEach((l, i) => {
  const t = l.trim();
  if (t.includes('id="meditation"') || t.includes('id="guides"') || t.includes('id="resources"')) {
    console.log((i+1) + ': ' + t.slice(0, 100));
  }
});
