## 2026-07-03 - Extracting static SVGs into memoized components
**Learning:** In this React Native app, complex static SVGs (like the grid and safe zones on the game board) can cause severe frame drops and performance bottlenecks during piece movement animations if they re-render along with frequent state changes.
**Action:** Always extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders. Ensure to explicitly set the `.displayName` property for ESLint rules.
