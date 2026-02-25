import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { GameState, initializeGame, canPieceMove } from '../gameLogic/gameState';
import { executeMove, checkKill } from '../gameLogic/engine';
import { PLAYER_PATHS, MAX_PATH_INDEX } from '../constants/board';
import Board from '../components/Board/Board';
import TamarindSeed from '../components/Elements/TamarindSeed';
import { rollSeeds, RollResult } from '../gameLogic/dice';
import * as Haptics from 'expo-haptics';
import { loadSounds, unloadSounds, playDiceSound, playMoveSound } from '../utils/audio';

type GameScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

type Props = {
    navigation: GameScreenNavigationProp;
    route: GameScreenRouteProp;
};

export default function GameScreen({ navigation, route }: Props) {
    const { players, boardType } = route.params;
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [seedsDisplay, setSeedsDisplay] = useState<boolean[]>([true, true, true, true]);
    const [lastRoll, setLastRoll] = useState<RollResult | null>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gameOverState, setGameOverState] = useState<{ isOver: boolean, message: string }>({ isOver: false, message: '' });

    // Track how many rolls each player has made WITHOUT getting a 4 or 8
    const [pityCounters, setPityCounters] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    // Track how many attempts a piece has made to get exactly home in the final 3 squares
    const [endGameAttempts, setEndGameAttempts] = useState<Record<string, number>>({});

    // Initialize engine on mount and load sounds
    useEffect(() => {
        const freshState = initializeGame(players, boardType);
        setGameState(freshState);

        loadSounds();
        return () => {
            unloadSounds();
        };
    }, [players]);

    // Auto-move logic: When a player rolls and has EXACTLY ONE valid move, skip the manual tap
    useEffect(() => {
        if (lastRoll && lastRoll.points > 0 && gameState && !isAnimating && !isRolling) {
            const currentPlayer = gameState.players.find(p => p.id === gameState.currentTurnPlayerId);
            if (currentPlayer) {
                const validPieces = currentPlayer.pieces.filter(p => canPieceMove(p, lastRoll.points, currentPlayer, gameState.boardType));
                if (validPieces.length === 1) {
                    // Small delay so user sees what they rolled before piece magically jumps
                    const timer = setTimeout(() => {
                        handlePiecePress(validPieces[0].id);
                    }, 400);
                    return () => clearTimeout(timer);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastRoll]); // Only trigger auto-move immediately following a new roll

    if (!gameState) {
        return <View style={styles.container}><Text>Loading Game...</Text></View>;
    }

    const handleRoll = async () => {
        if (isRolling || isAnimating) return;
        setIsRolling(true);

        playDiceSound();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const currentPlayerId = gameState?.currentTurnPlayerId || 1;
        const currentPity = pityCounters[currentPlayerId] || 0;
        const currentPlayer = gameState?.players.find(p => p.id === currentPlayerId);

        let probs: Record<number, number> = { 1: 0.2275, 2: 0.364, 3: 0.3185, 4: 0.05, 8: 0.04 };

        if (currentPity >= 5) {
            // Pity Logic: Force 4 or 8 after 5 dry turns
            probs = { 1: 0, 2: 0, 3: 0, 4: 0.5, 8: 0.5 };
        } else {
            // Standard PRD increases
            const pityBonus = currentPity * 0.02;
            probs[4] += pityBonus;
            probs[8] += pityBonus;

            // Kill-Weighted Randomness & End-Game Tension
            if (currentPlayer && gameState) {
                const rolls = [1, 2, 3, 4, 8];

                currentPlayer.pieces.forEach(piece => {
                    // Check if a specific roll results in a kill
                    rolls.forEach(r => {
                        if (canPieceMove(piece, r, currentPlayer, gameState.boardType)) {
                            const nextPos = piece.position === -1 ? 0 : piece.position + r;
                            const physicalSquare = PLAYER_PATHS[currentPlayerId][nextPos];
                            const potentialVictim = checkKill(gameState, physicalSquare, currentPlayerId);
                            if (potentialVictim) {
                                probs[r] += 0.15; // 15% increase for a killing roll!
                            }
                        }
                    });

                    // End-Game Tension: decrease exact winning roll probability for first 2 attempts
                    const dist = MAX_PATH_INDEX - piece.position;
                    if (dist >= 1 && dist <= 3) {
                        const attempts = endGameAttempts[piece.id] || 0;
                        if (attempts < 2) {
                            probs[dist] = Math.max(0.01, probs[dist] - 0.10); // Decrease by 10%
                        }
                    }
                });
            }
        }

        // Normalize probabilities
        const totalProb = Object.values(probs).reduce((sum, p) => sum + p, 0);
        Object.keys(probs).forEach(k => { probs[Number(k)] /= totalProb; });

        const rollWeight = Math.random();
        let cumulative = 0;
        let selectedRoll = 1;

        for (const r of [8, 4, 3, 2, 1]) {
            cumulative += probs[r];
            if (rollWeight <= cumulative) {
                selectedRoll = r;
                break;
            }
        }

        let openCount = selectedRoll;
        if (selectedRoll === 8) openCount = 0;

        if (selectedRoll === 4 || selectedRoll === 8) {
            setPityCounters(p => ({ ...p, [currentPlayerId]: 0 }));
        } else {
            setPityCounters(p => ({ ...p, [currentPlayerId]: currentPity + 1 }));
        }

        if (currentPlayer) {
            const newAttempts = { ...endGameAttempts };
            let attemptsChanged = false;
            currentPlayer.pieces.forEach(piece => {
                const dist = MAX_PATH_INDEX - piece.position;
                if (dist >= 1 && dist <= 3) {
                    newAttempts[piece.id] = (newAttempts[piece.id] || 0) + 1;
                    attemptsChanged = true;
                }
            });
            if (attemptsChanged) setEndGameAttempts(newAttempts);
        }

        // Generate seeds array based on openCount
        const seeds = [false, false, false, false];
        for (let i = 0; i < openCount; i++) { seeds[i] = true; }
        // Shuffle the seeds array so it looks random visually
        seeds.sort(() => Math.random() - 0.5);

        // Let the physical seeds bounce and spin for 600ms before reading the result
        setTimeout(() => {
            setIsRolling(false);
            setSeedsDisplay(seeds);

            let value = 0, points = 0, isExtraTurn = false;
            switch (openCount) {
                case 1: value = 1; points = 1; break; // Kanu (No extra turn)
                case 2: value = 2; points = 2; break; // Rendu
                case 3: value = 3; points = 3; break; // Moodu
                case 4: value = 4; points = 4; isExtraTurn = true; break; // Chamma gives an extra turn
                case 0: value = 0; points = 8; isExtraTurn = true; break; // Ashta gives an extra turn
            }

            setLastRoll({ value, points, isExtraTurn });

            // Check if the player has any valid moves
            if (gameState) {
                const currentPlayer = gameState.players.find(p => p.id === gameState.currentTurnPlayerId);
                if (currentPlayer) {
                    const hasValidMove = currentPlayer.pieces.some(piece => canPieceMove(piece, points, currentPlayer, gameState.boardType));

                    if (!hasValidMove) {
                        setTimeout(() => {
                            if (!isExtraTurn) {
                                setGameState(prevState => {
                                    if (!prevState) return prevState;
                                    const nextState: GameState = JSON.parse(JSON.stringify(prevState));

                                    let nextIndex = (nextState.players.findIndex(p => p.id === nextState.currentTurnPlayerId) + 1) % nextState.players.length;
                                    while (nextState.players[nextIndex] && nextState.players[nextIndex].rank !== null) {
                                        nextIndex = (nextIndex + 1) % nextState.players.length;
                                    }

                                    nextState.currentTurnPlayerId = nextState.players[nextIndex].id;
                                    return nextState;
                                });
                            }
                            setLastRoll(null);
                        }, 1000); // Pass turn silently if no moves
                    }
                }
            }
        }, 600);
    };

    const handlePiecePress = (pieceId: string) => {
        if (!lastRoll || lastRoll.points === 0 || isAnimating) return; // No active roll to use or animating

        const ownerId = Number(pieceId.split('-')[0]);
        if (ownerId !== gameState.currentTurnPlayerId) return; // Not your turn!

        const player = gameState.players.find(p => p.id === ownerId);
        const piece = player?.pieces.find(p => p.id === pieceId);

        if (piece && player && canPieceMove(piece, lastRoll.points, player, gameState.boardType)) {
            let pointsUsed = lastRoll.points;

            // Entering piece costs 4 points
            if (piece.position === -1) {
                pointsUsed = 4;
            }

            setIsAnimating(true);

            const { state: nextState, scoredPoint } = executeMove(gameState, pieceId, pointsUsed);

            // Detect if a kill occurred
            let killOccurred = false;
            for (const p of gameState.players) {
                if (p.id !== player.id) {
                    for (let i = 0; i < p.pieces.length; i++) {
                        const oldPos = p.pieces[i].position;
                        const newPos = nextState.players.find(np => np.id === p.id)?.pieces[i].position;
                        if (oldPos !== -1 && newPos === -1) {
                            killOccurred = true;
                        }
                    }
                }
            }

            // Path for animation
            const path: number[] = [];
            let currentTempPos = piece.position;

            if (piece.position === -1) {
                path.push(0); // Entering the board
            } else {
                for (let step = 0; step < pointsUsed; step++) {
                    if (currentTempPos >= 15 && !player.hasFirstKill) {
                        // Wrapping around the outer layer (0-15)
                        currentTempPos = (currentTempPos + 1) % 16;
                    } else {
                        currentTempPos += 1;
                    }
                    path.push(currentTempPos);
                }
            }

            let currentStepIdx = 0;
            const stepDuration = 200; // ms between each step

            const animateStep = async () => {
                if (currentStepIdx < path.length) {
                    playMoveSound();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    const stepPos = path[currentStepIdx];
                    setGameState(tempState => {
                        if (!tempState) return tempState;
                        const s = JSON.parse(JSON.stringify(tempState)) as GameState;
                        const pPlayer = s.players.find(p => p.id === ownerId);
                        if (pPlayer) {
                            const pPiece = pPlayer.pieces.find(p => p.id === pieceId);
                            if (pPiece) {
                                pPiece.position = stepPos;
                            }
                        }
                        return s;
                    });

                    currentStepIdx++;
                    setTimeout(animateStep, stepDuration);
                } else {
                    // Animation finished
                    if (lastRoll.points === 8 && pointsUsed === 4 && piece.position === -1) {
                        setGameState(nextState);
                        setLastRoll({ value: 4, points: 4, isExtraTurn: true });
                        setIsAnimating(false);
                        return; // Do not pass turn yet
                    }

                    // Consume roll logic normally
                    if (!lastRoll.isExtraTurn && !killOccurred && !scoredPoint) {
                        let nextIndex = (nextState.players.findIndex(p => p.id === nextState.currentTurnPlayerId) + 1) % nextState.players.length;
                        while (nextState.players[nextIndex].rank !== null) {
                            nextIndex = (nextIndex + 1) % nextState.players.length;
                        }
                        nextState.currentTurnPlayerId = nextState.players[nextIndex].id;
                    } else if (killOccurred || scoredPoint) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }

                    setGameState(nextState);
                    setLastRoll(null); // Consume the roll

                    // Evaluate Win Conditions
                    const finishedPlayers = nextState.players.filter(p => p.rank !== null).length;

                    if (finishedPlayers >= nextState.players.length - 1) {
                        if (nextState.players.length === 2 && finishedPlayers === 1) {
                            const winner = nextState.players.find(p => p.rank === 1);
                            setGameOverState({ isOver: true, message: `Congratulations!\n${winner?.name} won the game!` });
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        } else {
                            const latestWinner = nextState.players.find(p => p.rank === finishedPlayers);
                            if (finishedPlayers === nextState.players.length - 1) {
                                setGameOverState({ isOver: true, message: `Game Over!\n${latestWinner?.name} got rank ${finishedPlayers}!` });
                            }
                        }
                    }
                    setIsAnimating(false);
                }
            };

            animateStep();

        } else {
            console.log("Invalid move for this piece.");
        }
    };

    const currentPlayer = gameState.players.find(p => p.id === gameState.currentTurnPlayerId);

    // Render the trays for each player in the game in their respective corners
    const renderPlayerTray = (playerId: number) => {
        const isCurrentTurn = gameState.currentTurnPlayerId === playerId;
        if (!isCurrentTurn) return null; // Hide the tray completely if it's not their turn

        let positionStyle: any = {};

        // In order to avoid overlapping the central board (which takes up the middle screen width),
        // we use the empty vertical space above and below the board.
        // Rotation transforms swap width/height visually, so right/left offsets are tuned to prevent clipping.
        switch (playerId) {
            case 1:
                // Bottom player (Red) -> Bottom Left corner
                positionStyle = { bottom: 40, left: 20 };
                break;
            case 2:
                // Right player (Grey) -> Top Right vertical space
                // Rotate -90 makes seeds face left (towards board) and text face right (outwards)
                positionStyle = { top: 180, right: -40, transform: [{ rotate: '-90deg' }] };
                break;
            case 3:
                // Top player (Orange) -> Top Left horizontal space
                // Rotate 180 makes seeds face down (towards board) and text face up (outwards)
                positionStyle = { top: 120, left: 20, transform: [{ rotate: '180deg' }] };
                break;
            case 4:
                // Left player (Blue) -> Bottom Left vertical space
                // Rotate 90 makes seeds face right (towards board) and text face left (outwards)
                // Pushed hard against the bottom corner to stay out of the board space
                positionStyle = { bottom: 50, left: -40, transform: [{ rotate: '90deg' }] };
                break;
        }

        return (
            <TouchableOpacity
                key={`tray-${playerId}`}
                style={[styles.floatingDiceTray, positionStyle]}
                onPress={handleRoll}
                disabled={!!lastRoll || isRolling || isAnimating}
                activeOpacity={0.8}
            >
                <View style={[styles.trayInner]}>
                    <View style={styles.seedsRow}>
                        {seedsDisplay.map((isOpen, index) => (
                            <TamarindSeed key={index} isOpen={isOpen} size={30} isRolling={isRolling} />
                        ))}
                    </View>
                    <Text style={[styles.trayText]}>
                        {lastRoll ? `Rolled: ${lastRoll.points}` : 'Tap to Roll'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Top Header - Turn info */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        Turn: <Text style={styles.turnName}>{currentPlayer?.name}</Text>
                    </Text>
                    <Text style={styles.subText}>
                        Playing as: {currentPlayer?.pieceType}
                    </Text>
                </View>

                {/* The Board Area */}
                <View style={styles.boardContainer}>
                    <Board gameState={gameState} onPiecePress={handlePiecePress} />
                </View>

                {/* Render the 4 Corner Trays (Only active ones are visible) */}
                {gameState.players.map(p => renderPlayerTray(p.id))}

                {/* Game Over Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={gameOverState.isOver}
                    onRequestClose={() => { }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>🎉 Game Over 🎉</Text>
                            <Text style={styles.modalMessage}>{gameOverState.message}</Text>

                            <TouchableOpacity
                                style={styles.homeBtn}
                                onPress={() => navigation.navigate('Setup')}
                            >
                                <Text style={styles.homeBtnText}>Return to Setup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#3b2f2f', // Dark mud color for the ground
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    header: {
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    headerText: {
        color: '#EBE3D5',
        fontSize: 24,
        fontWeight: 'bold',
    },
    turnName: {
        color: '#FFD700', // Gold highlight for active player
    },
    subText: {
        color: '#A9A9A9',
        fontSize: 16,
        marginTop: 4,
    },
    boardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    floatingDiceTray: {
        position: 'absolute',
        backgroundColor: '#8B5A2B', // Wooden tray color
        padding: 10,
        borderRadius: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        borderWidth: 2,
        borderColor: '#5C3A21',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
    },
    trayInner: {
        alignItems: 'center',
    },
    seedsRow: {
        flexDirection: 'row',
        columnGap: 10,
        marginBottom: 8,
    },
    trayText: {
        color: '#FFD700', // Gold text
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#EBE3D5',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#8B5A2B',
    },
    modalTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#8B5A2B',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 20,
        color: '#5C3A21',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 30,
    },
    homeBtn: {
        backgroundColor: '#4AA02C',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        elevation: 3,
    },
    homeBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
