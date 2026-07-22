## 2025-02-18 - [Extracted complex SVG backgrounds]
**Learning:** In this React Native app, static complex SVGs (like game board backgrounds) should be extracted into separate components and wrapped in `React.memo` to prevent severe frame drops and performance bottlenecks during piece movement animations.
**Action:** Extract the `BoardBackground` static SVG content into its own React.memo component with explicit `.displayName` in `src/components/Board/BoardBackground.tsx`.
