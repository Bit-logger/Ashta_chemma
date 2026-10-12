## 2024-05-24 - React Native SVG Animation Overhead
**Learning:** Rendering static SVG elements (like the complex game board with gradients and grid lines) inside a component that updates frequently (e.g. during animations where `gameState` changes frame-by-frame) causes significant unnecessary overhead in this React Native app.
**Action:** Always extract static background SVG elements into a separate `React.memo` wrapped component so they don't re-render on every animation frame.
