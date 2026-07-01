## 2025-07-01 - [Memoizing Static SVGs in React Native]
**Learning:** In this React Native app, complex static SVGs (like game board backgrounds with many paths/shapes) cause severe frame drops and performance bottlenecks during animations (like piece movement) if they are re-rendered on every state change.
**Action:** Extract complex static SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders when the parent component's state changes.
