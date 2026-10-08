## 2024-10-09 - JSON.parse(JSON.stringify()) State Mutation Bottleneck
**Learning:** Found that using `JSON.parse(JSON.stringify())` to deep clone state for React updates blocks the main thread severely, especially with animations and deep structures like GameState.
**Action:** Replaced `JSON.parse(JSON.stringify())` with a manual spread-operator based `cloneGameState` function for faster clones.
