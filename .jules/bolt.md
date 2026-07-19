## 2024-05-24 - React Native SVG Performance Bottleneck
**Learning:** Complex static `<Svg>` layers in React Native components (like a game board) can cause severe frame drops if left inline within components that re-render frequently (e.g., when game state updates).
**Action:** Always extract complex, static SVG backgrounds into separate components and wrap them in `React.memo` to prevent unnecessary re-renders during state updates.
