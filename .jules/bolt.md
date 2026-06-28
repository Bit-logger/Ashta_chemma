Date: 2025-02-23
Learning: `JSON.parse(JSON.stringify(obj))` is significantly slower than manual deep cloning using the spread operator in JavaScript/TypeScript for complex state objects.
Action: Replaced JSON serialization deep cloning with manual spread cloning (structurally copying arrays and nested objects) in `executeMove` within `src/gameLogic/engine.ts`, yielding a ~25x performance improvement.
