## 2024-05-18 - Extracting Static Complex SVGs
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations if they re-render.
**Action:** Extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders.
