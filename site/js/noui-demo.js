const Ct = `@import 'tailwindcss';
@import './tokens.css';

html,
body,
#root {
  height: 100%;
  margin: 0;
}

body {
  background: var(--bg-deep-space);
  color: var(--ink);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

/* ── App shell & themes ── */
.noui-app {
  position: fixed;
  inset: 0;
  overflow: hidden;
  user-select: none;
  background: var(--app-bg);
  color: var(--app-ink);
  transition: background-color var(--dur-slow) var(--ease-out);
  --app-bg: var(--bg-deep-space);
  --app-ink: var(--ink);
}
.noui-app[data-theme='midnight'] {
  --app-bg: var(--bg-midnight);
}
.noui-app[data-theme='slate'] {
  --app-bg: var(--bg-slate);
}
.noui-app[data-theme='bright-ink'] {
  --app-bg: var(--bg-bright-ink);
  --app-ink: var(--ink-on-light);
}
.noui-app[data-theme='transparent'] {
  --app-bg: transparent;
}

.noui-backdrop {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out);
  background: radial-gradient(ellipse at bottom, rgba(49, 46, 129, 0.18), transparent 65%);
}
.noui-app[data-theme='deep-space'] .noui-backdrop {
  opacity: 1;
}

.noui-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.noui-wordmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0.1;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.noui-wordmark h1 {
  margin: 0 0 8px;
  font-size: clamp(56px, 12vw, 96px);
  line-height: 1;
}
.noui-wordmark p {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 20px;
}

.noui-pill {
  margin-top: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  background: var(--glass);
  color: #d4d4d8;
  font: 500 14px var(--font-sans);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-float);
  pointer-events: auto;
  cursor: pointer;
  transition:
    background-color var(--dur-fast),
    color var(--dur-fast),
    transform var(--dur-med) var(--ease-spring);
}
.noui-pill:hover {
  background: var(--glass-strong);
  color: #fff;
  transform: translateY(-1px);
}
.noui-app[data-theme='bright-ink'] .noui-pill {
  color: #27272a;
  border-color: rgba(0, 0, 0, 0.12);
  background: rgba(0, 0, 0, 0.04);
}

/* ── Living layer (positions written by the engine every frame) ── */
.noui-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.noui-safe-probe {
  position: absolute;
  inset: 0;
  visibility: hidden;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom)
    env(safe-area-inset-left);
}
.noui-goo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.noui-rail {
  position: absolute;
  inset: calc(var(--rail-inset) + env(safe-area-inset-top))
    calc(var(--rail-inset) + env(safe-area-inset-right)) calc(var(--rail-inset) + env(safe-area-inset-bottom))
    calc(var(--rail-inset) + env(safe-area-inset-left));
  border-radius: var(--rail-radius);
  padding: 2px;
  opacity: 0;
  background: rgba(255, 255, 255, 0.06);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#000 0 0) content-box exclude,
    linear-gradient(#000 0 0);
}
.noui-rail-glow {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from calc(var(--rail-angle, 135deg) - 70deg),
    transparent 0deg,
    var(--rail-color) 70deg,
    transparent 140deg
  );
}

.noui-eye,
.noui-sat {
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  outline: none;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}
.noui-eye {
  pointer-events: auto;
  touch-action: none;
  cursor: grab;
}
.noui-eye:active {
  cursor: grabbing;
}
.noui-sat {
  pointer-events: none;
  opacity: 0;
  cursor: pointer;
}
.noui-sat:hover {
  background: rgba(255, 255, 255, 0.1);
}
.noui-eye:focus-visible,
.noui-sat:focus-visible {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.7);
}

.noui-sclera {
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 35%, #15151f, #050508 70%);
  box-shadow:
    inset 0 4px 8px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  will-change: transform;
}
.noui-pupil {
  position: relative;
  width: 46%;
  height: 46%;
  border-radius: 50%;
  will-change: transform;
}
.noui-glint {
  position: absolute;
  left: 32%;
  top: 32%;
  width: 34%;
  height: 34%;
  border-radius: 50%;
  background: #fff;
  opacity: 0.9;
  box-shadow: 0 0 4px #fff;
}
.noui-glint2 {
  position: absolute;
  right: 12%;
  top: 12%;
  width: 16%;
  height: 16%;
  border-radius: 50%;
  background: #fff;
  opacity: 0.6;
}

/* Without WebGL2: draw the bodies with CSS so the app still works. */
.noui-layer[data-gl='off'] .noui-eye::before,
.noui-layer[data-gl='off'] .noui-sat::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    rgba(165, 180, 252, 0.7),
    rgba(79, 70, 229, 0.55) 60%,
    rgba(49, 46, 129, 0.6)
  );
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

/* Press-and-hold ring: fills in toward the long-press that opens the quick menu. */
.noui-eye::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.55);
  opacity: 0;
  transform: scale(0.7);
  pointer-events: none;
}
.noui-eye[data-hold='on']::after {
  animation: noui-hold 340ms 160ms var(--ease-out) forwards;
}
@keyframes noui-hold {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Quick menu */
.noui-menu {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: auto;
}
.noui-menu-item {
  position: absolute;
  display: grid;
  place-items: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(165, 180, 252, 0.28);
  background: linear-gradient(180deg, rgba(55, 52, 110, 0.75), rgba(20, 20, 34, 0.85));
  color: #e0e7ff;
  box-shadow:
    var(--shadow-float),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
  cursor: pointer;
  outline: none;
  opacity: 0;
  transform: translate(var(--from-x), var(--from-y)) scale(0.3);
  transition:
    transform 420ms var(--ease-spring),
    opacity 200ms var(--ease-out),
    background-color var(--dur-fast);
}
.noui-menu[data-open='on'] .noui-menu-item {
  opacity: 1;
  transform: none;
}
.noui-menu-item:hover:not(:disabled),
.noui-menu-item:focus-visible {
  border-color: rgba(165, 180, 252, 0.7);
  box-shadow:
    var(--shadow-float),
    0 0 0 3px rgba(129, 140, 248, 0.35);
}
.noui-menu-item:disabled {
  cursor: default;
  color: rgba(224, 231, 255, 0.4);
}
.noui-menu-label {
  position: absolute;
  white-space: nowrap;
  padding: 3px 9px;
  border-radius: var(--radius-pill);
  background: rgba(12, 12, 20, 0.85);
  border: 1px solid var(--line);
  font: 500 12px var(--font-sans);
  color: #e4e4e7;
  pointer-events: none;
}
/* Labels sit beside their button, on the side facing away from the eye. */
.noui-menu-item[data-label='right'] .noui-menu-label {
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}
.noui-menu-item[data-label='left'] .noui-menu-label {
  right: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
}
.noui-menu-item[data-label='above'] .noui-menu-label {
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}
.noui-menu-item[data-label='below'] .noui-menu-label {
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
}
.noui-menu-label em {
  margin-left: 6px;
  font-style: normal;
  font-size: 10px;
  color: #a5b4fc;
}
.noui-menu-item:disabled .noui-menu-label {
  color: #a1a1aa;
}

@media (prefers-reduced-motion: reduce) {
  .noui-menu-item {
    transition: opacity 150ms linear;
    transform: none;
  }
  .noui-eye[data-hold='on']::after {
    animation-duration: 1ms;
  }
}

/* ── Pods: glass panels that grow out of drones (shape and position written by the engine) ── */
.noui-pod {
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  pointer-events: none;
  color: var(--ink);
  /* Opaque enough to read on any background, even where backdrop blur is unavailable. */
  background: rgba(12, 12, 22, 0.9);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  will-change: transform, width, height;
  outline: none;
  user-select: text;
}
.noui-pod-content {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
}
.noui-pod-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px 10px 16px;
}
.noui-pod-icon {
  flex: none;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(99, 102, 241, 0.25);
  color: #c7d2fe;
}
.noui-pod-titles {
  flex: 1;
  min-width: 0;
}
.noui-pod-titles h2 {
  margin: 0;
  font: 600 15px/1.2 var(--font-sans);
  letter-spacing: -0.01em;
}
.noui-pod-titles p {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--ink-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.noui-pod-btn {
  flex: none;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink-muted);
  cursor: pointer;
  transition:
    background-color var(--dur-fast),
    color var(--dur-fast);
}
.noui-pod-btn:hover {
  background: var(--glass-strong);
  color: var(--ink);
}
.noui-pod-btn:focus-visible {
  outline: 2px solid #a5b4fc;
  outline-offset: 1px;
}
.noui-pod-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 4px 16px 16px;
  outline: none;
}
.noui-sat[data-active='on'] {
  box-shadow: 0 0 0 2px rgba(199, 210, 254, 0.55);
}
.noui-layer[data-gl='off'] .noui-pod {
  background: rgba(20, 20, 36, 0.92);
  border: 1px solid rgba(165, 180, 252, 0.35);
}

/* Placeholder content until the real tools land */
.noui-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 22px 6px 8px;
  text-align: center;
}
.noui-placeholder-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
  border-radius: 50%;
  color: #e0e7ff;
  background: radial-gradient(
    circle at 35% 30%,
    rgba(165, 180, 252, 0.6),
    rgba(79, 70, 229, 0.55) 60%,
    rgba(49, 46, 129, 0.6)
  );
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.22),
    0 10px 30px -8px rgba(79, 70, 229, 0.8);
}
.noui-placeholder h3 {
  margin: 0;
  font: 600 17px/1.3 var(--font-sans);
  letter-spacing: -0.02em;
}
.noui-placeholder p {
  margin: 0;
  max-width: 32ch;
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--ink-muted);
}
.noui-placeholder ul {
  display: grid;
  gap: 6px;
  margin: 8px 0 4px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  color: #d4d4d8;
}
.noui-placeholder li::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  margin-right: 8px;
  vertical-align: 2px;
  border-radius: 50%;
  background: #818cf8;
}
.noui-placeholder-tag {
  margin-top: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-pill);
  border: 1px solid var(--line);
  font: 500 11px var(--font-mono);
  color: var(--ink-muted);
}
`, Ft = `/* Design tokens. The engine reads none of these; UI and themes do. */
:root {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;

  /* surfaces */
  --bg-deep-space: #09090b;
  --bg-midnight: #0f172a;
  --bg-slate: #1e293b;
  --bg-bright-ink: #f4f4f5;
  --ink: #f4f4f5;
  --ink-muted: #a1a1aa;
  --ink-on-light: #09090b;
  --glass: rgba(255, 255, 255, 0.05);
  --glass-strong: rgba(255, 255, 255, 0.1);
  --line: rgba(255, 255, 255, 0.1);

  /* shape */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;
  --blur-glass: 24px;
  --shadow-float: 0 24px 60px -20px rgba(0, 0, 0, 0.7);

  /* motion (CSS side; the engine has its own springs) */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --dur-fast: 150ms;
  --dur-med: 300ms;
  --dur-slow: 700ms;
}
`, $t = `/* Extra styles for the site demo, loaded after the app's own CSS (tokens.css + index.css). */

:root {
  --font-sans: 'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}

/* The page scrolls over the stage on touch; only the eye itself captures touches (touch-action: none). */
html,
body {
  touch-action: pan-y;
}

/* Static previews inside the pods. These are not controls, so they never take focus. */
.sd-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 4px;
}
.sd-drop {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 18px 12px;
  border: 1.5px dashed rgba(165, 180, 252, 0.35);
  border-radius: 16px;
  background: rgba(99, 102, 241, 0.07);
  color: #c7d2fe;
  text-align: center;
}
.sd-drop b {
  margin-top: 4px;
  font-weight: 600;
  font-size: 14px;
  color: var(--ink);
}
.sd-drop small {
  font-size: 12px;
  color: var(--ink-muted);
}
.sd-list {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.sd-row,
.sd-preset {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
}
.sd-row b,
.sd-preset b {
  font-weight: 500;
  color: var(--ink);
}
.sd-row small {
  margin-left: auto;
  font: 11px var(--font-mono);
  color: var(--ink-muted);
}
.sd-row-ic {
  flex: none;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.22);
  color: #c7d2fe;
}
.sd-preset {
  justify-content: space-between;
}
.sd-var {
  font: 11.5px var(--font-mono);
  color: #22d3ee;
}
.sd-line {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--ink-muted);
}
.sd-text {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  line-height: 1.55;
  color: #d4d4d8;
}
.sd-text p {
  margin: 6px 0 0;
}
.sd-title {
  display: block;
  font-size: 14px;
  color: var(--ink);
}
.sd-caret {
  display: inline-block;
  width: 1.5px;
  height: 1.05em;
  vertical-align: -2px;
  background: #22d3ee;
  animation: sd-blink 1.05s steps(1) infinite;
}
.sd-code {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font: 12px/1.6 var(--font-mono);
  color: #d4d4d8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.sd-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sd-chip {
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  font: 11px var(--font-mono);
  color: var(--ink);
}
.sd-chip.sd-hot {
  background: rgba(99, 102, 241, 0.35);
  color: #e0e7ff;
}
.sd-muted {
  color: var(--ink-muted);
}
.sd-actions {
  display: flex;
  gap: 8px;
}
.sd-btn {
  flex: 1;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.07);
  text-align: center;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink);
}
.sd-btn.sd-primary {
  background: linear-gradient(180deg, #6366f1, #4f46e5);
}
.sd-btn.sd-muted {
  color: var(--ink-muted);
}
.sd-tag {
  align-self: center;
  margin-top: 2px;
}
@keyframes sd-blink {
  50% {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sd-caret {
    animation: none;
  }
}
`;
function zt(a = window) {
  const t = a.requestAnimationFrame.bind(a);
  let e = !0, n = null;
  return a.requestAnimationFrame = (s) => t((i) => {
    e ? s(i) : n = s;
  }), {
    get active() {
      return e;
    },
    setActive(s) {
      if (s !== e && (e = s, e && n)) {
        const i = n;
        n = null, t(i);
      }
    }
  };
}
const At = Math.PI * 2, E = (a, t, e) => a < t ? t : a > e ? e : a, q = (a, t) => (a % t + t) % t, U = (a, t, e) => a + (t - a) * e, ut = (a, t) => 1 - Math.exp(-a * t);
function Nt(a = 1) {
  let t = a >>> 0;
  return () => {
    t = t + 1831565813 >>> 0;
    let e = t;
    return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
  };
}
const et = 9, nt = 16, Ut = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`, Ot = `#version 300 es
precision highp float;
uniform vec3 u_blobs[${et}];
uniform vec3 u_parts[${nt}];
uniform vec3 u_color;
uniform float u_dpr;
uniform float u_k;
uniform float u_opacity;
// Pod: rounded box (center.xy, half size.zw; device px, y up) and its corner radius. z <= 0.5 means none.
uniform vec4 u_box;
uniform float u_boxR;
out vec4 o;

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 p = gl_FragCoord.xy;
  float d = 1e5;
  if (u_box.z > 0.5) d = sdRoundBox(p - u_box.xy, u_box.zw, u_boxR);
  for (int i = 0; i < ${et}; i++) {
    if (u_blobs[i].z > 0.5) d = smin(d, length(p - u_blobs[i].xy) - u_blobs[i].z, u_k);
  }
  for (int i = 0; i < ${nt}; i++) {
    if (u_parts[i].z > 0.3) d = smin(d, length(p - u_parts[i].xy) - u_parts[i].z, u_k * 0.5);
  }
  // Derivatives before any early exit (they need all pixels of the quad).
  vec2 g = vec2(dFdx(d), dFdy(d));
  float aa = 0.9 * u_dpr;
  float a = smoothstep(aa, -aa, d);
  if (a <= 0.002) { o = vec4(0.0); return; }

  float gl = length(g);
  vec2 n2 = gl > 1e-4 ? g / gl : vec2(0.0);
  float depth = clamp(-d / (16.0 * u_dpr), 0.0, 1.0);
  float edge = 1.0 - depth;
  vec3 N = normalize(vec3(n2 * edge * 1.4, 0.35 + depth));
  vec3 L = normalize(vec3(-0.5, 0.7, 0.8));
  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(reflect(-L, N), vec3(0.0, 0.0, 1.0)), 0.0), 40.0);
  float rim = pow(edge, 2.5);

  vec3 glass = u_color * (0.3 + 0.55 * diff);
  glass += rim * mix(u_color, vec3(0.85, 0.9, 1.0), 0.55) * 0.9;
  glass += vec3(n2.x, 0.0, -n2.x) * rim * 0.18;
  glass += spec;
  float glassAlpha = clamp(0.22 + rim * 0.6 + spec * 0.8 + edge * 0.08, 0.0, 1.0);

  vec3 solid = u_color * (0.55 + 0.45 * diff) + spec * 0.6 + rim * 0.12;

  vec3 col = mix(glass, solid, u_opacity);
  float alpha = mix(glassAlpha, 1.0, u_opacity) * a;
  o = vec4(col * alpha, alpha);
}`;
class Bt {
  constructor(t) {
    this.canvas = t, this.ok = this.init();
  }
  ok;
  gl = null;
  u = {
    blobs: null,
    parts: null,
    color: null,
    dpr: null,
    k: null,
    opacity: null,
    box: null,
    boxR: null
  };
  blobData = new Float32Array(et * 3);
  partData = new Float32Array(nt * 3);
  height = 0;
  dpr = 1;
  init() {
    const t = this.canvas.getContext("webgl2", { alpha: !0, premultipliedAlpha: !0, antialias: !1 });
    if (!t) return !1;
    const e = (c, d) => {
      const h = t.createShader(c);
      return h ? (t.shaderSource(h, d), t.compileShader(h), t.getShaderParameter(h, t.COMPILE_STATUS) ? h : (console.warn("noUI shader:", t.getShaderInfoLog(h)), null)) : null;
    }, n = e(t.VERTEX_SHADER, Ut), s = e(t.FRAGMENT_SHADER, Ot), i = t.createProgram();
    if (!n || !s || !i || (t.attachShader(i, n), t.attachShader(i, s), t.linkProgram(i), !t.getProgramParameter(i, t.LINK_STATUS))) return !1;
    t.useProgram(i);
    const o = t.createBuffer();
    t.bindBuffer(t.ARRAY_BUFFER, o), t.bufferData(t.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), t.STATIC_DRAW);
    const r = t.getAttribLocation(i, "a");
    return t.enableVertexAttribArray(r), t.vertexAttribPointer(r, 2, t.FLOAT, !1, 0, 0), t.enable(t.BLEND), t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA), t.clearColor(0, 0, 0, 0), this.u = {
      blobs: t.getUniformLocation(i, "u_blobs"),
      parts: t.getUniformLocation(i, "u_parts"),
      color: t.getUniformLocation(i, "u_color"),
      dpr: t.getUniformLocation(i, "u_dpr"),
      k: t.getUniformLocation(i, "u_k"),
      opacity: t.getUniformLocation(i, "u_opacity"),
      box: t.getUniformLocation(i, "u_box"),
      boxR: t.getUniformLocation(i, "u_boxR")
    }, this.gl = t, !0;
  }
  resize(t, e, n) {
    this.height = e, this.dpr = n, this.canvas.width = Math.round(t * n), this.canvas.height = Math.round(e * n), this.gl?.viewport(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * @param blobs     circles in CSS px (eye first); r <= 0.5 means absent
   * @param smoothing how far apart blobs still melt together (CSS px)
   * @param opacity   0 = glass, 1 = solid
   * @param box       the pod's rounded box (CSS px), or null
   */
  draw(t, e, n, s, i, o = null) {
    const r = this.gl;
    if (!r || r.isContextLost()) return;
    const { dpr: c, height: d } = this;
    let h = 1 / 0, l = 1 / 0, u = -1 / 0, x = -1 / 0;
    const v = (k, M, A) => {
      k - A < h && (h = k - A), k + A > u && (u = k + A), M - A < l && (l = M - A), M + A > x && (x = M + A);
    };
    for (let k = 0; k < et; k++) {
      const M = t[k], A = M && M.r > 0.5 ? M.r : 0;
      this.blobData[k * 3] = M ? M.x * c : 0, this.blobData[k * 3 + 1] = M ? (d - M.y) * c : 0, this.blobData[k * 3 + 2] = A * c, A > 0 && v(M.x, M.y, A);
    }
    for (let k = 0; k < nt; k++) {
      const M = e[k], A = M && M.r > 0.3 ? M.r : 0;
      this.partData[k * 3] = M ? M.x * c : 0, this.partData[k * 3 + 1] = M ? (d - M.y) * c : 0, this.partData[k * 3 + 2] = A * c, A > 0 && v(M.x, M.y, A);
    }
    const w = !!o && o.hw > 0.5 && o.hh > 0.5;
    if (w && (o.x - o.hw < h && (h = o.x - o.hw), o.x + o.hw > u && (u = o.x + o.hw), o.y - o.hh < l && (l = o.y - o.hh), o.y + o.hh > x && (x = o.y + o.hh)), r.disable(r.SCISSOR_TEST), r.clear(r.COLOR_BUFFER_BIT), u < h) return;
    const y = s + 4, g = this.canvas.width, S = this.canvas.height, T = E(Math.floor((h - y) * c), 0, g), R = E(Math.floor((d - x - y) * c), 0, S), O = E(Math.ceil((u - h + 2 * y) * c), 0, g - T), D = E(Math.ceil((x - l + 2 * y) * c), 0, S - R);
    O <= 0 || D <= 0 || (r.enable(r.SCISSOR_TEST), r.scissor(T, R, O, D), r.uniform3fv(this.u.blobs, this.blobData), r.uniform3fv(this.u.parts, this.partData), r.uniform3f(this.u.color, n[0], n[1], n[2]), r.uniform1f(this.u.dpr, c), r.uniform1f(this.u.k, s * c), r.uniform1f(this.u.opacity, E(i, 0, 1)), w ? (r.uniform4f(this.u.box, o.x * c, (d - o.y) * c, o.hw * c, o.hh * c), r.uniform1f(this.u.boxR, o.r * c)) : r.uniform4f(this.u.box, 0, 0, 0, 0), r.drawArrays(r.TRIANGLES, 0, 3));
  }
}
function xt(a) {
  const t = /^#?([0-9a-f]{6})$/i.exec(a?.trim() ?? "");
  if (!t) return [1, 1, 1];
  const e = parseInt(t[1], 16);
  return [(e >> 16 & 255) / 255, (e >> 8 & 255) / 255, (e & 255) / 255];
}
const yt = (a, t = 1) => `rgba(${Math.round(a[0] * 255)},${Math.round(a[1] * 255)},${Math.round(a[2] * 255)},${t})`;
function Yt(a, t) {
  const e = t / 24 * Math.PI * 2, n = -Math.cos(e), s = Math.sin(e), i = 1 + n * 0.15;
  return [
    E(a[0] * i + s * 0.1, 0, 1),
    E(a[1] * i + s * 0.05, 0, 1),
    E(a[2] * i - n * 0.1 - s * 0.05, 0, 1)
  ];
}
const Xt = (a) => a.getHours() + a.getMinutes() / 60 + a.getSeconds() / 3600;
function _t(a, t, e) {
  a[0] += (t[0] - a[0]) * e, a[1] += (t[1] - a[1]) * e, a[2] += (t[2] - a[2]) * e;
}
const jt = {
  set: (a, t) => setTimeout(a, t),
  clear: (a) => clearTimeout(a)
}, qt = {
  dragThreshold: 6,
  tapWindowMs: 220,
  longPressMs: 500
};
class Gt {
  constructor(t, e = qt, n = jt) {
    this.handlers = t, this.opts = e, this.timers = n;
  }
  /** When false (e.g. locked), presses never turn into drags. */
  dragEnabled = !0;
  pressed = !1;
  dragging = !1;
  sx = 0;
  sy = 0;
  lx = 0;
  ly = 0;
  pendingTap = null;
  longTimer = null;
  longPressed = !1;
  /** A tap was waiting when this press began: releasing quickly makes it a double-tap. */
  secondPress = !1;
  get isPressed() {
    return this.pressed;
  }
  get isDragging() {
    return this.dragging;
  }
  down(t, e) {
    this.pressed = !0, this.dragging = !1, this.sx = this.lx = t, this.sy = this.ly = e, this.longPressed = !1, this.secondPress = this.pendingTap !== null, this.clearPending(), this.clearLong(), this.longTimer = this.timers.set(() => {
      this.longTimer = null, !(!this.pressed || this.dragging) && (this.longPressed = !0, this.clearPending(), this.handlers.onLongPress?.());
    }, this.opts.longPressMs), this.handlers.onPress?.();
  }
  move(t, e, n) {
    if (this.pressed) {
      if (this.lx = t, this.ly = e, !this.dragging) {
        if (Math.hypot(t - this.sx, e - this.sy) <= this.opts.dragThreshold || (this.clearLong(), this.secondPress = !1, !this.dragEnabled || this.longPressed)) return;
        this.dragging = !0, this.clearPending(), this.handlers.onDragStart?.(this.sx, this.sy);
      }
      this.handlers.onDragMove?.(t, e, n);
    }
  }
  up(t, e, n) {
    if (this.pressed) {
      if (this.pressed = !1, this.clearLong(), this.handlers.onRelease?.(), this.dragging) {
        this.dragging = !1, this.handlers.onDragEnd?.(t, e, n);
        return;
      }
      if (this.longPressed) {
        this.longPressed = !1;
        return;
      }
      if (this.secondPress) {
        this.secondPress = !1, this.handlers.onDoubleTap?.();
        return;
      }
      this.pendingTap = this.timers.set(() => {
        this.pendingTap = null, this.handlers.onTap?.();
      }, this.opts.tapWindowMs);
    }
  }
  /** Pointer lost (pointercancel, lost capture): end any drag, never fire a tap. */
  cancel(t) {
    this.pressed && (this.pressed = !1, this.clearLong(), this.longPressed = !1, this.secondPress = !1, this.handlers.onRelease?.(), this.dragging && (this.dragging = !1, this.handlers.onDragEnd?.(this.lx, this.ly, t)));
  }
  dispose() {
    this.clearPending(), this.clearLong();
  }
  clearLong() {
    this.longTimer !== null && this.timers.clear(this.longTimer), this.longTimer = null;
  }
  clearPending() {
    this.pendingTap !== null && this.timers.clear(this.pendingTap), this.pendingTap = null;
  }
}
class Ht {
  constructor(t = 1 / 120, e = 12) {
    this.step = t, this.maxSteps = e;
  }
  acc = 0;
  advance(t, e) {
    this.acc += Math.max(0, t);
    let n = 0;
    for (; this.acc >= this.step && n < this.maxSteps; )
      e(this.step), this.acc -= this.step, n++;
    return n === this.maxSteps && (this.acc = Math.min(this.acc, this.step)), this.acc / this.step;
  }
  reset() {
    this.acc = 0;
  }
}
function Kt(a) {
  let t = 0, e = 0;
  const n = (s) => {
    const i = s / 1e3, o = e ? Math.min(i - e, 0.1) : 1 / 60;
    e = i, a(o), t = requestAnimationFrame(n);
  };
  return t = requestAnimationFrame(n), () => cancelAnimationFrame(t);
}
const gt = () => ({ x: 0, y: 0, tx: 1, ty: 0, nx: 0, ny: -1, seg: 0 }), rt = Math.PI / 2, W = Math.PI / 4;
class Vt {
  length = 0;
  radius = 0;
  x0 = 0;
  y0 = 0;
  x1 = 0;
  y1 = 0;
  /** Arc-length positions of the 4 corner midpoints and 4 edge centers. */
  snaps = [];
  segs = [];
  constructor(t, e, n, s) {
    this.build(t, e, n, s);
  }
  build(t, e, n, s) {
    const i = n.left, o = n.top, r = Math.max(i + 2, t - n.right), c = Math.max(o + 2, e - n.bottom), d = E(s, 0, Math.min(r - i, c - o) / 2);
    this.x0 = i, this.y0 = o, this.x1 = r, this.y1 = c, this.radius = d;
    const h = (v, w, y, g) => {
      const S = Math.hypot(y - v, g - w);
      return {
        kind: "line",
        start: 0,
        len: S,
        ax: v,
        ay: w,
        dx: S ? (y - v) / S : 1,
        dy: S ? (g - w) / S : 0
      };
    }, l = (v, w, y) => ({
      kind: "arc",
      start: 0,
      len: rt * d,
      cx: v,
      cy: w,
      a0: y
    }), u = [
      h(i + d, o, r - d, o),
      l(r - d, o + d, -rt),
      h(r, o + d, r, c - d),
      l(r - d, c - d, 0),
      h(r - d, c, i + d, c),
      l(i + d, c - d, rt),
      h(i, c - d, i, o + d),
      l(i + d, o + d, Math.PI)
    ];
    let x = 0;
    for (const v of u)
      v.start = x, x += v.len;
    this.segs = u, this.length = Math.max(x, 1e-6), this.snaps = u.map((v) => v.start + v.len / 2);
  }
  /** Point, tangent and outward normal at arc length s (any real number; wraps). */
  at(t, e = gt()) {
    t = q(t, this.length);
    const n = this.segs;
    let s = 0;
    for (; s < n.length - 1 && t > n[s].start + n[s].len; ) s++;
    const i = n[s], o = t - i.start;
    if (i.kind === "line")
      e.x = i.ax + i.dx * o, e.y = i.ay + i.dy * o, e.tx = i.dx, e.ty = i.dy;
    else {
      const r = i.a0 + (this.radius > 0 ? o / this.radius : 0), c = Math.cos(r), d = Math.sin(r);
      e.x = i.cx + this.radius * c, e.y = i.cy + this.radius * d, e.tx = -d, e.ty = c;
    }
    return e.nx = e.ty, e.ny = -e.tx, e.seg = s, e;
  }
  /** Arc length of the rail point nearest to (px, py), in [0, length). */
  project(t, e) {
    let n = 1 / 0, s = 0;
    for (const i of this.segs) {
      let o, r, c;
      if (i.kind === "line")
        o = E((t - i.ax) * i.dx + (e - i.ay) * i.dy, 0, i.len), r = i.ax + i.dx * o, c = i.ay + i.dy * o;
      else {
        const h = q(Math.atan2(e - i.cy, t - i.cx) - (i.a0 + W) + Math.PI, Math.PI * 2) - Math.PI, l = E(h, -W, W) + W;
        o = l * this.radius, r = i.cx + this.radius * Math.cos(i.a0 + l), c = i.cy + this.radius * Math.sin(i.a0 + l);
      }
      const d = (t - r) ** 2 + (e - c) ** 2;
      d < n && (n = d, s = i.start + o);
    }
    return q(s, this.length);
  }
  /** Shortest signed distance along the rail from a to b, in (-length/2, length/2]. */
  along(t, e) {
    const n = this.length;
    return q(e - t + n / 2, n) - n / 2;
  }
  /** Map a position from this rail onto a rail of a different length, keeping its relative place. */
  static rescale(t, e, n) {
    return e > 0 ? t / e * n : 0;
  }
}
const Wt = (a) => a % 2 === 1, N = (a = 0) => ({ x: a, v: 0 });
function I(a, t, e, n, s) {
  const i = At / Math.max(e, 1e-3);
  a.v += (i * i * (t - a.x) - 2 * n * i * a.v) * s, a.x += a.v * s;
}
function Qt(a) {
  return a.hidden ? "hidden" : a.dragging ? "dragging" : a.sleeping ? "sleeping" : a.locked ? "locked" : a.expanded ? "expanded" : a.curious ? "curious" : "idle";
}
const Zt = {
  hidden: 0,
  dragging: 1.08,
  sleeping: 0.06,
  locked: 0.3,
  expanded: 1,
  curious: 1,
  idle: 1
}, Jt = [0.42, 0.42, 0.46], Q = [0, 0, 0];
class te {
  constructor(t = Math.random) {
    this.rng = t;
  }
  lookX = N();
  lookY = N();
  lid = N(1);
  color = [0.13, 0.83, 0.93];
  targetX = 0;
  targetY = 0;
  nextGlance = 1;
  nextBlink = 2;
  blinkUntil = 0;
  secondBlink = 0;
  step(t, e, n) {
    const s = n.maxLook;
    if (n.mode === "dragging")
      this.targetX = 0, this.targetY = 0;
    else if (n.mode === "sleeping")
      this.targetX = 0, this.targetY = s * 0.45;
    else if (n.mode === "curious" && n.pointerDist > 0) {
      const d = Math.min(1, n.pointerDist / 140) * s / n.pointerDist;
      this.targetX = n.pointerDx * d, this.targetY = n.pointerDy * d, this.nextGlance = e + 1.5;
    } else if (e >= this.nextGlance)
      if (this.nextGlance = e + 2 + this.rng() * 3, this.rng() < 0.7) {
        const d = (n.mode === "locked" || n.mode === "expanded" ? 0.35 : 0.9) * s;
        this.targetX = (this.rng() - 0.5) * 2 * d, this.targetY = (this.rng() - 0.5) * 2 * d;
      } else
        this.targetX = 0, this.targetY = 0;
    I(this.lookX, this.targetX, 0.22, 0.85, t), I(this.lookY, this.targetY, 0.22, 0.85, t);
    const i = Math.hypot(this.lookX.x, this.lookY.x);
    i > s && i > 0 && (this.lookX.x *= s / i, this.lookY.x *= s / i);
    const o = n.mode !== "sleeping" && n.mode !== "dragging" && n.mode !== "hidden";
    o && e >= this.nextBlink && (this.blinkUntil = e + 0.11, this.secondBlink = this.rng() < 0.25 ? e + 0.27 : 0, this.nextBlink = e + 2.6 + this.rng() * 4), this.secondBlink && e >= this.secondBlink && (this.blinkUntil = e + 0.1, this.secondBlink = 0);
    let r = Zt[n.mode];
    o && e < this.blinkUntil && (r = 0.06), n.visible || (r = 0), I(this.lid, r, 0.12, 0.75, t), this.lid.x = E(this.lid.x, 0, 1.2);
    let c = n.pupil;
    n.mode === "dragging" || n.mode === "expanded" ? c = n.interaction : n.mode === "locked" ? c = Jt : n.mode === "sleeping" && (Q[0] = n.pupil[0] * 0.1, Q[1] = n.pupil[1] * 0.05, Q[2] = n.pupil[2] * 0.2, c = Q), _t(this.color, c, ut(3, t));
  }
}
class ee {
  constructor(t = 16, e = Math.random) {
    this.capacity = t, this.rng = e, this.items = Array.from({ length: t }, () => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0 }));
  }
  items;
  next = 0;
  /** Burst `count` droplets from (x, y). `speed` and `size` scale the defaults; (bx, by) adds a drift. */
  splash(t, e, n, s = 1, i = 1, o = 0, r = 0) {
    for (let c = 0; c < n; c++) {
      const d = this.items[this.next], h = this.rng() * At, l = (240 + this.rng() * 480) * s;
      d.x = t, d.y = e, d.vx = Math.cos(h) * l + o, d.vy = Math.sin(h) * l + r, d.r = (2 + this.rng() * 5) * i, this.next = (this.next + 1) % this.capacity;
    }
  }
  step(t) {
    const e = Math.exp(-3.1 * t), n = Math.exp(-5 * t);
    for (const s of this.items) {
      if (s.r < 0.3) {
        s.r = 0;
        continue;
      }
      s.vy += 1400 * t, s.vx *= e, s.vy *= e, s.x += s.vx * t, s.y += s.vy * t, s.r *= n;
    }
  }
  get alive() {
    let t = 0;
    for (const e of this.items) e.r > 0.3 && t++;
    return t;
  }
}
const ne = {
  compact: { w: 360, h: 460 },
  focus: { w: 760, h: 600 }
}, se = 22, ie = 18, Z = 16, bt = 60;
function oe(a, t, e, n = { x: 0, y: 0, hw: 0, hh: 0, r: 0 }) {
  const s = e.x0 + Z, i = e.y0 + Z, o = e.x1 - Z, r = e.y1 - Z, c = ne[a], d = Math.max(bt, Math.min(c.w, o - s) / 2), h = Math.max(bt, Math.min(c.h, r - i) / 2);
  let l, u;
  if (a === "focus")
    l = (s + o) / 2, u = (i + r) / 2;
  else {
    const x = t.r + ie + Math.abs(t.nx) * d + Math.abs(t.ny) * h;
    l = t.x - t.nx * x, u = t.y - t.ny * x;
  }
  return n.x = o - s >= 2 * d ? E(l, s + d, o - d) : (s + o) / 2, n.y = r - i >= 2 * h ? E(u, i + h, r - h) : (i + r) / 2, n.hw = d, n.hh = h, n.r = se, n;
}
class ae {
  /** Drone whose pod is open, or -1 while closing / closed. */
  index = -1;
  /** Drone the shape currently belongs to (it melts back into this one). -1 when nothing is shown. */
  owner = -1;
  mode = "compact";
  x = N();
  y = N();
  hw = N();
  hh = N();
  r = N();
  prev = { x: 0, y: 0, hw: 0, hh: 0, r: 0 };
  /** Where the shape is heading. */
  target = { x: 0, y: 0, hw: 0, hh: 0, r: 0 };
  /** 0..1: how fully the pod has opened onto its target (content fades in with this). */
  settled = 0;
  get open() {
    return this.index >= 0;
  }
  get visible() {
    return this.owner >= 0;
  }
  /** Jump the shape to a circle (where a drone is), with no motion. */
  startFrom(t, e, n) {
    for (const [s, i] of [
      [this.x, t],
      [this.y, e],
      [this.hw, n],
      [this.hh, n],
      [this.r, n]
    ])
      s.x = i, s.v = 0;
    this.snapshot();
  }
  snapshot() {
    this.prev.x = this.x.x, this.prev.y = this.y.x, this.prev.hw = this.hw.x, this.prev.hh = this.hh.x, this.prev.r = this.r.x;
  }
  step(t, e) {
    const n = this.target, s = this.open, i = e ? 0.2 : s ? 0.36 : 0.26, o = e ? 1 : s ? 0.8 : 1;
    if (I(this.x, n.x, i, o, t), I(this.y, n.y, i, o, t), I(this.hw, n.hw, i, o, t), I(this.hh, n.hh, i, o, t), I(this.r, n.r, i, o, t), this.hw.x = Math.max(0, this.hw.x), this.hh.x = Math.max(0, this.hh.x), this.r.x = E(this.r.x, 0, Math.min(this.hw.x, this.hh.x)), s) {
      const r = Math.abs(this.x.x - n.x) + Math.abs(this.y.x - n.y), c = Math.min(this.hw.x / n.hw, this.hh.x / n.hh);
      this.settled = E(1 - r / 60, 0, 1) * E((c - 0.75) / 0.25, 0, 1);
    } else
      this.settled = 0, this.owner >= 0 && this.hw.x <= n.hw + 1 && this.hh.x <= n.hh + 1 && Math.abs(this.x.x - n.x) < 2 && (this.owner = -1);
  }
}
const H = 8, re = 4, le = 30, de = 0.22, ce = 250, vt = 4e3, he = 7;
function lt(a, t = !1, e = re) {
  const n = E(a.springStiffness, 1, 100) / 100, s = !!a.reduceMotion || t, i = 0.3 + 0.5 * (E(a.dragFriction, 0, 100) / 100);
  return {
    coreSize: E(a.coreSize, 6, 80),
    satelliteSize: E(a.satelliteSize, 4, 60),
    satelliteCount: E(Math.round(e), 0, H),
    satelliteSpacing: E(a.satelliteSpacing || 60, 20, 200),
    response: 0.6 - 0.45 * Math.sqrt(n),
    // default 15 → ~0.43 s
    damping: s ? Math.max(1, i) : i,
    wobble: s ? 0 : E(a.wobbleIntensity, 0, 100) / 100,
    hasEyes: a.hasEyes,
    snapCorners: a.snapCorners,
    snapEdges: a.snapEdges,
    magneticRadius: E(a.magneticRadius, 0, 1e3),
    reducedMotion: s
  };
}
const wt = (a = 0, t = 0) => ({ s: N(a), r: N(t), prevS: a, prevR: t });
class pe {
  constructor(t, e, n = Nt(Date.now() & 65535)) {
    this.rail = t, this.rng = n, this.params = e, this.particles = new ee(16, n), this.eyeState = new te(n);
    const s = t.snaps[3];
    this.home = s, this.eye.s.x = this.eye.prevS = s, this.eye.r.x = this.eye.prevR = 0, this.eye.r.v = e.reducedMotion ? 0 : 60;
    for (const i of this.sats) i.s.x = i.prevS = s;
  }
  eye = wt();
  /** Bulge off the rail toward a hovering pointer (visual only, px along the outward normal). */
  bulge = N();
  prevBulge = 0;
  sats = Array.from({ length: H }, () => wt());
  particles;
  eyeState;
  /** The glass panel that oozes out of a drone. */
  pod = new ae();
  params;
  /** Where the eye rests when nobody is touching it. */
  home = 0;
  mode = "idle";
  expanded = !1;
  locked = !1;
  pressed = !1;
  dragging = !1;
  sleeping = !1;
  hidden = !1;
  hovered = !1;
  t = 0;
  /** Colors in, set by the engine (already circadian-shifted when that's on). */
  colors = {
    goo: [0.31, 0.27, 0.9],
    interaction: [1, 0.24, 0.31],
    pupil: [0.13, 0.83, 0.93]
  };
  /** Current goo color, eased toward its target. */
  gooColor = [0.31, 0.27, 0.9];
  lastInteract = 0;
  hiddenUntil = 0;
  pointerX = -1e5;
  pointerY = -1e5;
  dragTarget = 0;
  dragOffset = 0;
  hist = Array.from({ length: 8 }, () => ({ t: 0, s: 0 }));
  histN = 0;
  lastSeg = -1;
  lastSplash = -1;
  pt = gt();
  rng;
  // ───────────── input ─────────────
  /** Any sign of life: resets the sleep timer and wakes the eye. */
  interact() {
    this.lastInteract = this.t, this.sleeping = !1;
  }
  pointerMove(t, e) {
    this.pointerX = t, this.pointerY = e, this.interact();
  }
  pointerLeave() {
    this.pointerX = this.pointerY = -1e5;
  }
  press() {
    this.pressed = !0, this.interact(), this.splashAtEye(4, 0.6);
  }
  release() {
    this.pressed = !1;
  }
  dragStart(t, e) {
    this.locked || (this.closePod(), this.dragging = !0, this.hidden = !1, this.dragTarget = this.eye.s.x, this.dragOffset = this.rail.along(this.rail.project(t, e), this.eye.s.x), this.histN = 0);
  }
  dragMove(t, e, n) {
    if (!this.dragging) return;
    const s = this.rail.project(t, e) + this.dragOffset;
    this.dragTarget += this.rail.along(this.dragTarget, s);
    const i = this.hist[this.histN % this.hist.length];
    i.t = n, i.s = this.dragTarget, this.histN++, this.interact();
  }
  /** Release after a drag: glide on with the release speed, then settle on a nearby snap point. */
  dragEnd(t) {
    if (!this.dragging) return;
    this.dragging = !1;
    const e = E(this.releaseVelocity(t), -vt, vt), n = Math.sign(e) * Math.max(0, Math.abs(e) - ce) * de;
    if (this.home = this.snapNear(this.dragTarget + n), Math.abs(e) > 600) {
      const s = this.rail.at(this.eye.s.x, this.pt);
      this.splash(s.x, s.y, 8, 1 + Math.abs(e) / 3e3, 1, s.tx * e * 0.2, s.ty * e * 0.2);
    }
  }
  /** Single tap: bring a hidden eye back, otherwise release or recall the satellites. */
  tap() {
    if (this.hidden) {
      this.show();
      return;
    }
    this.toggleExpanded();
  }
  /** Double tap: lock in place (or unlock). */
  doubleTap() {
    this.toggleLocked();
  }
  toggleExpanded() {
    this.interact(), this.hidden = !1, this.expanded = !this.expanded, this.eye.r.v -= 70 * this.impulse, this.splashAtEye(4, 0.4);
    for (let t = 0; t < this.params.satelliteCount; t++) this.splashAtSat(t, this.expanded ? 3 : 2, 0.45);
  }
  setExpanded(t) {
    this.expanded !== t && this.toggleExpanded();
  }
  toggleLocked() {
    this.interact(), this.locked = !this.locked, this.eye.r.v -= 90 * this.impulse, this.splashAtEye(6, 0.8);
    for (let t = 0; t < this.params.satelliteCount; t++) this.splashAtSat(t, 3, 0.5);
  }
  /** Tuck the eye away as a small dot for `seconds`; a tap (or the time running out) brings it back. */
  hide(t = 3600) {
    this.interact(), this.hidden = !0, this.expanded = !1, this.hiddenUntil = this.t + t, this.splashAtEye(5, 0.5);
  }
  show() {
    this.hidden && (this.interact(), this.hidden = !1, this.eye.r.v += 120 * this.impulse, this.splashAtEye(5, 0.6));
  }
  /** Keyboard: move the resting spot along the rail by `ds` px (no snapping). */
  nudge(t) {
    this.locked || (this.interact(), this.home += t);
  }
  /** Keyboard: jump to the next snap point in a direction (+1 clockwise, -1 counter-clockwise). */
  jumpToSnap(t) {
    if (this.locked) return;
    this.interact();
    const e = this.rail.length;
    let n = 1 / 0;
    for (const s of this.snapPoints(!0)) {
      const i = t > 0 ? q(s - this.home, e) : q(this.home - s, e);
      i > 4 && i < n && (n = i);
    }
    n < 1 / 0 && (this.home += t * n);
  }
  // ───────────── pods ─────────────
  /** Open drone i's pod (releasing the drones first if needed). Opening another drone morphs the pod over. */
  openPod(t) {
    if (t < 0 || t >= this.params.satelliteCount) return;
    this.interact(), this.hidden && this.show(), this.expanded || this.toggleExpanded();
    const e = this.pod;
    if (e.index === t) return;
    if (!e.visible) {
      const s = this.rail.at(this.sats[t].s.x, this.pt);
      e.startFrom(s.x, s.y, Math.max(this.sats[t].r.x, 4));
    }
    e.index = t, e.owner = t, this.updatePodTarget(), this.sats[t].r.v += 120 * this.impulse;
    const n = this.rail.at(this.sats[t].s.x, this.pt);
    this.splash(n.x, n.y, 4, 0.5, 0.9, -n.nx * 200, -n.ny * 200);
  }
  closePod() {
    this.pod.index = -1, this.pod.mode = "compact";
  }
  setPodMode(t) {
    this.pod.mode = t, this.updatePodTarget();
  }
  /** Where drone i comes to rest (no sway), used to anchor its pod so the panel doesn't wander. */
  droneAnchor(t, e = { x: 0, y: 0, nx: 0, ny: 0, r: 0 }) {
    const n = this.rail.at(this.home - (t + 1) * this.params.satelliteSpacing, this.pt);
    return e.x = n.x, e.y = n.y, e.nx = n.nx, e.ny = n.ny, e.r = this.params.satelliteSize * 1.18, e;
  }
  anchor = { x: 0, y: 0, nx: 0, ny: 0, r: 0 };
  updatePodTarget() {
    const t = this.pod;
    if (t.open) {
      const { x0: e, y0: n, x1: s, y1: i } = this.rail;
      oe(t.mode, this.droneAnchor(t.index, this.anchor), { x0: e, y0: n, x1: s, y1: i }, t.target);
    } else if (t.owner >= 0) {
      const e = this.sats[t.owner], n = this.rail.at(e.s.x, this.pt), s = Math.max(e.r.x, 2);
      t.target.x = n.x, t.target.y = n.y, t.target.hw = s, t.target.hh = s, t.target.r = s;
    }
  }
  /** A satellite was clicked: it recoils. */
  punch(t) {
    const e = this.sats[t];
    e && (this.interact(), e.r.v -= 160 * this.impulse, this.splashAtSat(t, 4, 1));
  }
  /** Enabled snap points (arc lengths). With `fallbackToAll`, every corner and edge center if none are enabled. */
  snapPoints(t = !1) {
    const e = [];
    return this.rail.snaps.forEach((n, s) => {
      const i = s % 2 === 1;
      (i && this.params.snapCorners || !i && this.params.snapEdges) && e.push(n);
    }), e.length || !t ? e : [...this.rail.snaps];
  }
  /** The nearest enabled snap point within the magnetic radius of `s` (unwrapped near s), or s itself. */
  snapNear(t) {
    let e = 1 / 0, n = t;
    for (const s of this.snapPoints()) {
      const i = this.rail.along(t, s);
      Math.abs(i) < Math.abs(e) && (e = i, n = t + i);
    }
    return Math.abs(e) <= this.params.magneticRadius ? n : t;
  }
  // ───────────── simulation ─────────────
  step(t) {
    this.t += t;
    const e = this.t, n = this.params, s = this.eye, i = n.reducedMotion;
    s.prevS = s.s.x, s.prevR = s.r.x, this.prevBulge = this.bulge.x;
    for (const g of this.sats)
      g.prevS = g.s.x, g.prevR = g.r.x;
    this.hidden && e >= this.hiddenUntil && this.show(), !this.sleeping && !this.pressed && !this.hidden && !this.pod.open && e - this.lastInteract > le && (this.sleeping = !0);
    const o = this.rail.at(s.s.x, this.pt), r = o.x + o.nx * this.bulge.x, c = o.y + o.ny * this.bulge.x, d = this.pointerX - r, h = this.pointerY - c, l = Math.hypot(d, h);
    if (this.hovered = !this.dragging && l < n.coreSize * 2.2, this.mode = Qt({
      hidden: this.hidden,
      dragging: this.dragging,
      sleeping: this.sleeping,
      locked: this.locked,
      expanded: this.expanded,
      curious: l < 220
    }), this.dragging)
      I(s.s, this.dragTarget, 0.1, 0.95, t);
    else {
      let g = this.home;
      if (this.sleeping)
        g += o.ty * 8;
      else if (this.hovered && !this.locked && !this.hidden) {
        const S = this.rail.along(this.home, this.rail.project(this.pointerX, this.pointerY));
        g += E(S * 0.25, -n.coreSize, n.coreSize);
      } else !this.locked && !this.expanded && !this.hidden && !i && (g += Math.sin(e * 1.5) * 5);
      I(s.s, g, n.response, n.damping, t);
    }
    let u = n.coreSize;
    this.hidden ? u = he : this.sleeping ? u *= 0.9 : this.pressed && !this.locked && (u *= 0.85), I(s.r, u, 0.32, this.radiusDamping, t);
    const x = this.hovered && !this.locked && !this.hidden && !i ? E((d * o.nx + h * o.ny) * 0.2, -9, 2) : 0;
    I(this.bulge, x, 0.3, 0.6, t);
    const v = this.expanded && !this.sleeping && !this.hidden, w = i ? 1 : 0.72;
    for (let g = 0; g < H; g++) {
      const S = this.sats[g], T = g + 1;
      if (v && g < n.satelliteCount) {
        const R = i || this.pod.open ? 0 : Math.sin(e * 1.5 + T) * 4;
        I(S.s, s.s.x - T * n.satelliteSpacing + R, n.response * 0.7 + T * 0.04, w, t);
        const O = this.pod.index === g ? 1.18 : 1;
        I(S.r, n.satelliteSize * O, 0.3, this.radiusDamping + 0.05, t);
        const D = g === 0 ? s.s.x : this.sats[g - 1].s.x, k = S.s.x - D, M = n.satelliteSpacing * 1.2;
        Math.abs(k) > M && (S.s.x = D + Math.sign(k) * M);
      } else
        I(S.s, s.s.x, 0.16, 0.95, t), I(S.r, 0, 0.22, 0.9, t);
      S.r.x < 0 && (S.r.x = 0, S.r.v = Math.max(0, S.r.v));
    }
    if (o.seg !== this.lastSeg && (Wt(o.seg) && Math.abs(s.s.v) > 150 && e - this.lastSplash > 0.35 && !this.sleeping && (this.splash(o.x, o.y, 6, 0.9, 1, o.tx * s.s.v * 0.3, o.ty * s.s.v * 0.3), this.lastSplash = e), this.lastSeg = o.seg), !this.sleeping && !this.dragging && !this.hidden && !i && (this.rng() < 0.3 * t && (s.r.v += (60 + this.rng() * 60) * this.impulse), this.expanded))
      for (let g = 0; g < n.satelliteCount; g++)
        this.rng() < 0.18 * t && (this.sats[g].r.v += (80 + this.rng() * 80) * this.impulse);
    this.particles.step(t);
    const y = this.pod;
    y.snapshot(), y.open && (this.dragging || this.hidden || this.sleeping || !this.expanded) && this.closePod(), y.visible && ((!y.open || y.target.hw === 0) && this.updatePodTarget(), y.step(t, i)), this.eyeState.step(t, e, {
      mode: this.mode,
      pointerDx: d,
      pointerDy: h,
      pointerDist: l,
      maxLook: n.coreSize * 0.27,
      visible: n.hasEyes && !this.hidden,
      pupil: this.colors.pupil,
      interaction: this.colors.interaction
    }), _t(this.gooColor, this.dragging ? this.colors.interaction : this.colors.goo, ut(6, t));
  }
  /** Swap in a rail of a different size (window resize), keeping everything in the same relative place. */
  setRail(t) {
    const e = t.length / this.rail.length, n = (s) => {
      s.s.x *= e, s.s.v *= e, s.prevS *= e;
    };
    n(this.eye), this.sats.forEach(n), this.home *= e, this.dragTarget *= e, this.rail = t, this.pod.open && this.updatePodTarget();
  }
  // ───────────── helpers ─────────────
  get radiusDamping() {
    return this.params.reducedMotion ? 1 : 0.7 - 0.5 * this.params.wobble;
  }
  get impulse() {
    return this.params.reducedMotion ? 0 : 0.4 + this.params.wobble * 1.5;
  }
  releaseVelocity(t) {
    const e = Math.min(this.histN, this.hist.length);
    if (e < 2) return 0;
    const n = this.hist[(this.histN - 1) % this.hist.length];
    let s = n;
    for (let o = 2; o <= e; o++) {
      const r = this.hist[(this.histN - o) % this.hist.length];
      if (n.t - r.t > 0.1) break;
      s = r;
    }
    const i = n.t - s.t;
    return i < 8e-3 || t - n.t > 0.08 ? 0 : (n.s - s.s) / i;
  }
  splash(t, e, n, s = 1, i = 1, o = 0, r = 0) {
    this.params.reducedMotion || this.particles.splash(t, e, n, s, i, o, r);
  }
  splashAtEye(t, e) {
    const n = this.rail.at(this.eye.s.x, this.pt);
    this.splash(n.x, n.y, t, e);
  }
  splashAtSat(t, e, n) {
    const s = this.rail.at(this.sats[t].s.x, this.pt);
    this.splash(s.x, s.y, e, n);
  }
}
const V = 40, It = 30, B = 2, dt = 48;
class ue {
  constructor(t, e, n = {}) {
    this.dom = t, this.getConfig = e, this.events = n, this.config = e(), this.width = window.innerWidth, this.height = window.innerHeight;
    const s = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (this.systemReducedMotion = !!s?.matches, this.sim = new pe(this.buildRail(), lt(this.config, this.systemReducedMotion)), this.renderer = new Bt(t.canvas), t.root.dataset.gl = this.renderer.ok ? "on" : "off", this.resize(), this.updateColors(!0), this.gestures = new Gt({
      onPress: () => {
        this.sim.press(), t.eye.dataset.hold = "on";
      },
      onRelease: () => {
        this.sim.release(), delete t.eye.dataset.hold;
      },
      onTap: () => this.sim.tap(),
      onDoubleTap: () => this.sim.doubleTap(),
      onLongPress: () => {
        delete t.eye.dataset.hold, this.openMenu();
      },
      onDragStart: (i, o) => {
        delete t.eye.dataset.hold, this.sim.dragStart(i, o);
      },
      onDragMove: (i, o, r) => this.sim.dragMove(i, o, r),
      onDragEnd: (i, o, r) => this.sim.dragEnd(r)
    }), this.bindInput(), s) {
      const i = () => {
        this.systemReducedMotion = s.matches, this.sim.params = lt(this.config, this.systemReducedMotion);
      };
      s.addEventListener("change", i), this.cleanups.push(() => s.removeEventListener("change", i));
    }
  }
  sim;
  renderer;
  stepper = new Ht(1 / 120);
  gestures;
  cleanups = [];
  pt = gt();
  circles = Array.from({ length: H + 1 }, () => ({
    x: 0,
    y: 0,
    r: 0
  }));
  config;
  colorsAt = -1;
  railOpacity = 0;
  stopLoop = null;
  width = 0;
  height = 0;
  systemReducedMotion = !1;
  a11yKey = "";
  podKey = "";
  box = { x: 0, y: 0, hw: 0, hh: 0, r: 0 };
  // ───────────── commands (quick menu, keyboard) ─────────────
  toggleExpanded() {
    this.sim.toggleExpanded();
  }
  toggleLocked() {
    this.sim.toggleLocked();
  }
  hide(t) {
    this.sim.hide(t);
  }
  openPod(t) {
    this.sim.openPod(t);
  }
  /** Close the pod; with `refocus`, hand focus back to the drone it came from. */
  closePod(t = !1) {
    const e = this.sim.pod.index;
    this.sim.closePod(), t && e >= 0 && this.dom.satellites[e]?.focus({ preventScroll: !0 });
  }
  togglePodMode() {
    const t = this.sim.pod;
    t.open && this.sim.setPodMode(t.mode === "compact" ? "focus" : "compact");
  }
  focusEye() {
    this.dom.eye.focus({ preventScroll: !0 });
  }
  /** The eye's current center and the rail's outward normal there. */
  menuAnchor() {
    const t = this.sim.rail.at(this.sim.eye.s.x, this.pt);
    return { x: t.x, y: t.y, nx: t.nx, ny: t.ny, radius: Math.max(this.sim.eye.r.x, 8) };
  }
  openMenu() {
    this.sim.interact(), this.events.onMenu?.(this.menuAnchor());
  }
  start() {
    this.stopLoop || (this.stepper.reset(), this.stopLoop = Kt((t) => this.frame(t)));
  }
  destroy() {
    this.stopLoop?.(), this.stopLoop = null, this.gestures.dispose();
    for (const t of this.cleanups) t();
    this.cleanups.length = 0;
  }
  // ───────────── frame ─────────────
  frame(t) {
    const e = this.getConfig();
    e !== this.config ? (this.config = e, this.sim.params = lt(e, this.systemReducedMotion), this.updateColors(!0)) : this.updateColors(!1), this.gestures.dragEnabled = !this.sim.locked;
    const n = this.stepper.advance(t, (s) => this.sim.step(s));
    this.render(n, t), this.syncA11y(), this.syncPod();
  }
  /** Tell React when the pod opens, closes, switches drone or changes size. */
  syncPod() {
    const t = this.sim.pod, e = `${t.index}|${t.mode}`;
    e !== this.podKey && (this.podKey = e, this.events.onPod?.({ index: t.index, mode: t.mode }));
  }
  /** Keep focusability and labels in step with the eye's state (only touches the DOM on change). */
  syncA11y() {
    const { sim: t, dom: e } = this, n = `${t.expanded}|${t.locked}|${t.hidden}|${t.params.satelliteCount}|${t.pod.index}`;
    if (n === this.a11yKey) return;
    this.a11yKey = n;
    const s = t.expanded && !t.hidden;
    e.eye.setAttribute("aria-expanded", String(s));
    const i = t.hidden ? "Hidden. " : t.locked ? "Locked. " : "";
    e.eye.setAttribute(
      "aria-label",
      `noUI eye. ${i}Enter: ${s ? "recall" : "release"} satellites. Arrows: move along the rail. L: lock. M: menu.`
    ), e.satellites.forEach((o, r) => {
      const c = s && r < t.params.satelliteCount;
      o.tabIndex = c ? 0 : -1, o.setAttribute("aria-hidden", String(!c)), o.setAttribute("aria-expanded", String(t.pod.index === r)), t.pod.index === r ? o.dataset.active = "on" : delete o.dataset.active;
    });
  }
  render(t, e) {
    const { sim: n, dom: s, config: i } = this, o = n.params, r = n.eye, c = U(r.prevS, r.s.x, t), d = Math.max(0, U(r.prevR, r.r.x, t)), h = U(n.prevBulge, n.bulge.x, t), l = n.rail.at(c, this.pt), u = l.x + l.nx * h, x = l.y + l.ny * h;
    this.circles[0].x = u, this.circles[0].y = x, this.circles[0].r = d;
    const v = o.coreSize, w = n.hidden ? 1 : d / v;
    s.eye.style.transform = `translate3d(${u - v}px,${x - v}px,0) scale(${w.toFixed(4)})`;
    const y = n.eyeState;
    s.sclera.style.transform = `scaleY(${Math.max(0.02, y.lid.x).toFixed(3)})`, s.sclera.style.visibility = o.hasEyes && y.lid.x > 0.03 ? "visible" : "hidden";
    const g = yt(y.color);
    s.pupil.style.transform = `translate3d(${y.lookX.x.toFixed(2)}px,${y.lookY.x.toFixed(2)}px,0)`, s.pupil.style.backgroundColor = g, s.pupil.style.boxShadow = `0 0 12px ${yt(y.color, 0.8)}`;
    const S = o.satelliteSize;
    for (let k = 0; k < H; k++) {
      const M = n.sats[k], A = this.circles[k + 1], Y = s.satellites[k];
      if (k >= o.satelliteCount && M.r.x <= 0.5) {
        A.r = 0;
        continue;
      }
      const z = n.rail.at(U(M.prevS, M.s.x, t), this.pt), K = Math.max(0, U(M.prevR, M.r.x, t));
      if (A.x = z.x, A.y = z.y, A.r = K, !Y) continue;
      const _ = Math.hypot(z.x - u, z.y - x), b = E((_ - 15) / 35, 0, 1) * E(K / S, 0, 1);
      Y.style.transform = `translate3d(${z.x - S}px,${z.y - S}px,0) scale(${E(K / S, 0, 1.4).toFixed(3)})`, Y.style.opacity = b.toFixed(3), Y.style.pointerEvents = n.expanded && !n.sleeping && !n.hidden && b > 0.8 ? "auto" : "none";
    }
    let T = 0;
    i.railVisible && !n.sleeping && !n.hidden && (T = i.railReacts ? n.dragging ? 1 : n.mode === "curious" || n.hovered ? 0.25 : 0.06 : 0.5), this.railOpacity += (T - this.railOpacity) * ut(6, e);
    const R = i.railReacts && n.dragging && !o.reducedMotion ? 0.75 + Math.sin(n.t * 15) * 0.25 : 1, O = Math.atan2(u - this.width / 2, -(x - this.height / 2)) * 180 / Math.PI;
    s.rail.style.opacity = (this.railOpacity * R).toFixed(3), s.rail.style.setProperty("--rail-angle", `${O.toFixed(1)}deg`);
    const D = this.renderPod(t);
    this.renderer.ok && this.renderer.draw(
      this.circles,
      n.particles.items,
      n.gooColor,
      i.blobViscosity,
      // how far apart blobs still melt together (px), same scale as the original
      i.blobOpacity,
      D
    );
  }
  /**
   * Place the pod: the goo draws the animated shape; the glass shell follows it (inset a little so the
   * goo rim shows); the content stays put at the open size and is revealed as the shell grows.
   */
  renderPod(t) {
    const { sim: e, dom: n } = this, s = e.pod;
    if (!s.visible)
      return n.podShell.style.display !== "none" && (n.podShell.style.display = "none"), null;
    const i = this.box;
    i.x = U(s.prev.x, s.x.x, t), i.y = U(s.prev.y, s.y.x, t), i.hw = U(s.prev.hw, s.hw.x, t), i.hh = U(s.prev.hh, s.hh.x, t), i.r = U(s.prev.r, s.r.x, t);
    const o = n.podShell.style, r = Math.max(0, 2 * (i.hw - B)), c = Math.max(0, 2 * (i.hh - B)), d = i.x - i.hw + B, h = i.y - i.hh + B;
    o.display = "block", o.transform = `translate3d(${d.toFixed(2)}px,${h.toFixed(2)}px,0)`, o.width = `${r.toFixed(2)}px`, o.height = `${c.toFixed(2)}px`, o.borderRadius = `${Math.max(0, i.r - B).toFixed(2)}px`, o.pointerEvents = s.open && s.settled > 0.5 ? "auto" : "none";
    const l = s.target, u = n.podContent.style;
    return u.width = `${2 * (l.hw - B)}px`, u.height = `${2 * (l.hh - B)}px`, u.transform = `translate3d(${(l.x - l.hw + B - d).toFixed(2)}px,${(l.y - l.hh + B - h).toFixed(2)}px,0)`, u.opacity = s.settled.toFixed(3), i;
  }
  /** Feed colors to the sim. With circadian sync on, recompute once a second. */
  updateColors(t) {
    const e = performance.now();
    if (!t && (!this.config.atmosphericSync || e - this.colorsAt < 1e3)) return;
    this.colorsAt = e;
    const n = this.config, s = (o) => n.atmosphericSync ? Yt(xt(o), Xt(/* @__PURE__ */ new Date())) : xt(o), i = this.sim.colors;
    i.goo = s(n.gooColor), i.interaction = s(n.interactionColor), i.pupil = s(n.pupilColor);
  }
  // ───────────── input & sizing ─────────────
  bindInput() {
    const { eye: t, satellites: e } = this.dom, n = () => performance.now() / 1e3, s = (o, r, c, d) => {
      o.addEventListener(r, c, d), this.cleanups.push(() => o.removeEventListener(r, c, d));
    }, i = (o) => (r) => o(r);
    s(
      t,
      "pointerdown",
      i((o) => {
        o.pointerType === "mouse" && o.button !== 0 || (o.preventDefault(), t.setPointerCapture(o.pointerId), this.gestures.down(o.clientX, o.clientY));
      })
    ), s(
      t,
      "pointermove",
      i((o) => this.gestures.move(o.clientX, o.clientY, n()))
    ), s(
      t,
      "pointerup",
      i((o) => {
        t.hasPointerCapture(o.pointerId) && t.releasePointerCapture(o.pointerId), this.gestures.up(o.clientX, o.clientY, n());
      })
    ), s(t, "pointercancel", () => this.gestures.cancel(n())), s(t, "lostpointercapture", () => this.gestures.cancel(n())), s(t, "contextmenu", (o) => {
      o.preventDefault(), this.gestures.cancel(n()), this.openMenu();
    }), s(t, "keydown", (o) => this.onEyeKey(o)), e.forEach(
      (o, r) => s(o, "click", () => {
        this.sim.pod.index === r ? this.closePod() : this.openPod(r);
      })
    ), s(
      window,
      "pointerdown",
      (o) => {
        if (!this.sim.pod.open) return;
        const r = o.target;
        !!r && (this.dom.podShell.contains(r) || this.dom.eye.contains(r) || e.some((d) => d.contains(r)) || !!r.closest?.(".noui-menu")) || this.closePod();
      },
      { capture: !0 }
    ), s(
      window,
      "pointermove",
      i((o) => this.sim.pointerMove(o.clientX, o.clientY)),
      { passive: !0 }
    ), s(document, "pointerleave", () => this.sim.pointerLeave()), s(window, "blur", () => this.sim.pointerLeave()), s(window, "keydown", (o) => {
      this.sim.interact(), !(o.key !== "Escape" || o.defaultPrevented) && (this.sim.pod.open ? this.closePod() : this.sim.expanded && this.sim.setExpanded(!1));
    }), s(window, "resize", () => this.resize());
  }
  /**
   * Keyboard on the focused eye. Arrows move it in the direction pressed (along whatever edge it is on);
   * Shift+arrow jumps to the next corner or edge center.
   */
  onEyeKey(t) {
    const e = this.sim, s = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1]
    }[t.key];
    if (s) {
      t.preventDefault();
      const i = this.railDirection(s[0], s[1]);
      if (!i) return;
      t.shiftKey ? e.jumpToSnap(i) : e.nudge(i * dt);
      return;
    }
    switch (t.key) {
      case "Enter":
      case " ":
        t.preventDefault(), t.repeat || e.tap();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        this.openPod(Number(t.key) - 1);
        break;
      case "l":
      case "L":
        e.toggleLocked();
        break;
      case "m":
      case "M":
      case "ContextMenu":
        t.preventDefault(), this.openMenu();
        break;
      case "F10":
        t.shiftKey && (t.preventDefault(), this.openMenu());
        break;
    }
  }
  /** Which way along the rail (+1 / -1, or 0 for neither) moves the eye toward screen direction (kx, ky). */
  railDirection(t, e) {
    const { rail: n } = this.sim, s = this.sim.home, i = n.at(s), o = i.x, r = i.y, c = (l) => {
      const u = n.at(s + l);
      return (u.x - o) * t + (u.y - r) * e;
    }, d = c(dt), h = c(-dt);
    return Math.max(d, h) < 1 ? 0 : d >= h ? 1 : -1;
  }
  buildRail() {
    const t = getComputedStyle(this.dom.safeArea), e = (n) => parseFloat(n) || 0;
    return new Vt(
      this.width,
      this.height,
      {
        top: V + e(t.paddingTop),
        right: V + e(t.paddingRight),
        bottom: V + e(t.paddingBottom),
        left: V + e(t.paddingLeft)
      },
      It
    );
  }
  resize() {
    this.width = window.innerWidth, this.height = window.innerHeight, this.sim.setRail(this.buildRail()), this.renderer.resize(this.width, this.height, Math.min(window.devicePixelRatio || 1, 2));
  }
}
const ge = {
  dragFriction: 92,
  springStiffness: 15,
  wobbleIntensity: 40,
  snapCorners: !0,
  snapEdges: !1,
  magneticRadius: 180,
  railVisible: !0,
  railReacts: !0,
  bgTheme: "Deep Space",
  blobTheme: "Default",
  hasEyes: !0,
  atmosphericSync: !1,
  blobOpacity: 0,
  gooColor: "#4f46e5",
  // indigo-600
  interactionColor: "#ff3c50",
  pupilColor: "#22d3ee",
  // cyan 400
  blobViscosity: 35,
  coreSize: 24,
  // smaller than 30
  satelliteSize: 18,
  satelliteSpacing: 60,
  reduceMotion: !1
}, pt = {
  Snappy: { springStiffness: 45, dragFriction: 95, wobbleIntensity: 25 },
  Smooth: { springStiffness: 15, dragFriction: 92, wobbleIntensity: 40 },
  Bouncy: { springStiffness: 25, dragFriction: 55, wobbleIntensity: 75 },
  Heavy: { springStiffness: 5, dragFriction: 98, wobbleIntensity: 20 }
};
function fe(a) {
  for (const [t, e] of Object.entries(pt))
    if (a.springStiffness === e.springStiffness && a.dragFriction === e.dragFriction && a.wobbleIntensity === e.wobbleIntensity)
      return t;
  return null;
}
function p(a, t = {}, ...e) {
  const n = document.createElement(a);
  for (const [s, i] of Object.entries(t))
    i === void 0 || i === !1 || (s === "class" ? n.className = String(i) : n.setAttribute(s, i === !0 ? "" : i));
  for (const s of e)
    s === null || s === !1 || s === void 0 || n.append(s);
  return n;
}
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const me = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", key: "1oijnt" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5", key: "cereej" }],
  ["path", { d: "M4 13.5V6a2 2 0 0 1 2-2h2", key: "5ua5vh" }],
  [
    "path",
    {
      d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
      key: "1y4qbx"
    }
  ]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const xe = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ye = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const be = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ve = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const we = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ke = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Me = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Se = [
  ["path", { d: "m14 10 7-7", key: "oa77jy" }],
  ["path", { d: "M20 10h-6V4", key: "mjg0md" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M4 14h6v6", key: "rmj7iw" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ee = [
  ["path", { d: "M20.341 6.484A10 10 0 0 1 10.266 21.85", key: "1enhxb" }],
  ["path", { d: "M3.659 17.516A10 10 0 0 1 13.74 2.152", key: "1crzgf" }],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
  ["circle", { cx: "19", cy: "5", r: "2", key: "mhkx31" }],
  ["circle", { cx: "5", cy: "19", r: "2", key: "v8kfzx" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pe = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ae = [
  [
    "path",
    {
      d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
      key: "1s2grr"
    }
  ],
  ["path", { d: "M20 2v4", key: "1rf3ol" }],
  ["path", { d: "M22 4h-4", key: "gwowj6" }],
  ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const _e = [
  ["path", { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z", key: "qazsjp" }],
  ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4", key: "40519r" }]
];
/**
 * @license lucide-react v0.546.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ie = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
], L = {
  attach: Pe,
  notes: _e,
  clipboard: me,
  presets: Ae,
  release: Ee,
  lock: we,
  unlock: ke,
  hide: ye,
  larger: Me,
  smaller: Se,
  close: Ie,
  file: be,
  image: ve,
  copy: xe
}, kt = "http://www.w3.org/2000/svg";
function j(a, t = 20, e = "currentColor") {
  const n = document.createElementNS(kt, "svg"), s = {
    width: String(t),
    height: String(t),
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: e,
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true"
  };
  for (const [i, o] of Object.entries(s)) n.setAttribute(i, o);
  for (const [i, o] of a) {
    const r = document.createElementNS(kt, i);
    for (const [c, d] of Object.entries(o)) c !== "key" && r.setAttribute(c, String(d));
    n.append(r);
  }
  return n;
}
const G = 52, X = 12, Le = G + 8;
function Te(a, t, e, n) {
  const s = G / 2, i = Math.atan2(-a.ny, -a.nx), o = [0, 10, -10, 20, -20, 30, -30, 45, -45].map((h) => i + h * Math.PI / 180), r = (h, l) => h >= X + s && h <= e - X - s && l >= X + s && l <= n - X - s, c = (h, l, u) => Array.from({ length: t }, (x, v) => {
    const w = u + (v - (t - 1) / 2) * l / 180 * Math.PI;
    return {
      cx: a.x + Math.cos(w) * h,
      cy: a.y + Math.sin(w) * h,
      lx: Math.cos(w),
      ly: Math.sin(w)
    };
  }), d = a.radius + 50;
  for (let h = d; h <= d + 140; h += 10)
    for (let l = 40; l >= 18 && !(2 * h * Math.sin(l / 2 * Math.PI / 180) < Le); l -= 2)
      for (const x of o) {
        const v = c(h, l, x);
        if (v.every((w) => r(w.cx, w.cy))) return v;
      }
  return c(d, 40, i).map((h) => ({
    ...h,
    cx: Math.min(e - X - s, Math.max(X + s, h.cx)),
    cy: Math.min(n - X - s, Math.max(X + s, h.cy))
  }));
}
function Re(a, t, e, n, s) {
  const i = Te(t, e.length, window.innerWidth, window.innerHeight), o = [], r = p("div", {
    class: "noui-menu",
    "data-open": "off",
    role: "menu",
    "aria-label": "noUI quick menu"
  });
  e.forEach((l, u) => {
    const x = i[u], v = p("span", { class: "noui-menu-label", "aria-hidden": "true" }, l.label);
    l.hint && v.append(p("em", {}, l.hint));
    const w = p(
      "button",
      {
        type: "button",
        role: "menuitem",
        class: "noui-menu-item",
        "data-label": Math.abs(x.lx) > 0.3 ? x.lx > 0 ? "right" : "left" : x.ly > 0 ? "below" : "above",
        disabled: l.disabled,
        "aria-label": l.hint ? `${l.label} (${l.hint})` : l.label
      },
      j(l.icon, 20),
      v
    );
    w.style.left = `${x.cx - G / 2}px`, w.style.top = `${x.cy - G / 2}px`, w.style.width = `${G}px`, w.style.height = `${G}px`, w.style.setProperty("--from-x", `${t.x - x.cx}px`), w.style.setProperty("--from-y", `${t.y - x.cy}px`), w.style.transitionDelay = `${u * 25}ms`, w.addEventListener("click", () => n(l.id)), o.push(w), r.append(w);
  });
  const c = (l, u) => {
    for (let x = 1; x <= e.length; x++) {
      const v = (l + u * x + e.length) % e.length;
      if (!e[v].disabled) {
        o[v].focus();
        return;
      }
    }
  };
  r.addEventListener("keydown", (l) => {
    const u = o.findIndex((x) => x === document.activeElement);
    l.key === "Escape" ? (l.preventDefault(), l.stopPropagation(), s()) : l.key === "ArrowRight" || l.key === "ArrowDown" || l.key === "Tab" && !l.shiftKey ? (l.preventDefault(), c(u, 1)) : (l.key === "ArrowLeft" || l.key === "ArrowUp" || l.key === "Tab" && l.shiftKey) && (l.preventDefault(), c(u, -1));
  }), r.addEventListener("pointerdown", (l) => {
    l.target === r && s();
  }), r.addEventListener("contextmenu", (l) => l.preventDefault()), a.append(r);
  const d = requestAnimationFrame(() => r.dataset.open = "on"), h = e.findIndex((l) => !l.disabled);
  return o[h]?.focus({ preventScroll: !0 }), () => {
    cancelAnimationFrame(d), r.remove();
  };
}
const C = (a, t = "") => p("span", { class: `sd-chip ${t}`.trim() }, a), ct = (a, t, e) => p(
  "li",
  { class: "sd-row" },
  p("span", { class: "sd-row-ic" }, j(a, 15)),
  p("b", {}, t),
  p("small", {}, e)
), J = () => p("span", { class: "noui-placeholder-tag sd-tag" }, "Preview · the real tool lands in phase 4"), tt = (...a) => p("div", { class: "sd-stack" }, ...a), Mt = [
  {
    id: "attach",
    label: "Attach",
    icon: L.attach,
    tagline: "Files, images and snippets at hand",
    body: () => tt(
      p(
        "div",
        { class: "sd-drop" },
        j(L.attach, 22),
        p("b", {}, "Drop anything here"),
        p("small", {}, "Files, images, text. Paste works too.")
      ),
      p(
        "ul",
        { class: "sd-list" },
        ct(L.image, "screenshot.png", "1.4 MB"),
        ct(L.file, "meeting-notes.md", "3 KB"),
        ct(L.copy, "Pasted text", "340 chars")
      ),
      p("p", { class: "sd-line" }, "Hand any of it to the AI as context, or drag it back out."),
      J()
    )
  },
  {
    id: "notes",
    label: "Quick Notes",
    icon: L.notes,
    tagline: "Write it down before it slips",
    body: () => tt(
      p(
        "div",
        { class: "sd-text" },
        p("b", { class: "sd-title" }, "Tuesday standup"),
        p("p", {}, "Phase 3 shipped: pods ooze out of the drones and morph into each other."),
        p("p", {}, "Next: real tools. Notes first, ", p("span", { class: "sd-caret" }))
      ),
      p(
        "div",
        { class: "sd-chips" },
        C("Pinned"),
        C("Markdown"),
        C("Search"),
        C("Saved just now", "sd-muted")
      ),
      p(
        "p",
        { class: "sd-line" },
        "Opens on a fresh note with the cursor already blinking. It saves as you type."
      ),
      J()
    )
  },
  {
    id: "clipboard",
    label: "Clipboard Editor",
    icon: L.clipboard,
    tagline: "Clean it up before you paste",
    body: () => tt(
      p(
        "pre",
        { class: "sd-code" },
        `   Hello,   World   
{"name":"noUI","drones":[1,2,3,4]}
banana
apple
banana`
      ),
      p(
        "div",
        { class: "sd-chips" },
        C("Trim"),
        C("UPPER"),
        C("Sort"),
        C("Dedupe"),
        C("JSON", "sd-hot"),
        C("Find & replace")
      ),
      p(
        "div",
        { class: "sd-actions" },
        p("span", { class: "sd-btn sd-primary" }, "Copy back"),
        p("span", { class: "sd-btn" }, "Undo")
      ),
      J()
    )
  },
  {
    id: "presets",
    label: "Prompt Presets",
    icon: L.presets,
    tagline: "Your prompts, with blanks to fill",
    body: () => tt(
      p(
        "ul",
        { class: "sd-list" },
        p(
          "li",
          { class: "sd-preset" },
          p("b", {}, "Tidy this"),
          p("span", { class: "sd-var" }, "{{clipboard}}")
        ),
        p(
          "li",
          { class: "sd-preset" },
          p("b", {}, "Summarise my note"),
          p("span", { class: "sd-var" }, "{{note}}")
        ),
        p(
          "li",
          { class: "sd-preset" },
          p("b", {}, "Explain it simply"),
          p("span", { class: "sd-var" }, "{{input}}")
        )
      ),
      p("div", { class: "sd-chips" }, C("writing"), C("code"), C("favourites")),
      p(
        "div",
        { class: "sd-actions" },
        p("span", { class: "sd-btn sd-primary" }, "Copy result"),
        p("span", { class: "sd-btn sd-muted" }, "Run with AI · soon")
      ),
      J()
    )
  }
], ht = {
  "Deep Space": "deep-space",
  Midnight: "midnight",
  Slate: "slate",
  "Bright Ink": "bright-ink"
}, St = {
  Indigo: { gooColor: "#4f46e5", interactionColor: "#ff3c50", pupilColor: "#22d3ee" },
  Ember: { gooColor: "#ea580c", interactionColor: "#38bdf8", pupilColor: "#fde68a" },
  Orchid: { gooColor: "#a21caf", interactionColor: "#fb7185", pupilColor: "#f0abfc" }
}, Et = 'button:not([disabled]), [href], input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])', Pt = () => performance.now() / 1e3;
function De(a, t = {}) {
  let e = { ...ge, ...t }, n = "Deep Space", s = "Indigo";
  const i = e.coreSize, o = e.satelliteSize, r = p("div", { class: "noui-app", "data-theme": ht[n] }), c = p("div", { class: "noui-backdrop", "aria-hidden": "true" }), d = p(
    "main",
    { class: "noui-center" },
    p(
      "div",
      { class: "noui-wordmark", "aria-hidden": "true" },
      p("h1", {}, "noUI"),
      p("p", {}, "LIVES ON THE EDGE")
    )
  ), h = p("div", { class: "noui-layer", "data-gl": "on" }), l = p("div", { class: "noui-safe-probe", "aria-hidden": "true" }), u = p("div", { class: "noui-rail", "aria-hidden": "true" }, p("div", { class: "noui-rail-glow" }));
  u.style.setProperty("--rail-inset", `${V}px`), u.style.setProperty("--rail-radius", `${It}px`);
  const x = () => u.style.setProperty("--rail-color", e.interactionColor);
  x();
  const v = p("canvas", { class: "noui-goo", "aria-hidden": "true" }), w = Mt.slice(0, H).map((f, m) => {
    const P = p("button", {
      type: "button",
      class: "noui-sat",
      "aria-label": `${f.label} (${m + 1})`,
      "aria-haspopup": "dialog",
      title: f.label
    });
    return P.style.width = P.style.height = `${o * 2}px`, P.append(j(f.icon, Math.round(o), "white")), P;
  }), y = p(
    "div",
    { class: "noui-pupil" },
    p("div", { class: "noui-glint" }),
    p("div", { class: "noui-glint2" })
  ), g = p("div", { class: "noui-sclera" }, y);
  g.style.width = g.style.height = `${i * 1.08}px`;
  const S = p(
    "button",
    {
      type: "button",
      class: "noui-eye",
      "aria-label": "noUI eye: tap to release drones, double-tap to lock, drag to move along the rail"
    },
    g
  );
  S.style.width = S.style.height = `${i * 2}px`;
  const T = p("div", { class: "noui-pod-content" }), R = p("div", { class: "noui-pod", role: "dialog", "aria-modal": "false" }, T);
  R.style.display = "none", h.append(l, u, v, ...w, S, R), r.append(c, d, h), a.append(r);
  let O = -1, D = null, k = null;
  const M = (f) => {
    if (!k) return;
    const m = f === "focus";
    k.setAttribute("aria-label", m ? "Make smaller" : "Make larger"), k.title = `${m ? "Smaller" : "Larger"} (Ctrl+Enter)`, k.replaceChildren(j(m ? L.smaller : L.larger, 15));
  }, A = (f) => {
    if (f.index === O) {
      M(f.mode);
      return;
    }
    if (O = f.index, T.replaceChildren(), D = null, k = null, R.removeAttribute("aria-labelledby"), f.index < 0) return;
    const m = Mt[f.index];
    k = p("button", { type: "button", class: "noui-pod-btn" }), k.addEventListener("click", () => _.togglePodMode()), M(f.mode);
    const P = p(
      "button",
      { type: "button", class: "noui-pod-btn", "aria-label": "Close", title: "Close (Esc)" },
      j(L.close, 16)
    );
    P.addEventListener("click", () => _.closePod(!0)), D = p("div", { class: "noui-pod-body", tabindex: "-1" }, m.body()), R.setAttribute("aria-labelledby", "noui-pod-title"), T.append(
      p(
        "header",
        { class: "noui-pod-head" },
        p("span", { class: "noui-pod-icon", "aria-hidden": "true" }, j(m.icon, 16)),
        p(
          "div",
          { class: "noui-pod-titles" },
          p("h2", { id: "noui-pod-title" }, m.label),
          p("p", {}, m.tagline)
        ),
        k,
        P
      ),
      D
    );
    const F = D;
    requestAnimationFrame(() => {
      if (F !== D) return;
      (F.querySelector(Et) ?? F).focus({ preventScroll: !0 });
    });
  };
  R.addEventListener("keydown", (f) => {
    if (f.key === "Escape")
      f.preventDefault(), f.stopPropagation(), _.closePod(!0);
    else if (f.key === "Enter" && (f.ctrlKey || f.metaKey))
      f.preventDefault(), _.togglePodMode();
    else if (f.key === "Tab") {
      const m = Array.from(R.querySelectorAll(Et));
      if (!m.length) return;
      const P = m[0], F = m[m.length - 1], $ = document.activeElement;
      !$ || m.indexOf($) < 0 ? (f.preventDefault(), (f.shiftKey ? F : P).focus()) : f.shiftKey && $ === P ? (f.preventDefault(), F.focus()) : !f.shiftKey && $ === F && (f.preventDefault(), P.focus());
    }
  });
  let Y = null;
  const z = () => {
    Y?.(), Y = null;
  }, K = (f) => {
    z();
    const { expanded: m, locked: P } = _.sim, F = [
      { id: "ask", label: "Ask AI", icon: L.presets, disabled: !0, hint: "Soon" },
      { id: "drones", label: m ? "Recall drones" : "Release drones", icon: L.release },
      { id: "lock", label: P ? "Unlock" : "Lock", icon: P ? L.unlock : L.lock },
      { id: "hide", label: "Hide for an hour", icon: L.hide }
    ];
    Y = Re(
      h,
      f,
      F,
      ($) => {
        z(), $ === "drones" ? _.toggleExpanded() : $ === "lock" ? _.toggleLocked() : $ === "hide" && _.hide(3600), _.focusEye();
      },
      () => {
        z(), _.focusEye();
      }
    );
  }, _ = new ue(
    { root: h, canvas: v, eye: S, sclera: g, pupil: y, rail: u, satellites: w, safeArea: l, podShell: R, podContent: T },
    () => e,
    { onMenu: K, onPod: A }
  );
  _.start();
  const b = _.sim;
  let st = 0;
  const it = () => {
    clearInterval(st), st = 0;
  }, Lt = () => {
    it(), z(), b.dragging && b.dragEnd(Pt()), b.locked && b.toggleLocked(), b.hidden && b.show(), b.pointerLeave(), b.interact(), _.closePod();
  }, Tt = (f) => {
    Lt();
    const m = _.menuAnchor();
    switch (f) {
      case "idle":
        b.setExpanded(!1);
        break;
      case "curious": {
        b.setExpanded(!1);
        let P = Math.atan2(-m.ny, -m.nx);
        const F = () => {
          P += 0.045;
          const $ = 95 + Math.sin(P * 1.7) * 25, mt = _.menuAnchor();
          b.pointerMove(mt.x + Math.cos(P) * $, mt.y + Math.sin(P) * $);
        };
        F(), st = window.setInterval(F, 50);
        break;
      }
      case "expanded":
        b.setExpanded(!0);
        break;
      case "dragging":
        b.setExpanded(!1), b.dragStart(m.x, m.y);
        break;
      case "locked":
        b.setExpanded(!1), b.toggleLocked();
        break;
      case "sleeping":
        b.setExpanded(!1), b.sleeping = !0;
        break;
      case "hidden":
        b.hide(3600);
        break;
    }
  }, ot = (f) => {
    e = { ...e, ...f }, x();
  }, ft = [], at = () => ft.forEach((f) => f());
  window.addEventListener(
    "pointerdown",
    (f) => {
      f.isTrusted && (it(), b.dragging && b.dragEnd(Pt()), at());
    },
    { capture: !0 }
  ), window.addEventListener("keydown", (f) => f.isTrusted && at(), { capture: !0 }), window.addEventListener(
    "pointermove",
    (f) => {
      f.isTrusted && it();
    },
    { passive: !0 }
  );
  const Rt = () => ({
    gl: h.dataset.gl === "on",
    mood: b.mode,
    expanded: b.expanded,
    locked: b.locked,
    hidden: b.hidden,
    podIndex: b.pod.index,
    podMode: b.pod.mode,
    feel: fe(e),
    theme: n,
    palette: s,
    reduceMotion: e.reduceMotion
  }), Dt = (f, m = "") => {
    switch (f) {
      case "mood":
        Tt(m);
        break;
      case "pod": {
        const P = Number(m);
        P < 0 || b.pod.index === P ? _.closePod() : _.openPod(P);
        break;
      }
      case "podMode":
        b.pod.open && b.pod.mode !== m && _.togglePodMode();
        break;
      case "release":
        b.setExpanded(m === "true");
        break;
      case "menu":
        _.openMenu();
        break;
      case "feel":
        m in pt && ot(pt[m]);
        break;
      case "theme":
        m in ht && (n = m, r.dataset.theme = ht[m]);
        break;
      case "palette":
        m in St && (s = m, ot(St[m]));
        break;
      case "reduceMotion":
        ot({ reduceMotion: m === "true" });
        break;
    }
  };
  return {
    engine: _,
    state: Rt,
    run: (f, m) => {
      at(), Dt(f, m);
    },
    placeAt: (f) => {
      const m = b.rail.snaps[f];
      if (m !== void 0) {
        b.home = m, b.eye.s.x = b.eye.prevS = m;
        for (const P of b.sats) P.s.x = P.prevS = m;
      }
    },
    onUserAction: (f) => ft.push(f)
  };
}
function Ce() {
  return `${Ft}
${((t) => t.replace(/^@import[^;]+;\s*/gm, ""))(Ct)}
${$t}`;
}
function Fe() {
  const t = new URLSearchParams(location.search).get("scene") ?? "hero", e = document.createElement("style");
  e.textContent = Ce(), document.head.append(e);
  const n = zt(), s = document.getElementById("stage");
  if (!s) return;
  const i = De(s, t === "eye" ? { coreSize: 40 } : {});
  t === "hero" && i.placeAt(1);
  const o = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches, r = (y) => {
    window.parent !== window && window.parent.postMessage({ type: "noui-stage", scene: t, state: y }, location.origin);
  };
  let c = "";
  const d = (y = !1) => {
    const g = JSON.stringify(i.state());
    !y && g === c || (c = g, r(JSON.parse(g)));
  };
  window.setInterval(d, 200), window.addEventListener("message", (y) => {
    if (y.origin !== location.origin || y.source !== window.parent) return;
    const g = y.data;
    if (!(!g || g.type !== "noui-cmd" || typeof g.cmd != "string")) {
      if (g.cmd === "hello") {
        w();
        return;
      }
      if (g.cmd === "active") {
        const S = g.arg === "true";
        n.setActive(S), document.documentElement.dataset.active = String(S), S && v();
        return;
      }
      i.run(g.cmd, typeof g.arg == "string" ? g.arg : void 0), d();
    }
  });
  let h = !1;
  i.onUserAction(() => h = !0);
  const l = [], u = (y, g) => l.push(window.setTimeout(() => !h && n.active && g(), y));
  let x = !1;
  function v() {
    if (x || (x = !0, o)) return;
    const { engine: y } = i;
    t === "hero" ? (u(900, () => y.toggleExpanded()), u(2600, () => y.openPod(1)), u(5800, () => y.openPod(3)), u(9e3, () => y.closePod())) : t === "pods" ? u(500, () => y.openPod(1)) : t === "feel" && u(500, () => y.toggleExpanded());
  }
  const w = () => {
    window.parent !== window && window.parent.postMessage(
      { type: "noui-stage", scene: t, state: i.state(), ready: !0 },
      location.origin
    );
  };
  w(), window.parent === window && v();
}
Fe();
