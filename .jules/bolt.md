## 2024-05-24 - Memoizing Static SVGs for Animation Performance
**Learning:** Complex static SVGs (like game board backgrounds with gradients, grids, and safe zone markers) inside React Native components cause severe frame drops and performance bottlenecks if they re-render during frequent state updates like piece movement animations.
**Action:** Always extract static, unchanging SVG layouts into a separate component and wrap them in `React.memo` (and remember to set `.displayName` explicitly) when placed alongside dynamic state-driven child components in a parent container.
