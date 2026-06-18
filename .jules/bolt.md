## 2026-06-18 - React Native SVG Performance with Complex Static Graphics
**Learning:** In a React Native app built with Expo, complex static SVGs (like game board backgrounds with gradients, grids, and crosses) can cause severe frame drops and performance bottlenecks during piece movement animations if they re-render on every game state change.
**Action:** Always extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders when only overlay elements (like animated pieces) are changing state.
