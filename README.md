# 🎃 Pumpkin Focus Timer

> **#KiroweenHackathon26** — Kiroween 2026 hackathon submission, built with [Kiro](https://kiro.dev/), AWS's agentic AI IDE.

A Halloween-themed Pomodoro-style focus timer with a twist: as you rack up focus
seconds through the day, a pumpkin **grows through five stages** — seed 🌰 → sprout 🌱 →
small pumpkin 🎃 → big pumpkin 🎃 → glowing jack-o'-lantern 🎃✨.

No build step, no dependencies, no network calls. Open `index.html` and start focusing.

## Why spec-driven?

This app was developed with Kiro's spec-driven workflow. The full spec lives in
[`.kiro/specs/pumpkin-focus-timer/`](.kiro/specs/pumpkin-focus-timer/):

- `requirements.md` — user stories + EARS-format functional requirements
- `design.md` — architecture, state machine, data model, growth-stage thresholds
- `tasks.md` — task breakdown with completion log

The spec came first; the implementation followed it. That's the part of Kiro we
like most: instead of guessing what "make a timer app" means, the agent writes
requirements you can review and steer before any code exists.

## Features

- 15 / 25 / 50 minute focus presets with pause/resume/reset
- Five pumpkin growth stages driven by total focused seconds today
- Celebration overlay + spooky Web Audio chime on completion
- Daily stats (minutes focused, session count) persisted in `localStorage`
- In-memory fallback when storage is unavailable; midnight rollover resets
- Fully offline, responsive down to 360px, respects `prefers-reduced-motion`

## Run it

```bash
# just open it
start index.html      # Windows
open index.html       # macOS
```

Or serve it with any static server:

```bash
python -m http.server 8080
```

## Built with

- Vanilla HTML / CSS / JavaScript
- Kiro (spec-driven development: requirements → design → tasks)

---

Made for **Kiroween 2026** on Devpost. Happy shipping, and happy Halloween. 🎃👻
