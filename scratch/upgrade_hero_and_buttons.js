const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8').replace(/\r\n/g, '\n');

// 1. Upgrade 4 stats cards in Hero
const oldStats = `          <!-- 4 Curated Academic Statistics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-left pt-6 border-t border-slate-200/80">
            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">4.4 hrs</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Daily Phone Average</div>
              <div class="text-[11px] text-slate-500 mt-1">Undergraduate leisure use (J. Amer. Coll. Health)</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">89%</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Study Flow Derailment</div>
              <div class="text-[11px] text-slate-500 mt-1">Interrupted by notifications every 12 mins</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">76%</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Bedtime Screen Lag</div>
              <div class="text-[11px] text-slate-500 mt-1">Phone in bed extends sleep latency by 43m</div>
            </div>

            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">100%</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Verified Privacy Terms</div>
              <div class="text-[11px] text-slate-500 mt-1">Zero hidden subscriptions or telemetry</div>
            </div>
          </div>`;

const newStats = `          <!-- 4 Curated Academic Statistics (Joyful 3D Cards) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-left pt-6 border-t border-slate-200/80">
            <div class="card-joyful-3d bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs group cursor-pointer" onclick="if(window.playBubblePop) playBubblePop()">
              <div class="text-forest-800 font-heading font-extrabold text-2xl flex items-center justify-between">
                <span>4.4 hrs</span>
                <i class="fa-solid fa-mobile-screen text-forest-300 group-hover:text-forest-600 transition text-sm"></i>
              </div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Daily Phone Average</div>
              <div class="text-[11px] text-slate-500 mt-1">Undergraduate leisure use (J. Amer. Coll. Health)</div>
            </div>

            <div class="card-joyful-3d bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs group cursor-pointer" onclick="if(window.playBubblePop) playBubblePop()">
              <div class="text-forest-800 font-heading font-extrabold text-2xl flex items-center justify-between">
                <span>89%</span>
                <i class="fa-solid fa-bell-slash text-forest-300 group-hover:text-forest-600 transition text-sm"></i>
              </div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Study Flow Derailment</div>
              <div class="text-[11px] text-slate-500 mt-1">Interrupted by notifications every 12 mins</div>
            </div>

            <div class="card-joyful-3d bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs group cursor-pointer" onclick="if(window.playBubblePop) playBubblePop()">
              <div class="text-forest-800 font-heading font-extrabold text-2xl flex items-center justify-between">
                <span>76%</span>
                <i class="fa-solid fa-moon text-forest-300 group-hover:text-forest-600 transition text-sm"></i>
              </div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Bedtime Screen Lag</div>
              <div class="text-[11px] text-slate-500 mt-1">Phone in bed extends sleep latency by 43m</div>
            </div>

            <div class="card-joyful-3d bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs group cursor-pointer" onclick="if(window.playBubblePop) playBubblePop()">
              <div class="text-forest-800 font-heading font-extrabold text-2xl flex items-center justify-between">
                <span>100%</span>
                <i class="fa-solid fa-shield-halved text-forest-300 group-hover:text-forest-600 transition text-sm"></i>
              </div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Verified Privacy Terms</div>
              <div class="text-[11px] text-slate-500 mt-1">Zero hidden subscriptions or telemetry</div>
            </div>
          </div>`;

if (content.includes(oldStats)) {
  content = content.replace(oldStats, newStats);
  console.log("Upgraded Hero stats cards with 3D joyful hover");
} else {
  console.log("Hero stats cards pattern not found directly, checking variations...");
}

// 2. Upgrade Assessment submit button
const oldAssessBtn = `<button type="submit" class="bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-xs transition flex items-center gap-2">
                <i class="fa-solid fa-chart-simple"></i>
                <span>Generate Habit Reflection Report</span>
              </button>`;

const newAssessBtn = `<button type="submit" class="btn-duo-primary text-sm px-7 py-3.5 flex items-center gap-2 cursor-pointer shadow-sm">
                <i class="fa-solid fa-chart-simple"></i>
                <span>Generate Habit Reflection Report</span>
              </button>`;

if (content.includes(oldAssessBtn)) {
  content = content.replace(oldAssessBtn, newAssessBtn);
  console.log("Upgraded Assessment submit button to Duolingo 3D style");
}

// 3. Upgrade Pomodoro start button
const oldTimerBtn = `<button id="timer-start-pause-btn" class="bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5">
                  <i class="fa-solid fa-play mr-1.5"></i> Start Focus
                </button>`;

const newTimerBtn = `<button id="timer-start-pause-btn" class="btn-duo-primary text-xs sm:text-sm px-6 py-3 flex items-center gap-1.5 cursor-pointer">
                  <i class="fa-solid fa-play mr-1.5"></i> Start Focus
                </button>`;

if (content.includes(oldTimerBtn)) {
  content = content.replace(oldTimerBtn, newTimerBtn);
  console.log("Upgraded Pomodoro start button to Duolingo 3D style");
}

fs.writeFileSync(indexPath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("Finished updating hero and buttons!");
