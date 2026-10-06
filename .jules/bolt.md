## 2024-05-18 - JSON Serialization bottleneck
**Learning:** React game state updates using `JSON.parse(JSON.stringify(prevState))` inside an animation loop (`animateStep` using `setTimeout`) causes massive performance drops (~900ms per 10k iterations vs ~40ms for manual object spreading).
**Action:** Always prefer a manual `cloneGameState` deep clone using object spreads in game engines that use frequent state mutations, particularly React where `useState` hooks are hit multiple times a second during animations.
