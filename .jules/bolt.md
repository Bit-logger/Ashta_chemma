## 2024-05-24 - Board Re-render Bottleneck
**Learning:** Piece animation loops via game state updates, causing the entire `Board` and its complex SVG elements (grids, gradients, crosses) to re-render constantly.
**Action:** Extract the static SVG background into a `React.memo` wrapped component to prevent unnecessary re-renders of the complex SVG tree during the high-frequency animation state updates.
