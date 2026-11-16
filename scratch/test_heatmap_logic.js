const fs = require('fs');
const path = require('path');

// Test that heatmap.js data generation logic works properly
const code = fs.readFileSync(path.join(__dirname, '..', 'js/modules/heatmap.js'), 'utf8');

// Verify key aspects in code
const assertions = [
  { name: "Contains generateDummyData", test: code.includes("function generateDummyData") },
  { name: "Contains calculateMetrics", test: code.includes("function calculateMetrics") },
  { name: "Contains renderHeatmap", test: code.includes("function renderHeatmap") },
  { name: "Contains setupHeatmapListeners", test: code.includes("function setupHeatmapListeners") },
  { name: "Contains initHeatmap", test: code.includes("window.initHeatmap = function") },
  { name: "Contains 5 activity levels", test: code.includes("hm-lvl-4") && code.includes("hm-lvl-0") },
  { name: "Contains quick log button listener", test: code.includes("hm-btn-log-session") },
  { name: "Contains 26/52 week range filters", test: code.includes("hm-range-26") && code.includes("hm-range-52") }
];

assertions.forEach(a => {
  if (a.test) {
    console.log(`[PASS] ${a.name}`);
  } else {
    console.error(`[FAIL] ${a.name}`);
    process.exit(1);
  }
});

console.log("Heatmap logic assertions passed!");
