## 2026-06-29 - Extract Static SVG Backgrounds
**Learning:** Rendering complex static SVGs (like game board backgrounds) directly inside a component that re-renders frequently (like a game board where pieces are constantly moving and updating the state) causes severe frame drops and performance bottlenecks.
**Action:** Extract static complex SVGs into separate components and wrap them in `React.memo` to prevent unnecessary re-renders. Also, remember to explicitly set the `.displayName` property on the memoized component to satisfy ESLint rules.
