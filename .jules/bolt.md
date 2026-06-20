## 2024-06-21 - Extract static SVGs to avoid frame drops
**Learning:** In this React Native app, large static SVGs used as backgrounds (like game boards with many lines/shapes) will cause severe frame drops and performance bottlenecks if re-rendered alongside piece movement animations.
**Action:** Extract static, complex SVGs into separate components and wrap them in `React.memo` to prevent them from re-rendering unless their explicit props change.
