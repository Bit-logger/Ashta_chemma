## 2024-05-18 - [Static SVG Performance Bottleneck]
**Learning:** Static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations because they re-render on every state change if not memoized.
**Action:** Extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders.
