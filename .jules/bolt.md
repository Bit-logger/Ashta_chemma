## 2024-06-19 - Extracted static SVG board background
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) must be extracted into separate components and wrapped in React.memo to prevent severe frame drops and performance bottlenecks during piece movement animations.
**Action:** Always extract and memoize complex static SVGs that sit alongside frequently re-rendered dynamic elements.
