const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'styles.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');

const targetBefore = `/* Reduced motion preference */`;

const duoCSS = `/* ======================================================== */
/* DUOLINGO-STYLE ANIMATIONS & MICRO-INTERACTIONS ("SAGE")   */
/* ======================================================== */

/* Idle gentle floating */
@keyframes duo-float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-9px) rotate(0.8deg);
  }
}

.duo-float-anim {
  animation: duo-float 3.2s ease-in-out infinite;
  transform-origin: center bottom;
}

/* Synchronized ground shadow */
@keyframes duo-shadow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.18;
  }
  50% {
    transform: scale(0.78);
    opacity: 0.08;
  }
}

.duo-shadow-anim {
  animation: duo-shadow 3.2s ease-in-out infinite;
  transform-origin: center center;
}

/* Celebratory Happy Jump (Squash and Stretch) */
@keyframes duo-jump {
  0% {
    transform: translateY(0) scale(1, 1);
  }
  20% {
    transform: translateY(6px) scale(1.16, 0.84);
  }
  48% {
    transform: translateY(-26px) scale(0.92, 1.12);
  }
  70% {
    transform: translateY(3px) scale(1.08, 0.94);
  }
  85% {
    transform: translateY(-6px) scale(0.98, 1.02);
  }
  100% {
    transform: translateY(0) scale(1, 1);
  }
}

.duo-celebrate-anim {
  animation: duo-jump 0.85s cubic-bezier(0.28, 0.84, 0.42, 1) !important;
}

/* Wing flapping */
@keyframes duo-wing-l {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-28deg); }
}
@keyframes duo-wing-r {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(28deg); }
}

.duo-wing-left {
  transform-origin: 30px 52px;
  transition: transform 0.2s ease;
}
.duo-wing-right {
  transform-origin: 90px 52px;
  transition: transform 0.2s ease;
}

#duo-mascot-container:hover .duo-wing-left,
.duo-celebrate-anim .duo-wing-left {
  animation: duo-wing-l 0.25s ease-in-out 3;
}

#duo-mascot-container:hover .duo-wing-right,
.duo-celebrate-anim .duo-wing-right {
  animation: duo-wing-r 0.25s ease-in-out 3;
}

/* Sprout sway */
@keyframes duo-sprout {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(4deg); }
}

.duo-sprout-sway {
  transform-origin: 60px 28px;
  animation: duo-sprout 2.5s ease-in-out infinite;
}

/* Eyelid natural blink */
.duo-eyelid {
  transform-origin: 50% 34px;
  transform: scaleY(0);
  transition: transform 0.08s ease;
}

.duo-eyelid.duo-blink {
  transform: scaleY(1);
}

/* Speech bubble styling & tail */
.duo-speech-bubble {
  position: relative;
  background-color: #ffffff;
  border: 2px solid #e6e4dc;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(20, 62, 46, 0.06);
}

.duo-speech-tail {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffffff;
}

.duo-speech-tail::before {
  content: "";
  position: absolute;
  top: -9px;
  left: -9px;
  width: 0;
  height: 0;
  border-left: 9px solid transparent;
  border-right: 9px solid transparent;
  border-top: 9px solid rgba(20, 62, 46, 0.15);
  z-index: -1;
}

/* Speech pop bounce-in */
@keyframes duo-pop {
  0% {
    transform: scale(0.85);
    opacity: 0;
  }
  65% {
    transform: scale(1.04);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.duo-pop-anim {
  animation: duo-pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Streak Flame dancing animation */
@keyframes duo-flame-flicker {
  0%, 100% {
    transform: scale(1) rotate(-2deg);
    filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
  }
  50% {
    transform: scale(1.15) rotate(3deg);
    filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.85));
  }
}

.duo-flame-anim {
  display: inline-block;
  animation: duo-flame-flicker 1.8s ease-in-out infinite;
  transform-origin: center bottom;
}

/* Flame aura glow */
.duo-flame-glow {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0) 70%);
  animation: duo-flame-flicker 1.8s ease-in-out infinite alternate;
  pointer-events: none;
}

/* 3D Tactile Pills & Cards */
.duo-pill-3d {
  box-shadow: 0 4px 0 #e6e4dc;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.duo-pill-3d:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #d0cdc2;
}

.duo-pill-3d:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #d0cdc2;
}

/* Duolingo Chunky 3D Pushable Buttons */
.btn-duo-primary {
  background-color: var(--color-forest-800);
  color: #ffffff !important;
  font-weight: 700;
  border-radius: 14px;
  border-bottom: 4px solid var(--color-forest-950) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.1s ease, border-bottom-width 0.1s ease, background-color 0.15s ease;
}

.btn-duo-primary:hover {
  background-color: var(--color-forest-700);
}

.btn-duo-primary:active {
  transform: translateY(3px);
  border-bottom-width: 1px !important;
  box-shadow: none;
}

.btn-duo-secondary {
  background-color: #ffffff;
  color: var(--color-forest-950) !important;
  font-weight: 700;
  border-radius: 14px;
  border: 1.5px solid #d0cdc2;
  border-bottom: 4px solid #b7b3a5 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: transform 0.1s ease, border-bottom-width 0.1s ease, background-color 0.15s ease;
}

.btn-duo-secondary:hover {
  background-color: #f8fafc;
}

.btn-duo-secondary:active {
  transform: translateY(3px);
  border-bottom-width: 1px !important;
  box-shadow: none;
}

`;

const normalizedCSS = cssContent.replace(/\r\n/g, '\n');
if (!normalizedCSS.includes(targetBefore)) {
  console.error("Target comment not found in styles.css!");
  process.exit(1);
}

const updatedCSS = normalizedCSS.replace(targetBefore, duoCSS + targetBefore);
fs.writeFileSync(cssPath, updatedCSS.replace(/\n/g, '\r\n'), 'utf8');
console.log("Successfully added Duolingo animation styles to styles.css!");
