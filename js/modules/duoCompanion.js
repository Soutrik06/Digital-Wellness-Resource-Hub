/**
 * MINDFUL — Digital Wellness Resource Hub
 * Module: Duo-Style Mindful Mascot & Interactive Animations ("Sage the Zen Owl")
 * 
 * Features:
 * - Animated SVG mascot with eye-tracking, blink cycles, wing flaps, and happy jumps
 * - Interactive speech bubble with randomized student digital wellness tips
 * - Duolingo-style celebration engine (confetti, stars & floating wellness leaves)
 * - Lightweight Web Audio API synthesizer for cheerful milestone chimes & bubbly pops
 * - Tactile 3D button micro-interactions and interactive streak flame
 * - Corner Mascot ("Corner Sage") that tracks user scrolling and provides section tips
 * - Joyful milestone toast notifications
 */

(function () {
  'use strict';

  // Quotes and tips for Sage the Zen Owl
  const SAGE_TIPS = [
    "Hey student! Keep your 19-day focus streak alive today! 🌱",
    "Turn your phone to Grayscale to cut addictive doomscrolling by 37%! 🎨",
    "Notifications every 12 mins ruin flow. Try a 25-min silence sprint! 🔕",
    "One 25-min Pomodoro beats 2 hours of distracted multitasking! ⏱️",
    "Breathe in for 4s, hold for 4s, exhale for 4s. Feel your attention reset! 🌿",
    "Leave your phone across the room before bed for 43m faster sleep! 🌙",
    "Unhook and Cold Turkey are 100% free with zero privacy telemetry! 🛡️",
    "You are in control of your devices, not the algorithm! 🚀",
    "178 productive focus hours logged this semester! Proud of you! 🎓",
    "Take a 5-minute eye rest break. Look 20 feet away! 👀"
  ];

  // Section-specific tips for Corner Sage
  const SECTION_TIPS = {
    'assessment': "Testing your digital habits? Pick the most honest answers! 📋",
    'matcher': "Select your OS & problem — I'll find your ideal shield! 🎯",
    'resources': "All 13 resources have verified privacy & 0 spyware! 🛡️",
    'comparison': "Compare pricing, privacy terms & accessibility side-by-side! 🔍",
    'guides': "Step-by-step setup tutorials with no confusion! 📚",
    'meditation': "Take a 5-minute Vipassana breathing pause right now! 🧘",
    'toolkit': "Ready for a 25-min Pomodoro focus sprint? Let's do it! ⏱️",
    'feedback': "Share your anonymous thoughts to help fellow students! 💬",
    'methodology': "Fact-checked research sources and privacy criteria! 🔬"
  };

  let tipIndex = 0;
  let audioEnabled = true;
  let audioCtx = null;
  let cornerSageDismissed = false;

  /**
   * Safe Audio Context initialization for synthesized Duolingo-style victory chimes & pops
   */
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  /**
   * Pleasant major chord arpeggio victory chime
   */
  function playCelebrationChime() {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // Soft, warm, bell-like tone
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.38);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch (e) {
      // Audio autoplay policy or unavailable
    }
  }

  /**
   * Satisfying soft bubble pop sound for button clicks & tab switches
   */
  function playBubblePop() {
    if (!audioEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Quick pitch ramp from 400Hz to 850Hz creates a distinct bubbly pop
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch (e) {}
  }

  // Expose sound methods globally
  window.playBubblePop = playBubblePop;
  window.playCelebrationChime = playCelebrationChime;

  /**
   * Particle Celebration Engine: Confetti, stars, and wellness leaves
   */
  function fireConfettiBurst(originX, originY) {
    const canvas = document.getElementById('duo-confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = [
      '#10b981', '#059669', '#34d399', '#f59e0b', '#fbbf24', 
      '#3b82f6', '#60a5fa', '#ec4899', '#8b5cf6', '#143e2e'
    ];

    const count = 65;
    const startX = originX !== undefined ? originX : window.innerWidth / 2;
    const startY = originY !== undefined ? originY : window.innerHeight * 0.45;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 8.5;
      const isLeaf = i % 4 === 0;

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: isLeaf ? (10 + Math.random() * 8) : (6 + Math.random() * 6),
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.25,
        gravity: 0.22,
        drag: 0.96,
        alpha: 1,
        fade: 0.012 + Math.random() * 0.01,
        isLeaf: isLeaf
      });
    }

    let animationId = null;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (let p of particles) {
        if (p.alpha <= 0) continue;
        alive = true;

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= p.fade;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.isLeaf) {
          // Draw leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.stroke();
        } else {
          // Draw rectangular confetti
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        }

        ctx.restore();
      }

      if (alive) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    render();
  }

  /**
   * Displays a playful Duolingo-style celebratory toast notification
   */
  function showJoyfulToast(icon, title, message) {
    let toast = document.getElementById('duo-global-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'duo-global-toast';
      document.body.appendChild(toast);
    }

    toast.className = 'joyful-toast flex items-center gap-3 bg-white border-2 border-forest-800 rounded-2xl px-4 py-3 shadow-xl max-w-sm sm:max-w-md';
    toast.innerHTML = `
      <div class="w-10 h-10 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center text-xl shrink-0">
        ${icon || '🌱'}
      </div>
      <div class="flex-grow">
        <div class="text-xs font-heading font-extrabold text-forest-950">${title || 'Mindful Milestone!'}</div>
        <div class="text-[11px] text-slate-600 font-medium">${message || ''}</div>
      </div>
      <button class="text-slate-400 hover:text-slate-700 text-xs p-1" onclick="this.parentElement.remove()">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -40px)';
        setTimeout(() => toast.remove(), 350);
      }
    }, 4000);
  }

  window.showJoyfulToast = showJoyfulToast;

  /**
   * Triggers the full mascot celebration (jump, wing flap, confetti, chime)
   */
  function triggerMascotCelebration(customMessage) {
    const mascot = document.getElementById('duo-mascot');
    const speechText = document.getElementById('duo-speech-text');

    if (mascot) {
      mascot.classList.remove('duo-celebrate-anim');
      void mascot.offsetWidth; // trigger reflow
      mascot.classList.add('duo-celebrate-anim');

      // Temporary happy eye expression
      const eyesNormal = document.querySelectorAll('.duo-eye-normal');
      const eyesHappy = document.querySelectorAll('.duo-eye-happy');
      eyesNormal.forEach(el => el.classList.add('hidden'));
      eyesHappy.forEach(el => el.classList.remove('hidden'));

      setTimeout(() => {
        eyesNormal.forEach(el => el.classList.remove('hidden'));
        eyesHappy.forEach(el => el.classList.add('hidden'));
      }, 1400);
    }

    if (speechText) {
      if (customMessage) {
        speechText.textContent = customMessage;
      } else {
        tipIndex = (tipIndex + 1) % SAGE_TIPS.length;
        speechText.textContent = SAGE_TIPS[tipIndex];
      }
      const bubble = document.getElementById('duo-speech-bubble');
      if (bubble) {
        bubble.classList.remove('duo-pop-anim');
        void bubble.offsetWidth;
        bubble.classList.add('duo-pop-anim');
      }
    }

    // Play synthesized celebration audio
    playCelebrationChime();

    // Fire confetti from mascot position
    if (mascot) {
      const rect = mascot.getBoundingClientRect();
      fireConfettiBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.4);
    } else {
      fireConfettiBurst();
    }
  }

  /**
   * Initializes eye tracking so Sage looks toward the user cursor
   */
  function setupEyeTracking() {
    const pupilLeft = document.getElementById('duo-pupil-left');
    const pupilRight = document.getElementById('duo-pupil-right');
    const mascot = document.getElementById('duo-mascot');
    if (!pupilLeft || !pupilRight || !mascot) return;

    window.addEventListener('mousemove', (e) => {
      const rect = mascot.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - mascotCenterX;
      const deltaY = e.clientY - mascotCenterY;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(4.5, Math.hypot(deltaX, deltaY) / 55);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      pupilLeft.setAttribute('transform', `translate(${moveX}, ${moveY})`);
      pupilRight.setAttribute('transform', `translate(${moveX}, ${moveY})`);
    });
  }

  /**
   * Natural periodic blinking cycle
   */
  function setupBlinkCycle() {
    const eyelids = document.querySelectorAll('.duo-eyelid');
    if (!eyelids.length) return;

    function blink() {
      eyelids.forEach(lid => lid.classList.add('duo-blink'));
      setTimeout(() => {
        eyelids.forEach(lid => lid.classList.remove('duo-blink'));
      }, 180);

      const nextBlink = 2800 + Math.random() * 2700;
      setTimeout(blink, nextBlink);
    }

    setTimeout(blink, 2500);
  }

  /**
   * Renders the complete Duolingo-style mascot companion widget HTML
   */
  function renderMascotHeroWidget() {
    const mount = document.getElementById('duo-mascot-hero-mount');
    if (!mount) return;

    mount.innerHTML = `
      <div class="duo-hero-companion-wrapper relative flex flex-col items-center justify-center my-6 select-none">
        
        <!-- Floating Ambient Nature Particles in Hero (Drifting Leaves & Sparkles) -->
        <div class="pointer-events-none absolute -top-8 -left-12 sm:-left-20 anim-float-1 text-emerald-600 opacity-70 text-2xl" title="Mindful Leaf">
          <i class="fa-solid fa-leaf"></i>
        </div>
        <div class="pointer-events-none absolute top-12 -right-8 sm:-right-16 anim-float-2 text-forest-700 opacity-60 text-xl" title="Zen Seedling">
          <i class="fa-solid fa-seedling"></i>
        </div>
        <div class="pointer-events-none absolute -top-4 right-10 anim-sparkle text-amber-400 text-lg">
          <i class="fa-solid fa-star"></i>
        </div>
        <div class="pointer-events-none absolute bottom-4 -left-6 anim-sparkle text-emerald-400 text-sm" style="animation-delay: 1.2s;">
          <i class="fa-solid fa-sparkles"></i>
        </div>

        <!-- Interactive Speech Bubble -->
        <div id="duo-speech-bubble" class="duo-speech-bubble relative bg-white border-2 border-forest-800/15 rounded-2xl px-4 py-2.5 shadow-sm text-xs text-forest-950 font-semibold max-w-xs sm:max-w-sm text-center mb-3 cursor-pointer hover:border-forest-700 transition duo-pop-anim">
          <div class="flex items-center justify-center gap-1.5 text-forest-800 mb-0.5 text-[10px] uppercase font-bold tracking-wider">
            <i class="fa-solid fa-sparkles text-amber-500"></i>
            <span>Sage • Your Mindful Companion</span>
            <i class="fa-solid fa-sparkles text-amber-500"></i>
          </div>
          <p id="duo-speech-text" class="text-slate-700 leading-snug">
            Hey student! Keep your 19-day focus streak alive today! 🌱
          </p>
          <span class="text-[10px] text-slate-400 font-normal block mt-1">
            (Click Sage or me for mindful study tips!)
          </span>
          <div class="duo-speech-tail"></div>
        </div>

        <!-- Mascot & Controls Row -->
        <div class="flex items-center justify-center gap-5 sm:gap-8">
          
          <!-- Duolingo-style Streak Flame Badge -->
          <div id="duo-streak-pill" class="duo-pill-3d bg-white border border-amber-300 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col items-center cursor-pointer hover:scale-105 transition active:scale-95" title="19 Consecutive Mindful Days! Click to celebrate!">
            <div class="relative w-8 h-8 flex items-center justify-center mb-0.5">
              <span class="duo-flame-glow"></span>
              <i class="fa-solid fa-fire text-amber-500 text-2xl duo-flame-anim"></i>
            </div>
            <span class="text-xs font-extrabold text-forest-950 font-heading">19 DAYS</span>
            <span class="text-[9px] uppercase font-bold tracking-wider text-amber-700">Streak 🔥</span>
          </div>

          <!-- SVG Character: Sage the Zen Owl -->
          <div id="duo-mascot-container" class="relative cursor-pointer group" title="Click Sage to celebrate and receive mindful wisdom!">
            
            <!-- SVG Owl Body -->
            <svg id="duo-mascot" class="duo-float-anim w-32 h-32 sm:w-36 sm:h-36 drop-shadow-md transition-transform" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sageBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#2a7a58" />
                  <stop offset="100%" stop-color="#143e2e" />
                </linearGradient>
                <linearGradient id="sageBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#d6e8dc" />
                </linearGradient>
                <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fbbf24" />
                  <stop offset="100%" stop-color="#d97706" />
                </linearGradient>
              </defs>

              <!-- Sprout on Head -->
              <g id="duo-sprout" class="duo-sprout-sway">
                <path d="M60 22 C60 14 53 10 47 12 C47 18 53 22 60 22 Z" fill="#10b981" />
                <path d="M60 22 C60 12 68 8 74 11 C73 17 67 22 60 22 Z" fill="#34d399" />
                <path d="M60 22 L60 28" stroke="#059669" stroke-width="2.5" stroke-linecap="round" />
              </g>

              <!-- Left Wing -->
              <path id="duo-wing-left" class="duo-wing-left" d="M26 50 C16 54 10 70 20 82 C25 80 28 68 30 58 Z" fill="#1b533e" />
              
              <!-- Right Wing -->
              <path id="duo-wing-right" class="duo-wing-right" d="M94 50 C104 54 110 70 100 82 C95 80 92 68 90 58 Z" fill="#1b533e" />

              <!-- Main Owl Torso -->
              <ellipse cx="60" cy="65" rx="36" ry="40" fill="url(#sageBodyGrad)" />

              <!-- Belly Patch -->
              <ellipse cx="60" cy="74" rx="24" ry="26" fill="url(#sageBellyGrad)" />

              <!-- Belly Feather Flecks -->
              <path d="M54 68 Q60 72 66 68" stroke="#93b79d" stroke-width="2" stroke-linecap="round" fill="none" />
              <path d="M48 76 Q54 80 60 76" stroke="#93b79d" stroke-width="2" stroke-linecap="round" fill="none" />
              <path d="M60 76 Q66 80 72 76" stroke="#93b79d" stroke-width="2" stroke-linecap="round" fill="none" />

              <!-- Left Eye Socket -->
              <circle cx="44" cy="50" r="14" fill="#ffffff" stroke="#143e2e" stroke-width="2.5" />
              <!-- Right Eye Socket -->
              <circle cx="76" cy="50" r="14" fill="#ffffff" stroke="#143e2e" stroke-width="2.5" />

              <!-- Normal Eye State (Interactive pupils) -->
              <g class="duo-eye-normal">
                <!-- Left Pupil & Specular -->
                <g id="duo-pupil-left">
                  <circle cx="45" cy="50" r="6.5" fill="#0a1f16" />
                  <circle cx="43" cy="48" r="2.2" fill="#ffffff" />
                </g>
                <!-- Right Pupil & Specular -->
                <g id="duo-pupil-right">
                  <circle cx="75" cy="50" r="6.5" fill="#0a1f16" />
                  <circle cx="73" cy="48" r="2.2" fill="#ffffff" />
                </g>
              </g>

              <!-- Happy Celebrate Eyes (^  ^) -->
              <g class="duo-eye-happy hidden">
                <path d="M38 52 Q44 44 50 52" stroke="#0a1f16" stroke-width="3" stroke-linecap="round" fill="none" />
                <path d="M70 52 Q76 44 82 52" stroke="#0a1f16" stroke-width="3" stroke-linecap="round" fill="none" />
              </g>

              <!-- Eyelids for Natural Blinking -->
              <rect class="duo-eyelid" x="28" y="34" width="32" height="32" fill="#2a7a58" rx="14" />
              <rect class="duo-eyelid" x="60" y="34" width="32" height="32" fill="#2a7a58" rx="14" />

              <!-- Beak -->
              <polygon points="60,54 54,63 66,63" fill="url(#beakGrad)" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round" />

              <!-- Cheeks Blush -->
              <circle cx="34" cy="60" r="5" fill="#f472b6" opacity="0.35" />
              <circle cx="86" cy="60" r="5" fill="#f472b6" opacity="0.35" />

              <!-- Feet -->
              <ellipse cx="49" cy="104" rx="7" ry="3.5" fill="#d97706" />
              <ellipse cx="71" cy="104" rx="7" ry="3.5" fill="#d97706" />
            </svg>

            <!-- Dynamic Floating Shadow -->
            <div class="duo-shadow-anim w-24 h-3 bg-forest-900/15 rounded-full mx-auto blur-[1.5px] mt-1"></div>
          </div>

          <!-- Mindful Cadence & Sound Pill -->
          <div class="flex flex-col items-center gap-2">
            <!-- Breathing cadence pill -->
            <div id="duo-breathe-pill" class="duo-pill-3d bg-white border border-forest-200 rounded-2xl p-2.5 sm:p-3 shadow-xs flex flex-col items-center cursor-pointer hover:scale-105 transition active:scale-95" title="Attention Restoration Cadence: Inhale 4s, Exhale 4s">
              <div class="w-8 h-8 rounded-full bg-forest-50 border border-forest-200 flex items-center justify-center mb-0.5 animate-pulse">
                <i class="fa-solid fa-wind text-forest-700 text-sm"></i>
              </div>
              <span class="text-xs font-extrabold text-forest-950 font-heading">4-7-8</span>
              <span class="text-[9px] uppercase font-bold tracking-wider text-forest-700">Zen Pace 🍃</span>
            </div>

            <!-- Sound toggle button -->
            <button id="duo-sound-toggle" class="text-slate-500 hover:text-forest-800 text-[11px] font-semibold flex items-center gap-1 transition p-1 bg-white/80 rounded-lg px-2 border border-slate-200 shadow-2xs" title="Toggle Celebration Chime Audio">
              <i class="fa-solid fa-volume-high text-forest-600" id="duo-sound-icon"></i>
              <span id="duo-sound-label">Audio On</span>
            </button>
          </div>

        </div>

      </div>

      <!-- Full-screen celebration particle overlay canvas -->
      <canvas id="duo-confetti-canvas" class="pointer-events-none fixed inset-0 z-50"></canvas>
    `;

    // Setup interactive handlers
    const mascotContainer = document.getElementById('duo-mascot-container');
    const speechBubble = document.getElementById('duo-speech-bubble');
    const streakPill = document.getElementById('duo-streak-pill');
    const breathePill = document.getElementById('duo-breathe-pill');
    const soundToggle = document.getElementById('duo-sound-toggle');
    const soundIcon = document.getElementById('duo-sound-icon');
    const soundLabel = document.getElementById('duo-sound-label');

    if (mascotContainer) {
      mascotContainer.addEventListener('click', () => {
        playBubblePop();
        triggerMascotCelebration();
      });
    }

    if (speechBubble) {
      speechBubble.addEventListener('click', () => {
        playBubblePop();
        triggerMascotCelebration();
      });
    }

    if (streakPill) {
      streakPill.addEventListener('click', () => {
        playBubblePop();
        triggerMascotCelebration("🔥 19 CONSECUTIVE DAYS! Top 5% mindful consistency!");
        showJoyfulToast("🔥", "Streak Power Activated!", "You have logged 19 mindful focus days in a row!");
      });
    }

    if (breathePill) {
      breathePill.addEventListener('click', () => {
        playBubblePop();
        triggerMascotCelebration("🌬️ Inhale peace... Hold... Exhale distraction. Reset complete!");
        showJoyfulToast("🌬️", "4-7-8 Attention Restoration", "Breathing cadence synced. Feel the digital calm return.");
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        audioEnabled = !audioEnabled;
        if (audioEnabled) {
          soundIcon.className = 'fa-solid fa-volume-high text-forest-600';
          soundLabel.textContent = 'Audio On';
          playCelebrationChime();
          showJoyfulToast("🔊", "Audio Enabled", "Playful chimes and bubble pops are now on!");
        } else {
          soundIcon.className = 'fa-solid fa-volume-xmark text-slate-400';
          soundLabel.textContent = 'Muted';
          showJoyfulToast("🔇", "Audio Muted", "Silent mindful mode activated.");
        }
      });
    }

    // Initialize eyes & blinking
    setupEyeTracking();
    setupBlinkCycle();

    // Hook into Heatmap's quick log button
    hookHeatmapLogButton();

    // Hook into Pomodoro session finish
    hookPomodoroCompletion();

    // Setup the Corner Mascot widget that follows the student on scroll
    setupCornerCompanionWidget();

    // Attach bubbly sound effects across interactive elements
    setupBubblySoundHooks();
  }

  /**
   * Sets up the floating Corner Companion ("Corner Sage") in the bottom-right
   */
  function setupCornerCompanionWidget() {
    let corner = document.getElementById('duo-corner-companion');
    if (!corner) {
      corner = document.createElement('div');
      corner.id = 'duo-corner-companion';
      corner.className = 'corner-companion-widget hidden sm:flex items-center gap-2.5 bg-white border-2 border-forest-800 rounded-full px-3 py-1.5 shadow-xl select-none transition-all duration-300';
      corner.style.display = 'none';
      document.body.appendChild(corner);
    }

    corner.innerHTML = `
      <div id="corner-sage-avatar" class="relative cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-forest-800 text-white font-bold text-sm shadow-xs hover:scale-110 active:scale-95 transition" title="Click Sage!">
        <i class="fa-solid fa-seedling text-emerald-300 text-xs absolute -top-1 right-0 anim-sparkle"></i>
        <span>🦉</span>
      </div>
      <div id="corner-sage-content" class="flex items-center gap-2 cursor-pointer">
        <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-[10px]">
          <i class="fa-solid fa-fire text-amber-500"></i>
          <span>19d</span>
        </div>
        <span id="corner-sage-tip" class="text-[11px] font-semibold text-forest-950 max-w-[200px] truncate">
          19-day streak active! Keep going! 🌱
        </span>
      </div>
      <button id="corner-sage-close" class="text-slate-400 hover:text-slate-700 text-[10px] p-1 ml-1" title="Dismiss companion">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `;

    // Interactive events
    const avatar = document.getElementById('corner-sage-avatar');
    const content = document.getElementById('corner-sage-content');
    const closeBtn = document.getElementById('corner-sage-close');
    const tipEl = document.getElementById('corner-sage-tip');

    function onCornerClick() {
      playBubblePop();
      triggerMascotCelebration("🎉 Sage says: Great study momentum! Keep your devices working for you!");
      showJoyfulToast("🦉", "Sage is Cheering You On!", "Remember to take a 5-minute break every hour!");
    }

    if (avatar) avatar.addEventListener('click', onCornerClick);
    if (content) content.addEventListener('click', onCornerClick);
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        cornerSageDismissed = true;
        corner.style.display = 'none';
      });
    }

    // Scroll listener to show/hide Corner Sage and update section-specific advice
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
      if (cornerSageDismissed) return;
      if (scrollTimeout) return;

      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const scrollY = window.scrollY || window.pageYOffset;
        
        // Show only after scrolling 320px past hero
        if (scrollY > 340) {
          corner.style.display = 'flex';

          // Detect active section
          const sections = ['assessment', 'matcher', 'resources', 'comparison', 'guides', 'meditation', 'toolkit', 'feedback', 'methodology'];
          for (let secId of sections) {
            const sec = document.getElementById(secId);
            if (sec) {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= 250 && rect.bottom >= 200) {
                if (tipEl && SECTION_TIPS[secId]) {
                  tipEl.textContent = SECTION_TIPS[secId];
                }
                break;
              }
            }
          }
        } else {
          corner.style.display = 'none';
        }
      }, 80);
    }, { passive: true });
  }

  /**
   * Attaches cheerful audio feedback to buttons and interactive tabs
   */
  function setupBubblySoundHooks() {
    // Buttons and navigation links
    const interactiveSelectors = [
      '.btn-duo-primary',
      '.btn-duo-secondary',
      '#toolkit button',
      '.tab-active',
      '#assessment button',
      '#library-search-input'
    ];

    document.querySelectorAll(interactiveSelectors.join(', ')).forEach(el => {
      el.addEventListener('click', () => {
        playBubblePop();
      });
    });
  }

  /**
   * Connects the Heatmap quick-log button to Sage's celebration
   */
  function hookHeatmapLogButton() {
    const btnLog = document.getElementById('hm-btn-log-session');
    if (btnLog) {
      btnLog.addEventListener('click', () => {
        playBubblePop();
        setTimeout(() => {
          triggerMascotCelebration("🎉 Awesome! +25 min focus sprint logged! Streak extended!");
          showJoyfulToast("⏱️", "Focus Session Logged!", "+25m added to today's mindful activity! Streak maintained!");
        }, 150);
      });
    }
  }

  /**
   * Connects Pomodoro timer celebrations to Sage
   */
  function hookPomodoroCompletion() {
    window.duoCelebrate = function (customMessage) {
      triggerMascotCelebration(customMessage);
      showJoyfulToast("🏆", "Mindful Goal Achieved!", customMessage);
    };
  }

  /**
   * Module initialization
   */
  window.initDuoCompanion = function () {
    renderMascotHeroWidget();
  };

})();
