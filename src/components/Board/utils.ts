import { BOARD_SIZE } from '../../constants/board';

// Helper to get center coordinates of a specific cell (0-24)
export const getCellCenter = (index: number, cellSize: number) => {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    return {
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
    };
};
