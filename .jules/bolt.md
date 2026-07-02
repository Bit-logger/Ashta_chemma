## 2026-07-02 - Optimize SVG rendering during animations
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) should be extracted into separate components and wrapped in `React.memo` to prevent severe frame drops and performance bottlenecks during piece movement animations.
**Action:** Always extract static SVG backgrounds into memoized components.
