## 2023-10-23 - Prevented heavy SVG static board re-rendering during animation loops
**Learning:** In React Native games with continuous animation loops (e.g. updating state every 200ms for piece movement), complex static SVG backgrounds cause severe frame drops and memory pressure if they are not isolated and memoized correctly.
**Action:** Extract large static visual elements into separate components wrapped in `React.memo` to prevent unnecessary re-rendering triggered by game state changes happening in the parent component.
