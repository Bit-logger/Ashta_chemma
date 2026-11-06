## 2025-02-12 - Prevent Re-renders & GC Pauses in Animation Loop
**Learning:** Found two severe performance bottlenecks:
1. React Native diffing 20+ SVG elements on every animation frame for the game board.
2. An expensive `JSON.parse(JSON.stringify())` deep clone running synchronously in a 200ms animation loop inside GameScreen.
**Action:** Always memoize complex static SVGs behind a `React.memo` component, and strictly avoid `JSON.parse/stringify` in animation loops—opt for targeted shallow copying using spread operators (`{...}`).
