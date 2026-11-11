# Pumpkin Focus Timer — Requirements

## Overview

A Halloween-themed Pomodoro-style focus timer built as a single-page web app.
A pumpkin grows (seed → sprout → small pumpkin → big pumpkin → glowing jack-o'-lantern)
as the user accumulates focus time. Session stats are stored locally.

This project is the Kiroween 2026 hackathon submission for **#KiroweenHackathon26**,
built with Kiro's spec-driven development workflow (requirements → design → tasks).

## User Stories

1. As a developer, I want to start a focus session so that I can work in distraction-free blocks.
2. As a user, I want visual feedback (a growing pumpkin) so that staying focused feels rewarding.
3. As a user, I want to see my daily focus stats so that I can track my streak.
4. As a user, I want spooky-but-friendly feedback when a session ends so the app stays fun.

## Functional Requirements (EARS)

- WHEN the user clicks "Start Focus", THE SYSTEM SHALL start a 25-minute countdown
  (configurable via preset chips: 15 / 25 / 50 minutes).
- WHEN the user clicks "Pause" or "Resume", THE SYSTEM SHALL suspend/restore the countdown
  without losing elapsed time.
- WHEN the user clicks "Reset", THE SYSTEM SHALL clear the countdown and return the pumpkin to seed stage.
- WHEN a countdown reaches zero, THE SYSTEM SHALL play a short spooky chime (Web Audio API,
  no external assets) and show a celebration overlay with the accumulated minutes.
- WHEN focus seconds are accumulated, THE SYSTEM SHALL map total seconds to 5 growth stages:
  0s seed, 300s sprout, 900s small pumpkin, 1800s big pumpkin, 3600s glowing jack-o'-lantern.
- WHEN the page is loaded, THE SYSTEM SHALL restore today's accumulated seconds and stage
  from localStorage under the key `pumpkin-focus-state`.
- WHEN the accumulated seconds cross a stage threshold, THE SYSTEM SHALL animate the stage
  transition (scale-in + glow).
- IF localStorage is unavailable, THE SYSTEM SHALL run in memory-only mode without errors.

## Non-functional Requirements

- No build step, no external dependencies: runs by opening `index.html`.
- Works offline.
- Responsive: usable at 360px width and up.
- Respects `prefers-reduced-motion`.

## Constraints

- Pure HTML/CSS/JS, no frameworks, no network calls.
- All graphics are emoji/CSS/SVG — no binary assets.
