/*
 * noUI landing demo — a small working version of the planned engine:
 *  - rounded-rect rail parameterised by arc length (s)
 *  - eye + drones simulated as 1D springs in rail space (fixed 120 Hz step)
 *  - fling with momentum and magnetic snap to corners / edge centers
 *  - glass metaball shader (WebGL2), drawn only inside the goo's bounding box
 */
export function startDemo() {

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const canvas = $('goo');
  const eyeBtn = $('eyeBtn');
  const sclera = $('sclera');
  const pupil = $('pupil');
  const railEl = $('rail');
  const hint = $('hint');
  const pod = $('pod');
  const podTitle = $('podTitle');
  const podBody = $('podBody');
  const podIc = $('podIc');
  const droneEls = [...document.querySelectorAll('.drone')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TAU = Math.PI * 2;
  const STEP = 1 / 120;
  const mod = (a, n) => ((a % n) + n) % n;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const now = () => performance.now() / 1000;

  // ───────────────────────── Rail ─────────────────────────
  const rail = { segs: [], L: 1, snaps: [], P: 28, R: 34 };

  function buildRail(W, H) {
    const cs = getComputedStyle(stage);
    const P = parseFloat(cs.getPropertyValue('--P')) || 40;
    const PT = parseFloat(cs.getPropertyValue('--PT')) || P;
    let R = parseFloat(cs.getPropertyValue('--R')) || 36;
    const x0 = P, y0 = PT, x1 = W - P, y1 = H - P;
    R = Math.min(R, (x1 - x0) / 2 - 1, (y1 - y0) / 2 - 1);
    const A = (Math.PI / 2) * R;
    const segs = [
      { t: 'L', ax: x0 + R, ay: y0, bx: x1 - R, by: y0 },
      { t: 'A', cx: x1 - R, cy: y0 + R, a0: -Math.PI / 2 },
      { t: 'L', ax: x1, ay: y0 + R, bx: x1, by: y1 - R },
      { t: 'A', cx: x1 - R, cy: y1 - R, a0: 0 },
      { t: 'L', ax: x1 - R, ay: y1, bx: x0 + R, by: y1 },
      { t: 'A', cx: x0 + R, cy: y1 - R, a0: Math.PI / 2 },
      { t: 'L', ax: x0, ay: y1 - R, bx: x0, by: y0 + R },
      { t: 'A', cx: x0 + R, cy: y0 + R, a0: Math.PI },
    ];
    let acc = 0;
    for (const sg of segs) {
      sg.start = acc;
      if (sg.t === 'L') {
        sg.len = Math.hypot(sg.bx - sg.ax, sg.by - sg.ay);
        sg.dx = (sg.bx - sg.ax) / (sg.len || 1);
        sg.dy = (sg.by - sg.ay) / (sg.len || 1);
      } else {
        sg.len = A;
      }
      acc += sg.len;
    }
    rail.segs = segs;
    rail.L = acc;
    rail.R = R;
    rail.P = P;
    rail.PT = PT;
    rail.snaps = segs.map((sg) => sg.start + sg.len / 2); // corners + edge centers
  }

  const tmp = { x: 0, y: 0, tx: 1, ty: 0, nx: 0, ny: -1, seg: 0 };
  function railAt(s, out = tmp) {
    s = mod(s, rail.L);
    const segs = rail.segs;
    let i = 0;
    while (i < segs.length - 1 && s > segs[i].start + segs[i].len) i++;
    const sg = segs[i];
    const u = s - sg.start;
    if (sg.t === 'L') {
      out.x = sg.ax + sg.dx * u;
      out.y = sg.ay + sg.dy * u;
      out.tx = sg.dx;
      out.ty = sg.dy;
    } else {
      const th = sg.a0 + u / rail.R;
      const c = Math.cos(th), sn = Math.sin(th);
      out.x = sg.cx + rail.R * c;
      out.y = sg.cy + rail.R * sn;
      out.tx = -sn;
      out.ty = c;
    }
    out.nx = out.ty; // outward normal for a clockwise path (y down)
    out.ny = -out.tx;
    out.seg = i;
    return out;
  }

  function railProject(px, py) {
    let best = Infinity, bestS = 0;
    for (const sg of rail.segs) {
      let u, qx, qy;
      if (sg.t === 'L') {
        u = clamp((px - sg.ax) * sg.dx + (py - sg.ay) * sg.dy, 0, sg.len);
        qx = sg.ax + sg.dx * u;
        qy = sg.ay + sg.dy * u;
      } else {
        let d = Math.atan2(py - sg.cy, px - sg.cx) - (sg.a0 + Math.PI / 4);
        d = mod(d + Math.PI, TAU) - Math.PI;
        const half = Math.PI / 4;
        const a = clamp(d, -half, half) + half;
        u = a * rail.R;
        qx = sg.cx + rail.R * Math.cos(sg.a0 + a);
        qy = sg.cy + rail.R * Math.sin(sg.a0 + a);
      }
      const dist = (px - qx) ** 2 + (py - qy) ** 2;
      if (dist < best) { best = dist; bestS = sg.start + u; }
    }
    return bestS;
  }

  // shortest signed distance from a to b along the loop
  const along = (a, b) => mod(b - a + rail.L / 2, rail.L) - rail.L / 2;

  // ───────────────────────── Springs ─────────────────────────
  // response = period in seconds, zeta = damping ratio (SwiftUI-style)
  function spring(o, x, v, target, response, zeta, h) {
    const w = TAU / response;
    o[v] += (w * w * (target - o[x]) - 2 * zeta * w * o[v]) * h;
    o[x] += o[v] * h;
  }

  // ───────────────────────── State ─────────────────────────
  const S = {
    W: 0, H: 0, dpr: 1, t: 0,
    eye: { s: 0, v: 0, home: 0, r: 0, vr: 0, baseR: 26, off: 0, voff: 0 },
    drones: droneEls.map(() => ({ s: 0, v: 0, r: 0, vr: 0 })),
    droneR: 19, spacing: 64,
    expanded: false, locked: false, sleeping: false,
    pressed: false, dragging: false, dragTarget: 0, sOffset: 0, hist: [],
    downX: 0, downY: 0, lastTap: 0, pendingTap: null,
    pointer: { x: -1e4, y: -1e4 }, hover: false,
    lastInteract: 0, interacted: false,
    look: { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, next: 0 },
    lid: { v: 1, vv: 0 }, blinkUntil: 0, nextBlink: 2, secondBlink: 0,
    pupilC: [0.13, 0.83, 0.93], gooC: [0.31, 0.27, 0.9],
    railO: 0.2, railA: 135,
    lastSeg: -1, lastSplash: 0,
    pod: -1,
    visible: true,
  };

  const COL = {
    pupil: [0.133, 0.827, 0.933],
    hot: [1.0, 0.235, 0.314],
    grey: [0.5, 0.5, 0.56],
    sleep: [0.3, 0.23, 0.55],
    goo: [0.31, 0.275, 0.898],
  };

  // ───────────────────────── Particles ─────────────────────────
  const NP = 14;
  const parts = Array.from({ length: NP }, () => ({ x: 0, y: 0, vx: 0, vy: 0, r: 0 }));
  let pi = 0;
  function splash(x, y, n, speed = 1, size = 1, tx = 0, ty = 0) {
    if (reduceMotion) return;
    for (let k = 0; k < n; k++) {
      const p = parts[pi];
      const a = Math.random() * TAU;
      const sp = (240 + Math.random() * 420) * speed;
      p.x = x; p.y = y;
      p.vx = Math.cos(a) * sp + tx;
      p.vy = Math.sin(a) * sp + ty;
      p.r = (2 + Math.random() * 4.5) * size;
      pi = (pi + 1) % NP;
    }
  }

  // ───────────────────────── Simulation step ─────────────────────────
  const eyePos = { x: 0, y: 0, tx: 1, ty: 0, nx: 0, ny: -1, seg: 0 };

  function step(h) {
    S.t += h;
    const t = S.t;
    const e = S.eye;

    // sleep after inactivity
    if (!S.sleeping && t - S.lastInteract > 22 && !S.pressed && S.pod < 0) S.sleeping = true;

    railAt(e.s, eyePos);
    const ex = eyePos.x + eyePos.nx * e.off, ey = eyePos.y + eyePos.ny * e.off;
    const pdx = S.pointer.x - ex, pdy = S.pointer.y - ey;
    const pDist = Math.hypot(pdx, pdy);
    S.hover = !S.dragging && pDist < e.baseR * 2.3;

    // ── eye position along the rail
    let target, resp, zeta;
    if (S.dragging) {
      target = S.dragTarget; resp = 0.11; zeta = 0.95;
    } else {
      target = e.home; resp = 0.42; zeta = 0.74;
      if (S.hover && !S.locked && !S.expanded) {
        target += clamp(along(e.home, railProject(S.pointer.x, S.pointer.y)) * 0.25, -26, 26);
      } else if (!S.sleeping && !S.locked && !reduceMotion) {
        target += Math.sin(t * 1.5) * 4; // idle breathing
      }
    }
    spring(e, 's', 'v', target, resp, zeta, h);

    // ── squash / size
    const rT = e.baseR * (S.sleeping ? 0.9 : S.pressed && !S.locked ? 0.86 : 1);
    spring(e, 'r', 'vr', rT, 0.34, 0.42, h);

    // ── bulge toward a hovering pointer (visual only, along the normal)
    const offT = S.hover && !S.locked ? clamp((pdx * eyePos.nx + pdy * eyePos.ny) * 0.2, -9, 2) : 0;
    spring(e, 'off', 'voff', offT, 0.3, 0.6, h);

    // ── drones: a train trailing the eye
    const out = S.expanded && !S.sleeping;
    for (let i = 0; i < S.drones.length; i++) {
      const d = S.drones[i];
      const k = i + 1;
      if (out) {
        spring(d, 's', 'v', e.s - k * S.spacing, 0.3 + k * 0.05, 0.72, h);
        spring(d, 'r', 'vr', S.droneR * (S.pod === i ? 1.22 : 1), 0.3, 0.5, h);
      } else {
        spring(d, 's', 'v', e.s, 0.16 + (4 - k) * 0.02, 0.92, h);
        spring(d, 'r', 'vr', 0, 0.22, 0.9, h);
      }
    }

    // ── splash when the eye swings through a corner
    if (eyePos.seg !== S.lastSeg) {
      if (eyePos.seg % 2 === 1 && Math.abs(e.v) > 260 && t - S.lastSplash > 0.35) {
        splash(ex, ey, 5, 0.8, 1, eyePos.tx * e.v * 0.3, eyePos.ty * e.v * 0.3);
        S.lastSplash = t;
      }
      S.lastSeg = eyePos.seg;
    }

    // ── particles
    const fr = Math.exp(-3.1 * h), shrink = Math.exp(-5 * h);
    for (const p of parts) {
      if (p.r < 0.3) { p.r = 0; continue; }
      p.vy += 1400 * h;
      p.vx *= fr; p.vy *= fr;
      p.x += p.vx * h; p.y += p.vy * h;
      p.r *= shrink;
    }

    // ── look
    const L = S.look;
    const maxLook = S.eye.baseR * 0.3;
    if (S.dragging) { L.tx = 0; L.ty = 0; }
    else if (S.sleeping) { L.tx = 0; L.ty = maxLook * 0.4; }
    else if (pDist < 360 && S.pointer.x > -1e3) {
      const f = Math.min(1, pDist / 140) * maxLook / (pDist || 1);
      L.tx = pdx * f; L.ty = pdy * f;
      L.next = t + 1.5;
    } else if (t > L.next) {
      L.next = t + 1.8 + Math.random() * 2.8;
      if (Math.random() < 0.7) {
        const r = (S.locked || S.expanded ? 0.4 : 0.9) * maxLook;
        L.tx = (Math.random() - 0.5) * 2 * r; L.ty = (Math.random() - 0.5) * 2 * r;
      } else { L.tx = 0; L.ty = 0; }
    }
    spring(L, 'x', 'vx', L.tx, 0.2, 0.85, h);
    spring(L, 'y', 'vy', L.ty, 0.2, 0.85, h);
    const ld = Math.hypot(L.x, L.y);
    if (ld > maxLook) { L.x *= maxLook / ld; L.y *= maxLook / ld; }

    // ── blink
    if (t > S.nextBlink && !S.sleeping) {
      S.blinkUntil = t + 0.11;
      S.secondBlink = Math.random() < 0.25 ? t + 0.27 : 0;
      S.nextBlink = t + 2.6 + Math.random() * 4;
    }
    if (S.secondBlink && t > S.secondBlink) { S.blinkUntil = t + 0.1; S.secondBlink = 0; }
    let lidT = 1;
    if (S.sleeping) lidT = 0.07;
    else if (t < S.blinkUntil) lidT = 0.06;
    else if (S.locked) lidT = 0.34;
    else if (S.dragging) lidT = 1.08;
    spring(S.lid, 'v', 'vv', lidT, 0.12, 0.75, h);

    // ── colors
    let pc = COL.pupil, gc = COL.goo, gmix = 0;
    if (S.sleeping) { pc = COL.sleep; }
    else if (S.locked) { pc = COL.grey; gc = COL.grey; gmix = 0.45; }
    else if (S.dragging) { pc = COL.hot; gc = COL.hot; gmix = 0.5; }
    else if (S.expanded) { pc = COL.hot; }
    const kc = 1 - Math.exp(-7 * h);
    const dim = S.sleeping ? 0.6 : 1;
    for (let c = 0; c < 3; c++) {
      S.pupilC[c] += (pc[c] - S.pupilC[c]) * kc;
      const g = (COL.goo[c] * (1 - gmix) + gc[c] * gmix) * dim;
      S.gooC[c] += (g - S.gooC[c]) * kc;
    }

    // ── rail highlight
    const railT = S.sleeping ? 0.04 : S.dragging ? 1 : S.hover ? 0.6 : S.expanded ? 0.42 : 0.22;
    S.railO += (railT - S.railO) * (1 - Math.exp(-6 * h));
  }

  // ───────────────────────── Interaction ─────────────────────────
  function wake() {
    S.lastInteract = S.t;
    if (S.sleeping) { S.sleeping = false; S.nextBlink = S.t + 0.25; }
  }
  const vibrate = (p) => { if (!S.interacted) return; try { navigator.vibrate && navigator.vibrate(p); } catch (_) {} };

  function local(e) {
    const r = stage.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function setExpanded(v) {
    S.expanded = v;
    eyeBtn.setAttribute('aria-expanded', String(v));
    droneEls.forEach((d) => { d.tabIndex = v ? 0 : -1; d.setAttribute('aria-hidden', String(!v)); });
    if (!v) closePod();
  }

  function toggleExpand() {
    wake();
    setExpanded(!S.expanded);
    S.eye.vr -= 70;
    railAt(S.eye.s, eyePos);
    splash(eyePos.x, eyePos.y, 4, 0.45, 0.9);
    vibrate(S.expanded ? 25 : 18);
  }

  function toggleLock() {
    wake();
    S.locked = !S.locked;
    eyeBtn.classList.toggle('locked', S.locked);
    S.eye.vr -= 50;
    railAt(S.eye.s, eyePos);
    splash(eyePos.x, eyePos.y, 6, 0.7);
    vibrate([35, 45, 35]);
  }

  function hideHint() { hint.classList.add('gone'); }

  eyeBtn.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    wake();
    S.interacted = true;
    S.pressed = true;
    S.dragging = false;
    S.downX = e.clientX; S.downY = e.clientY;
    const p = local(e);
    S.sOffset = along(railProject(p.x, p.y), S.eye.s);
    S.dragTarget = S.eye.s;
    S.hist.length = 0;
    eyeBtn.setPointerCapture(e.pointerId);
  });

  eyeBtn.addEventListener('pointermove', (e) => {
    if (!S.pressed) return;
    if (!S.dragging && !S.locked && Math.hypot(e.clientX - S.downX, e.clientY - S.downY) > 6) {
      S.dragging = true;
      closePod();
      hideHint();
      clearTimeout(S.pendingTap); S.pendingTap = null; S.lastTap = 0;
    }
    if (!S.dragging) return;
    const p = local(e);
    const raw = railProject(p.x, p.y) + S.sOffset;
    S.dragTarget += along(S.dragTarget, raw);
    const t = now();
    S.hist.push({ t, s: S.dragTarget });
    while (S.hist.length > 2 && t - S.hist[0].t > 0.1) S.hist.shift();
  });

  function release(e) {
    if (!S.pressed) return;
    S.pressed = false;
    if (eyeBtn.hasPointerCapture(e.pointerId)) eyeBtn.releasePointerCapture(e.pointerId);
    if (S.dragging) {
      S.dragging = false;
      fling();
    } else if (e.type === 'pointerup') {
      tap();
    }
  }
  eyeBtn.addEventListener('pointerup', release);
  eyeBtn.addEventListener('pointercancel', release);

  function fling() {
    let v = 0;
    const hst = S.hist;
    if (hst.length >= 2) {
      const a = hst[0], b = hst[hst.length - 1];
      if (b.t - a.t > 0.008 && now() - b.t < 0.08) v = (b.s - a.s) / (b.t - a.t);
    }
    v = clamp(v, -4200, 4200);
    let rest = S.dragTarget + v * 0.2;
    // magnetic snap to corners / edge centers
    let best = Infinity, snapTo = rest;
    for (const sp of rail.snaps) {
      const cand = rest + along(rest, sp);
      const d = Math.abs(cand - rest);
      if (d < best) { best = d; snapTo = cand; }
    }
    if (best < 160) rest = snapTo;
    S.eye.home = rest;
    if (Math.abs(v) > 700) {
      railAt(S.eye.s, eyePos);
      splash(eyePos.x, eyePos.y, 6, 0.9, 1, eyePos.tx * v * 0.25, eyePos.ty * v * 0.25);
    }
    vibrate(10);
  }

  // Tap expands; a second tap within 300 ms locks instead.
  // Expansion is held back a moment so a double-tap never shows drones popping out and back in.
  function tap() {
    const t = performance.now();
    railAt(S.eye.s, eyePos);
    splash(eyePos.x, eyePos.y, 3, 0.35, 0.8);
    if (S.pendingTap && t - S.lastTap < 300) {
      clearTimeout(S.pendingTap);
      S.pendingTap = null;
      S.lastTap = 0;
      toggleLock();
      return;
    }
    S.lastTap = t;
    S.pendingTap = setTimeout(() => { S.pendingTap = null; toggleExpand(); }, 200);
  }

  eyeBtn.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'Enter' || k === ' ') { e.preventDefault(); toggleExpand(); }
    else if (k === 'l' || k === 'L') { toggleLock(); }
    else if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); if (!S.locked) { wake(); S.eye.home += 56; } }
    else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); if (!S.locked) { wake(); S.eye.home -= 56; } }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (S.pod >= 0) { const i = S.pod; closePod(); droneEls[i].focus(); }
    else if (S.expanded) { setExpanded(false); eyeBtn.focus(); }
  });

  window.addEventListener('pointermove', (e) => {
    const p = local(e);
    S.pointer.x = p.x; S.pointer.y = p.y;
    if (p.y > -50 && p.y < S.H + 50) wake();
  }, { passive: true });
  document.addEventListener('pointerleave', () => { S.pointer.x = -1e4; S.pointer.y = -1e4; });

  // ───────────────────────── Pods ─────────────────────────
  const PODS = {
    attach: {
      title: 'Attach', icon: 'i-attach',
      html: `<div class="pod-drop">Drop files, images or text here</div>
        <div class="pod-row"><span class="pod-thumb" style="background:linear-gradient(135deg,#818cf8,#22d3ee)"></span><b>rail-sketch.png</b><small>1.2 MB</small></div>
        <div class="pod-row"><span class="pod-thumb" style="background:linear-gradient(135deg,#f0abfc,#6366f1)"></span><b>brief.pdf</b><small>84 KB</small></div>`,
    },
    notes: {
      title: 'Quick Notes', icon: 'i-note',
      html: `<div class="pod-text">Fling should settle on corners<br>— magnetic radius ~160px<span class="caret"></span></div>
        <div class="pod-row"><b>Ideas for drones</b><small>2h</small></div>
        <div class="pod-row"><b>Prompt for release notes</b><small>Mon</small></div>`,
    },
    clipboard: {
      title: 'Clipboard Editor', icon: 'i-clip',
      html: `<div class="pod-text">{ "eye": "noUI", "drones": 4,<br>&nbsp;&nbsp;"rail": true }</div>
        <div class="pod-tools"><span>Trim</span><span>UPPER</span><span>Sort</span><span>JSON ✓</span><span class="ai">✦ Rewrite</span></div>
        <div class="pod-actions"><span class="primary">Copy</span></div>`,
    },
    presets: {
      title: 'Prompt Presets', icon: 'i-spark',
      html: `<div class="pod-row"><b>Summarize</b><small class="pod-var">{{clipboard}}</small></div>
        <div class="pod-row"><b>Commit message</b><small class="pod-var">{{clipboard}}</small></div>
        <div class="pod-row"><b>Explain simply</b><small class="pod-var">{{input}}</small></div>
        <div class="pod-actions"><span>Copy</span><span class="primary">Run with AI</span></div>`,
    },
  };

  let podTimer = 0;
  function openPod(i) {
    wake();
    clearTimeout(podTimer);
    const key = droneEls[i].dataset.pod;
    const def = PODS[key];
    S.pod = i;
    droneEls.forEach((d, j) => d.classList.toggle('active', j === i));
    podTitle.textContent = def.title;
    podIc.innerHTML = `<svg class="ic"><use href="#${def.icon}"/></svg>`;
    podBody.innerHTML = def.html;
    pod.classList.remove('open');
    pod.hidden = false;

    const d = S.drones[i];
    const q = railAt(d.s, { x: 0, y: 0, tx: 0, ty: 0, nx: 0, ny: 0, seg: 0 });
    const pw = pod.offsetWidth, ph = pod.offsetHeight;
    const reach = 34 + Math.abs(q.nx) * pw / 2 + Math.abs(q.ny) * ph / 2;
    const cx = q.x - q.nx * reach, cy = q.y - q.ny * reach;
    const m = rail.P + 12;
    const left = clamp(cx - pw / 2, m, S.W - m - pw);
    const top = clamp(cy - ph / 2, rail.PT + 12, S.H - m - ph);
    pod.style.left = left + 'px';
    pod.style.top = top + 'px';
    pod.style.transformOrigin = `${q.x - left}px ${q.y - top}px`;
    d.vr += 90;
    splash(q.x, q.y, 4, 0.5, 0.9, -q.nx * 200, -q.ny * 200);
    vibrate(12);
    requestAnimationFrame(() => requestAnimationFrame(() => pod.classList.add('open')));
  }

  function closePod() {
    if (S.pod < 0) return;
    S.pod = -1;
    droneEls.forEach((d) => d.classList.remove('active'));
    pod.classList.remove('open');
    podTimer = setTimeout(() => { if (S.pod < 0) pod.hidden = true; }, 380);
  }

  droneEls.forEach((el) => el.addEventListener('pointerdown', () => { S.interacted = true; }));
  droneEls.forEach((el, i) => {
    el.addEventListener('click', () => {
      hideHint();
      if (S.pod === i) closePod(); else openPod(i);
    });
  });
  $('podX').addEventListener('click', closePod);
  stage.addEventListener('pointerdown', (e) => {
    if (S.pod >= 0 && !pod.contains(e.target) && !e.target.closest('.drone') && e.target !== eyeBtn && !eyeBtn.contains(e.target)) closePod();
  });

  // ───────────────────────── WebGL renderer ─────────────────────────
  const VS = `#version 300 es
  in vec2 a;
  void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

  const FS = `#version 300 es
  precision highp float;
  uniform vec4 u_b[5];
  uniform vec3 u_p[${NP}];
  uniform vec3 u_col;
  uniform float u_dpr;
  uniform float u_k;
  out vec4 o;
  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }
  void main() {
    vec2 p = gl_FragCoord.xy;
    float d = 1e5;
    for (int i = 0; i < 5; i++) {
      if (u_b[i].z > 0.5) d = smin(d, length(p - u_b[i].xy) - u_b[i].z, u_k);
    }
    for (int i = 0; i < ${NP}; i++) {
      if (u_p[i].z > 0.3) d = smin(d, length(p - u_p[i].xy) - u_p[i].z, u_k * 0.5);
    }
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

    vec3 col = u_col * (0.3 + 0.55 * diff);
    col += rim * mix(u_col, vec3(0.85, 0.9, 1.0), 0.55) * 0.9;
    col += vec3(n2.x, 0.0, -n2.x) * rim * 0.18;   // faint iridescent fringe
    col += spec;
    float alpha = clamp(0.22 + rim * 0.6 + spec * 0.8 + edge * 0.08, 0.0, 1.0) * a;
    o = vec4(col * alpha, alpha);
  }`;

  let gl = null, U = {};
  const bData = new Float32Array(20);
  const pData = new Float32Array(NP * 3);

  function initGL() {
    gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return false;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return false;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    for (const n of ['u_b', 'u_p', 'u_col', 'u_dpr', 'u_k']) U[n] = gl.getUniformLocation(prog, n);
    gl.clearColor(0, 0, 0, 0);
    return true;
  }

  function drawGL(ex, ey) {
    const dpr = S.dpr, H = S.H;
    let minX = ex - S.eye.r, maxX = ex + S.eye.r, minY = ey - S.eye.r, maxY = ey + S.eye.r;
    bData[0] = ex * dpr; bData[1] = (H - ey) * dpr; bData[2] = Math.max(0, S.eye.r) * dpr;
    for (let i = 0; i < S.drones.length; i++) {
      const d = S.drones[i];
      const q = railAt(d.s);
      const r = Math.max(0, d.r);
      const o = (i + 1) * 4;
      bData[o] = q.x * dpr; bData[o + 1] = (H - q.y) * dpr; bData[o + 2] = r * dpr;
      if (r > 0.5) {
        minX = Math.min(minX, q.x - r); maxX = Math.max(maxX, q.x + r);
        minY = Math.min(minY, q.y - r); maxY = Math.max(maxY, q.y + r);
      }
    }
    for (let i = 0; i < NP; i++) {
      const p = parts[i];
      pData[i * 3] = p.x * dpr; pData[i * 3 + 1] = (H - p.y) * dpr; pData[i * 3 + 2] = p.r * dpr;
      if (p.r > 0.3) {
        minX = Math.min(minX, p.x - p.r); maxX = Math.max(maxX, p.x + p.r);
        minY = Math.min(minY, p.y - p.r); maxY = Math.max(maxY, p.y + p.r);
      }
    }
    const k = 24;
    gl.disable(gl.SCISSOR_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // only shade the pixels the goo can touch
    const pad = k + 4;
    const sx = clamp(Math.floor((minX - pad) * dpr), 0, canvas.width);
    const sy = clamp(Math.floor((H - maxY - pad) * dpr), 0, canvas.height);
    const sw = clamp(Math.ceil((maxX - minX + 2 * pad) * dpr), 0, canvas.width - sx);
    const sh = clamp(Math.ceil((maxY - minY + 2 * pad) * dpr), 0, canvas.height - sy);
    if (sw <= 0 || sh <= 0) return;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(sx, sy, sw, sh);
    gl.uniform4fv(U.u_b, bData);
    gl.uniform3fv(U.u_p, pData);
    gl.uniform3f(U.u_col, S.gooC[0], S.gooC[1], S.gooC[2]);
    gl.uniform1f(U.u_dpr, dpr);
    gl.uniform1f(U.u_k, k * dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  // ───────────────────────── Render (DOM + GL) ─────────────────────────
  const rgb = (c, m = 1) => `rgb(${(c[0] * 255 * m) | 0},${(c[1] * 255 * m) | 0},${(c[2] * 255 * m) | 0})`;

  function render() {
    const e = S.eye;
    railAt(e.s, eyePos);
    const ex = eyePos.x + eyePos.nx * e.off;
    const ey = eyePos.y + eyePos.ny * e.off;
    const sc = Math.max(0, e.r) / e.baseR;

    eyeBtn.style.transform = `translate3d(${ex - 32}px,${ey - 32}px,0) scale(${sc.toFixed(4)})`;
    sclera.style.transform = `scaleY(${Math.max(0.03, S.lid.v).toFixed(3)})`;
    pupil.style.transform = `translate3d(${S.look.x.toFixed(2)}px,${S.look.y.toFixed(2)}px,0)`;
    pupil.style.background = rgb(S.pupilC);
    pupil.style.boxShadow = `0 0 12px ${rgb(S.pupilC)}`;

    for (let i = 0; i < S.drones.length; i++) {
      const d = S.drones[i];
      const q = railAt(d.s);
      const dist = Math.hypot(q.x - eyePos.x, q.y - eyePos.y);
      const r = Math.max(0, d.r);
      const alpha = clamp((dist - 18) / 26, 0, 1) * clamp(r / S.droneR, 0, 1);
      const el = droneEls[i];
      el.style.transform = `translate3d(${q.x - 22}px,${q.y - 22}px,0) scale(${clamp(r / S.droneR, 0, 1.3).toFixed(3)})`;
      el.style.opacity = alpha.toFixed(3);
      el.style.pointerEvents = S.expanded && alpha > 0.8 ? 'auto' : 'none';
      const side = Math.abs(q.nx) > Math.abs(q.ny) ? (q.nx > 0 ? 'l' : 'r') : (q.ny > 0 ? 't' : 'b');
      if (el.dataset.side !== side) el.dataset.side = side;
    }

    // rail highlight follows the eye
    const a = (Math.atan2(ex - S.W / 2, -(ey - S.H / 2)) * 180) / Math.PI;
    railEl.style.setProperty('--a', a.toFixed(1) + 'deg');
    railEl.style.setProperty('--rail-o', S.railO.toFixed(3));
    railEl.style.setProperty('--rail-c', S.dragging ? '#ff5468' : S.locked ? '#9a9aa8' : '#818cf8');

    if (gl) drawGL(ex, ey);
  }

  // ───────────────────────── Sizing ─────────────────────────
  function resize() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (!W || !H) return;
    const oldL = rail.L;
    const fracEye = S.W ? mod(S.eye.s, oldL) / oldL : null;
    const fracHome = S.W ? mod(S.eye.home, oldL) / oldL : null;
    S.W = W; S.H = H;
    S.dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * S.dpr);
    canvas.height = Math.round(H * S.dpr);
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    const small = W < 640;
    S.eye.baseR = small ? 23 : 26;
    S.droneR = small ? 17 : 19;
    S.spacing = small ? 56 : 64;
    sclera.style.setProperty('--sclera', Math.round(S.eye.baseR * 1.1) + 'px');
    buildRail(W, H);

    if (fracEye === null) {
      // start in the bottom-right corner
      const s0 = rail.segs[3].start + rail.segs[3].len / 2;
      S.eye.s = S.eye.home = s0;
      S.drones.forEach((d) => { d.s = s0; });
    } else {
      const ns = fracEye * rail.L;
      const shift = ns - S.eye.s;
      S.eye.s = ns;
      S.eye.home = fracHome * rail.L;
      S.drones.forEach((d) => { d.s += shift; });
      S.dragTarget += shift;
    }
  }

  // ───────────────────────── Loop ─────────────────────────
  let last = 0, acc = 0, raf = 0;
  function frame(ts) {
    raf = 0;
    const t = ts / 1000;
    const dt = last ? Math.min(t - last, 0.1) : STEP;
    last = t;
    acc += dt;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    render();
    if (S.visible) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }

  // ───────────────────────── Boot ─────────────────────────
  if (!initGL()) { gl = null; stage.classList.add('no-gl'); }
  resize();
  new ResizeObserver(resize).observe(stage);
  window.addEventListener('resize', resize);

  new IntersectionObserver(([en]) => {
    S.visible = en.isIntersecting;
    if (S.visible) start();
  }).observe(stage);
  start();

  // intro: grow in, then release the drones once so visitors see them
  S.eye.vr = 60;
  setTimeout(() => { if (!S.interacted && !S.expanded) toggleExpand(); }, 1300);

  // ───────────────────────── Page chrome ─────────────────────────
  const nav = $('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}
