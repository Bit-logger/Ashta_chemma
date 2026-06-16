## 2026-06-16 - [Memoize Static Complex SVGs]
**Learning:** In this React Native Expo application, complex SVG backgrounds in components re-render during animations or state updates causing severe frame drops.
**Action:** Always extract static SVG elements into separate components wrapped in `React.memo()` to prevent expensive re-renders.
