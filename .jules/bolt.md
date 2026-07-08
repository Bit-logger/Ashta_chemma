## 2026-07-08 - Memoize static complex SVGs
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) should be extracted into separate components and wrapped in `React.memo` to prevent severe frame drops and performance bottlenecks during piece movement animations.
**Action:** Always extract static SVG elements into separate memoized components when the parent component has frequent state updates (e.g. game animations).
