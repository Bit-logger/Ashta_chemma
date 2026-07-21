## 2026-07-21 - Memoize Static SVGs for Animations
**Learning:** In React Native, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during animations (like piece movement) if they re-render.
**Action:** Always extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders.
