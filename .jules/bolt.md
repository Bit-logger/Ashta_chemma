## 2025-02-02 - React Native Game State Cloning
**Learning:** Found heavy usage of `JSON.parse(JSON.stringify())` to deeply clone the entire game state in game animation loops (running every 200ms). This is a severe performance bottleneck and causes heavy Garbage Collection pressure, making the UI janky.
**Action:** Replaced it with precise immutable shallow updates (spread operators + `.map()` loops on arrays). Avoid deep cloning completely, especially on game animations frames.
