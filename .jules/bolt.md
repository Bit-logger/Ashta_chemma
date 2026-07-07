## 2024-05-18 - [Memoizing Static SVG Backgrounds]
**Learning:** React Native SVG is heavily dependent on UI thread layout. In a board game app, animating a piece frequently updates parent state. Leaving complex static SVG components (like board grids and shadows) inline causes them to re-render constantly alongside the pieces, tanking FPS.
**Action:** Always extract static, heavy SVG assets into their own components and wrap them in `React.memo` so they remain stable while lightweight dynamic foreground pieces re-render around them.
