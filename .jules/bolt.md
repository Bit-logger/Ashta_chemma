## $(date +%Y-%m-%d) - [Extracting Static SVGs for Performance]
**Learning:** In this React Native app, complex static SVGs (like the board's grid and safe zones) cause severe frame drops and performance bottlenecks during animations (e.g., piece movements) when they are part of a component that re-renders frequently.
**Action:** Always extract complex, static SVGs into their own separate components and wrap them in `React.memo` to prevent them from re-rendering unless explicitly needed.
