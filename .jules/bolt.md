## 2024-06-25 - React Native GC Stutter Fix
**Learning:** `JSON.parse(JSON.stringify())` blocks the JS thread and causes micro-stutters/GC pauses when used for deep cloning React state inside animation loops or intervals, specifically observed in the 60fps recursive `setTimeout` logic in `animateStep`.
**Action:** Use targeted shallow copies for deep object structures in high-frequency React state updates rather than full serialization/deserialization.
