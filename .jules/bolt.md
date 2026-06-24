
## 2024-05-18 - Memoize static SVG board background
**Learning:** In this React Native app, complex SVGs used for the game board background (like textures and grids) cause severe frame drops and performance bottlenecks if they are re-rendered unnecessarily during piece movement animations.
**Action:** Extract static complex SVGs into separate components and wrap them in `React.memo()` to prevent re-renders when parent state (like player turn or piece positions) changes.
