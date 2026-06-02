## 2024-06-02 - React Native Render Loop Complexity
**Learning:** Found an O(N²) nested array iteration used to compute visual offsets within a component (`Board.tsx`) map function. When paired with high-frequency state updates (like piece animation ticks where a piece moves one cell at a time and updates state per step), this causes extreme performance degradation, as the O(N²) calculation is run on every frame for every rendered piece.
**Action:** Replace nested array filtering/counting inside render loops with an O(1) or O(N) pre-computed lookup map (`useMemo`) outside the piece iteration, effectively converting O(P * O) time complexity during render to O(P) render time + O(P) memo time.

## 2024-06-02 - React Native SVG Memoization
**Learning:** React Native SVG components (`<Svg>`, `<Line>`, `<Rect>`) are notoriously expensive to reconcile over the JS-to-Native bridge. Re-rendering a static 5x5 grid with 50+ background SVG elements on every tick of an animation loop significantly degraded FPS.
**Action:** Always wrap complex, static SVG backgrounds in `React.useMemo` when the parent component is subjected to rapid state updates (like animations). Only include structural props (boardSize, cellSize) in the dependency array.
