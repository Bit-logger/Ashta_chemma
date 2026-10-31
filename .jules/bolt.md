## 2024-03-24 - Avoiding JSON.parse/stringify in Game State
**Learning:** In a highly interactive game, using `JSON.parse(JSON.stringify(gameState))` for deep cloning state on every step of a piece's animation or turn action causes significant performance overhead and unneeded garbage collection pressure.
**Action:** Replaced with a manual, specialized shallow clone utility (`cloneGameState`) to clone only what's necessary, improving frame rates and responsiveness during state updates.
