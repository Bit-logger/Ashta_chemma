## 2024-06-27 - [Board Background SVG Performance]
**Learning:** In this React Native application, static complex SVGs (like game board backgrounds) cause severe frame drops and performance bottlenecks during piece movement animations when rendered inline in the main board component, as it re-evaluates the entire SVG structure on every state change.
**Action:** Always extract complex, static SVGs into their own separate components and explicitly wrap them in `React.memo` (along with setting `.displayName`) to prevent these unnecessary re-renders.
