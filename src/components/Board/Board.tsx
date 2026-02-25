import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Rect, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { getSafeZones, BOARD_SIZE, PLAYER_PATHS, MAX_PATH_INDEX } from '../../constants/board';
import { GameState } from '../../gameLogic/gameState';
import { PlayerPiece } from '../Elements/PlayerPiece';

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

    // Helper to draw the cross (X) for Safe Zones (Kachhas)
    const renderSafeZoneCross = (index: number) => {
        const { x, y } = getCellCenter(index);
        const offset = cellSize * 0.35; // How big the cross is relative to the cell
        return (
            <React.Fragment key={`safe-${index}`}>
                <Line
                    x1={x - offset} y1={y - offset}
                    x2={x + offset} y2={y + offset}
                    stroke="rgba(255, 255, 240, 0.85)" // slightly off-white rice flour
                    strokeWidth="4"
                    strokeLinecap="round"
                />
                <Line
                    x1={x + offset} y1={y - offset}
                    x2={x - offset} y2={y + offset}
                    stroke="rgba(255, 255, 240, 0.85)"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </React.Fragment>
        );
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
            <Svg height="100%" width="100%" style={styles.svgLayer}>
                {/* Background Ground Texture / Shadow */}
                <Defs>
                    <RadialGradient id="groundShadow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                        <Stop offset="0%" stopColor="#8c5835" stopOpacity="0.6" />
                        <Stop offset="100%" stopColor="#4a2e1b" stopOpacity="0.95" />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#groundShadow)" rx="10" />

                {/* The 5x5 Grid Lines (Rice Flour Style) */}
                {/* Horizontal Lines */}
                {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                    <Line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * cellSize}
                        x2={boardSize}
                        y2={i * cellSize}
                        stroke="rgba(255, 255, 240, 0.9)" // Chalky white
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />
                ))}

                {/* Vertical Lines */}
                {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                    <Line
                        key={`v-${i}`}
                        x1={i * cellSize}
                        y1="0"
                        x2={i * cellSize}
                        y2={boardSize}
                        stroke="rgba(255, 255, 240, 0.9)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                    />
                ))}

                {/* Render the Safe Zones (Crosses) */}
                {getSafeZones(gameState.boardType).map((safeIndex: number) => renderSafeZoneCross(safeIndex))}
            </Svg>

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
    svgLayer: {
        overflow: 'visible', // Allow pieces on the edges to be visible without clipping
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
