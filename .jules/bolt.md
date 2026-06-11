## 2024-06-11 - Optimize Board Background rendering
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations due to continuous re-rendering along with the pieces if they are in the same component.
**Action:** Extract static SVG backgrounds into separate components and wrap them in `React.memo` to ensure they are only rendered once.
