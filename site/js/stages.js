// The live stages. Each [data-frame] holds an iframe of demo.html, which runs the real noUI engine
// (js/noui-demo.js, built from src/site-demo). This file is the page's side of the conversation:
//   page → demo  { type: "noui-cmd", cmd, arg }       buttons with data-cmd / data-arg
//   demo → page  { type: "noui-stage", scene, state } highlights chips, shows the eye's mood
// Stages scrolled out of view are paused, so only what you can see costs anything.

const MOODS = {
  idle: ["Idle", "Calm glances around the room, slow blinks, sometimes a double blink. A cyan pupil."],
  curious: ["Curious", "A cursor nearby and the pupil follows it. The eye leans a little toward you."],
  expanded: ["Drones out", "The eye glows red while its drones are out, and keeps its gaze steadier."],
  dragging: ["Held", "Wide open and red while you drag it. Let go and it glides on, then snaps to a corner."],
  locked: ["Locked", "Grey and half-lidded. It won't move or follow your drag until you unlock it."],
  sleeping: ["Asleep", "After thirty seconds with no input: a slit of an eye, dim violet, drones tucked away. Move to wake it."],
  hidden: ["Hidden", "Shrunk to a small dot, out of the way for an hour. Tap the dot to bring it back."],
};

class Stage {
  constructor(scope, frame) {
    this.scope = scope;
    this.frame = frame;
    this.view = frame.querySelector("iframe");
    this.ready = false;
    this.queue = [];
    this.visible = false;
    this.state = null;
    this.controls = [...scope.querySelectorAll("[data-cmd]")];
    this.modeLabels = [...scope.querySelectorAll("[data-mode-label]")];
    this.moodName = scope.querySelector("[data-mood-name]");
    this.moodText = scope.querySelector("[data-mood-text]");

    this.controls.forEach((el) =>
      el.addEventListener("click", () => {
        let arg = el.dataset.arg ?? "";
        if (el.hasAttribute("data-toggle")) arg = String(el.getAttribute("aria-pressed") !== "true");
        this.send(el.dataset.cmd, arg);
      }),
    );
    // The demo announces itself when it starts, but it may have started before this script ran:
    // ask it again once the frame has loaded (and now, in case it already has).
    this.view.addEventListener("load", () => this.post({ cmd: "hello" }));
    this.post({ cmd: "hello" });
    // If it never answers (blocked frame), still show the frame rather than the poster forever.
    setTimeout(() => (this.frame.dataset.ready = ""), 6000);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => this.setVisible(en.isIntersecting), { threshold: 0.12 }).observe(frame);
    } else {
      this.setVisible(true);
    }
    this.paint();
  }

  post(message) {
    this.view.contentWindow?.postMessage({ type: "noui-cmd", ...message }, location.origin);
  }

  send(cmd, arg) {
    if (this.ready) this.post({ cmd, arg });
    else this.queue.push({ cmd, arg });
  }

  setVisible(on) {
    this.visible = on;
    if (this.ready) this.post({ cmd: "active", arg: String(on) });
  }

  onReady() {
    if (this.ready) return;
    this.ready = true;
    this.frame.dataset.ready = "";
    this.post({ cmd: "active", arg: String(this.visible) });
    for (const m of this.queue.splice(0)) this.post(m);
  }

  onState(state) {
    this.state = state;
    this.paint();
  }

  paint() {
    const s = this.state;
    const mood = s ? (MOODS[s.mood] ?? MOODS.idle) : MOODS.idle;
    this.modeLabels.forEach((el) => (el.textContent = mood[0]));
    if (this.moodName) this.moodName.textContent = mood[0];
    if (this.moodText) this.moodText.textContent = mood[1];
    const badge = this.frame.querySelector("[data-badge]");
    if (badge && s) badge.textContent = s.gl ? "Live" : "Live · no WebGL2, drawn with plain CSS";
    for (const el of this.controls) {
      const { cmd, arg } = el.dataset;
      let on = false;
      if (s) {
        if (cmd === "mood") on = s.mood === arg;
        else if (cmd === "pod") on = s.podIndex === Number(arg);
        else if (cmd === "podMode") on = s.podIndex >= 0 && s.podMode === arg;
        else if (cmd === "feel") on = s.feel === arg;
        else if (cmd === "theme") on = s.theme === arg;
        else if (cmd === "palette") on = s.palette === arg;
        else if (cmd === "reduceMotion") on = s.reduceMotion;
        else if (cmd === "release") on = false;
      }
      if (el.hasAttribute("aria-pressed")) el.setAttribute("aria-pressed", String(on));
      if (el.hasAttribute("data-needs-pod")) el.disabled = !s || s.podIndex < 0;
    }
  }
}

export function initStages() {
  const stages = [];
  document.querySelectorAll("[data-scope]").forEach((scope) => {
    const frame = scope.querySelector("[data-frame]");
    if (frame) stages.push(new Stage(scope, frame));
  });

  window.addEventListener("message", (e) => {
    if (e.origin !== location.origin) return;
    const data = e.data;
    if (!data || data.type !== "noui-stage") return;
    const stage = stages.find((s) => s.view.contentWindow === e.source);
    if (!stage) return;
    if (data.ready) stage.onReady();
    if (data.state) stage.onState(data.state);
  });
}
