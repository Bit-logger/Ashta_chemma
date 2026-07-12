## 2024-03-21 - Extract complex SVG to avoid severe frame drops
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks if they re-render during piece movement animations.
**Action:** Extract complex static SVGs into separate components and wrap them in `React.memo` to prevent unneeded re-renders during state-heavy animations. Also, explicitly set `.displayName` on the memoized component.
