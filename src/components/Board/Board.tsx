import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BOARD_SIZE, PLAYER_PATHS, MAX_PATH_INDEX } from '../../constants/board';
import { GameState } from '../../gameLogic/gameState';
import { PlayerPiece } from '../Elements/PlayerPiece';
import BoardBackground from './BoardBackground';

type BoardProps = {
    gameState: GameState;
    onPiecePress?: (pieceId: string) => void;
};

const Board: React.FC<BoardProps> = ({ gameState, onPiecePress }) => {
    const windowWidth = Dimensions.get('window').width;
    const boardSize = windowWidth * 0.75; // Reduced to 75% to make room for side pieces
    const cellSize = boardSize / BOARD_SIZE;

    // Helper to get center coordinates of a specific cell (0-24)
    const getCellCenter = (index: number) => {
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        return {
            x: col * cellSize + cellSize / 2,
            y: row * cellSize + cellSize / 2,
        };
    };

    // Calculate home positions outside the board for each player
    const getHomeCenter = (playerId: number, pieceIndex: number) => {
        const offset = (pieceIndex - 1.5) * 30; // Closer spread
        const margin = 20; // Tighter distance from the board edge

        switch (playerId) {
            case 1: return { x: boardSize / 2 + offset, y: boardSize + margin }; // Bottom (22)
            case 2: return { x: boardSize + margin, y: boardSize / 2 + offset }; // Right (14)
            case 3: return { x: boardSize / 2 + offset, y: -margin }; // Top (2)
            case 4: return { x: -margin, y: boardSize / 2 + offset }; // Left (10)
            default: return { x: 0, y: 0 };
        }
    };

    return (
        <View style={[styles.container, { width: boardSize, height: boardSize }, styles.boardMargin]}>
            {/* Memoized Background to prevent expensive SVG re-renders on every animation frame */}
            <BoardBackground
                boardSize={boardSize}
                cellSize={cellSize}
                boardType={gameState.boardType}
            />

            {/* Render the Pieces dynamically over the board */}
            {gameState.players
                .slice()
                .sort((a, b) => {
                    // Render the active player last so their pieces have the highest z-index for tapping
                    const aIsActive = a.id === gameState.currentTurnPlayerId;
                    const bIsActive = b.id === gameState.currentTurnPlayerId;
                    if (aIsActive && !bIsActive) return 1;
                    if (!aIsActive && bIsActive) return -1;
                    return 0;
                })
                .map(player =>
                    player.pieces.map((piece, index) => {
                        if (piece.position > MAX_PATH_INDEX) return null; // In center/finished

                        let center;
                        let stackIndex = 0;

                        if (piece.position === -1) {
                            center = getHomeCenter(player.id, index); // Draw off-board at home
                        } else {
                            const cellIndex = PLAYER_PATHS[player.id][piece.position];
                            // Shallow copy so we can mutate X/Y
                            center = { ...getCellCenter(cellIndex) };

                            // Check for other pieces on this same physical cell to offset them
                            gameState.players.forEach(p => {
                                p.pieces.forEach(otherPiece => {
                                    if (otherPiece.position !== -1 && otherPiece.position <= MAX_PATH_INDEX) {
                                        const otherCellIndex = PLAYER_PATHS[p.id][otherPiece.position];
                                        if (otherCellIndex === cellIndex && otherPiece.id < piece.id) {
                                            stackIndex++;
                                        }
                                    }
                                });
                            });

                            // Apply a slight visual offset diagonally up-right so bottom pieces remain tappable
                            if (stackIndex > 0) {
                                center.x += stackIndex * 8;
                                center.y -= stackIndex * 8;
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={piece.id}
                                style={[
                                    styles.pieceWrapper,
                                    { left: center.x - 15, top: center.y - 15 } // -15 because piece size is ~30
                                ]}
                                onPress={() => onPiecePress && onPiecePress(piece.id)}
                                activeOpacity={0.7}
                            >
                                <PlayerPiece type={player.pieceType} size={30} />
                            </TouchableOpacity>
                        );
                    })
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3b2f2f', // Base dark mud
        borderRadius: 10,
        elevation: 8, // Android shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        position: 'relative', // so absolutely positioned pieces show over it
    },
    boardMargin: {
        marginTop: 40,
        marginBottom: 40,
    },
    pieceWrapper: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure pieces stay above grid lines
    }
});

export default Board;
