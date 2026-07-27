## 2026-07-27 - JSON.parse/stringify bottleneck
**Learning:** React Native applications and game loops often suffer from deep cloning objects via `JSON.parse(JSON.stringify())`. It is significantly slower than shallow copying or manual deep copying. For the `GameState` object in this game, cloning is called frequently on each animation frame or piece move.
**Action:** Replace `JSON.parse(JSON.stringify())` with a dedicated, custom `cloneGameState` function that handles the exact shape of `GameState` for maximum speed.
