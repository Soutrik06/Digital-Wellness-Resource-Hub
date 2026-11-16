const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Basic balance check on crucial structural tags
const tagsToCheck = ['main', 'section', 'article', 'aside', 'footer', 'nav', 'table'];

tagsToCheck.forEach(tag => {
  const openCount = (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
  const closeCount = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
  console.log(`Tag <${tag}>: open=${openCount}, close=${closeCount}`);
  if (openCount !== closeCount) {
    console.error(`Tag mismatch for <${tag}>!`);
    process.exit(1);
  }
});

console.log("HTML structural tags perfectly balanced!");
