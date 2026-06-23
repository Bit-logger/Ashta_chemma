## 2026-06-23 - Extract Static SVGs into Memoized Components for Animation Performance
**Learning:** In this React Native app, complex static SVG elements (such as the game board background and grid lines) re-rendering on every frame during piece movement animations can cause significant frame drops and a janky experience.
**Action:** Always extract static, unchanging SVG components into separate components and wrap them in `React.memo()` to prevent them from participating in the render loop during parent component state updates, especially during animations.
