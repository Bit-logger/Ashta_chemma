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

    // Instead of deep cloning, we will create an immutable copy of only what needs to change.
    // ⚡ Bolt: Eliminate deep clones to prevent micro-stutters and GC pressure.

    const currentPlayerId = gameState.currentTurnPlayerId;
    const player = gameState.players.find(p => p.id === currentPlayerId);
    if (!player) return { state: gameState, scoredPoint: false };

    const piece = player.pieces.find(p => p.id === pieceId);
    if (!piece) return { state: gameState, scoredPoint: false };

    // Calculate new position progress index
    let nextPosition = piece.position === -1 ? 0 : piece.position + rollValue;

    if (piece.position !== -1 && piece.position <= 15 && !player.hasFirstKill) {
        if (nextPosition > 15) {
            nextPosition = nextPosition - 16; // Wrap around to start of outer loop
        }
    }

    // What physical grid square are they landing on?
    const physicalTargetSquare = PLAYER_PATHS[player.id][nextPosition];

    // Check for kills using the physical coordinate (against the original state, as we haven't moved yet)
    const killedPiece = checkKill(gameState, physicalTargetSquare, player.id);

    let hasFirstKill = player.hasFirstKill;
    let victimOwnerId: number | null = null;
    let victimPieceId: string | null = null;

    if (killedPiece) {
        victimOwnerId = killedPiece.ownerId;
        victimPieceId = killedPiece.id;
        hasFirstKill = true;
    }

    let isFinished = false;
    let scoredPoint = false;

    if (nextPosition === MAX_PATH_INDEX) {
        isFinished = true;
        scoredPoint = true; // Grabbing center grants an extra turn
    }

    // Determine if player has completed all pieces (including this one's new state)
    const isPlayerFinished = isFinished && player.pieces.every(p => p.id === pieceId ? true : p.isFinished);
    let newRank = player.rank;

    if (isPlayerFinished && !player.rank) {
        const currentRanks = gameState.players.map(p => p.rank || 0);
        const maxRank = Math.max(0, ...currentRanks);
        newRank = maxRank + 1;
    }

    const newState: GameState = {
        ...gameState,
        movingPieceId: null,
        currentRollValue: null,
        players: gameState.players.map(p => {
            // Update the victim
            if (p.id === victimOwnerId) {
                return {
                    ...p,
                    pieces: p.pieces.map(vp =>
                        vp.id === victimPieceId ? { ...vp, position: -1 } : vp
                    )
                };
            }
            // Update the moving player
            if (p.id === currentPlayerId) {
                return {
                    ...p,
                    hasFirstKill: hasFirstKill,
                    rank: newRank,
                    pieces: p.pieces.map(mp =>
                        mp.id === pieceId ? { ...mp, position: nextPosition, isFinished: isFinished } : mp
                    )
                };
            }
            return p;
        })
    };

    return { state: newState, scoredPoint };
};
