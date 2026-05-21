Original prompt: アニメーションつけたい

## Progress

- Decided to add beginner-friendly CSS/JS animations before moving to Three.js.
- Target animation set: animated omikuji cup inside the draw button, flying fortune slip during draw, and small sparkles when the result appears.
- Added HTML/CSS/JS for the animated omikuji box, flying slip, result sparkles, and `window.render_game_to_text` for test visibility.
- Verified desktop and mobile with Playwright fallback because the skill-provided web game client failed to load `playwright-core` in this environment.
- Started the next step: add a transparent Three.js canvas with a rotating 3D omikuji box that reacts to draw events.
- Moved the Three.js scene into its own unframed top stage after the background placement clipped the model.
- Vendored Three.js `0.177.0` files locally under `docs/vendor/` so the scene does not depend on a CDN at runtime.
- Verified desktop and mobile screenshots, draw interaction, and canvas pixel output for the 3D scene.
- Created branch `codex/3d-omikuji-upgrade` for the model-first GUI redesign.
- Replaced the small decorative model with a large cylinder-style omikuji box, table stage, clickable canvas, flying draw stick, and in-stage result paper.
- Verified the upgraded branch on desktop and mobile with screenshots, localStorage reload checks, draw-button state checks, and Three.js canvas pixel output.

## TODO

- Next suggestion: add richer paper-unfolding or box texture detail if the branch becomes the new main version.
