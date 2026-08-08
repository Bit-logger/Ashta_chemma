## 2023-10-27 - [Memoize static SVG background in Board.tsx]
**Learning:** The React Native SVG board rendering loops were executing on every single animation frame, causing major lag during piece movement.
**Action:** Use React.useMemo to memoize the static grid and background elements, allowing pieces to animate over them smoothly without triggering SVG redraws.
