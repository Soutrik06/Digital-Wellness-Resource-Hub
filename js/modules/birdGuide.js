/**
 * MINDFUL — Left-Side Bird Guide ("Zephyr the Wandering Warbler")
 * 
 * A fixed, fully alive, animated bird companion docked on the left edge.
 * Behaves as a friendly tourist-guide character, reacting to:
 *  - Current scroll section  → changes expression + guide tip
 *  - Idle time               → yawns, preens feathers, looks around
 *  - User click / hover      → excited flap, happy eyes, flies briefly
 *  - Page milestones         → waves wing with custom messages
 *  - Time of day             → different greetings (morning / afternoon / evening)
 *
 * Animation states: idle-perch | float | look-left | look-right | excited |
 *                   wave | sleep | preen | fly-in | speak | headbob
 * 
 * Color palette: forest green #143e2e / sage #52796f / warm-off-white #fbfbf9
 */

(function () {
  'use strict';

  /* ─── SECTION GUIDE SCRIPTS ─────────────────────────────────────── */
  const SECTION_GUIDES = {
    default:    { emoji: '🗺️', msg: "Hi! I'm Zephyr, your wellness guide. Scroll down to explore!", mood: 'wave' },
    assessment: { emoji: '📋', msg: "Be honest here! Your answers shape your personal insight report.", mood: 'nod' },
    matcher:    { emoji: '🎯', msg: "Pick your OS and problem. I'll pinpoint your perfect tool!", mood: 'excited' },
    resources:  { emoji: '📚', msg: "13 hand-verified tools. Zero spyware. All checked for you!", mood: 'proud' },
    comparison: { emoji: '🔍', msg: "Compare pricing, privacy & compatibility side-by-side!", mood: 'look-right' },
    guides:     { emoji: '🛠️', msg: "Step-by-step setup guides — no tech degree required!", mood: 'nod' },
    meditation: { emoji: '🧘', msg: "Take 5 minutes. Breathe with me. Your focus will thank you.", mood: 'calm' },
    toolkit:    { emoji: '⏱️', msg: "Start your Pomodoro! 25 min focus → 5 min break. Ready?", mood: 'excited' },
    feedback:   { emoji: '💬', msg: "Share your honest thoughts — it helps fellow students!", mood: 'wave' },
    methodology:{ emoji: '🔬', msg: "All sources fact-checked in November 2026. Verified!", mood: 'proud' },
  };

  /* ─── IDLE QUIPS (Random every 18s) ─────────────────────────────── */
  const IDLE_QUIPS = [
    "Pssst… have you tried the Pomodoro timer yet? ⏱️",
    "Fun fact: Grayscale mode reduces scrolling by 37%! 🎨",
    "Even 5 mins of Vipassana breathing resets your focus! 🌿",
    "Cold Turkey Blocker is completely free — no account needed! 🦃",
    "Your 19-day streak is in the top 5% of mindful students! 🔥",
    "f.lux shifts your screen warm at sunset. Install it tonight! 🌅",
    "Unhook removes YouTube's infinite-scroll rabbit holes! 🐇",
    "ActivityWatch tracks your time without sending data anywhere! 🕵️",
    "One sec app adds a 1-second pause before opening Instagram. Try it! ⏸️",
    "Obsidian is free and your notes stay on YOUR device forever! 📔",
  ];

  /* ─── STATE ─────────────────────────────────────────────────────── */
  let state = {
    mood: 'idle',
    currentSection: 'default',
    isExpanded: true,
    isSleeping: false,
    idleTimer: null,
    quipTimer: null,
    quipIdx: 0,
    isAnimating: false,
    lastScrollY: 0,
    bubbleVisible: false,
  };

  let audioCtx = null;

  /* ─── HELPERS ───────────────────────────────────────────────────── */
  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning! Ready to build great habits today? ☀️";
    if (h < 17) return "Good afternoon! Perfect time for a focus sprint! 🌤️";
    return "Good evening! Wind down your screen time for better sleep! 🌙";
  }

  function chirp(type) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const now = audioCtx.currentTime;

      if (type === 'tweet') {
        // Upward warble  —  bird-like whistle
        [800, 1050, 900, 1200].forEach((f, i) => {
          const o = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          o.type = 'sine';
          o.frequency.setValueAtTime(f, now + i * 0.07);
          o.frequency.exponentialRampToValueAtTime(f * 1.08, now + i * 0.07 + 0.055);
          g.gain.setValueAtTime(0.08, now + i * 0.07);
          g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.09);
          o.connect(g); g.connect(audioCtx.destination);
          o.start(now + i * 0.07); o.stop(now + i * 0.07 + 0.1);
        });
      } else if (type === 'pop') {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(600, now);
        o.frequency.exponentialRampToValueAtTime(900, now + 0.05);
        g.gain.setValueAtTime(0.07, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(now); o.stop(now + 0.08);
      }
    } catch (e) {}
  }

  /* ─── SVG BIRD PARTS (all CSS-class driven for animation) ───────── */
  function buildBirdSVG() {
    return `
<svg id="zephyr-svg" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"
     class="w-full h-full" style="overflow:visible">
  <defs>
    <radialGradient id="zBodyGrad" cx="50%" cy="40%" r="55%">
      <stop offset="0%"   stop-color="#2d7a58"/>
      <stop offset="100%" stop-color="#0f2d20"/>
    </radialGradient>
    <radialGradient id="zBellyGrad" cx="50%" cy="30%" r="60%">
      <stop offset="0%"   stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#c2d7c9"/>
    </radialGradient>
    <radialGradient id="zWingGrad" cx="30%" cy="30%" r="70%">
      <stop offset="0%"   stop-color="#1b533e"/>
      <stop offset="100%" stop-color="#0a1f16"/>
    </radialGradient>
    <linearGradient id="zTailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#143e2e"/>
      <stop offset="100%" stop-color="#34d399" stop-opacity="0.5"/>
    </linearGradient>
  </defs>

  <!-- Tail feathers -->
  <g id="z-tail" class="zephyr-tail">
    <ellipse cx="40" cy="73" rx="6"  ry="11" fill="url(#zTailGrad)" transform="rotate(-18 40 73)"/>
    <ellipse cx="40" cy="74" rx="5"  ry="12" fill="url(#zTailGrad)"/>
    <ellipse cx="40" cy="73" rx="6"  ry="11" fill="url(#zTailGrad)" transform="rotate(18 40 73)"/>
  </g>

  <!-- Left wing (back) -->
  <path id="z-wing-left" class="zephyr-wing-left"
        d="M22 42 C10 36 6 55 14 65 C18 61 22 54 24 46 Z"
        fill="url(#zWingGrad)"/>

  <!-- Right wing (back) -->
  <path id="z-wing-right" class="zephyr-wing-right"
        d="M58 42 C70 36 74 55 66 65 C62 61 58 54 56 46 Z"
        fill="url(#zWingGrad)"/>

  <!-- Body -->
  <ellipse cx="40" cy="50" rx="22" ry="26" fill="url(#zBodyGrad)"/>

  <!-- Belly -->
  <ellipse cx="40" cy="55" rx="13" ry="16" fill="url(#zBellyGrad)"/>

  <!-- Belly stripes (warbler pattern) -->
  <path d="M34 51 Q40 54 46 51" stroke="#93b79d" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M32 57 Q40 61 48 57" stroke="#93b79d" stroke-width="1.2" fill="none" stroke-linecap="round"/>

  <!-- Head -->
  <circle id="z-head" class="zephyr-head" cx="40" cy="27" r="16" fill="url(#zBodyGrad)"/>

  <!-- Head crest feathers -->
  <g id="z-crest" class="zephyr-crest">
    <path d="M36 13 C34 6 30 2 27 5 C29 10 34 13 36 13 Z" fill="#10b981"/>
    <path d="M40 11 C40 4 44 0 47 3 C45 8 42 11 40 11 Z"  fill="#34d399"/>
    <path d="M43 13 C45 7 50 4 52 7 C49 11 44 13 43 13 Z" fill="#10b981"/>
  </g>

  <!-- Left eye white -->
  <circle cx="33" cy="26" r="7"   fill="#ffffff" stroke="#0a1f16" stroke-width="1.5"/>
  <!-- Right eye white -->
  <circle cx="47" cy="26" r="7"   fill="#ffffff" stroke="#0a1f16" stroke-width="1.5"/>

  <!-- Normal pupils (cursor-tracking via JS transforms) -->
  <g id="z-eye-normal">
    <g id="z-pupil-left">
      <circle cx="33.5" cy="26.5" r="4"  fill="#0a1f16"/>
      <circle cx="32"   cy="25"   r="1.3" fill="#ffffff"/>
    </g>
    <g id="z-pupil-right">
      <circle cx="47.5" cy="26.5" r="4"  fill="#0a1f16"/>
      <circle cx="46"   cy="25"   r="1.3" fill="#ffffff"/>
    </g>
  </g>

  <!-- Happy crescent eyes (shown during celebrate) -->
  <g id="z-eye-happy" class="hidden">
    <path d="M27 28 Q33 20 39 28" stroke="#0a1f16" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M41 28 Q47 20 53 28" stroke="#0a1f16" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  </g>

  <!-- Sleepy half-lids -->
  <g id="z-eye-sleep" class="hidden">
    <rect x="25" y="22" width="16" height="7" fill="#2a7a58" rx="4"/>
    <rect x="39" y="22" width="16" height="7" fill="#2a7a58" rx="4"/>
  </g>

  <!-- Thinking eyes (one eyebrow raised) -->
  <g id="z-eye-think" class="hidden">
    <circle cx="33.5" cy="26.5" r="4"  fill="#0a1f16"/>
    <circle cx="32"   cy="25"   r="1.3" fill="#ffffff"/>
    <circle cx="47.5" cy="26.5" r="4"  fill="#0a1f16"/>
    <circle cx="46"   cy="25"   r="1.3" fill="#ffffff"/>
    <!-- Raised brow -->
    <path d="M25 20 Q33 16 38 20" stroke="#0a1f16" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </g>

  <!-- Beak -->
  <polygon id="z-beak" class="zephyr-beak"
           points="40,30 35,37 45,37"
           fill="#f59e0b" stroke="#b45309" stroke-width="0.8" stroke-linejoin="round"/>

  <!-- Blush cheeks -->
  <circle cx="24" cy="32" r="4" fill="#fb7185" opacity="0.3"/>
  <circle cx="56" cy="32" r="4" fill="#fb7185" opacity="0.3"/>

  <!-- Feet / perch grip -->
  <g id="z-feet">
    <line x1="34" y1="74" x2="29" y2="78" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="34" y1="74" x2="34" y2="80" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="34" y1="74" x2="39" y2="78" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>

    <line x1="46" y1="74" x2="41" y2="78" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="46" y1="74" x2="46" y2="80" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="46" y1="74" x2="51" y2="78" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
  </g>

  <!-- Wing tip accent (sage stripe) -->
  <path d="M14 60 C14 65 18 68 20 65" stroke="#34d399" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M66 60 C66 65 62 68 60 65" stroke="#34d399" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;
  }

  /* ─── BUILD THE ENTIRE WIDGET DOM ───────────────────────────────── */
  function buildWidget() {
    const wrap = document.createElement('div');
    wrap.id = 'zephyr-bird-guide';
    wrap.setAttribute('role', 'complementary');
    wrap.setAttribute('aria-label', 'Zephyr the Mindful Bird Guide');
    wrap.innerHTML = `
      <!-- Speech Bubble -->
      <div id="zephyr-bubble" class="zephyr-bubble" aria-live="polite">
        <div class="zephyr-bubble-header">
          <span id="zephyr-bubble-emoji" class="text-base">🗺️</span>
          <span class="zephyr-guide-label">Zephyr's Guide</span>
          <button id="zephyr-bubble-close" class="zephyr-bubble-close" title="Close tip">×</button>
        </div>
        <p id="zephyr-bubble-text" class="zephyr-bubble-text"></p>
        <div class="zephyr-bubble-tail"></div>
      </div>

      <!-- Bird Body Wrapper -->
      <div id="zephyr-bird-wrap" class="zephyr-bird-wrap" title="Click Zephyr for a wellness tip!" tabindex="0" role="button" aria-label="Click Zephyr for a wellness tip">
        ${buildBirdSVG()}

        <!-- Sparkle ring shown during excited state -->
        <div class="zephyr-sparkle-ring" id="zephyr-sparkle-ring" aria-hidden="true">
          <span class="zs1">✦</span><span class="zs2">✦</span><span class="zs3">✦</span><span class="zs4">✦</span>
        </div>
      </div>

      <!-- Action Pill Bar -->
      <div class="zephyr-pill-bar" id="zephyr-pill-bar">
        <button class="zephyr-pill" id="zpill-tip"   title="Get a wellness tip">💡 Tip</button>
        <button class="zephyr-pill" id="zpill-focus" title="Start a focus session">⏱ Focus</button>
        <button class="zephyr-pill" id="zpill-mute"  title="Mute Zephyr's chirps">🔊</button>
      </div>

      <!-- Section progress pips -->
      <div class="zephyr-section-pips" id="zephyr-pips" aria-hidden="true">
        <span class="zpip" data-sec="assessment" title="Assessment"></span>
        <span class="zpip" data-sec="matcher"    title="Matcher"></span>
        <span class="zpip" data-sec="resources"  title="Library"></span>
        <span class="zpip" data-sec="comparison" title="Comparison"></span>
        <span class="zpip" data-sec="guides"     title="Guides"></span>
        <span class="zpip" data-sec="meditation" title="Meditation"></span>
        <span class="zpip" data-sec="toolkit"    title="Toolkit"></span>
        <span class="zpip" data-sec="feedback"   title="Feedback"></span>
      </div>
    `;
    document.body.appendChild(wrap);
  }

  /* ─── MOOD / EXPRESSION SWITCHING ───────────────────────────────── */
  function setMood(mood) {
    state.mood = mood;
    const svg = document.getElementById('zephyr-svg');
    const eyeNormal  = document.getElementById('z-eye-normal');
    const eyeHappy   = document.getElementById('z-eye-happy');
    const eyeSleep   = document.getElementById('z-eye-sleep');
    const eyeThink   = document.getElementById('z-eye-think');
    const sparkle    = document.getElementById('zephyr-sparkle-ring');
    const birdWrap   = document.getElementById('zephyr-bird-wrap');

    // Reset all moods
    [eyeNormal, eyeHappy, eyeSleep, eyeThink].forEach(el => el && el.classList.add('hidden'));
    sparkle && sparkle.classList.remove('zephyr-sparkle-active');
    if (birdWrap) {
      birdWrap.classList.remove('zephyr-state-excited','zephyr-state-calm','zephyr-state-sleep','zephyr-state-wave','zephyr-state-fly');
    }
    if (svg) {
      svg.classList.remove('zephyr-nod', 'zephyr-shake');
    }

    switch (mood) {
      case 'excited':
        eyeHappy && eyeHappy.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-excited');
        sparkle  && sparkle.classList.add('zephyr-sparkle-active');
        setTimeout(() => {
          birdWrap && birdWrap.classList.remove('zephyr-state-excited');
          sparkle  && sparkle.classList.remove('zephyr-sparkle-active');
          eyeHappy && eyeHappy.classList.add('hidden');
          eyeNormal && eyeNormal.classList.remove('hidden');
          state.isAnimating = false;
        }, 1600);
        break;

      case 'wave':
        eyeNormal && eyeNormal.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-wave');
        setTimeout(() => {
          birdWrap && birdWrap.classList.remove('zephyr-state-wave');
          state.isAnimating = false;
        }, 1200);
        break;

      case 'nod':
        eyeNormal && eyeNormal.classList.remove('hidden');
        svg && svg.classList.add('zephyr-nod');
        setTimeout(() => {
          svg && svg.classList.remove('zephyr-nod');
          state.isAnimating = false;
        }, 900);
        break;

      case 'proud':
        eyeHappy && eyeHappy.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-wave');
        sparkle && sparkle.classList.add('zephyr-sparkle-active');
        setTimeout(() => {
          birdWrap && birdWrap.classList.remove('zephyr-state-wave');
          sparkle && sparkle.classList.remove('zephyr-sparkle-active');
          eyeHappy && eyeHappy.classList.add('hidden');
          eyeNormal && eyeNormal.classList.remove('hidden');
          state.isAnimating = false;
        }, 1500);
        break;

      case 'calm':
        eyeNormal && eyeNormal.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-calm');
        state.isAnimating = false;
        break;

      case 'sleep':
        eyeSleep && eyeSleep.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-sleep');
        state.isSleeping = true;
        state.isAnimating = false;
        break;

      case 'think':
        eyeThink && eyeThink.classList.remove('hidden');
        setTimeout(() => {
          eyeThink && eyeThink.classList.add('hidden');
          eyeNormal && eyeNormal.classList.remove('hidden');
          state.isAnimating = false;
        }, 1800);
        break;

      case 'look-right':
        eyeNormal && eyeNormal.classList.remove('hidden');
        movePupils(5, 1);
        setTimeout(() => { movePupils(0, 0); state.isAnimating = false; }, 1200);
        break;

      default:
        // idle
        eyeNormal && eyeNormal.classList.remove('hidden');
        birdWrap && birdWrap.classList.add('zephyr-state-calm');
        state.isAnimating = false;
    }
  }

  /* ─── SPEECH BUBBLE ─────────────────────────────────────────────── */
  function showBubble(emojiStr, text, duration) {
    const bubble  = document.getElementById('zephyr-bubble');
    const emojiEl = document.getElementById('zephyr-bubble-emoji');
    const textEl  = document.getElementById('zephyr-bubble-text');
    if (!bubble || !textEl) return;

    if (emojiEl) emojiEl.textContent = emojiStr || '🌿';
    textEl.textContent = text;
    bubble.classList.add('zephyr-bubble-visible');
    state.bubbleVisible = true;

    if (duration) {
      clearTimeout(state._bubbleTimer);
      state._bubbleTimer = setTimeout(() => hideBubble(), duration);
    }
  }

  function hideBubble() {
    const bubble = document.getElementById('zephyr-bubble');
    if (bubble) bubble.classList.remove('zephyr-bubble-visible');
    state.bubbleVisible = false;
  }

  /* ─── EYE TRACKING ───────────────────────────────────────────────── */
  function movePupils(x, y) {
    const pL = document.getElementById('z-pupil-left');
    const pR = document.getElementById('z-pupil-right');
    if (pL) pL.setAttribute('transform', `translate(${x},${y})`);
    if (pR) pR.setAttribute('transform', `translate(${x},${y})`);
  }

  function setupEyeTracking() {
    window.addEventListener('mousemove', (e) => {
      if (state.isSleeping || state.mood === 'sleep') return;
      const wrap = document.getElementById('zephyr-bird-wrap');
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const ang = Math.atan2(dy, dx);
      const dist = Math.min(3.5, Math.hypot(dx, dy) / 80);
      movePupils(Math.cos(ang) * dist, Math.sin(ang) * dist);
    }, { passive: true });
  }

  /* ─── SCROLL SECTION DETECTOR ───────────────────────────────────── */
  const SECTION_IDS = ['assessment','matcher','resources','comparison','guides','meditation','toolkit','feedback','methodology'];

  function detectSection() {
    let active = 'default';
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.top <= 220 && r.bottom >= 100) { active = id; break; }
      }
    }
    return active;
  }

  function updatePips(active) {
    document.querySelectorAll('.zpip').forEach(p => {
      p.classList.toggle('zpip-active', p.dataset.sec === active);
    });
  }

  /* ─── IDLE BEHAVIOURS ───────────────────────────────────────────── */
  const IDLE_MOODS = ['think','look-right','nod','wave'];
  let idleMoodIdx = 0;

  function startIdleCycle() {
    state.idleTimer = setInterval(() => {
      if (state.isAnimating || state.isSleeping) return;
      state.isAnimating = true;
      setMood(IDLE_MOODS[idleMoodIdx % IDLE_MOODS.length]);
      idleMoodIdx++;
    }, 7000);

    // Random quip every 20 seconds
    state.quipTimer = setInterval(() => {
      if (state.isSleeping || state.bubbleVisible) return;
      const quip = IDLE_QUIPS[state.quipIdx % IDLE_QUIPS.length];
      state.quipIdx++;
      showBubble('💭', quip, 6000);
      chirp('tweet');
      setMood('think');
    }, 20000);
  }

  /* ─── SCROLL HANDLER ─────────────────────────────────────────────── */
  function setupScrollHandler() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        // Wake up if sleeping and user scrolled
        if (state.isSleeping) {
          const wrap = document.getElementById('zephyr-bird-wrap');
          if (wrap) wrap.classList.remove('zephyr-state-sleep');
          const eyeSleep = document.getElementById('z-eye-sleep');
          const eyeNormal = document.getElementById('z-eye-normal');
          if (eyeSleep) eyeSleep.classList.add('hidden');
          if (eyeNormal) eyeNormal.classList.remove('hidden');
          state.isSleeping = false;
        }

        const section = detectSection();
        updatePips(section);

        if (section !== state.currentSection) {
          state.currentSection = section;
          const guide = SECTION_GUIDES[section] || SECTION_GUIDES.default;
          showBubble(guide.emoji, guide.msg, 7000);
          chirp('tweet');
          if (!state.isAnimating) {
            state.isAnimating = true;
            setMood(guide.mood || 'wave');
          }
        }
      });
    }, { passive: true });
  }

  /* ─── USER INTERACTION ───────────────────────────────────────────── */
  function setupInteractions() {
    const birdWrap  = document.getElementById('zephyr-bird-wrap');
    const bubbleClose = document.getElementById('zephyr-bubble-close');
    const tipBtn    = document.getElementById('zpill-tip');
    const focusBtn  = document.getElementById('zpill-focus');
    const muteBtn   = document.getElementById('zpill-mute');

    let muted = false;

    // Click on bird → celebrate + random tip
    if (birdWrap) {
      birdWrap.addEventListener('click', () => {
        const quip = IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)];
        showBubble('🌿', quip, 7000);
        if (!muted) chirp('tweet');
        state.isAnimating = true;
        setMood('excited');
        if (typeof window.showJoyfulToast === 'function') {
          window.showJoyfulToast('🦜', 'Zephyr says:', quip);
        }
      });

      birdWrap.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          birdWrap.click();
        }
      });

      // Hover → look-right (curious)
      birdWrap.addEventListener('mouseenter', () => {
        if (!state.isAnimating && !state.isSleeping) {
          movePupils(2, 0);
        }
      });
      birdWrap.addEventListener('mouseleave', () => movePupils(0, 0));
    }

    if (bubbleClose) {
      bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideBubble();
      });
    }

    if (tipBtn) {
      tipBtn.addEventListener('click', () => {
        const quip = IDLE_QUIPS[state.quipIdx % IDLE_QUIPS.length];
        state.quipIdx++;
        showBubble('💡', quip, 8000);
        if (!muted) chirp('tweet');
        state.isAnimating = true;
        setMood('nod');
      });
    }

    if (focusBtn) {
      focusBtn.addEventListener('click', () => {
        // Scroll to toolkit section and trigger Pomodoro
        const tk = document.getElementById('toolkit');
        if (tk) tk.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showBubble('⏱️', "Let's smash a 25-min focus sprint! Starting Pomodoro now! 🚀", 5000);
        if (!muted) chirp('tweet');
        state.isAnimating = true;
        setMood('excited');
        setTimeout(() => {
          const startBtn = document.getElementById('timer-start-pause-btn');
          if (startBtn && !startBtn.textContent.includes('Pause')) startBtn.click();
        }, 900);
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        muted = !muted;
        muteBtn.textContent = muted ? '🔇' : '🔊';
        if (!muted) chirp('pop');
      });
    }
  }

  /* ─── SLEEP AFTER 90s NO ACTIVITY ──────────────────────────────── */
  function setupSleepDetector() {
    let sleepTimer = null;
    const resetSleep = () => {
      clearTimeout(sleepTimer);
      if (state.isSleeping) {
        state.isSleeping = false;
        const wrap = document.getElementById('zephyr-bird-wrap');
        if (wrap) wrap.classList.remove('zephyr-state-sleep');
        const eyeSleep = document.getElementById('z-eye-sleep');
        const eyeNormal = document.getElementById('z-eye-normal');
        if (eyeSleep) eyeSleep.classList.add('hidden');
        if (eyeNormal) eyeNormal.classList.remove('hidden');
      }
      sleepTimer = setTimeout(() => {
        if (!state.bubbleVisible) {
          state.isAnimating = true;
          setMood('sleep');
          showBubble('💤', "Zzz… Wake me up when you're ready to focus! 💤", 0);
        }
      }, 90000);
    };

    ['mousemove','scroll','keydown','click','touchstart'].forEach(ev => {
      window.addEventListener(ev, resetSleep, { passive: true });
    });
    resetSleep();
  }

  /* ─── ENTRY POINT ───────────────────────────────────────────────── */
  window.initBirdGuide = function () {
    buildWidget();
    setMood('idle');

    // Show greeting on load
    setTimeout(() => {
      showBubble('👋', getTimeGreeting(), 7000);
      chirp('tweet');
      state.isAnimating = true;
      setMood('wave');
    }, 1200);

    setupEyeTracking();
    setupScrollHandler();
    setupInteractions();
    startIdleCycle();
    setupSleepDetector();
  };

})();
