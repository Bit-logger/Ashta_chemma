## 2024-05-18 - Replacing JSON.parse(JSON.stringify()) with targeted structural cloning
**Learning:** Using `JSON.parse(JSON.stringify())` to deep clone state for immutability is extremely inefficient, especially when called frequently like in an animation loop.
**Action:** Replace `JSON.parse(JSON.stringify())` with structural sharing via spread operators. It's much faster, maintains immutability, and avoids expensive serialization/deserialization cycles.
