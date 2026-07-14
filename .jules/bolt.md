## 2024-07-14 - Static Complex SVGs React Native Optimization
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations because the entire complex SVG tree is re-evaluated when the parent updates.
**Action:** Extract complex static SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders during state changes that do not affect the SVG.
