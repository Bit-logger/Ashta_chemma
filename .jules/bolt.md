## 2025-06-25 - Extracted static complex SVG components and memoized them
**Learning:** In React Native applications using `react-native-svg`, keeping static complex SVG backgrounds inline within a frequently updating component (like a game board) causes severe frame drops during animations due to unnecessary re-renders of the large element tree.
**Action:** Extract the complex, static SVG content into a separate component and wrap it in `React.memo` to dramatically cut down on re-renders, making piece animations smoother.
