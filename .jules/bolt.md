## 2024-05-15 - React Native SVG Board Optimization
**Learning:** Extracting heavy SVG components like `<Svg>`, `<Defs>`, `<RadialGradient>`, and grids into a separate `React.memo()` component is critical for preventing unnecessary re-renders in React Native. In this codebase, the `Board` component was re-rendering on every game state change (which happens every 200ms during animation), causing lag.
**Action:** Always check if static UI layers (especially SVGs or large lists) are being re-rendered by rapidly changing parent state. Extract and memoize static visual layers.
