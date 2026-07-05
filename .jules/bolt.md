## 2024-07-05 - Extracting Static SVG Backgrounds in React Native
**Learning:** Complex static SVGs (like game board grids and safe zone crosses) mixed with dynamically animated components (like moving pieces) can cause severe frame drops and performance bottlenecks during animations.
**Action:** Extract static SVG backgrounds into separate components and wrap them in `React.memo` (with `displayName` explicitly set) to prevent unnecessary re-renders of the expensive SVG elements on every state change.
