## 2025-02-12 - Prevent SVG Re-renders in React Native
**Learning:** In React Native, large complex SVGs (like game boards or custom graphics) can severely impact performance if they re-render on every state change.
**Action:** Extract static parts of SVGs into their own components and wrap them in `React.memo()`. Only pass primitive props to ensure shallow equality checks work. Use `React.memo` on smaller recurring elements like pieces and seeds too.
