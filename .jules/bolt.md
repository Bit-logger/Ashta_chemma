## 2026-07-15 - Memoizing Static SVG Layouts in React Native
**Learning:** In React Native applications using `react-native-svg`, mixing complex static SVG graphics (like board layouts, gridlines) within dynamic components (like the pieces) can cause significant frame drops and unneeded re-renders when the dynamic state changes frequently.
**Action:** Extract static complex SVG elements into their own separate components and wrap them in `React.memo` to decouple their rendering lifecycle from dynamic animations.
