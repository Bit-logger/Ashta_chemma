## 2026-10-14 - Optimize Static SVG React Native
**Learning:** React Native Svg elements containing large amounts of static grid lines or gradients re-render on every props change of the parent component, causing significant lag when frequent state updates occur (e.g. game loop or animations).
**Action:** Wrap the static portion of complex SVGs in a `React.useMemo` block, keeping dynamic overlay components (like absolute positioned interactive pieces) outside the memoized block.
