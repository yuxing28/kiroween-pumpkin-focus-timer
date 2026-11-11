/* Pumpkin Focus Timer — Kiroween 2026 (#KiroweenHackathon26)
 * Built with Kiro spec-driven development: see .kiro/specs/pumpkin-focus-timer/
 */
(() => {
  "use strict";

  const STAGES = [
    { at: 0, emoji: "🌰" },
    { at: 300, emoji: "🌱" },
    { at: 900, emoji: "🎃", small: true },
    { at: 1800, emoji: "🎃" },
    { at: 3600, emoji: "🎃", glow: true },
  ];
  const STORE_KEY = "pumpkin-focus-state";

  // QA smoke mode (?smoke=1): 15-second sessions with compressed growth
  // thresholds, used for automated QA and quick demos. See README.
  const SMOKE = new URLSearchParams(location.search).has("smoke");
  const STAGE_SCALE = SMOKE ? 0.01 : 1;

  const $ = (sel) => document.querySelector(sel);
  const els = {
    timer: $("#timer"),
    hero: $("#hero-emoji"),
    chips: Array.from(document.querySelectorAll(".chip")),
    primary: $("#btn-primary"),
    reset: $("#btn-reset"),
    overlay: $("#overlay"),
    overlayText: $("#overlay-text"),
    dismiss: $("#btn-dismiss"),
    statMinutes: $("#stat-minutes"),
    statSessions: $("#stat-sessions"),
    stageEls: Array.from(document.querySelectorAll(".stage")),
  };

  // ---- persistence (try/catch -> in-memory fallback) ----
  const memory = {};
  const load = () => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return memory[STORE_KEY] || {}; }
  };
  const save = (data) => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch { memory[STORE_KEY] = data; }
  };

  const todayStr = () => new Date().toISOString().slice(0, 10);
  const persisted = load();
  let todaySeconds =
    persisted.lastActiveDate === todayStr() ? Number(persisted.todaySeconds) || 0 : 0;
  let sessions = persisted.sessions || 0;

  // ---- state machine ----
  let state = {
    phase: "idle",
    durationSec: SMOKE ? 15 : 1500,
    remainingSec: SMOKE ? 15 : 1500,
    endAt: 0,
  };
  let tickId = null;
  let shownStage = -1;

  function fmt(sec) {
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function render() {
    els.timer.textContent = fmt(Math.max(0, state.remainingSec));
    els.timer.classList.toggle("done", state.phase === "completed");

    const stageIdx = STAGES.reduce(
      (acc, st, i) => (todaySeconds >= st.at * STAGE_SCALE ? i : acc), 0);
    if (stageIdx !== shownStage) {
      shownStage = stageIdx;
      const st = STAGES[stageIdx];
      els.hero.textContent = st.emoji;
      els.hero.classList.toggle("small", !!st.small);
      els.hero.classList.toggle("glowing", !!st.glow);
      els.hero.classList.remove("stage-pop");
      void els.hero.offsetWidth; // restart animation
      els.hero.classList.add("stage-pop");
      els.stageEls.forEach((el, i) =>
        el.classList.toggle("reached", i <= stageIdx));
    }

    els.primary.textContent =
      state.phase === "running" ? "Pause"
      : state.phase === "paused" ? "Resume"
      : "Start Focus";

    els.statMinutes.textContent = `${Math.floor(todaySeconds / 60)} min focused today`;
    els.statSessions.textContent = `${sessions} session${sessions === 1 ? "" : "s"}`;
  }

  function persist() {
    save({ todaySeconds, lastActiveDate: todayStr(), sessions });
  }

  function tick() {
    const remaining = Math.round((state.endAt - Date.now()) / 1000);
    if (remaining <= 0) {
      complete();
    } else {
      state.remainingSec = remaining;
      todaySeconds += 0.25; // each tick is 250ms of focus
      render();
      if (Math.round(todaySeconds * 4) % 8 === 0) persist(); // every ~2s
    }
  }

  function start() {
    state.endAt = Date.now() + state.remainingSec * 1000;
    state.phase = "running";
    tickId = setInterval(tick, 250);
    render();
  }

  function pause() {
    clearInterval(tickId);
    state.remainingSec = Math.max(0, Math.round((state.endAt - Date.now()) / 1000));
    state.phase = "paused";
    persist();
    render();
  }

  function reset() {
    clearInterval(tickId);
    state.phase = "idle";
    state.remainingSec = state.durationSec;
    persist();
    render();
  }

  function complete() {
    clearInterval(tickId);
    state.phase = "completed";
    state.remainingSec = 0;
    sessions += 1;
    persist();
    playChime();
    const grown = shownStage >= 4
      ? "Your jack-o'-lantern is glowing. 🎃"
      : "The pumpkin grew a little today. 🌱";
    els.overlayText.textContent = `${Math.round(state.durationSec / 60)} minutes done. ${grown}`;
    els.overlay.classList.remove("hidden");
    render();
  }

  // ---- spooky chime (Web Audio, no assets) ----
  let audioCtx = null;
  function playChime() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = [440, 523.25, 659.25]; // A4, C5, E5
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t0 = audioCtx.currentTime + i * 0.18;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 1);
      });
    } catch { /* audio unavailable — stay silent */ }
  }

  // ---- events ----
  els.primary.addEventListener("click", () => {
    if (state.phase === "running") pause();
    else if (state.phase === "paused" || state.phase === "completed") {
      if (state.phase === "completed") state.remainingSec = state.durationSec;
      start();
    }
  });
  els.reset.addEventListener("click", reset);
  els.dismiss.addEventListener("click", () => {
    els.overlay.classList.add("hidden");
    state.phase = "idle";
    state.remainingSec = state.durationSec;
    render();
  });
  els.chips.forEach((chip) => chip.addEventListener("click", () => {
    if (state.phase === "running" || state.phase === "paused") return;
    els.chips.forEach((c) => c.classList.toggle("selected", c === chip));
    state.durationSec = Number(chip.dataset.min) * 60;
    state.remainingSec = state.durationSec;
    render();
  }));

  if (SMOKE) {
    const smokeChip = document.createElement("button");
    smokeChip.className = "chip";
    smokeChip.dataset.min = "0.25";
    smokeChip.textContent = "15 sec";
    els.chips.forEach((c) => c.classList.remove("selected"));
    smokeChip.classList.add("selected");
    els.chips[0].parentElement.appendChild(smokeChip);
    smokeChip.addEventListener("click", () => els.chips
      .concat(smokeChip).forEach((c) =>
        c.classList.toggle("selected", c === smokeChip)));
  }

  render();
})();
