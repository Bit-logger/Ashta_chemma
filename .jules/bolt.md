## 2024-05-18 - JSON.parse(JSON.stringify()) Performance Bottleneck
**Learning:** In React Native, deeply cloning state objects using `JSON.parse(JSON.stringify())` is significantly slower (up to 20-25x slower) than manual object spreading or shallow copying. This is particularly problematic in game engines where the state is updated frequently (e.g. during animations).
**Action:** Replace `JSON.parse(JSON.stringify())` with manual cloning using object spread syntax for better performance.
