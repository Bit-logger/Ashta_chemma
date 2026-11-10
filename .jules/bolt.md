## 2024-11-10 - React.memo for generic piece component
**Learning:** In a highly animated board game with many individual pieces that share identical underlying states during simple moves, re-rendering every single piece unnecessarily slows down performance.
**Action:** Always verify if high-frequency re-rendered generic elements like PlayerPiece or TamarindSeed could benefit from React.memo.
