## 2024-10-18 - Optimized Svg Board Re-Renders
**Learning:** `react-native-svg` components inside heavily updated contexts (like game loops or ticking screens) are extremely costly.
**Action:** Always extract and `React.memo()` heavy SVG layers (especially backgrounds that rely on primitive values) to prevent the entire view tree from reconciling during animations or frequent updates.
