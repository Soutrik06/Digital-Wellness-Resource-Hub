/**
 * MINDFUL — Digital Wellness Toolkit Module
 * 4 Fully Functional In-Browser Tools:
 * 1. Pomodoro Focus Timer with Web Audio API chime & progress ring
 * 2. Digital Time Calculator with SVG distribution chart & benchmark
 * 3. Notification Audit Checklist with localStorage state persistence
 * 4. Bedtime Routine Planner with 90-minute sleep cycle calculation
 */

// ==========================================
// 1. POMODORO FOCUS TIMER
// ==========================================
let timerInterval = null;
let timerMode = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
let timerDurations = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};
let timerSecondsLeft = 25 * 60;
let isTimerRunning = false;
let completedSessions = 0;
let isAudioMuted = false;

function initPomodoroTimer() {
  const displayTime = document.getElementById('timer-time-display');
  const displayStatus = document.getElementById('timer-status-badge');
  const btnStartPause = document.getElementById('timer-start-pause-btn');
  const btnReset = document.getElementById('timer-reset-btn');
  const btnSkip = document.getElementById('timer-skip-btn');
  const btnMute = document.getElementById('timer-mute-btn');
  const sessionCountEl = document.getElementById('timer-session-count');
  const modeButtons = document.querySelectorAll('.timer-mode-btn');

  // Load saved sessions from local storage
  const savedSessions = localStorage.getItem('mindful_pomodoro_sessions');
  if (savedSessions) {
    completedSessions = parseInt(savedSessions) || 0;
    if (sessionCountEl) sessionCountEl.textContent = completedSessions;
  }

  function updateDisplay() {
    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (displayTime) displayTime.textContent = formatted;

    // Update document title with timer countdown
    if (isTimerRunning) {
      document.title = `(${formatted}) MINDFUL Focus Timer`;
    }

    // Update SVG progress ring
    const circle = document.getElementById('timer-progress-ring');
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = 2 * Math.PI * radius;
      const totalSeconds = timerDurations[timerMode];
      const offset = circumference - (timerSecondsLeft / totalSeconds) * circumference;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = offset;
    }
  }

  function setMode(mode) {
    timerMode = mode;
    timerSecondsLeft = timerDurations[mode];
    pauseTimer();
    updateDisplay();

    modeButtons.forEach(btn => {
      const isTarget = btn.dataset.mode === mode;
      btn.className = isTarget 
        ? "timer-mode-btn px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-forest-800 shadow-2xs transition"
        : "timer-mode-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition";
    });

    if (displayStatus) {
      if (mode === 'focus') {
        displayStatus.textContent = "Focus Sprint";
        displayStatus.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200";
      } else if (mode === 'shortBreak') {
        displayStatus.textContent = "Short Break (5m)";
        displayStatus.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-200";
      } else {
        displayStatus.textContent = "Long Break (15m)";
        displayStatus.className = "text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200";
      }
    }
  }

  function startTimer() {
    if (isTimerRunning) return;
    isTimerRunning = true;
    if (btnStartPause) {
      btnStartPause.innerHTML = '<i class="fa-solid fa-pause mr-1.5"></i> Pause';
      btnStartPause.classList.remove('bg-forest-800', 'hover:bg-forest-900');
      btnStartPause.classList.add('bg-slate-800', 'hover:bg-slate-900');
    }

    timerInterval = setInterval(() => {
      if (timerSecondsLeft > 0) {
        timerSecondsLeft--;
        updateDisplay();
      } else {
        // Interval completed!
        clearInterval(timerInterval);
        isTimerRunning = false;
        playChime();

        if (timerMode === 'focus') {
          completedSessions++;
          localStorage.setItem('mindful_pomodoro_sessions', completedSessions);
          if (sessionCountEl) sessionCountEl.textContent = completedSessions;

          // Announce interval completion
          announceLiveMessage("Focus interval complete! Great work. Time for a restful break.");

          // Auto-advance to break
          if (completedSessions % 4 === 0) {
            setMode('longBreak');
          } else {
            setMode('shortBreak');
          }
        } else {
          announceLiveMessage("Break is over! Ready to resume your focus block?");
          setMode('focus');
        }

        if (btnStartPause) {
          btnStartPause.innerHTML = '<i class="fa-solid fa-play mr-1.5"></i> Start Focus';
          btnStartPause.classList.add('bg-forest-800', 'hover:bg-forest-900');
          btnStartPause.classList.remove('bg-slate-800', 'hover:bg-slate-900');
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    document.title = "MINDFUL — Digital Wellness Resource Hub";
    if (btnStartPause) {
      btnStartPause.innerHTML = '<i class="fa-solid fa-play mr-1.5"></i> Resume';
      btnStartPause.classList.add('bg-forest-800', 'hover:bg-forest-900');
      btnStartPause.classList.remove('bg-slate-800', 'hover:bg-slate-900');
    }
  }

  function resetTimer() {
    pauseTimer();
    timerSecondsLeft = timerDurations[timerMode];
    updateDisplay();
    if (btnStartPause) {
      btnStartPause.innerHTML = '<i class="fa-solid fa-play mr-1.5"></i> Start Focus';
    }
  }

  function playChime() {
    if (isAudioMuted) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Synthesize a calming, gentle marimba/bell tone chord
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch (e) {
      console.warn("Web Audio chime could not play automatically:", e);
    }
  }

  // Event Listeners
  if (btnStartPause) {
    btnStartPause.addEventListener('click', () => {
      if (isTimerRunning) pauseTimer();
      else startTimer();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', resetTimer);
  }

  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      pauseTimer();
      if (timerMode === 'focus') setMode('shortBreak');
      else setMode('focus');
    });
  }

  if (btnMute) {
    btnMute.addEventListener('click', () => {
      isAudioMuted = !isAudioMuted;
      btnMute.innerHTML = isAudioMuted 
        ? '<i class="fa-solid fa-volume-xmark text-slate-400"></i>' 
        : '<i class="fa-solid fa-volume-high text-forest-800"></i>';
      btnMute.setAttribute('aria-label', isAudioMuted ? 'Unmute chime audio' : 'Mute chime audio');
      btnMute.title = isAudioMuted ? 'Audio chime muted' : 'Audio chime enabled';
    });
  }

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.dataset.mode);
    });
  });

  // Initial display setup
  updateDisplay();
}

// ==========================================
// 2. DIGITAL TIME CALCULATOR
// ==========================================
function initTimeCalculator() {
  const form = document.getElementById('time-calc-form');
  const resultsCard = document.getElementById('time-calc-results');
  if (!form) return;

  // Pre-load from local storage if available
  const savedProductive = localStorage.getItem('mindful_calc_productive');
  const savedRecreational = localStorage.getItem('mindful_calc_recreational');
  if (savedProductive && document.getElementById('calc-productive-hours')) {
    document.getElementById('calc-productive-hours').value = savedProductive;
  }
  if (savedRecreational && document.getElementById('calc-recreational-hours')) {
    document.getElementById('calc-recreational-hours').value = savedRecreational;
  }

  function calculateAndRender() {
    const productiveDaily = parseFloat(document.getElementById('calc-productive-hours')?.value || '3');
    const recreationalDaily = parseFloat(document.getElementById('calc-recreational-hours')?.value || '4.5');

    const prodLabel = document.getElementById('label-prod-val');
    const recLabel = document.getElementById('label-rec-val');
    if (prodLabel) prodLabel.textContent = `${productiveDaily} hrs`;
    if (recLabel) recLabel.textContent = `${recreationalDaily} hrs`;

    // Save to localStorage
    localStorage.setItem('mindful_calc_productive', productiveDaily);
    localStorage.setItem('mindful_calc_recreational', recreationalDaily);

    const totalDaily = productiveDaily + recreationalDaily;
    const weeklyProductive = productiveDaily * 7;
    const weeklyRecreational = recreationalDaily * 7;
    const weeklyTotal = totalDaily * 7;

    const productivePercent = Math.round((productiveDaily / totalDaily) * 100) || 50;
    const recreationalPercent = 100 - productivePercent;

    // Benchmark comparison: Healthy recommended recreational screen time is <= 2.5 hrs/day
    let benchmarkBadge = "bg-emerald-100 text-emerald-900 border-emerald-200";
    let benchmarkText = "Within Recommended Balance Range";
    let benchmarkAdvice = "Your recreational screen time aligns well with cognitive recovery limits.";

    if (recreationalDaily > 4.5) {
      benchmarkBadge = "bg-rose-100 text-rose-900 border-rose-200";
      benchmarkText = "High Leisure Screen Load";
      benchmarkAdvice = "Recreational time exceeds study time by a significant margin. Implementing a 1-hour screen curfew could reclaim over 7 hours every week.";
    } else if (recreationalDaily > 2.5) {
      benchmarkBadge = "bg-amber-100 text-amber-900 border-amber-200";
      benchmarkText = "Moderate Discretionary Use";
      benchmarkAdvice = "Recreational screen time is near the undergraduate average (4.4h). Setting app limits on your top 2 apps can save ~90 mins daily.";
    }

    if (resultsCard) {
      resultsCard.classList.remove('hidden');
      resultsCard.innerHTML = `
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <span class="text-xs uppercase font-bold text-slate-500 tracking-wider">Weekly Screen Summary</span>
              <h4 class="text-xl font-bold text-slate-900 mt-0.5">${weeklyTotal.toFixed(1)} Hours Total Screen Time / Week</h4>
            </div>
            <span class="badge ${benchmarkBadge}">${benchmarkText}</span>
          </div>

          <!-- Quick Metrics Grid -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span class="text-xs text-slate-500 block">Daily Average</span>
              <span class="text-lg font-bold text-slate-900">${totalDaily.toFixed(1)} hrs</span>
            </div>
            <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
              <span class="text-xs text-emerald-800 block">Weekly Productive</span>
              <span class="text-lg font-bold text-emerald-950">${weeklyProductive.toFixed(1)} hrs</span>
            </div>
            <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
              <span class="text-xs text-amber-800 block">Weekly Leisure</span>
              <span class="text-lg font-bold text-amber-950">${weeklyRecreational.toFixed(1)} hrs</span>
            </div>
            <div class="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200/80">
              <span class="text-xs text-indigo-800 block">Yearly Discretionary</span>
              <span class="text-lg font-bold text-indigo-950">${Math.round(weeklyRecreational * 52)} hrs</span>
            </div>
          </div>

          <!-- Dynamic SVG Chart Comparison -->
          <div>
            <div class="flex justify-between items-center text-xs font-semibold mb-1">
              <span class="text-emerald-800"><i class="fa-solid fa-square text-emerald-600 mr-1"></i> Productive / Academic (${productivePercent}%)</span>
              <span class="text-amber-800"><i class="fa-solid fa-square text-amber-600 mr-1"></i> Recreational / Leisure (${recreationalPercent}%)</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
              <div class="bg-forest-700 h-3 transition-all duration-500" style="width: ${productivePercent}%" title="Productive Study: ${productiveDaily}h"></div>
              <div class="bg-amber-500 h-3 transition-all duration-500" style="width: ${recreationalPercent}%" title="Recreational Leisure: ${recreationalDaily}h"></div>
            </div>
          </div>

          <!-- Contextual Academic Advice -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
            <strong class="text-slate-900"><i class="fa-solid fa-lightbulb text-forest-700 mr-1"></i> Habit Impact:</strong>
            ${benchmarkAdvice}
          </div>
        </div>
      `;
    }
  }

  form.addEventListener('input', calculateAndRender);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    calculateAndRender();
  });

  // Calculate default initially
  calculateAndRender();
}

// ==========================================
// 3. NOTIFICATION AUDIT CHECKLIST
// ==========================================
const NOTIFICATION_APPS = [
  { id: 'app-insta', name: 'Instagram & TikTok', rec: 'Turn off all non-DM notifications; silence likes, reels, and stories.', status: 'High distraction' },
  { id: 'app-discord', name: 'Discord & Slack', rec: 'Mute non-study servers; set mentions to @direct-only during study hours.', status: 'High cognitive buzz' },
  { id: 'app-yt', name: 'YouTube App', rec: 'Disable mobile upload notifications and recommendations; use subscription feed only.', status: 'High rabbit-hole risk' },
  { id: 'app-mail', name: 'Student Email & Canvas', rec: 'Switch to scheduled hourly sync instead of immediate push alerts.', status: 'Moderate urgency' },
  { id: 'app-news', name: 'News & Sports Banners', rec: 'Disable all lock screen breaking news alerts; check headlines intentionally.', status: 'Low utility' },
  { id: 'app-shopping', name: 'Shopping & Delivery Apps', rec: 'Completely disable promotional sales banners; leave delivery status only.', status: 'Predatory engagement' },
  { id: 'app-games', name: 'Mobile Games & Streaks', rec: 'Disable streak reminders and daily bonus pop-ups entirely.', status: 'Dopamine bait' },
  { id: 'app-msg', name: 'Group Chats (WhatsApp / iMessage)', rec: 'Mute high-volume informal group chats; keep direct emergency DMs active.', status: 'Attention vampire' },
  { id: 'app-promo', name: 'Utility & Browser Push', rec: 'Deny website notification permission prompts by default in browser settings.', status: 'Spam noise' }
];

function initNotificationAudit() {
  const container = document.getElementById('notification-audit-items');
  const countEl = document.getElementById('audit-completed-count');
  const resetBtn = document.getElementById('audit-reset-btn');
  if (!container) return;

  // Retrieve checked items from localStorage
  let savedAudit = JSON.parse(localStorage.getItem('mindful_notif_audit') || '[]');

  function renderAuditItems() {
    container.innerHTML = NOTIFICATION_APPS.map(app => {
      const isChecked = savedAudit.includes(app.id);
      return `
        <label class="flex items-start gap-3 p-3.5 rounded-xl border ${isChecked ? 'bg-forest-50/50 border-forest-200' : 'bg-white border-slate-200'} hover:border-slate-300 transition cursor-pointer">
          <input type="checkbox" class="audit-checkbox mt-0.5" data-id="${app.id}" ${isChecked ? 'checked' : ''}>
          <div class="flex-grow text-xs">
            <div class="flex items-center justify-between gap-2">
              <span class="font-bold text-slate-900 ${isChecked ? 'line-through text-slate-400' : ''}">${app.name}</span>
              <span class="badge ${isChecked ? 'badge-free' : 'bg-amber-100 text-amber-800'} text-[10px]">${isChecked ? 'Audited' : app.status}</span>
            </div>
            <p class="text-slate-600 mt-1 leading-relaxed ${isChecked ? 'text-slate-400' : ''}">${app.rec}</p>
          </div>
        </label>
      `;
    }).join('');

    if (countEl) {
      countEl.textContent = `${savedAudit.length} of ${NOTIFICATION_APPS.length} Apps Audited`;
    }

    // Attach listeners
    container.querySelectorAll('.audit-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          if (!savedAudit.includes(id)) savedAudit.push(id);
        } else {
          savedAudit = savedAudit.filter(item => item !== id);
        }
        localStorage.setItem('mindful_notif_audit', JSON.stringify(savedAudit));
        renderAuditItems();
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      savedAudit = [];
      localStorage.removeItem('mindful_notif_audit');
      renderAuditItems();
    });
  }

  renderAuditItems();
}

// ==========================================
// 4. BEDTIME ROUTINE PLANNER
// ==========================================
function initBedtimePlanner() {
  const wakeTimeInput = document.getElementById('bedtime-wake-time');
  const sleepCyclesSelect = document.getElementById('bedtime-cycles-select');
  const scheduleOutput = document.getElementById('bedtime-schedule-output');
  const checklistContainer = document.getElementById('bedtime-checklist-items');
  if (!wakeTimeInput) return;

  const BEDTIME_HABITS = [
    { id: 'habit-caffeine', text: 'No caffeine after 2:00 PM (protect adenosine sleep pressure)' },
    { id: 'habit-warm', text: 'Turn on f.lux or Night Light display warmth at sunset' },
    { id: 'habit-grayscale', text: 'Activate phone monochrome grayscale 45 minutes before sleep' },
    { id: 'habit-dock', text: 'Charge smartphone across the room (away from bedside arm\'s reach)' },
    { id: 'habit-cool', text: 'Set room temperature to cool (65-68°F / 18-20°C for optimal melatonin)' }
  ];

  let savedHabits = JSON.parse(localStorage.getItem('mindful_bedtime_habits') || '[]');

  function updateBedtimePlan() {
    const wakeVal = wakeTimeInput.value || '07:30';
    const [wakeHours, wakeMins] = wakeVal.split(':').map(Number);
    const numCycles = parseFloat(sleepCyclesSelect?.value || '5'); // 5 cycles = 7.5 hours

    // Each cycle is 90 mins (1.5 hours) + 15 mins to fall asleep
    const totalMinutesNeeded = (numCycles * 90) + 15;

    // Calculate target bedtime in minutes from midnight
    let wakeTotalMins = (wakeHours * 60) + wakeMins;
    let bedtimeTotalMins = wakeTotalMins - totalMinutesNeeded;
    if (bedtimeTotalMins < 0) bedtimeTotalMins += 24 * 60;

    const bedHours = Math.floor(bedtimeTotalMins / 60);
    const bedMins = bedtimeTotalMins % 60;

    const formatTime = (h, m) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const displayH = h % 12 === 0 ? 12 : h % 12;
      return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
    };

    const targetBedtimeStr = formatTime(bedHours, bedMins);

    // Calculate T-120 min, T-60 min, T-30 min
    const getMinusTime = (offsetMins) => {
      let t = bedtimeTotalMins - offsetMins;
      if (t < 0) t += 24 * 60;
      return formatTime(Math.floor(t / 60), t % 60);
    };

    if (scheduleOutput) {
      scheduleOutput.innerHTML = `
        <div class="bg-forest-900 text-white p-5 rounded-2xl shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-forest-800 pb-3">
            <div>
              <span class="text-xs uppercase tracking-wider text-forest-300 font-bold">Calculated Bedtime</span>
              <h4 class="text-2xl font-extrabold text-white mt-0.5">${targetBedtimeStr}</h4>
            </div>
            <div class="text-right">
              <span class="text-xs text-forest-300 block">Ultradian Sleep</span>
              <span class="text-sm font-semibold text-white">${numCycles} Complete Cycles (${(numCycles * 1.5).toFixed(1)} hrs)</span>
            </div>
          </div>

          <div class="space-y-2.5 text-xs">
            <div class="flex items-start gap-3 bg-forest-950/60 p-2.5 rounded-xl border border-forest-800/80">
              <span class="font-mono font-bold text-forest-300 shrink-0">${getMinusTime(120)}</span>
              <div>
                <strong class="text-white">T-120 Mins: Digestion & Work Wind-Down</strong>
                <p class="text-forest-200 text-[11px] mt-0.5">Cease intense study problem-sets and close heavy textbook tabs to lower mental arousal.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 bg-forest-950/60 p-2.5 rounded-xl border border-forest-800/80">
              <span class="font-mono font-bold text-amber-300 shrink-0">${getMinusTime(60)}</span>
              <div>
                <strong class="text-white">T-60 Mins: Circadian Blue Light Shield</strong>
                <p class="text-forest-200 text-[11px] mt-0.5">Activate f.lux / Night Light warm tones and switch phone to Bedtime Grayscale.</p>
              </div>
            </div>

            <div class="flex items-start gap-3 bg-forest-950/60 p-2.5 rounded-xl border border-forest-800/80">
              <span class="font-mono font-bold text-emerald-300 shrink-0">${getMinusTime(30)}</span>
              <div>
                <strong class="text-white">T-30 Mins: Screen Curfew & Charging Dock</strong>
                <p class="text-forest-200 text-[11px] mt-0.5">Place smartphone on charging dock across the room. Read physical book or stretch.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  function renderHabits() {
    if (!checklistContainer) return;
    checklistContainer.innerHTML = BEDTIME_HABITS.map(h => {
      const isChecked = savedHabits.includes(h.id);
      return `
        <label class="flex items-center gap-3 p-2.5 rounded-xl border ${isChecked ? 'bg-forest-50/50 border-forest-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-700'} hover:border-slate-300 transition cursor-pointer text-xs">
          <input type="checkbox" class="audit-checkbox shrink-0" data-id="${h.id}" ${isChecked ? 'checked' : ''}>
          <span>${h.text}</span>
        </label>
      `;
    }).join('');

    checklistContainer.querySelectorAll('.audit-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.dataset.id;
        if (e.target.checked) {
          if (!savedHabits.includes(id)) savedHabits.push(id);
        } else {
          savedHabits = savedHabits.filter(item => item !== id);
        }
        localStorage.setItem('mindful_bedtime_habits', JSON.stringify(savedHabits));
        renderHabits();
      });
    });
  }

  wakeTimeInput.addEventListener('input', updateBedtimePlan);
  if (sleepCyclesSelect) sleepCyclesSelect.addEventListener('change', updateBedtimePlan);

  updateBedtimePlan();
  renderHabits();
}

function announceLiveMessage(message) {
  const liveRegion = document.getElementById('a11y-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
  }
}

function initToolkit() {
  initPomodoroTimer();
  initTimeCalculator();
  initNotificationAudit();
  initBedtimePlanner();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initToolkit };
}
