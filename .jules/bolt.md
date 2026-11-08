## 2024-11-08 - Avoiding Deep Clones in React Native Animation Loops
**Learning:** Using `JSON.parse(JSON.stringify())` for state updates inside high-frequency animation loops (like moving game pieces) causes severe micro-stutters. It forces synchronous serialization and deserialization, putting immense pressure on the JS thread and garbage collector.
**Action:** Always use manual immutable spreads (e.g., `...state`, `.map()`) instead of deep clones, especially for complex state objects and inside `requestAnimationFrame`, `setTimeout` loops, or complex state recalculations in engines.
