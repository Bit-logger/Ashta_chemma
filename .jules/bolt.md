## 2024-10-04 - React Native SVG Memoization
**Learning:** Complex SVG elements (like `Svg`, `RadialGradient`, `Line` and `Path`) in React Native are significantly heavier to render than simple Views. In a board game where the board background is static but pieces move frequently, re-rendering the SVG grid on every state update causes unnecessary JS thread overhead and frame drops.
**Action:** Extract static SVG layouts into separate components and wrap them in `React.memo()`. Do the same for complex SVG game pieces that only rely on simple props.
