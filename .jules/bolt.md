## 2026-06-22 - Extract static SVGs into memoized components
**Learning:** In this React Native codebase, complex SVG game boards (grids, shadows, cross marks) re-rendering on every animation frame causes significant frame drops and lag during piece movement.
**Action:** Extract static SVG elements into separate components (like `BoardBackground`) and wrap them in `React.memo` so they only render once when the game loads, rather than syncing with rapid `gameState` updates during animations.
