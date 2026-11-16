const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css/styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

const targetBefore = `/* Reduced motion preference */`;

const joyfulCSS = `/* ======================================================== */
/* JOYFUL & ANIMATED THEME ENHANCEMENTS                      */
/* ======================================================== */

/* Floating ambient elements (Leaves, Sparkles, Badges) */
@keyframes float-drift-1 {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-16px) rotate(12deg);
  }
}

@keyframes float-drift-2 {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(-14deg);
  }
}

@keyframes sparkle-twinkle {
  0%, 100% {
    transform: scale(0.8) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.25) rotate(45deg);
    opacity: 1;
    filter: drop-shadow(0 0 6px rgba(251, 191, 36, 0.8));
  }
}

.anim-float-1 {
  animation: float-drift-1 5s ease-in-out infinite;
}

.anim-float-2 {
  animation: float-drift-2 6.5s ease-in-out infinite;
}

.anim-sparkle {
  animation: sparkle-twinkle 2.8s ease-in-out infinite;
}

/* Joyful 3D Cards with Bouncy Spring Curve */
.card-joyful-3d {
  border-bottom: 4px solid var(--color-surface-border) !important;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease, border-color 0.2s ease;
}

.card-joyful-3d:hover {
  transform: translateY(-6px);
  border-bottom-color: var(--color-sage-400) !important;
  box-shadow: 0 16px 30px -8px rgba(20, 62, 46, 0.12), 0 8px 10px -4px rgba(20, 62, 46, 0.04);
}

.card-joyful-3d:active {
  transform: translateY(1px);
  border-bottom-width: 2px !important;
}

/* Playful Icon Wiggle on Hover */
@keyframes icon-wiggle-keyframes {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-14deg) scale(1.15); }
  75% { transform: rotate(14deg) scale(1.15); }
}

.icon-wiggle:hover i,
.group:hover .icon-wiggle i {
  display: inline-block;
  animation: icon-wiggle-keyframes 0.4s ease-in-out;
}

/* Shimmer Sweep Animation on Badges & Buttons */
@keyframes shimmer-sweep-anim {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer-badge {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer-sweep-anim 3s infinite;
}

/* Assessment Bouncy Radio Selected Card */
@keyframes radio-pop-anim {
  0% { transform: scale(1); }
  40% { transform: scale(1.035); }
  100% { transform: scale(1); }
}

.radio-card-joyful {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
  border-bottom: 3px solid #e6e4dc;
}

.radio-card-joyful:hover {
  border-color: var(--color-sage-400);
  background-color: #f7faf8;
  transform: translateY(-2px);
}

.radio-card-joyful:has(input:checked) {
  border-color: var(--color-forest-700);
  border-bottom-color: var(--color-forest-900);
  background-color: #f0f7f3;
  animation: radio-pop-anim 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(20, 62, 46, 0.08);
}

/* Running Pomodoro Timer Pulsing Ring */
@keyframes timer-glow-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(20, 62, 46, 0.25);
  }
  50% {
    box-shadow: 0 0 0 16px rgba(20, 62, 46, 0);
  }
}

.timer-running-pulse {
  animation: timer-glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Floating Corner Mascot Companion ("Corner Sage") */
@keyframes corner-slide-up {
  0% {
    transform: translateY(120px) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(-8px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.corner-companion-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 999;
  animation: corner-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 12px 28px rgba(15, 35, 25, 0.18));
}

.corner-companion-minimized {
  transform: translateY(calc(100% - 2.75rem)) !important;
}

/* Joyful Achievement Toast */
@keyframes toast-drop-in {
  0% {
    transform: translate(-50%, -80px) scale(0.9);
    opacity: 0;
  }
  60% {
    transform: translate(-50%, 8px) scale(1.03);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
}

.joyful-toast {
  position: fixed;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  animation: toast-drop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

`;

if (!cssContent.includes(targetBefore)) {
  console.error("Target comment not found in styles.css");
  process.exit(1);
}

const newCSS = cssContent.replace(targetBefore, joyfulCSS + targetBefore);
fs.writeFileSync(cssPath, newCSS.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully appended Joyful theme animations to styles.css!");
