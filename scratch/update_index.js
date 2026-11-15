const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../../../../../../../Users/stepp/Downloads/DW_proj/index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update Section H header with Supabase status badge
const oldHeader = `<div class="text-center max-w-3xl mx-auto mb-10">
          <span class="badge badge-category uppercase font-bold tracking-wider mb-1">Empirical Iteration</span>
          <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-forest-950">
            Student Feedback &amp; Usability Testing Audit
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-2">
            Documenting genuine usability trials with college participants, problem identification, implemented revisions, and an active local testing feedback queue.
          </p>
        </div>`;

const newHeader = `<div class="text-center max-w-3xl mx-auto mb-10">
          <span class="badge badge-category uppercase font-bold tracking-wider mb-1">Empirical Iteration</span>
          <h2 class="text-2xl sm:text-3xl font-heading font-extrabold text-forest-950">
            Student Feedback &amp; Usability Testing Audit
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 mt-2">
            Documenting genuine usability trials with college participants, problem identification, implemented revisions, and an active local testing feedback queue.
          </p>
          <div id="supabase-status-badge" class="mt-3 flex justify-center"></div>
        </div>`;

// 2. Update Form and Feed columns
const oldColumns = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <!-- Structured Feedback Form (Left Column, 6 cols) -->
          <div class="lg:col-span-6 card-wellness p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-pen-to-square text-forest-700"></i>
              <span>Log Usability Testing Feedback</span>
            </h3>
            <p class="text-xs text-slate-500 mb-5 leading-relaxed">
              Tested a wellness tool or walked through one of our setup guides? Record your findings. Submissions are saved locally to your browser and can be exported as JSON for grading evaluation.
            </p>

            <form id="usability-feedback-form" class="space-y-4 text-xs">
              <div>
                <label for="fb-major" class="block font-bold text-slate-700 mb-1">Your Major / Student Year</label>
                <input type="text" id="fb-major" required placeholder="e.g. 2nd Year Computer Science" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700">
              </div>

              <div>
                <label for="fb-resource" class="block font-bold text-slate-700 mb-1">Resource or Guide Evaluated</label>
                <select id="fb-resource" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:border-forest-700">
                  <option value="Unhook YouTube Extension">Unhook (YouTube Guide 1)</option>
                  <option value="Cold Turkey Blocker">Cold Turkey Blocker</option>
                  <option value="Bedtime Mode & Grayscale">Bedtime Mode &amp; Grayscale (Guide 2)</option>
                  <option value="ActivityWatch Local Tracker">ActivityWatch (Guide 3)</option>
                  <option value="Pomofocus / Focus Timer">Pomofocus / Focus Timer</option>
                  <option value="one sec App Delay">one sec - App Delay</option>
                  <option value="f.lux Display Warmth">f.lux Display Warmth</option>
                  <option value="uBlock Origin">uBlock Origin Ad Blocker</option>
                  <option value="Obsidian / Joplin">Obsidian / Joplin Note-Taking</option>
                </select>
              </div>

              <div>
                <label for="fb-task" class="block font-bold text-slate-700 mb-1">Task Attempted During Test</label>
                <input type="text" id="fb-task" required placeholder="e.g. Attempted a 2-hour locked homework session" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700">
              </div>

              <!-- Ease of Use Rating (1-5 stars) -->
              <div>
                <span class="block font-bold text-slate-700 mb-1">Ease of Setup &amp; Use Rating</span>
                <div class="flex items-center gap-4 text-slate-700 text-xs">
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="1" class="text-forest-800"> 1 (Difficult)
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="2" class="text-forest-800"> 2
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="3" class="text-forest-800"> 3
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="4" checked class="text-forest-800"> 4
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="5" class="text-forest-800"> 5 (Seamless)
                  </label>
                </div>
              </div>

              <div>
                <label for="fb-problems" class="block font-bold text-slate-700 mb-1">Problems Encountered (if any)</label>
                <textarea id="fb-problems" rows="2" placeholder="e.g. Locked out of campus login portal, instructions lacked extension link..." class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700"></textarea>
              </div>

              <div>
                <label for="fb-suggestions" class="block font-bold text-slate-700 mb-1">Practical Suggestions for Hub</label>
                <textarea id="fb-suggestions" rows="2" required placeholder="What should be clarified or changed for other students?" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700"></textarea>
              </div>

              <button type="submit" class="w-full bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Save Review to Local Testing Queue</span>
              </button>
            </form>

            <!-- Success Persistence Callout -->
            <div id="feedback-success-banner" class="hidden mt-4 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-start gap-2">
              <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
              <span><strong>Saved to Local Queue:</strong> Your testing submission has been recorded in your browser's persistent session queue. You can review it below or export it as JSON.</span>
            </div>
          </div>

          <!-- Active Local Submissions Feed (Right Column, 6 cols) -->
          <div class="lg:col-span-6 card-wellness p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-clipboard-list text-forest-700"></i>
                  <span>Active Local Testing Queue</span>
                </h3>
                <div class="flex items-center gap-2">
                  <button id="feedback-export-btn" class="text-xs font-semibold px-2.5 py-1 bg-forest-50 hover:bg-forest-100 text-forest-800 rounded-lg transition inline-flex items-center gap-1 border border-forest-200">
                    <i class="fa-solid fa-download text-[10px]"></i> Export JSON
                  </button>
                  <button id="feedback-clear-btn" class="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition hidden">
                    Clear
                  </button>
                </div>
              </div>

              <div id="feedback-local-queue" class="max-h-96 overflow-y-auto pr-1">
                <!-- Rendered dynamically by feedback.js -->
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <i class="fa-solid fa-circle-info text-forest-700 mr-1"></i> Transparent evaluation: submissions persist in localStorage without external tracking servers.
            </div>
          </div>

        </div>`;

const newColumns = `<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <!-- Structured Feedback Form (Left Column, 6 cols) -->
          <div class="lg:col-span-6 card-wellness p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
              <i class="fa-solid fa-pen-to-square text-forest-700"></i>
              <span>Log Usability Testing Feedback</span>
            </h3>
            <p class="text-xs text-slate-500 mb-4 leading-relaxed">
              Tested a wellness tool or walked through one of our setup guides? Record your findings. Submissions can be sent anonymously to our live Supabase cloud backend or local session queue.
            </p>

            <!-- Anonymous Option Toggle Pill -->
            <div class="p-3 bg-forest-50/70 border border-forest-200/80 rounded-xl mb-4">
              <label class="flex items-center justify-between cursor-pointer">
                <div class="flex items-center gap-2.5">
                  <i class="fa-solid fa-user-secret text-forest-700 text-base"></i>
                  <div>
                    <span class="font-bold text-slate-900 block text-xs">Submit Anonymously</span>
                    <span class="text-[11px] text-slate-500 block">Identity masked. No name, email, or IP address stored.</span>
                  </div>
                </div>
                <input type="checkbox" id="fb-anonymous" checked class="audit-checkbox">
              </label>
            </div>

            <form id="usability-feedback-form" class="space-y-4 text-xs">
              <div id="fb-major-container" class="opacity-50 transition-opacity">
                <label for="fb-major" class="block font-bold text-slate-700 mb-1">Your Major / Student Year (Optional when anonymous)</label>
                <input type="text" id="fb-major" disabled placeholder="Anonymous (Identity hidden)" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700">
              </div>

              <div>
                <label for="fb-resource" class="block font-bold text-slate-700 mb-1">Resource or Guide Evaluated</label>
                <select id="fb-resource" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs bg-white focus:border-forest-700">
                  <option value="General Digital Wellness Hub Feedback">General Platform Feedback &amp; Usability</option>
                  <option value="Wellness Resource Recommendation">Suggest a New Wellness Resource</option>
                  <option value="Unhook YouTube Extension">Unhook (YouTube Guide 1)</option>
                  <option value="Cold Turkey Blocker">Cold Turkey Blocker</option>
                  <option value="Bedtime Mode &amp; Grayscale">Bedtime Mode &amp; Grayscale (Guide 2)</option>
                  <option value="ActivityWatch Local Tracker">ActivityWatch (Guide 3)</option>
                  <option value="Pomofocus / Focus Timer">Pomofocus / Focus Timer</option>
                  <option value="one sec App Delay">one sec - App Delay</option>
                  <option value="f.lux Display Warmth">f.lux Display Warmth</option>
                  <option value="uBlock Origin">uBlock Origin Ad Blocker</option>
                  <option value="Obsidian / Joplin">Obsidian / Joplin Note-Taking</option>
                  <option value="Meditation &amp; Vipassana Hub">Meditation &amp; Vipassana Section</option>
                </select>
              </div>

              <div>
                <label for="fb-task" class="block font-bold text-slate-700 mb-1">Task Attempted During Test</label>
                <input type="text" id="fb-task" required placeholder="e.g. Attempted a 2-hour locked homework session" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700">
              </div>

              <!-- Ease of Use Rating (1-5 stars) -->
              <div>
                <span class="block font-bold text-slate-700 mb-1">Ease of Setup &amp; Use Rating</span>
                <div class="flex items-center gap-4 text-slate-700 text-xs">
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="1" class="text-forest-800"> 1 (Difficult)
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="2" class="text-forest-800"> 2
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="3" class="text-forest-800"> 3
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="4" checked class="text-forest-800"> 4
                  </label>
                  <label class="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="fb-rating" value="5" class="text-forest-800"> 5 (Seamless)
                  </label>
                </div>
              </div>

              <div>
                <label for="fb-problems" class="block font-bold text-slate-700 mb-1">Problems Encountered (if any)</label>
                <textarea id="fb-problems" rows="2" placeholder="e.g. Locked out of campus login portal, instructions lacked extension link..." class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700"></textarea>
              </div>

              <div>
                <label for="fb-suggestions" class="block font-bold text-slate-700 mb-1">Practical Suggestions for Hub</label>
                <textarea id="fb-suggestions" rows="2" required placeholder="What should be clarified or changed for other students?" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:border-forest-700 focus:ring-1 focus:ring-forest-700"></textarea>
              </div>

              <button type="submit" class="w-full bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Submit Anonymous Feedback</span>
              </button>
            </form>

            <!-- Success Persistence Callout -->
            <div id="feedback-success-banner" class="hidden mt-4 p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-start gap-2">
              <i class="fa-solid fa-circle-check text-emerald-600 mt-0.5"></i>
              <span id="feedback-success-text"><strong>Saved:</strong> Your testing submission has been recorded.</span>
            </div>
          </div>

          <!-- Active Local / Cloud Submissions Feed (Right Column, 6 cols) -->
          <div class="lg:col-span-6 card-wellness p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i class="fa-solid fa-clipboard-list text-forest-700"></i>
                  <span>Recent Anonymous Feedback</span>
                </h3>
                <div class="flex items-center gap-2">
                  <button id="feedback-refresh-btn" class="text-xs px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition inline-flex items-center gap-1 border border-slate-200" title="Refresh feed">
                    <i class="fa-solid fa-rotate text-[10px]"></i>
                  </button>
                  <button id="feedback-export-btn" class="text-xs font-semibold px-2.5 py-1 bg-forest-50 hover:bg-forest-100 text-forest-800 rounded-lg transition inline-flex items-center gap-1 border border-forest-200">
                    <i class="fa-solid fa-download text-[10px]"></i> Export JSON
                  </button>
                  <button id="feedback-clear-btn" class="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition hidden">
                    Clear
                  </button>
                </div>
              </div>

              <div id="feedback-local-queue" class="max-h-96 overflow-y-auto pr-1">
                <!-- Rendered dynamically by feedback.js -->
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span class="flex items-center gap-1"><i class="fa-solid fa-shield-halved text-forest-700"></i> Zero IP or telemetry logging</span>
              <button id="btn-open-supabase-modal" class="text-forest-800 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-database"></i> Supabase Backend Setup
              </button>
            </div>
          </div>

        </div>`;

// 3. Add Supabase Modal before </main>
const supabaseModalHtml = `
    <!-- SUPABASE BACKEND CONFIGURATION & SQL MODAL -->
    <div id="supabase-config-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden" role="dialog" aria-modal="true" aria-labelledby="supabase-modal-title">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button id="btn-close-supabase-modal" class="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition" aria-label="Close Supabase modal">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>

        <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl">
            <i class="fa-solid fa-database"></i>
          </div>
          <div>
            <h3 id="supabase-modal-title" class="text-xl font-bold text-slate-900">Supabase Backend Configuration</h3>
            <p class="text-xs text-slate-500">Connect a real Supabase PostgreSQL database for anonymous feedback persistence.</p>
          </div>
        </div>

        <div class="space-y-6 text-xs sm:text-sm">
          <!-- Credentials Form -->
          <form id="supabase-credentials-form" class="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Project Credentials</h4>
            <div>
              <label for="sb-input-url" class="block font-semibold text-slate-700 mb-1">Supabase Project URL</label>
              <input type="url" id="sb-input-url" required placeholder="https://your-project-id.supabase.co" class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:border-forest-700 focus:ring-1 focus:ring-forest-700 bg-white">
            </div>
            <div>
              <label for="sb-input-key" class="block font-semibold text-slate-700 mb-1">Supabase Anon Public API Key</label>
              <input type="password" id="sb-input-key" required placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:border-forest-700 focus:ring-1 focus:ring-forest-700 bg-white">
            </div>
            <div id="sb-test-message" class="text-xs hidden p-2 rounded-lg bg-white border border-slate-200"></div>
            <div class="flex items-center justify-between pt-2">
              <button type="button" id="btn-reset-supabase" class="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer">
                Revert to Local Demo
              </button>
              <button type="submit" class="bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid fa-plug"></i> Test & Save Connection
              </button>
            </div>
          </form>

          <!-- SQL Schema Instructions -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h4 class="font-bold text-slate-800 text-xs uppercase tracking-wider">Supabase SQL Schema (Run in Supabase SQL Editor)</h4>
              <button type="button" onclick="navigator.clipboard.writeText(document.getElementById('sb-sql-snippet').textContent).then(() => alert('SQL copied to clipboard!'))" class="text-[11px] font-semibold text-forest-800 hover:underline inline-flex items-center gap-1 cursor-pointer">
                <i class="fa-solid fa-copy"></i> Copy SQL
              </button>
            </div>
            <pre class="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800" id="sb-sql-snippet">-- 1. Create table for anonymous feedback
CREATE TABLE IF NOT EXISTS public.anonymous_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_anonymous BOOLEAN DEFAULT true NOT NULL,
    student_major TEXT DEFAULT 'Anonymous Student',
    resource_tested TEXT NOT NULL,
    task_completed TEXT NOT NULL,
    ease_rating INTEGER NOT NULL CHECK (ease_rating BETWEEN 1 AND 5),
    problems_encountered TEXT,
    suggestions TEXT NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.anonymous_feedback ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Anyone can insert anonymous feedback (Public)
CREATE POLICY "Allow public anonymous submissions"
    ON public.anonymous_feedback
    FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 4. Policy: Anyone can read feedback (Public)
CREATE POLICY "Allow public reading of feedback"
    ON public.anonymous_feedback
    FOR SELECT TO anon, authenticated USING (true);</pre>
            <p class="text-[11px] text-slate-500">
              The full schema file with index and seed data is available at <code class="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">supabase/schema.sql</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>`;

// 4. Script imports
const oldScripts = `<script src="js/modules/toolkit.js"></script>
  <script src="js/modules/feedback.js"></script>`;

const newScripts = `<script src="js/modules/toolkit.js"></script>
  <!-- Supabase JS Client & Config -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/config/supabase.js"></script>
  <script src="js/modules/feedback.js"></script>`;

// Normalize CRLF to LF for matching
const isCRLF = html.includes('\r\n');
let normHtml = html.replace(/\r\n/g, '\n');

if (normHtml.includes(oldHeader)) {
  normHtml = normHtml.replace(oldHeader, newHeader);
  console.log('PASS: Replaced Header');
} else {
  console.warn('WARN: Could not find exact oldHeader');
}

if (normHtml.includes(oldColumns)) {
  normHtml = normHtml.replace(oldColumns, newColumns);
  console.log('PASS: Replaced Form & Feed Columns');
} else {
  console.warn('WARN: Could not find exact oldColumns');
}

if (normHtml.includes('</main>')) {
  normHtml = normHtml.replace('</main>', supabaseModalHtml);
  console.log('PASS: Inserted Supabase Modal');
}

if (normHtml.includes(oldScripts)) {
  normHtml = normHtml.replace(oldScripts, newScripts);
  console.log('PASS: Added Supabase script tags');
} else {
  console.warn('WARN: Could not find oldScripts');
}

// Convert back to original line ending if needed
const outputHtml = isCRLF ? normHtml.replace(/\n/g, '\r\n') : normHtml;
fs.writeFileSync(indexPath, outputHtml, 'utf8');
console.log('Successfully updated index.html!');
