## 2024-07-25 - Avoid JSON deep clones for fast state updates
**Learning:** Found that `JSON.parse(JSON.stringify())` was used for cloning deep state variables which can be extremely slow and can block the main thread, especially during continuous rapid state updates like animation frames.
**Action:** Use spread operators and shallow cloning via immutable update patterns (`...state, array: state.array.map(...)`) or `structuredClone` for necessary deep clones.
