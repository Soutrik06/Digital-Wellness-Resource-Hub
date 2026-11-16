const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Insert heatmap container into Hero section
const targetHeroText = `          <!-- Mindful Visual Breathing Circle (SVG-Based Calm Visual) -->
          <div class="relative max-w-xs mx-auto mb-10 flex flex-col items-center justify-center">
            <div class="w-36 h-36 rounded-full bg-gradient-to-tr from-forest-200/50 via-sage-100 to-emerald-100 flex items-center justify-center border border-forest-200/70 shadow-inner animate-breath">
              <div class="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center text-forest-900 shadow-sm border border-forest-100">
                <i class="fa-solid fa-seedling text-2xl text-forest-700 mb-1"></i>
                <span class="text-[10px] font-bold uppercase tracking-wider text-forest-800">Mindful</span>
              </div>
            </div>
            <span class="text-[11px] text-slate-500 font-medium mt-2">Breathe & Reset • Attention Restoration Cadence</span>
          </div>`;

const replacementHeroText = `          <!-- Mindful Visual Breathing Circle (SVG-Based Calm Visual) -->
          <div class="relative max-w-xs mx-auto mb-8 flex flex-col items-center justify-center">
            <div class="w-36 h-36 rounded-full bg-gradient-to-tr from-forest-200/50 via-sage-100 to-emerald-100 flex items-center justify-center border border-forest-200/70 shadow-inner animate-breath">
              <div class="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center text-forest-900 shadow-sm border border-forest-100">
                <i class="fa-solid fa-seedling text-2xl text-forest-700 mb-1"></i>
                <span class="text-[10px] font-bold uppercase tracking-wider text-forest-800">Mindful</span>
              </div>
            </div>
            <span class="text-[11px] text-slate-500 font-medium mt-2">Breathe & Reset • Attention Restoration Cadence</span>
          </div>

        </div>

        <!-- GitHub-Style Mindful Activity Heatmap (Hero Feature) -->
        <div id="mindful-heatmap-container" class="max-w-4xl mx-auto mb-12 text-left">
          <!-- Populated dynamically by js/modules/heatmap.js with realistic dummy data & interactions -->
        </div>

        <div class="max-w-4xl mx-auto">`;

// Normalizing line endings for reliable replacement
const normalizedContent = content.replace(/\r\n/g, '\n');
const normalizedTarget = targetHeroText.replace(/\r\n/g, '\n');
const normalizedReplacement = replacementHeroText.replace(/\r\n/g, '\n');

if (!normalizedContent.includes(normalizedTarget)) {
  console.error("Target hero text not found!");
  process.exit(1);
}

let newContent = normalizedContent.replace(normalizedTarget, normalizedReplacement);

// Close the extra div for the 4 stats container before </section>
const targetStatsEnd = `            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">100%</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Verified Privacy Terms</div>
              <div class="text-[11px] text-slate-500 mt-1">Zero hidden subscriptions or telemetry</div>
            </div>
          </div>

        </div>

      </div>
    </section>`;

const replacementStatsEnd = `            <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div class="text-forest-800 font-heading font-extrabold text-2xl">100%</div>
              <div class="text-xs font-semibold text-slate-800 mt-0.5">Verified Privacy Terms</div>
              <div class="text-[11px] text-slate-500 mt-1">Zero hidden subscriptions or telemetry</div>
            </div>
          </div>
        </div>

      </div>
    </section>`;

if (newContent.includes(targetStatsEnd.replace(/\r\n/g, '\n'))) {
  newContent = newContent.replace(targetStatsEnd.replace(/\r\n/g, '\n'), replacementStatsEnd.replace(/\r\n/g, '\n'));
}

// 2. Add <script src="js/modules/heatmap.js"></script> before js/main.js
const scriptTarget = `<script src="js/modules/methodology.js"></script>
  <script src="js/main.js"></script>`;

const scriptReplacement = `<script src="js/modules/methodology.js"></script>
  <script src="js/modules/heatmap.js"></script>
  <script src="js/main.js"></script>`;

if (!newContent.includes(scriptTarget.replace(/\r\n/g, '\n'))) {
  console.error("Script target not found!");
  process.exit(1);
}

newContent = newContent.replace(scriptTarget.replace(/\r\n/g, '\n'), scriptReplacement.replace(/\r\n/g, '\n'));

// Save back with original CRLF or LF
fs.writeFileSync(indexPath, newContent.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully updated index.html with heatmap container and script!");
