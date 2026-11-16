/**
 * MINDFUL — Digital Wellness Resource Hub
 * Module: Mindful Activity Heatmap (GitHub Contribution Style)
 * 
 * Visualizes student focus sessions, screen-time discipline, and digital habits
 * in a responsive, accessible, interactive 7xN calendar contribution matrix.
 */

(function () {
  'use strict';

  // Heatmap configuration and state
  const HEATMAP_CONFIG = {
    cellLevels: [
      { min: 0, max: 0, level: 0, label: 'No focus recorded', colorClass: 'hm-lvl-0' },
      { min: 1, max: 2, level: 1, label: '1–2 sessions (25–50 min)', colorClass: 'hm-lvl-1' },
      { min: 3, max: 4, level: 2, label: '3–4 sessions (75–100 min)', colorClass: 'hm-lvl-2' },
      { min: 5, max: 6, level: 3, label: '5–6 sessions (125–150 min)', colorClass: 'hm-lvl-3' },
      { min: 7, max: 99, level: 4, label: '7+ sessions (Deep Sprint 3h+)', colorClass: 'hm-lvl-4' }
    ],
    storageKey: 'mindful_heatmap_custom_data',
    daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  };

  let heatmapState = {
    viewRange: '26', // '26' (semester) or '52' (full year)
    daysData: [],
    customSessions: {},
    selectedDay: null
  };

  /**
   * Deterministic pseudo-random number generator for consistent dummy data
   */
  function pseudoRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generates realistic, authentic dummy data for past 371 days leading up to today
   */
  function generateDummyData() {
    const data = [];
    const today = new Date(); // Current date (Nov 2026 in project context)
    // Normalize today to midnight
    today.setHours(0, 0, 0, 0);

    // Retrieve any locally persisted user-simulated sessions
    try {
      const stored = localStorage.getItem(HEATMAP_CONFIG.storageKey);
      if (stored) {
        heatmapState.customSessions = JSON.parse(stored);
      }
    } catch (e) {
      heatmapState.customSessions = {};
    }

    // We want exactly 53 weeks (371 days) ending on the current week's Saturday
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
    const daysUntilSaturday = 6 - currentDayOfWeek;
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + daysUntilSaturday);

    // 53 weeks * 7 days = 371 total days
    const totalDays = 53 * 7;
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - totalDays + 1);

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      currentDate.setHours(0, 0, 0, 0);

      const isFuture = currentDate > today;
      const isToday = currentDate.getTime() === today.getTime();
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let sessions = 0;
      let habits = [];

      if (!isFuture) {
        // Compute days ago relative to today
        const diffTime = today.getTime() - currentDate.getTime();
        const daysAgo = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Custom user bonus added via "Log Focus Session" button
        const userBonus = heatmapState.customSessions[dateKey] || 0;

        // Seed based on date integer
        const seed = currentDate.getFullYear() * 10000 + (currentDate.getMonth() + 1) * 100 + currentDate.getDate();
        const rand = pseudoRandom(seed);
        const rand2 = pseudoRandom(seed + 42);

        // Active streak simulation: past 19 days (daysAgo 0 to 18) are consistently active
        if (daysAgo <= 18) {
          if (isWeekend) {
            sessions = 2 + Math.floor(rand * 3); // 2 to 4 sessions
          } else {
            sessions = 4 + Math.floor(rand * 4); // 4 to 7 sessions
          }
        } else {
          // Midterm sprint period: 30 to 45 days ago (October exam crunch)
          if (daysAgo >= 30 && daysAgo <= 45) {
            sessions = isWeekend ? (Math.floor(rand * 4)) : (3 + Math.floor(rand * 5)); // 3 to 7
          } 
          // Summer break / lull: 90 to 140 days ago (July / early August)
          else if (daysAgo >= 90 && daysAgo <= 140) {
            sessions = rand > 0.45 ? (1 + Math.floor(rand2 * 3)) : 0;
          }
          // Standard semester distribution
          else {
            if (isWeekend) {
              sessions = rand > 0.4 ? Math.floor(rand2 * 3) : 0; // 0, 1, or 2
            } else {
              sessions = rand > 0.12 ? (2 + Math.floor(rand2 * 4)) : 0; // 2 to 5
            }
          }
        }

        sessions += userBonus;

        // Habits tagging
        if (sessions >= 1) habits.push('Pomodoro Focus Completed');
        if (sessions >= 3) habits.push('App Notification Limits Respected');
        if (sessions >= 5) habits.push('Zero Late-Night Screen Lag');
        if (isWeekend && sessions > 0) habits.push('Mindful Weekend Review');
      }

      // Determine level
      let level = 0;
      if (sessions === 0) level = 0;
      else if (sessions <= 2) level = 1;
      else if (sessions <= 4) level = 2;
      else if (sessions <= 6) level = 3;
      else level = 4;

      data.push({
        date: currentDate,
        dateKey: dateKey,
        dayOfWeek: dayOfWeek,
        isToday: isToday,
        isFuture: isFuture,
        sessions: sessions,
        minutes: sessions * 25,
        level: isFuture ? -1 : level,
        habits: habits
      });
    }

    return data;
  }

  /**
   * Computes streak, total sessions, and consistency metrics from the data
   */
  function calculateMetrics(data) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDays = data.filter(d => !d.isFuture);
    const totalSessions = pastDays.reduce((acc, d) => acc + d.sessions, 0);
    const totalMinutes = totalSessions * 25;
    const totalHours = (totalMinutes / 60).toFixed(1);
    const activeDaysCount = pastDays.filter(d => d.sessions > 0).length;
    const consistencyRate = Math.round((activeDaysCount / pastDays.length) * 100);

    // Calculate current streak backward from today
    let currentStreak = 0;
    // Sort descending by date
    const sortedDesc = [...pastDays].sort((a, b) => b.date - a.date);
    for (let day of sortedDesc) {
      if (day.sessions > 0) {
        currentStreak++;
      } else {
        // If today has 0, streak isn't broken if yesterday had sessions
        if (day.isToday && currentStreak === 0) {
          continue;
        }
        break;
      }
    }

    // Calculate longest streak across history
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedAsc = [...pastDays].sort((a, b) => a.date - b.date);
    for (let day of sortedAsc) {
      if (day.sessions > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    return {
      totalSessions,
      totalHours,
      activeDaysCount,
      currentStreak,
      longestStreak,
      consistencyRate
    };
  }

  /**
   * Renders the complete Heatmap DOM
   */
  function renderHeatmap() {
    const container = document.getElementById('mindful-heatmap-container');
    if (!container) return;

    const data = heatmapState.daysData;
    const weeksToDisplay = heatmapState.viewRange === '26' ? 26 : 52;
    const daysToSlice = weeksToDisplay * 7;
    
    // Slice the most recent N weeks
    const slicedData = data.slice(data.length - daysToSlice);
    const metrics = calculateMetrics(data);

    // Group days into columns of 7 days (weeks)
    const weeks = [];
    for (let i = 0; i < slicedData.length; i += 7) {
      weeks.push(slicedData.slice(i, i + 7));
    }

    // Determine month labels positioned along the top
    const monthLabels = [];
    let lastMonth = -1;
    weeks.forEach((week, weekIndex) => {
      // Look at the month of the first non-future day or middle of the week
      const sampleDay = week[0].date;
      const month = sampleDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          weekIndex: weekIndex,
          name: HEATMAP_CONFIG.months[month]
        });
        lastMonth = month;
      }
    });

    // Build Metric Summary HTML
    const metricsHtml = `
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div class="bg-forest-50/60 border border-forest-100 rounded-xl p-3 text-center">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Focus Sessions</div>
          <div class="text-xl sm:text-2xl font-heading font-extrabold text-forest-900" id="hm-metric-sessions">${metrics.totalSessions}</div>
          <div class="text-[10px] text-forest-700 font-medium">${metrics.totalHours} productive hours</div>
        </div>
        <div class="bg-forest-50/60 border border-forest-100 rounded-xl p-3 text-center">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Current Streak</div>
          <div class="text-xl sm:text-2xl font-heading font-extrabold text-forest-800 flex items-center justify-center gap-1">
            <span>${metrics.currentStreak}</span>
            <span class="text-amber-500 text-lg">🔥</span>
          </div>
          <div class="text-[10px] text-slate-600 font-medium">consecutive days</div>
        </div>
        <div class="bg-forest-50/60 border border-forest-100 rounded-xl p-3 text-center">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Longest Streak</div>
          <div class="text-xl sm:text-2xl font-heading font-extrabold text-forest-900">${metrics.longestStreak} days</div>
          <div class="text-[10px] text-slate-600 font-medium">Fall 2026 record</div>
        </div>
        <div class="bg-forest-50/60 border border-forest-100 rounded-xl p-3 text-center">
          <div class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Consistency</div>
          <div class="text-xl sm:text-2xl font-heading font-extrabold text-forest-900">${metrics.consistencyRate}%</div>
          <div class="text-[10px] text-emerald-700 font-medium">${metrics.activeDaysCount} active days</div>
        </div>
      </div>
    `;

    // Build Month Header Row HTML
    let monthHeaderHtml = '<div class="heatmap-month-header flex text-[10px] font-medium text-slate-500 select-none mb-1.5" style="margin-left: 28px;">';
    let currentWeekPos = 0;
    monthLabels.forEach((m) => {
      const skipWeeks = m.weekIndex - currentWeekPos;
      const widthPx = skipWeeks * 14; // each week column is 11px + 3px gap = 14px
      if (widthPx > 0) {
        monthHeaderHtml += `<span style="width: ${widthPx}px; display: inline-block;"></span>`;
      }
      monthHeaderHtml += `<span class="heatmap-month-label" style="min-width: 28px;">${m.name}</span>`;
      currentWeekPos = m.weekIndex + 2; // rough offset
    });
    monthHeaderHtml += '</div>';

    // Build Days Grid (Left labels + 7xN columns)
    let gridBodyHtml = `
      <div class="flex items-start">
        <!-- Weekday labels column (Mon, Wed, Fri) -->
        <div class="flex flex-col justify-between text-[9px] font-semibold text-slate-400 select-none mr-1.5 h-[95px] py-[2px] leading-none">
          <span>&nbsp;</span>
          <span>Mon</span>
          <span>&nbsp;</span>
          <span>Wed</span>
          <span>&nbsp;</span>
          <span>Fri</span>
          <span>&nbsp;</span>
        </div>

        <!-- 7xN Weekly Columns -->
        <div class="flex gap-[3px]" role="grid" aria-label="Mindful Habit Activity Calendar">
    `;

    weeks.forEach((week, wIdx) => {
      gridBodyHtml += `<div class="flex flex-col gap-[3px]" role="row">`;
      week.forEach((day, dIdx) => {
        if (day.isFuture) {
          // Future empty slot
          gridBodyHtml += `
            <div class="hm-cell hm-lvl-future" 
                 role="gridcell" 
                 aria-disabled="true" 
                 data-date="${day.dateKey}">
            </div>`;
        } else {
          const isTodayClass = day.isToday ? 'hm-today' : '';
          const isSelectedClass = (heatmapState.selectedDay && heatmapState.selectedDay.dateKey === day.dateKey) ? 'hm-selected' : '';
          const ariaLabel = `${day.sessions} sessions on ${day.date.toDateString()}`;

          gridBodyHtml += `
            <button type="button" 
                    class="hm-cell hm-lvl-${day.level} ${isTodayClass} ${isSelectedClass}" 
                    role="gridcell"
                    tabindex="0"
                    data-date="${day.dateKey}"
                    data-sessions="${day.sessions}"
                    data-mins="${day.minutes}"
                    data-level="${day.level}"
                    data-istoday="${day.isToday}"
                    aria-label="${ariaLabel}">
            </button>
          `;
        }
      });
      gridBodyHtml += `</div>`;
    });

    gridBodyHtml += `
        </div>
      </div>
    `;

    // Build Legend & Interactive Quick-Log Bar
    const legendHtml = `
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 text-xs text-slate-500">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] text-slate-500 font-medium">Activity:</span>
          <span class="text-[10px] text-slate-400 mr-1">Less</span>
          <div class="flex items-center gap-[3px]">
            <span class="hm-cell-legend hm-lvl-0" title="0 sessions (Rest / Off)"></span>
            <span class="hm-cell-legend hm-lvl-1" title="1–2 sessions (25–50m)"></span>
            <span class="hm-cell-legend hm-lvl-2" title="3–4 sessions (75–100m)"></span>
            <span class="hm-cell-legend hm-lvl-3" title="5–6 sessions (125–150m)"></span>
            <span class="hm-cell-legend hm-lvl-4" title="7+ sessions (Deep Sprint 3h+)"></span>
          </div>
          <span class="text-[10px] text-slate-400 ml-1">More</span>
        </div>

        <div class="flex items-center gap-2">
          <button id="hm-btn-log-session" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-[11px] font-semibold transition shadow-xs active:scale-95">
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>Log Today's Focus (+25m)</span>
          </button>
        </div>
      </div>
    `;

    // Inspector Details Strip for clicked or hovered day
    const inspectorHtml = `
      <div id="hm-day-inspector" class="mt-3 p-3 rounded-xl bg-forest-50/40 border border-forest-100/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <span class="font-bold text-forest-950" id="hm-inspector-date">Today (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span>
            <span class="text-slate-400 mx-1.5">•</span>
            <span class="text-forest-800 font-semibold" id="hm-inspector-sessions">Active Streak Day</span>
          </div>
        </div>
        <div class="text-[11px] text-slate-500 flex items-center gap-2" id="hm-inspector-habits">
          <i class="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
          <span>Click any square to inspect past daily routines</span>
        </div>
      </div>
    `;

    // Render into the container
    container.innerHTML = `
      <div class="heatmap-card bg-white rounded-2xl border border-[#e6e4dc] p-4 sm:p-6 shadow-sm">
        
        <!-- Header with Title & View Range Toggle -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-sm">
              <i class="fa-solid fa-chart-simple"></i>
            </div>
            <div>
              <h3 class="font-heading font-extrabold text-forest-950 text-base sm:text-lg flex items-center gap-2">
                <span>Mindful Activity & Focus Heatmap</span>
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200">
                  Semester Habit Matrix
                </span>
              </h3>
              <p class="text-xs text-slate-500">
                Visualizing daily Pomodoro sessions, distraction discipline, and bedtime routine adherence.
              </p>
            </div>
          </div>

          <!-- Range Filter Switcher -->
          <div class="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-semibold self-start sm:self-center">
            <button id="hm-range-26" class="px-3 py-1 rounded-md transition ${heatmapState.viewRange === '26' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}">
              Semester (26 Wks)
            </button>
            <button id="hm-range-52" class="px-3 py-1 rounded-md transition ${heatmapState.viewRange === '52' ? 'bg-white text-forest-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}">
              Full Year (52 Wks)
            </button>
          </div>
        </div>

        <!-- Metrics Cards -->
        ${metricsHtml}

        <!-- Heatmap Grid Scrollable Area -->
        <div class="heatmap-scroll-wrapper overflow-x-auto pb-1" id="hm-scroll-box" tabindex="0" aria-label="Contribution grid scrollable container">
          <div class="min-w-fit pr-2">
            ${monthHeaderHtml}
            ${gridBodyHtml}
          </div>
        </div>

        <!-- Legend and Quick Log -->
        ${legendHtml}

        <!-- Day Inspector -->
        ${inspectorHtml}

      </div>
    `;

    // Attach listeners
    setupHeatmapListeners();

    // Auto-scroll to the right so current days/weeks are front-and-center
    const scrollBox = document.getElementById('hm-scroll-box');
    if (scrollBox) {
      setTimeout(() => {
        scrollBox.scrollLeft = scrollBox.scrollWidth;
      }, 50);
    }
  }

  /**
   * Sets up interactive tooltips, cell clicks, range buttons, and session simulator
   */
  function setupHeatmapListeners() {
    // 1. Range toggle buttons
    const btn26 = document.getElementById('hm-range-26');
    const btn52 = document.getElementById('hm-range-52');

    if (btn26 && btn52) {
      btn26.addEventListener('click', () => {
        if (heatmapState.viewRange !== '26') {
          heatmapState.viewRange = '26';
          renderHeatmap();
        }
      });

      btn52.addEventListener('click', () => {
        if (heatmapState.viewRange !== '52') {
          heatmapState.viewRange = '52';
          renderHeatmap();
        }
      });
    }

    // 2. Interactive "Log Today's Focus (+25m)" button
    const btnLog = document.getElementById('hm-btn-log-session');
    if (btnLog) {
      btnLog.addEventListener('click', () => {
        const todayKey = new Date().toISOString().split('T')[0];
        heatmapState.customSessions[todayKey] = (heatmapState.customSessions[todayKey] || 0) + 1;
        
        try {
          localStorage.setItem(HEATMAP_CONFIG.storageKey, JSON.stringify(heatmapState.customSessions));
        } catch (e) {
          // ignore localstorage quota
        }

        // Regenerate and re-render
        heatmapState.daysData = generateDummyData();
        renderHeatmap();

        // Visual flash feedback on button
        btnLog.innerHTML = `<i class="fa-solid fa-check text-[10px]"></i> Focus Logged (+25m)!`;
        btnLog.classList.remove('bg-forest-800');
        btnLog.classList.add('bg-emerald-700');
        setTimeout(() => {
          if (btnLog) {
            btnLog.innerHTML = `<i class="fa-solid fa-plus text-[10px]"></i> <span>Log Today's Focus (+25m)</span>`;
            btnLog.classList.add('bg-forest-800');
            btnLog.classList.remove('bg-emerald-700');
          }
        }, 1500);
      });
    }

    // 3. Floating tooltip creation if not already in document
    let tooltip = document.getElementById('hm-floating-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'hm-floating-tooltip';
      tooltip.className = 'hm-tooltip hidden';
      document.body.appendChild(tooltip);
    }

    // 4. Attach mouse hover & click to individual cells
    const cells = document.querySelectorAll('.hm-cell[data-date]');
    const inspectorDate = document.getElementById('hm-inspector-date');
    const inspectorSessions = document.getElementById('hm-inspector-sessions');
    const inspectorHabits = document.getElementById('hm-inspector-habits');

    cells.forEach(cell => {
      const dateKey = cell.getAttribute('data-date');
      const sessions = parseInt(cell.getAttribute('data-sessions') || '0', 10);
      const mins = parseInt(cell.getAttribute('data-mins') || '0', 10);
      const isToday = cell.getAttribute('data-istoday') === 'true';

      const dayObj = heatmapState.daysData.find(d => d.dateKey === dateKey);

      // Mouseenter: Show floating tooltip
      cell.addEventListener('mouseenter', (e) => {
        const dateObj = new Date(dateKey + 'T00:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        let sessionText = sessions === 0 ? 'No focus sessions' : `${sessions} focus ${sessions === 1 ? 'session' : 'sessions'} (${mins} min)`;
        if (isToday) sessionText += ' • Today';

        tooltip.innerHTML = `
          <div class="font-bold text-[11px] text-white">${sessionText}</div>
          <div class="text-[10px] text-emerald-200 mt-0.5">${formattedDate}</div>
          ${dayObj && dayObj.habits.length > 0 ? `<div class="text-[9px] text-slate-300 mt-1 border-t border-forest-700 pt-0.5">${dayObj.habits[0]}</div>` : ''}
        `;
        tooltip.classList.remove('hidden');

        // Position tooltip right above the cell
        const rect = cell.getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
      });

      cell.addEventListener('mouseleave', () => {
        tooltip.classList.add('hidden');
      });

      // Click: Update the Inspector strip below
      cell.addEventListener('click', () => {
        cells.forEach(c => c.classList.remove('hm-selected'));
        cell.classList.add('hm-selected');

        const dateObj = new Date(dateKey + 'T00:00:00');
        const formattedFull = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });

        if (inspectorDate) {
          inspectorDate.textContent = formattedFull;
        }

        if (inspectorSessions) {
          if (sessions === 0) {
            inspectorSessions.textContent = 'Mindful Rest Day (0 sessions logged)';
          } else {
            inspectorSessions.textContent = `${sessions} Focus Sessions (${mins} mins in Deep Work)`;
          }
        }

        if (inspectorHabits) {
          if (dayObj && dayObj.habits.length > 0) {
            inspectorHabits.innerHTML = `
              <i class="fa-solid fa-circle-check text-emerald-600 text-[10px]"></i>
              <span class="font-medium text-forest-900">${dayObj.habits.join(' • ')}</span>
            `;
          } else {
            inspectorHabits.innerHTML = `
              <span class="text-slate-400">Regular balance routine maintained</span>
            `;
          }
        }
      });
    });
  }

  /**
   * Initializes the Mindful Activity Heatmap
   */
  window.initHeatmap = function () {
    const container = document.getElementById('mindful-heatmap-container');
    if (!container) return;

    heatmapState.daysData = generateDummyData();
    renderHeatmap();
  };

})();
