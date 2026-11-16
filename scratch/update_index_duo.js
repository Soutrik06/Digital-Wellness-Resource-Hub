const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Upgrade Hero CTAs with Duolingo tactile 3D style and replace the static circle with the Duo Mascot Hero Mount
const targetHeroCenter = `          <!-- Call to Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
            <a href="#assessment" class="bg-forest-800 hover:bg-forest-900 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center gap-2">
              <i class="fa-solid fa-clipboard-check"></i>
              <span>Start Self-Assessment</span>
            </a>
            <a href="#resources" class="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-forest-700"></i>
              <span>Explore 13 Vetted Tools</span>
            </a>
            <a href="#toolkit" class="bg-forest-50 hover:bg-forest-100 border border-forest-200 text-forest-900 font-semibold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center gap-2">
              <i class="fa-solid fa-stopwatch text-forest-700"></i>
              <span>Focus Toolkit</span>
            </a>
          </div>

          <!-- Mindful Visual Breathing Circle (SVG-Based Calm Visual) -->
          <div class="relative max-w-xs mx-auto mb-8 flex flex-col items-center justify-center">
            <div class="w-36 h-36 rounded-full bg-gradient-to-tr from-forest-200/50 via-sage-100 to-emerald-100 flex items-center justify-center border border-forest-200/70 shadow-inner animate-breath">
              <div class="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center text-forest-900 shadow-sm border border-forest-100">
                <i class="fa-solid fa-seedling text-2xl text-forest-700 mb-1"></i>
                <span class="text-[10px] font-bold uppercase tracking-wider text-forest-800">Mindful</span>
              </div>
            </div>
            <span class="text-[11px] text-slate-500 font-medium mt-2">Breathe & Reset • Attention Restoration Cadence</span>
          </div>`;

const replacementHeroCenter = `          <!-- Duolingo-Style 3D Tactile Call to Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8">
            <a href="#assessment" class="btn-duo-primary px-6 py-3.5 text-sm flex items-center gap-2">
              <i class="fa-solid fa-clipboard-check"></i>
              <span>Start Self-Assessment</span>
            </a>
            <a href="#resources" class="btn-duo-secondary px-6 py-3.5 text-sm flex items-center gap-2">
              <i class="fa-solid fa-layer-group text-forest-700"></i>
              <span>Explore 13 Vetted Tools</span>
            </a>
            <a href="#toolkit" class="btn-duo-secondary px-5 py-3.5 text-sm flex items-center gap-2">
              <i class="fa-solid fa-stopwatch text-forest-700"></i>
              <span>Focus Toolkit</span>
            </a>
          </div>

          <!-- Duolingo-Style Animated Mindful Mascot ("Sage the Zen Owl") & Streak Showcase -->
          <div id="duo-mascot-hero-mount" class="w-full max-w-md mx-auto mb-6">
            <!-- Populated dynamically with interactive SVG character, speech bubble & flame streak by duoCompanion.js -->
          </div>`;

const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetHeroCenter.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementHeroCenter.replace(/\r\n/g, '\n');

if (!normalizedContent.includes(normalizedTarget)) {
  console.error("Hero center target not found!");
  process.exit(1);
}

let newContent = normalizedContent.replace(normalizedTarget, normalizedReplacement);

// 2. Add duoCompanion.js script tag before js/main.js
const scriptTarget = `<script src="js/modules/heatmap.js"></script>
  <script src="js/main.js"></script>`;

const scriptReplacement = `<script src="js/modules/heatmap.js"></script>
  <script src="js/modules/duoCompanion.js"></script>
  <script src="js/main.js"></script>`;

if (!newContent.includes(scriptTarget.replace(/\r\n/g, '\n'))) {
  console.error("Script target not found in index.html!");
  process.exit(1);
}

newContent = newContent.replace(scriptTarget.replace(/\r\n/g, '\n'), scriptReplacement.replace(/\r\n/g, '\n'));

fs.writeFileSync(indexPath, newContent.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully updated index.html with Duolingo-style mascot mount and script!");
