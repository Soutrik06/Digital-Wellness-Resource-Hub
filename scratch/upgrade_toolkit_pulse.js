const fs = require('fs');
const path = require('path');

const toolkitPath = path.join(__dirname, '..', 'js/modules/toolkit.js');
let code = fs.readFileSync(toolkitPath, 'utf8').replace(/\r\n/g, '\n');

// 1. In startTimer
const startTarget = `    if (isTimerRunning) return;
    isTimerRunning = true;`;

const startReplacement = `    if (isTimerRunning) return;
    isTimerRunning = true;
    const ringParent = document.getElementById('timer-progress-ring')?.closest('.relative');
    if (ringParent) ringParent.classList.add('timer-running-pulse');
    if (typeof window.showJoyfulToast === 'function') window.showJoyfulToast("⏱️", "Pomodoro Started!", "25-min focus sprint in progress. You've got this!");`;

// 2. In pauseTimer
const pauseTarget = `  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;`;

const pauseReplacement = `  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    const ringParent = document.getElementById('timer-progress-ring')?.closest('.relative');
    if (ringParent) ringParent.classList.remove('timer-running-pulse');`;

if (code.includes(startTarget) && code.includes(pauseTarget)) {
  code = code.replace(startTarget, startReplacement).replace(pauseTarget, pauseReplacement);
  fs.writeFileSync(toolkitPath, code.replace(/\n/g, '\r\n'), 'utf8');
  console.log("Successfully hooked timer-running-pulse into toolkit.js");
} else {
  console.error("Targets not found in toolkit.js");
}
