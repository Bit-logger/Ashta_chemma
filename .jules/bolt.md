## 2024-06-25 - Extracting static complex SVGs

**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) should be extracted into separate components and wrapped in `React.memo` to prevent severe frame drops and performance bottlenecks during piece movement animations.
**Action:** Extract heavy static SVG layouts into isolated components and wrap them in `React.memo` (and explicitly set `.displayName`) when dealing with performance-intensive views over a static background.
