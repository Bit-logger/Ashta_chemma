import { checkKill } from '../engine';
import { GameState, initializeGame } from '../gameState';
import { PLAYER_PATHS, STANDARD_SAFE_ZONES } from '../../constants/board';

describe('checkKill', () => {
    let mockGameState: GameState;

    beforeEach(() => {
        // Initialize a 4-player game
        mockGameState = initializeGame([
            { id: 1, name: 'Player 1', pieceType: 'Type1' },
            { id: 2, name: 'Player 2', pieceType: 'Type2' },
            { id: 3, name: 'Player 3', pieceType: 'Type3' },
            { id: 4, name: 'Player 4', pieceType: 'Type4' },
        ], 'standard');
    });

    it('returns null if the physicalTargetSquare is a safe zone', () => {
        // Find a safe zone (kachha)
        const safeZoneSquare = STANDARD_SAFE_ZONES[0];

        const movingPlayerId = 1;

        // Player 2 piece on the safe zone (should be protected)
        mockGameState.players[1].pieces[0].position = PLAYER_PATHS[2].indexOf(safeZoneSquare);

        const result = checkKill(mockGameState, safeZoneSquare, movingPlayerId);

        expect(result).toBeNull();
    });

    it('returns null if no opponent piece is on the physicalTargetSquare', () => {
        // Pick an empty non-safe zone
        const emptySquare = 0; // assuming this is a non-safe zone square not occupied initially
        const movingPlayerId = 1;

        const result = checkKill(mockGameState, emptySquare, movingPlayerId);

        expect(result).toBeNull();
    });

    it('returns the victim piece if an opponent piece is exactly on the physicalTargetSquare (not a safe zone)', () => {
        const targetSquare = 0; // some non-safe zone coordinate
        const movingPlayerId = 1;

        // Place opponent (Player 2)'s piece on the target square
        const victimPathIndex = PLAYER_PATHS[2].indexOf(targetSquare);
        expect(victimPathIndex).toBeGreaterThan(-1); // ensure the path goes through it
        mockGameState.players[1].pieces[0].position = victimPathIndex;

        const result = checkKill(mockGameState, targetSquare, movingPlayerId);

        expect(result).not.toBeNull();
        expect(result?.id).toBe('2-0'); // The opponent's piece
        expect(result?.ownerId).toBe(2);
    });

    it('returns null if the opponent piece on the physicalTargetSquare is off-board (position -1)', () => {
        const targetSquare = 0;
        const movingPlayerId = 1;

        // In initializeGame, pieces are at position -1.
        // We set the targetSquare to the physical position where the piece *would* be if it was at path index 0
        // Wait, piece is at -1, so it shouldn't be matched by physical coordinates anyway, but let's make sure.

        const result = checkKill(mockGameState, targetSquare, movingPlayerId);

        expect(result).toBeNull();
    });

    it('returns null if the moving player encounters their own piece on the square', () => {
        const targetSquare = 0;
        const movingPlayerId = 1;

        // Place the SAME player's piece on the target square
        const ownPiecePathIndex = PLAYER_PATHS[1].indexOf(targetSquare);
        mockGameState.players[0].pieces[0].position = ownPiecePathIndex;

        const result = checkKill(mockGameState, targetSquare, movingPlayerId);

        expect(result).toBeNull(); // Cannot kill own piece
    });

    it('returns null if the opponent piece is finished (e.g., at MAX_PATH_INDEX)', () => {
        const movingPlayerId = 1;

        // Assume the center index is MAX_PATH_INDEX. It's a safe zone? Well checkKill first checks safe zone.
        // Even if center is not marked safe, a finished piece shouldn't be killed?
        // Let's set a piece at some very high index >= MAX_PATH_INDEX to simulate it.
        const maxPathIndex = 24;
        const targetSquare = PLAYER_PATHS[2][maxPathIndex];

        mockGameState.players[1].pieces[0].position = maxPathIndex;
        mockGameState.players[1].pieces[0].isFinished = true;

        const result = checkKill(mockGameState, targetSquare, movingPlayerId);

        // If targetSquare is a safe zone (center), it returns null.
        // If it's not a safe zone (hypothetically), checkKill shouldn't kill it if position >= MAX_PATH_INDEX
        expect(result).toBeNull();
    });
});
