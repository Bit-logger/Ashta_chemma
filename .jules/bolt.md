## 2024-03-24 - React Native SVG Render Bottlenecks
**Learning:** In games or complex UIs using `react-native-svg`, heavy background graphics that do not change based on state (like the board grid and textures) will re-render unnecessarily on every parent component update (e.g. piece movement or dice rolls).
**Action:** Extract static SVG elements into their own component and wrap them in `React.memo()` with primitive props.
