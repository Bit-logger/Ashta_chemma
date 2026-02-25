// Board Dimensions
export const BOARD_SIZE = 5;

export type BoardType = 'standard' | 'innerGadulu';

// The indexes of the 5 Safe Zones (Kachhas) in a 1D 0-24 array of the 5x5 grid
// Center is 12.
// Player 1 Start: 22 (Bottom)
// Player 2 Start: 14 (Right)
// Player 3 Start: 2 (Top)
// Player 4 Start: 10 (Left)
export const STANDARD_SAFE_ZONES = [2, 10, 12, 14, 22];

// Inner Gadulu adds 4 inner safe zones in a diamond pattern around the center
export const INNER_GADULU_SAFE_ZONES = [2, 6, 8, 10, 12, 14, 16, 18, 22];

export const getSafeZones = (type: BoardType): number[] => {
    return type === 'innerGadulu' ? INNER_GADULU_SAFE_ZONES : STANDARD_SAFE_ZONES;
};

// Each player has a unique path starting from their respective edge safe zone,
// doing a full outer lap, and then spiraling into the center.
export const PLAYER_PATHS: Record<number, number[]> = {
    1: [ // Bottom Start
        22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5, 10, 15, 20, 21,
        // Inner spiral (Clockwise)
        16, 11, 6, 7, 8, 13, 18, 17, 12
    ],
    2: [ // Right Start
        14, 9, 4, 3, 2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19,
        // Inner spiral (Clockwise)
        18, 17, 16, 11, 6, 7, 8, 13, 12
    ],
    3: [ // Top Start
        2, 1, 0, 5, 10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4, 3,
        // Inner spiral (Clockwise)
        8, 13, 18, 17, 16, 11, 6, 7, 12
    ],
    4: [ // Left Start
        10, 15, 20, 21, 22, 23, 24, 19, 14, 9, 4, 3, 2, 1, 0, 5,
        // Inner spiral (Clockwise)
        6, 7, 8, 13, 18, 17, 16, 11, 12
    ]
};

export const MAX_PATH_INDEX = 24; // 24 moves required to get to center index 24 (the 25th step)
