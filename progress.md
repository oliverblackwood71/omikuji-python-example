Original prompt: アニメーションつけたい

## Progress

- Decided to add beginner-friendly CSS/JS animations before moving to Three.js.
- Target animation set: animated omikuji cup inside the draw button, flying fortune slip during draw, and small sparkles when the result appears.
- Added HTML/CSS/JS for the animated omikuji box, flying slip, result sparkles, and `window.render_game_to_text` for test visibility.
- Verified desktop and mobile with Playwright fallback because the skill-provided web game client failed to load `playwright-core` in this environment.

## TODO

- Next suggestion: consider a lightweight Three.js scene only after the current CSS/JS animation article section is finished.
