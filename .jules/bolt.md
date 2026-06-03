## 2025-02-12 - SVG Performance Bottlenecks in React Native Games
**Learning:** Animated, static SVG components in React Native cause large rendering overhead when not memoized, due to constant bridge communication and reconciler evaluation on every state change.
**Action:** Always wrap static SVG components (like game boards or background grids) in `useMemo` or `React.memo` when they are rendered alongside highly dynamic/animated components.
