## 2026-06-12 - React Native SVG Animation Performance
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations when re-rendered alongside moving pieces.
**Action:** Extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders during state updates (like piece movement).
