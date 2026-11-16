const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Checking syntax of all JavaScript files...");
const jsFiles = [
  'js/data/resources.js',
  'js/data/testingData.js',
  'js/config/supabase.js',
  'js/modules/navigation.js',
  'js/modules/heatmap.js',
  'js/modules/assessment.js',
  'js/modules/matcher.js',
  'js/modules/library.js',
  'js/modules/comparison.js',
  'js/modules/guides.js',
  'js/modules/toolkit.js',
  'js/modules/feedback.js',
  'js/modules/methodology.js',
  'js/main.js'
];

let hasErrors = false;
for (const file of jsFiles) {
  const fullPath = path.join(__dirname, '..', file);
  try {
    execSync(`node -c "${fullPath}"`);
    console.log(`[PASS] ${file}`);
  } catch (err) {
    console.error(`[FAIL] ${file}:`, err.message);
    hasErrors = true;
  }
}

console.log("\nChecking index.html structure...");
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const checks = [
  { name: 'Heatmap container exists', test: indexHtml.includes('id="mindful-heatmap-container"') },
  { name: 'Heatmap script included', test: indexHtml.includes('src="js/modules/heatmap.js"') },
  { name: 'Main script included', test: indexHtml.includes('src="js/main.js"') },
  { name: 'Assessment section intact', test: indexHtml.includes('id="assessment"') },
  { name: 'Hero section intact', test: indexHtml.includes('Your Digital Life') }
];

for (const check of checks) {
  if (check.test) {
    console.log(`[PASS] ${check.name}`);
  } else {
    console.error(`[FAIL] ${check.name}`);
    hasErrors = true;
  }
}

if (hasErrors) {
  process.exit(1);
} else {
  console.log("\nAll checks passed successfully!");
}
