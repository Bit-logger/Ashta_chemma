## 2024-05-14 - React Native Complex SVG Rendering Bottleneck
**Learning:** Complex static SVGs (like game board grids with many lines and elements) inside React Native components cause severe frame drops and performance bottlenecks if they re-render on every state update (e.g., during piece movement animations).
**Action:** Extract static SVG elements into separate components and wrap them in `React.memo` with a `displayName`. Ensure function props passed to these memoized components are wrapped in `React.useCallback` to maintain reference stability and prevent unnecessary re-renders.
