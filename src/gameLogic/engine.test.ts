import { executeMove } from './engine';
import { GameState, initializeGame } from './gameState';
import { MAX_PATH_INDEX } from '../constants/board';

describe('executeMove', () => {
    let baseGameState: GameState;

    beforeEach(() => {
        baseGameState = initializeGame([{ id: 1, name: 'Player 1', pieceType: 'P1' }]);
    });

    it('should grant an extra turn and finish the piece when reaching MAX_PATH_INDEX', () => {
        // Setup state where piece is close to MAX_PATH_INDEX
        const pieceId = '1-0';
        const rollValue = 3;
        baseGameState.players[0].pieces[0].position = MAX_PATH_INDEX - rollValue;

        // Grant first kill right so player can enter inner spiral (needed to reach MAX_PATH_INDEX)
        baseGameState.players[0].hasFirstKill = true;

        const { state: newState, scoredPoint } = executeMove(baseGameState, pieceId, rollValue);

        const updatedPiece = newState.players[0].pieces[0];

        // The piece should be marked as finished
        expect(updatedPiece.isFinished).toBe(true);
        // Position should be exactly MAX_PATH_INDEX
        expect(updatedPiece.position).toBe(MAX_PATH_INDEX);
        // Should score a point (which typically grants an extra turn)
        expect(scoredPoint).toBe(true);
    });
});
