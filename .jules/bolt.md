## 2023-11-03 - [Prevent SVG Re-renders with React.memo in Animations]
**Learning:** Rendering complex SVGs with gradients inside components that update state frequently (like `GameScreen.tsx` updating `Board.tsx` every 200ms during an animation) causes significant re-rendering lag and jank in React Native.
**Action:** Extract large static visual components (like grid lines and board backgrounds) into their own components wrapped in `React.memo` so they aren't recalculated when sibling components (like moving pieces) update their position.

## 2023-11-03 - [Shallow State Cloning for Frequent Updates]
**Learning:** Using `JSON.parse(JSON.stringify(state))` inside a fast loop like an animation tick (e.g. 200ms `animateStep`) creates garbage collection overhead and tanks framerates due to slow serialization.
**Action:** Use shallow cloning with the spread operator (`...`) combined with array `map()` specifically to target only the properties that need mutation.
