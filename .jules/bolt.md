## 2026-10-21 - Memoize static SVGs to prevent heavy re-renders
**Learning:** Putting completely static SVGs in a React component without memoization causes measurable performance degradation during animations where the parent state updates frequently (like during `gameState` updates in `Board.tsx` and piece animations).
**Action:** Use `React.memo` for components that only render static SVGs based on props (like `PlayerPiece` and `TamarindSeed`), and use `useMemo` for large inline SVG blocks within components that re-render often (like the background grid in `Board.tsx`).
