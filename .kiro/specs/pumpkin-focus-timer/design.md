# Pumpkin Focus Timer — Design

## Architecture

Single-page vanilla web app, three files:

```
index.html   — structure: header, stage strip, timer card, controls, stats footer
styles.css   — theme (dark spooky gradient), stage animations, reduced-motion support
app.js       — state machine, timer loop, persistence, Web Audio chime
```

No modules, no build step. `app.js` is loaded with `defer`.

## State Machine

```
IDLE ──start──▶ RUNNING ──pause──▶ PAUSED
  ▲                 │                 │
  └──────reset───────┴────resume───────┘
RUNNING ──countdown==0──▶ COMPLETED (overlay + chime) ──dismiss──▶ IDLE
```

Timer uses a `requestAnimationFrame`-free approach: `setInterval(250ms)` comparing
`Date.now()` against `endAt` timestamps, so it tolerates tab throttling.

## Data Model

```js
state = {
  durationSec: 1500,     // current preset
  remainingSec: 1500,
  phase: 'idle'|'running'|'paused'|'completed',
  todaySeconds: 0,       // persisted
  lastActiveDate: 'YYYY-MM-DD' // persisted, resets todaySeconds on rollover
}
```

Persistence: `localStorage['pumpkin-focus-state']` JSON. Access wrapped in try/catch.

## Growth Stages

| Stage | Threshold (today seconds) | Visual |
|---|---|---|
| 0 Seed | 0 | 🌰 + "Plant a seed" |
| 1 Sprout | 300 | 🌱 |
| 2 Small pumpkin | 900 | 🎃 small (scale .7) |
| 3 Big pumpkin | 1800 | 🎃 full size |
| 4 Jack-o'-lantern | 3600 | 🎃 glow filter + pulsing |

Stage computed from `todaySeconds`; transitions get a `stage-pop` CSS animation.

## Audio

`playChime()` builds two oscillators (minor-third arpeggio) with a decaying gain node.
Created lazily on first user gesture to satisfy autoplay policies.

## Error Handling

- localStorage failures → in-memory fallback object.
- Invalid persisted JSON → reset to defaults.
- Date rollover (new day) → reset `todaySeconds`, keep app running.

## Accessibility

- Buttons have aria-labels; timer announces via `aria-live="polite"` on phase change.
- `prefers-reduced-motion: reduce` disables pop/glow animations.
