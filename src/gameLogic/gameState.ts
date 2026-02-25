import { MAX_PATH_INDEX, getSafeZones, BoardType, PLAYER_PATHS } from '../constants/board';

export type PieceState = {
    id: string; // e.g. 'P1-0'
    ownerId: number;
    position: number; // -1 means home (not on board). 0 to MAX_PATH_INDEX is on board path. MAX_PATH_INDEX is absolute center win.
    isFinished: boolean;
};

export type PlayerState = {
    id: number;
    name: string;
    pieceType: string;
    hasFirstKill: boolean; // Crucial 'Golden Rule' - must kill to enter inner spiral
    pieces: PieceState[];
    rank: number | null; // Tracks 1st, 2nd, 3rd place finishes
};

export type GameState = {
    players: PlayerState[];
    currentTurnPlayerId: number;
    currentRollValue: number | null;
    movingPieceId: string | null;
    winnerId: number | null;
    boardType: BoardType;
};

// Initializer
export const initializeGame = (playersData: { id: number; name: string; pieceType: string }[], boardType: BoardType = 'standard'): GameState => {
    const players = playersData.map((p) => ({
        ...p,
        hasFirstKill: false,
        rank: null,
        pieces: Array.from({ length: 4 }).map((_, i) => ({
            id: `${p.id}-${i}`,
            ownerId: p.id,
            position: -1, // Start off-board
            isFinished: false,
        })),
    }));

    return {
        players,
        currentTurnPlayerId: playersData[0]?.id || 1,
        currentRollValue: null,
        movingPieceId: null,
        winnerId: null,
        boardType,
    };
};

export const canPieceMove = (piece: PieceState, rollValue: number, player: PlayerState, boardType: BoardType): boolean => {
    if (piece.isFinished) return false;

    // Traditional Rule: Must roll 4 (Chamma) or 8 (Ashta) to enter the board
    if (piece.position === -1 && ![4, 8].includes(rollValue)) {
        return false;
    }

    // If entering the board, target is index 0. Otherwise, move by rollValue.
    let nextTarget = piece.position === -1 ? 0 : piece.position + rollValue;

    // Golden Rule check & Continuous Looping:
    // The outer perimeter is indices 0 through 15. The spiral (inner) starts at 16.
    // A player MUST HAVE A KILL to voluntarily move past index 15.
    // If they reach index 15 and roll e.g. a 3, without a kill, they wrap to index 2 (15->0, 15->1, 15->2).
    if (piece.position !== -1 && piece.position <= 15) {
        if (!player.hasFirstKill) {
            // They don't have a kill, so they are locked into the 0-15 loop.
            // Calculate their target by applying modulo 16 arithmetic for the steps AFTER 15.
            if (nextTarget > 15) {
                const leftoverSteps = nextTarget - 16;
                nextTarget = leftoverSteps; // Loops back to 0, 1, etc...
            }
        }
    } else if (piece.position >= 16) {
        // They are already in the inner spiral. Can't overshoot center.
        if (nextTarget > MAX_PATH_INDEX) {
            return false;
        }
    }

    // New Rule: Two pieces from the same player CANNOT share the same square UNLESS it's a Safe Zone
    const physicalTargetSquare = PLAYER_PATHS[player.id][nextTarget];

    if (!getSafeZones(boardType).includes(physicalTargetSquare)) {
        // Check if any of THIS player's other pieces are already sitting on this exact physical square
        const isOccupiedBySelf = player.pieces.some(p =>
            p.id !== piece.id && // Don't match the moving piece against itself
            p.position !== -1 && // Must be on board
            p.position <= MAX_PATH_INDEX && // Not finished
            PLAYER_PATHS[player.id][p.position] === physicalTargetSquare
        );

        if (isOccupiedBySelf) {
            return false; // Illegal move, cannot stack on yourself outside a safe zone
        }
    }

    return true;
};
