## 2024-08-04 - SVG Re-rendering Bottlenecks in React Native
**Learning:** `react-native-svg` elements map directly to native views or complex canvas drawings and are very expensive to re-render in loops. Static SVG backgrounds should always be extracted using `useMemo` when combined with frequently changing game state (like piece positions).
**Action:** Always check if a monolithic UI component combines static heavy SVGs with fast-updating React state, and separate them.
