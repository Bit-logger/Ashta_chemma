## 2024-05-14 - SVG Animation Bottlenecks in React Native
**Learning:** State-driven step-by-step animations (setting state every 200ms) in React Native cause the entire screen to re-render. If the screen contains complex SVGs (like a game board with gradients, lines, and 16 seeds), these SVGs get re-rendered on every animation frame, leading to jank and dropped frames on lower-end devices.
**Action:** Always memoize static, complex SVG components (using `React.memo` or `useMemo`) that sit in the same component tree as frequently updating state, especially during animations.
