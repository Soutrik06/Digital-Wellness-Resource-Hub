const fs = require('fs');
const path = require('path');

// 1. Update assessment.js
const assessPath = path.join(__dirname, '..', 'js/modules/assessment.js');
let assessCode = fs.readFileSync(assessPath, 'utf8').replace(/\r\n/g, '\n');

const assessTarget = `    // Show results & scroll smoothly
    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });`;

const assessReplacement = `    // Show results & scroll smoothly
    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (typeof window.duoCelebrate === 'function') {
      window.duoCelebrate("🎉 Digital Wellness Assessment Completed! Here are your personalized next steps!");
    }`;

if (assessCode.includes(assessTarget)) {
  assessCode = assessCode.replace(assessTarget, assessReplacement);
  fs.writeFileSync(assessPath, assessCode.replace(/\n/g, '\r\n'), 'utf8');
  console.log("Successfully hooked duoCelebrate into assessment.js");
} else {
  console.error("Could not find assessTarget in assessment.js");
}

// 2. Update toolkit.js
const toolkitPath = path.join(__dirname, '..', 'js/modules/toolkit.js');
let toolkitCode = fs.readFileSync(toolkitPath, 'utf8').replace(/\r\n/g, '\n');

const toolkitTarget = `          // Announce interval completion
          announceLiveMessage("Focus interval complete! Great work. Time for a restful break.");`;

const toolkitReplacement = `          // Announce interval completion
          announceLiveMessage("Focus interval complete! Great work. Time for a restful break.");

          if (typeof window.duoCelebrate === 'function') {
            window.duoCelebrate("🎉 Focus Sprint Complete! 25 mins of deep work unlocked. Time to relax! ☕");
          }`;

if (toolkitCode.includes(toolkitTarget)) {
  toolkitCode = toolkitCode.replace(toolkitTarget, toolkitReplacement);
  fs.writeFileSync(toolkitPath, toolkitCode.replace(/\n/g, '\r\n'), 'utf8');
  console.log("Successfully hooked duoCelebrate into toolkit.js");
} else {
  console.error("Could not find toolkitTarget in toolkit.js");
}
