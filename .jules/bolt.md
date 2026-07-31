## 2023-10-27 - Replace JSON.parse(JSON.stringify()) with custom deep clone function
**Learning:** `JSON.parse(JSON.stringify())` is used extensively in the app to clone the state, such as the `GameState`, during tight animation loops (`setTimeout`). This can cause severe performance bottleneck.
**Action:** Always refactor `JSON.parse(JSON.stringify())` into an explicit shallow map/spread for the state array fields to prevent lag in hot paths.
