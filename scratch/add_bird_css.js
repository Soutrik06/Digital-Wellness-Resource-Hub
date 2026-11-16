const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css/styles.css');
let css = fs.readFileSync(cssPath, 'utf8').replace(/\r\n/g, '\n');

const target = `/* Reduced motion preference */`;

const birdCSS = `/* ================================================================ */
/* ZEPHYR — FIXED LEFT-SIDE BIRD GUIDE                            */
/* ================================================================ */

/* ── Widget container ──────────────────────────────────────────── */
#zephyr-bird-guide {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 998;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  pointer-events: none;   /* children re-enable selectively */
  user-select: none;
}

/* Hide on very small screens — doesn't crowd mobile */
@media (max-width: 1023px) {
  #zephyr-bird-guide {
    display: none;
  }
}

/* ── Bird body wrapper ─────────────────────────────────────────── */
.zephyr-bird-wrap {
  pointer-events: all;
  width: 72px;
  height: 72px;
  position: relative;
  cursor: pointer;
  outline: none;
  /* Slide in from left on load */
  animation: zephyr-slide-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.zephyr-bird-wrap:focus-visible {
  outline: 3px solid var(--color-forest-700);
  outline-offset: 4px;
  border-radius: 50%;
}

/* ── Slide in entrance ─────────────────────────────────────────── */
@keyframes zephyr-slide-in {
  0%   { transform: translateX(-90px) scale(0.7); opacity: 0; }
  60%  { transform: translateX(8px)   scale(1.06); opacity: 1; }
  100% { transform: translateX(0)     scale(1);    opacity: 1; }
}

/* ── Default idle float ────────────────────────────────────────── */
@keyframes z-float {
  0%, 100% { transform: translateY(0)   rotate(0deg); }
  40%       { transform: translateY(-8px) rotate(1.5deg); }
  70%       { transform: translateY(-4px) rotate(-1deg); }
}

.zephyr-bird-wrap {
  animation: zephyr-slide-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             z-float 4s ease-in-out 0.7s infinite;
}

/* ── EXCITED state ─────────────────────────────────────────────── */
@keyframes z-excited {
  0%   { transform: translateY(0) scale(1); }
  20%  { transform: translateY(8px) scale(1.1, 0.88); }
  45%  { transform: translateY(-22px) scale(0.92, 1.1); }
  65%  { transform: translateY(4px) scale(1.06, 0.95); }
  80%  { transform: translateY(-8px) scale(0.98, 1.02); }
  100% { transform: translateY(0) scale(1); }
}

.zephyr-state-excited {
  animation: z-excited 0.75s cubic-bezier(0.28, 0.84, 0.42, 1) !important;
}

/* ── WAVE state (left wing raises) ────────────────────────────── */
@keyframes z-wave {
  0%,100% { transform: rotate(0deg); }
  25%      { transform: rotate(-30deg); }
  75%      { transform: rotate(-20deg); }
}

.zephyr-state-wave #z-wing-left {
  transform-origin: 22px 50px;
  animation: z-wave 0.6s ease-in-out 2;
}

/* ── CALM / idle state ─────────────────────────────────────────── */
.zephyr-state-calm {
  animation: z-float 4s ease-in-out 0.7s infinite !important;
}

/* ── SLEEP state ───────────────────────────────────────────────── */
@keyframes z-sleep {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50%       { transform: translateY(3px) rotate(3deg); }
}

.zephyr-state-sleep {
  animation: z-sleep 2.5s ease-in-out infinite !important;
  opacity: 0.75;
  filter: saturate(0.5) brightness(0.9);
  transition: opacity 0.6s, filter 0.6s;
}

/* ── Crest sway ────────────────────────────────────────────────── */
@keyframes z-crest-sway {
  0%, 100% { transform: rotate(-4deg); }
  50%       { transform: rotate(5deg); }
}

.zephyr-crest {
  transform-origin: 40px 14px;
  animation: z-crest-sway 3s ease-in-out infinite;
}

/* ── Tail fan ──────────────────────────────────────────────────── */
@keyframes z-tail-fan {
  0%, 100% { transform: scaleX(1) rotate(0deg); }
  50%       { transform: scaleX(1.15) rotate(2deg); }
}

.zephyr-tail {
  transform-origin: 40px 68px;
  animation: z-tail-fan 3.5s ease-in-out infinite;
}

/* ── Beak open/close (speak animation) ────────────────────────── */
@keyframes z-beak-talk {
  0%, 100%  { transform: scaleY(1); }
  50%        { transform: scaleY(0.5) translateY(2px); }
}

.zephyr-bubble-visible ~ .zephyr-bird-wrap #z-beak {
  transform-origin: 40px 30px;
  animation: z-beak-talk 0.35s ease-in-out 6;
}

/* ── Nod animation ─────────────────────────────────────────────── */
@keyframes z-nod {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(8deg); }
  75%       { transform: rotate(-4deg); }
}

.zephyr-nod {
  transform-origin: 40px 60px;
  animation: z-nod 0.5s ease-in-out 2 !important;
}

/* ── Hidden eye states ─────────────────────────────────────────── */
.hidden { display: none !important; }

/* ── SPARKLE RING ──────────────────────────────────────────────── */
.zephyr-sparkle-ring {
  position: absolute;
  inset: -16px;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.zephyr-sparkle-ring span {
  position: absolute;
  font-size: 11px;
  color: #f59e0b;
  animation: none;
}

.zephyr-sparkle-active {
  opacity: 1;
}

@keyframes z-spark-orbit {
  0%   { transform: rotate(var(--sa)) translateX(38px) scale(0.6); opacity: 0; }
  25%  { opacity: 1; transform: rotate(var(--sa)) translateX(38px) scale(1.1); }
  75%  { opacity: 1; transform: rotate(calc(var(--sa) + 300deg)) translateX(38px) scale(1); }
  100% { opacity: 0; transform: rotate(calc(var(--sa) + 360deg)) translateX(38px) scale(0.5); }
}

.zephyr-sparkle-active .zs1 { --sa: 0deg;   animation: z-spark-orbit 1.1s ease-out; }
.zephyr-sparkle-active .zs2 { --sa: 90deg;  animation: z-spark-orbit 1.1s ease-out 0.08s; }
.zephyr-sparkle-active .zs3 { --sa: 180deg; animation: z-spark-orbit 1.1s ease-out 0.16s; }
.zephyr-sparkle-active .zs4 { --sa: 270deg; animation: z-spark-orbit 1.1s ease-out 0.24s; }

/* ── SPEECH BUBBLE ─────────────────────────────────────────────── */
.zephyr-bubble {
  pointer-events: all;
  position: absolute;
  left: 82px;           /* right of the bird */
  top: 50%;
  transform: translateY(-50%) scale(0.85);
  transform-origin: left center;
  opacity: 0;
  width: 220px;
  background: #ffffff;
  border: 2px solid var(--color-forest-800);
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 8px 24px -4px rgba(14, 45, 32, 0.18), 0 2px 6px rgba(0,0,0,0.06);
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 999;
}

.zephyr-bubble-visible {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  pointer-events: all;
}

.zephyr-bubble-header {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-forest-900);
}

.zephyr-guide-label {
  flex: 1;
  font-size: 10px;
}

.zephyr-bubble-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  color: #94a3b8;
  padding: 0 2px;
  border-radius: 4px;
  transition: color 0.15s;
}
.zephyr-bubble-close:hover { color: var(--color-forest-900); }

.zephyr-bubble-text {
  font-size: 11.5px;
  line-height: 1.5;
  color: #334155;
  font-weight: 500;
  margin: 0;
}

/* Left-pointing tail */
.zephyr-bubble-tail {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 0; height: 0;
  border-top: 7px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 8px solid var(--color-forest-800);
}
.zephyr-bubble-tail::after {
  content: '';
  position: absolute;
  left: 2px;
  top: -5px;
  width: 0; height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 6px solid #ffffff;
}

/* ── ACTION PILL BAR ───────────────────────────────────────────── */
.zephyr-pill-bar {
  pointer-events: all;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 2px;
  animation: zephyr-slide-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
}

.zephyr-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px 4px 8px;
  background: #ffffff;
  border: 1.5px solid var(--color-sage-200);
  border-bottom: 3px solid var(--color-surface-border-strong);
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  color: var(--color-forest-900);
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
              border-color 0.15s, box-shadow 0.15s, background 0.15s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.zephyr-pill:hover {
  background: var(--color-sage-50);
  border-color: var(--color-sage-400);
  transform: translateX(4px) scale(1.04);
  box-shadow: 0 3px 8px rgba(20,62,46,0.1);
}

.zephyr-pill:active {
  transform: translateX(2px) translateY(2px) scale(0.97);
  border-bottom-width: 1px;
}

/* ── SECTION PROGRESS PIPS ─────────────────────────────────────── */
.zephyr-section-pips {
  pointer-events: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-left: 10px;
  margin-top: 4px;
  animation: zephyr-slide-in 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both;
}

.zpip {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-sage-200);
  transition: background 0.3s, transform 0.25s;
}

.zpip-active {
  background: var(--color-forest-700);
  transform: scaleX(2.4);
  border-radius: 3px;
}

`;

if (!css.includes(target)) {
  console.error('Target comment not found in styles.css');
  process.exit(1);
}

const newCSS = css.replace(target, birdCSS + target);
fs.writeFileSync(cssPath, newCSS.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully added Zephyr Bird Guide CSS to styles.css!');
