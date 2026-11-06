/**
 * MINDFUL — Digital Wellness Self-Assessment Module
 * 5-Question reflective quiz evaluating focus, screen time, notifications, and bedtime habits.
 * 100% on-device scoring with actionable personalized recommendations.
 */

function initAssessment() {
  const form = document.getElementById('wellness-assessment-form');
  const resultsContainer = document.getElementById('assessment-results-container');
  const retakeBtn = document.getElementById('assessment-retake-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Daily screen time (recreational)
    const q1Val = parseInt(document.querySelector('input[name="assess-screentime"]:checked')?.value || '3');
    // 2. Social media interruptions during study sessions
    const q2Val = parseInt(document.querySelector('input[name="assess-studydistract"]:checked')?.value || '3');
    // 3. Frequency of notification check urges
    const q3Val = parseInt(document.querySelector('input[name="assess-notifications"]:checked')?.value || '3');
    // 4. Phone usage before sleeping
    const q4Val = parseInt(document.querySelector('input[name="assess-bedtime"]:checked')?.value || '3');
    // 5. Difficulty controlling scrolling habits
    const q5Val = parseInt(document.querySelector('input[name="assess-scrolling"]:checked')?.value || '3');

    // Scores range from 1 (severe habits) to 4 (healthy habits)
    // Dimension 1: Focus Management = (Study Session + Scrolling Control) / 2
    const focusScore = Math.round(((q2Val + q5Val) / 2) * 25);
    // Dimension 2: Screen-Time Awareness = (Daily Screen Time + Scrolling Control) / 2
    const screenTimeScore = Math.round(((q1Val + q5Val) / 2) * 25);
    // Dimension 3: Notification Management = Notification Checks
    const notifScore = Math.round(q3Val * 25);
    // Dimension 4: Bedtime Habits = Bedtime Phone Usage
    const bedtimeScore = Math.round(q4Val * 25);

    // Overall Score (0 - 100)
    const totalScore = Math.round((focusScore + screenTimeScore + notifScore + bedtimeScore) / 4);

    // Generate Tailored Insights
    const insights = [];
    const recommendedToolIds = [];

    if (focusScore < 60) {
      insights.push({
        pillar: "Focus Management",
        icon: "fa-bullseye",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        observation: "Frequent multi-tasking and algorithmic feeds (YouTube/Shorts) disrupt your deep study flow.",
        action: "Set strict 25-minute Pomodoro study blocks and strip algorithmic sidebars during coursework.",
        toolName: "Unhook & Cold Turkey Blocker",
        toolId: "unhook"
      });
      recommendedToolIds.push("unhook", "cold-turkey");
    } else {
      insights.push({
        pillar: "Focus Management",
        icon: "fa-circle-check",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        observation: "Strong discipline during study sessions. Minimal algorithmic derailment.",
        action: "Maintain current cadence; consider Pomodoro intervals to protect stamina during exam periods.",
        toolName: "Pomofocus.io",
        toolId: "pomofocus"
      });
    }

    if (screenTimeScore < 60) {
      insights.push({
        pillar: "Screen-Time Awareness",
        icon: "fa-hourglass-half",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        observation: "Elevated recreational screen hours may be displacing offline rest and academic prep.",
        action: "Implement mindful friction pauses to break unconscious phone pickups and audit usage locally.",
        toolName: "one sec & ActivityWatch",
        toolId: "one-sec"
      });
      recommendedToolIds.push("one-sec", "activitywatch");
    } else {
      insights.push({
        pillar: "Screen-Time Awareness",
        icon: "fa-circle-check",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        observation: "Balanced recreational screen ratio with healthy awareness of screen limits.",
        action: "Continue periodic weekly audits to ensure screen time stays aligned with academic goals.",
        toolName: "Android Digital Wellbeing / Apple Screen Time",
        toolId: "android-wellbeing"
      });
    }

    if (notifScore < 60) {
      insights.push({
        pillar: "Notification Discipline",
        icon: "fa-bell-slash",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        observation: "Reactive notification checking fragments attention and triggers phantom vibration anxiety.",
        action: "Switch non-human apps (shopping, social, news) to scheduled summaries or complete silence.",
        toolName: "Notification Audit Toolkit",
        toolId: "toolkit-audit"
      });
    } else {
      insights.push({
        pillar: "Notification Discipline",
        icon: "fa-circle-check",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        observation: "Proactive notification control keeps interruptions at a manageable baseline.",
        action: "Ensure emergency VIP breakthrough contacts are designated for late-night silence periods.",
        toolName: "Bedtime Mode",
        toolId: "bedtime-mode"
      });
    }

    if (bedtimeScore < 60) {
      insights.push({
        pillar: "Bedtime & Sleep Hygiene",
        icon: "fa-moon",
        color: "text-rose-700 bg-rose-50 border-rose-200",
        observation: "Screen exposure within 30 minutes of sleep suppresses melatonin and prolongs sleep latency.",
        action: "Automate monochrome display (grayscale) and warm display lighting starting 60 minutes before target bedtime.",
        toolName: "f.lux & Native Bedtime Grayscale",
        toolId: "flux"
      });
      recommendedToolIds.push("flux", "bedtime-mode");
    } else {
      insights.push({
        pillar: "Bedtime & Sleep Hygiene",
        icon: "fa-circle-check",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        observation: "Great pre-sleep habits. Protecting bedtime from screens promotes memory consolidation.",
        action: "Keep bedroom charging stations across the room to prevent morning snooze doomscrolling.",
        toolName: "Bedtime Planner",
        toolId: "toolkit-bedtime"
      });
    }

    // Determine Overall Archetype / Profile
    let statusLabel = "Balanced Digital Navigator";
    let statusDesc = "You possess solid foundational habits with minor areas for friction reduction.";
    let statusBadgeClass = "bg-emerald-100 text-emerald-900 border-emerald-200";

    if (totalScore >= 80) {
      statusLabel = "Mindful Digital Scholar";
      statusDesc = "Exceptional digital balance. You actively command technology rather than letting algorithms dictate your attention.";
      statusBadgeClass = "bg-forest-100 text-forest-900 border-forest-300";
    } else if (totalScore < 50) {
      statusLabel = "High Digital Friction & Sensory Overload";
      statusDesc = "Your digital environment is currently introducing cognitive exhaustion. High-impact structural safeguards are recommended.";
      statusBadgeClass = "bg-rose-100 text-rose-900 border-rose-300";
    } else if (totalScore < 70) {
      statusLabel = "Developing Digital Balance";
      statusDesc = "You maintain good study intent, but notifications and late-night habits create recurring attention leaks.";
      statusBadgeClass = "bg-amber-100 text-amber-900 border-amber-300";
    }

    // Render Results HTML
    resultsContainer.innerHTML = `
      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-6">
          <div class="text-center md:text-left">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeClass} mb-2">
              <i class="fa-solid fa-compass"></i> Profile: ${statusLabel}
            </span>
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900">Your Digital Habit Self-Reflection</h3>
            <p class="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">${statusDesc}</p>
          </div>

          <!-- Score Gauge Badge -->
          <div class="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-200 min-w-[140px]">
            <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Balance Score</span>
            <span class="text-4xl font-extrabold text-forest-800 my-1">${totalScore}<span class="text-lg text-slate-400 font-normal">/100</span></span>
            <span class="text-[11px] font-medium text-slate-500">Reflective Benchmark</span>
          </div>
        </div>

        <!-- 4 Pillars Breakdown -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
          <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">Focus Management</span>
              <span class="text-xs font-mono font-bold text-slate-900">${focusScore}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-forest-700 h-2 rounded-full transition-all duration-500" style="width: ${focusScore}%"></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">Screen-Time Awareness</span>
              <span class="text-xs font-mono font-bold text-slate-900">${screenTimeScore}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-forest-700 h-2 rounded-full transition-all duration-500" style="width: ${screenTimeScore}%"></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">Notification Discipline</span>
              <span class="text-xs font-mono font-bold text-slate-900">${notifScore}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-forest-700 h-2 rounded-full transition-all duration-500" style="width: ${notifScore}%"></div>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">Bedtime Habits</span>
              <span class="text-xs font-mono font-bold text-slate-900">${bedtimeScore}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div class="bg-forest-700 h-2 rounded-full transition-all duration-500" style="width: ${bedtimeScore}%"></div>
            </div>
          </div>
        </div>

        <!-- Actionable Insights List -->
        <h4 class="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Actionable Next Steps Tailored for You</h4>
        <div class="space-y-3 mb-6">
          ${insights.map(item => `
            <div class="p-3.5 rounded-xl border text-xs sm:text-sm flex items-start gap-3 ${item.color}">
              <i class="fa-solid ${item.icon} text-base mt-0.5 shrink-0"></i>
              <div class="flex-grow">
                <div class="font-bold mb-0.5">${item.pillar}</div>
                <p class="text-slate-700 mb-1 leading-relaxed">${item.observation}</p>
                <div class="bg-white/90 p-2 rounded-lg border border-slate-200/60 text-slate-800">
                  <span class="font-semibold text-forest-800"><i class="fa-solid fa-arrow-right text-[11px] mr-1"></i> Recommendation:</span> ${item.action}
                  <span class="block text-[11px] text-slate-500 mt-0.5">Suggested Tool: <strong>${item.toolName}</strong></span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Privacy & Medical Disclaimer -->
        <div class="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 flex items-start gap-2 mb-6">
          <i class="fa-solid fa-circle-info text-slate-500 mt-0.5 shrink-0"></i>
          <span><strong>Academic & Health Disclaimer:</strong> This assessment is an educational self-reflection framework designed to support digital hygiene awareness for college students. It is not a clinical diagnostic assessment or mental health evaluation. All scores were computed strictly on your device; no responses were logged or transmitted.</span>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button id="assessment-retake-btn-inline" class="text-xs font-semibold text-slate-600 hover:text-forest-800 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-slate-100 transition">
            <i class="fa-solid fa-rotate-left"></i> Retake Assessment
          </button>
          <div class="flex items-center gap-2">
            <a href="#matcher" class="bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition inline-flex items-center gap-1.5">
              <span>Find Recommended Tools in Matcher</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    `;

    // Show results & scroll smoothly
    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Attach retake listener
    const retakeBtnInline = document.getElementById('assessment-retake-btn-inline');
    if (retakeBtnInline) {
      retakeBtnInline.addEventListener('click', () => {
        resultsContainer.classList.add('hidden');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  if (retakeBtn) {
    retakeBtn.addEventListener('click', () => {
      resultsContainer.classList.add('hidden');
      form.reset();
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initAssessment };
}
