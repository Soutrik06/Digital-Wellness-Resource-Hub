const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const targetClass = `class="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 hover:border-forest-400 bg-slate-50/50 cursor-pointer transition"`;
const replacementClass = `class="radio-card-joyful flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white"`;

const occurrences = (content.match(new RegExp(targetClass, 'g')) || []).length;
console.log(`Found ${occurrences} radio label occurrences in index.html`);

if (occurrences > 0) {
  content = content.replaceAll(targetClass, replacementClass);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log("Successfully upgraded all assessment radio options with joyful bouncy style!");
} else {
  console.log("No occurrences found; checking normalized...");
}
