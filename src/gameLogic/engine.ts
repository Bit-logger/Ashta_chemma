import { GameState, PieceState } from './gameState';
import { getSafeZones, MAX_PATH_INDEX, PLAYER_PATHS } from '../constants/board';

// Checks if moving a piece to a target square results in a kill
// Returns the ID of the killed piece, or null if no kill
export const checkKill = (
    gameState: GameState,
    physicalTargetSquare: number,
    movingPlayerId: number
): PieceState | null => {
    if (getSafeZones(gameState.boardType).includes(physicalTargetSquare)) {
        return null; // Can't kill on a kachha (safe zone)
    }

    // Look for opponent pieces on this exact square by translating their path progress to physical coordinates
    for (const player of gameState.players) {
        if (player.id !== movingPlayerId) {
            for (const piece of player.pieces) {
                if (piece.position !== -1 && piece.position < MAX_PATH_INDEX) {
                    const physicalPos = PLAYER_PATHS[player.id][piece.position];
                    if (physicalPos === physicalTargetSquare) {
                        return piece; // Found a victim!
                    }
                }
            }
        }
    }

    return null;
};

// Applies the move, handles kills, and updates the game state
// Returns the new state and whether the move scored an extra turn (e.g., reaching center)
export const executeMove = (
    gameState: GameState,
    pieceId: string,
    rollValue: number
): { state: GameState; scoredPoint: boolean } => {
    // Deep clone state to avoid mutation (Redux style)
    const newState = JSON.parse(JSON.stringify(gameState)) as GameState;

    const playerIndex = newState.players.findIndex(p => p.id === newState.currentTurnPlayerId);
    const player = newState.players[playerIndex];
    const pieceIndex = player.pieces.findIndex(p => p.id === pieceId);
    const piece = player.pieces[pieceIndex];

    // Calculate new position progress index
    let nextPosition = piece.position === -1 ? 0 : piece.position + rollValue;

    if (piece.position !== -1 && piece.position <= 15 && !player.hasFirstKill) {
        if (nextPosition > 15) {
            nextPosition = nextPosition - 16; // Wrap around to start of outer loop
        }
    }

    // What physical grid square are they landing on?
    const physicalTargetSquare = PLAYER_PATHS[player.id][nextPosition];

    // Check for kills using the physical coordinate
    const killedPiece = checkKill(newState, physicalTargetSquare, player.id);

    if (killedPiece) {
        // Send victim home
        const victimPlayer = newState.players.find(p => p.id === killedPiece.ownerId);
        if (victimPlayer) {
            const vPiece = victimPlayer.pieces.find(p => p.id === killedPiece.id);
            if (vPiece) vPiece.position = -1; // Sent back!
        }

        // Grant first kill right if they didn't have it
        player.hasFirstKill = true;
    }

    let scoredPoint = false;

    // Apply move
    piece.position = nextPosition;
    if (piece.position === MAX_PATH_INDEX) {
        piece.isFinished = true;
        scoredPoint = true; // Grabbing center grants an extra turn

        // Check for player completion
        const isPlayerFinished = player.pieces.every(p => p.isFinished);
        if (isPlayerFinished && !player.rank) {
            const currentRanks = newState.players.map(p => p.rank || 0);
            const maxRank = Math.max(0, ...currentRanks);
            player.rank = maxRank + 1;
        }
    }

    newState.movingPieceId = null;
    newState.currentRollValue = null;

    return { state: newState, scoredPoint };
};
