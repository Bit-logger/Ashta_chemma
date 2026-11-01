## 2025-02-05 - Avoid JSON.parse(JSON.stringify) for State Cloning
**Learning:** Using `JSON.parse(JSON.stringify())` to deep clone state during rapid animation frames or game engine evaluations introduces significant CPU and garbage collection overhead, leading to frame drops in React Native apps.
**Action:** Always prefer shallow cloning (using spread operators) for state updates, especially within `setTimeout` loops used for animations.
