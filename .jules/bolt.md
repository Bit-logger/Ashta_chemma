## 2026-08-11 - Memoize Static Board SVG in React Native
**Learning:** During continuous state updates (like piece-by-piece movement animation which rapidly updates `gameState`), complex static SVG layers (like the 5x5 game board grid and safe zones) in the same component cause unnecessary CPU drain by re-rendering entirely.
**Action:** Extract heavy static SVG layouts into a `useMemo` hook that depends only on immutable or rarely changing values (like `boardType` and layout `Dimensions`), while allowing dynamic elements (like player pieces) to render separately outside the memoized block.
