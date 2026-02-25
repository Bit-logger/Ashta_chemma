import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BoardType } from '../constants/board';

type SetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setup'>;

type Props = {
    navigation: SetupScreenNavigationProp;
};

const PIECE_TYPES = [
    { id: 'bangle', name: 'Gaaju Mukka (Bangle)' },
    { id: 'stone', name: 'Raallu (Stone)' },
    { id: 'splint', name: 'Chippiri Pulla (Splint)' },
    { id: 'button', name: 'Shirt Button' },
];

export default function SetupScreen({ navigation }: Props) {
    const [playerCount, setPlayerCount] = useState(2);
    const [boardType, setBoardType] = useState<BoardType>('standard');
    const [players, setPlayers] = useState([
        { id: 1, name: 'Player 1', pieceType: 'bangle' },
        { id: 2, name: 'Player 2', pieceType: 'stone' },
        { id: 3, name: 'Player 3', pieceType: 'splint' },
        { id: 4, name: 'Player 4', pieceType: 'button' },
    ]);

    const handleNameChange = (id: number, name: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, name } : p));
    };

    const handlePieceChange = (id: number, pieceType: string) => {
        setPlayers(players.map(p => p.id === id ? { ...p, pieceType } : p));
    };

    const handleStart = () => {
        let activePlayers = players.slice(0, playerCount);

        // Traditional 2-Player Rule: Players sit exactly opposite each other.
        // ID 1 is Bottom. ID 3 is Top.
        if (playerCount === 2) {
            activePlayers[1] = { ...activePlayers[1], id: 3 };
        }

        navigation.navigate('Game', { players: activePlayers, boardType });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ashta Chamma</Text>

            <View style={styles.countContainer}>
                <Text style={styles.label}>Number of Players:</Text>
                <View style={styles.row}>
                    {[2, 3, 4].map(num => (
                        <TouchableOpacity
                            key={num}
                            style={[styles.countButton, playerCount === num && styles.activeCount]}
                            onPress={() => setPlayerCount(num)}
                        >
                            <Text style={styles.countText}>{num}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.countContainer}>
                <Text style={styles.label}>Board Selection:</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.countButton, boardType === 'standard' && styles.activeCount]}
                        onPress={() => setBoardType('standard')}
                    >
                        <Text style={styles.countText}>Standard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.countButton, boardType === 'innerGadulu' && styles.activeCount]}
                        onPress={() => setBoardType('innerGadulu')}
                    >
                        <Text style={styles.countText}>Inner Gadulu</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {players.slice(0, playerCount).map((player) => (
                <View key={player.id} style={styles.playerCard}>
                    <Text style={styles.playerTitle}>Player {player.id}</Text>
                    <TextInput
                        style={styles.input}
                        value={player.name}
                        onChangeText={(text) => handleNameChange(player.id, text)}
                        placeholder="Enter Name"
                        placeholderTextColor="#A9A9A9"
                    />
                    <Text style={styles.label}>Select Piece:</Text>
                    <View style={styles.piecesRow}>
                        {PIECE_TYPES.map(pt => (
                            <TouchableOpacity
                                key={pt.id}
                                style={[styles.pieceBtn, player.pieceType === pt.id && styles.activePiece]}
                                onPress={() => handlePieceChange(player.id, pt.id)}
                            >
                                <Text style={styles.pieceBtnText}>{pt.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ))}

            <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
                <Text style={styles.startBtnText}>Start Game</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#2C1E16', // Deep espresso wood
        minHeight: '100%',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#FFD700', // Gold
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 2, height: 4 },
        textShadowRadius: 6,
        letterSpacing: 2,
    },
    countContainer: {
        marginBottom: 25,
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        color: '#EBE3D5', // Cream text
        marginBottom: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        gap: 15,
    },
    countButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        backgroundColor: '#4A3320', // Dull wood
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeCount: {
        backgroundColor: '#D35400', // Burnt orange highlight
        borderColor: '#FFD700', // Gold border
        shadowColor: '#D35400',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
    },
    countText: {
        color: '#EBE3D5',
        fontWeight: 'bold',
        fontSize: 18,
    },
    playerCard: {
        backgroundColor: '#3E2A1D', // Card wood
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#5C3A21',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
    },
    playerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#5C3A21',
        paddingBottom: 8,
    },
    input: {
        backgroundColor: '#2C1E16',
        borderWidth: 1,
        borderColor: '#5C3A21',
        color: '#EBE3D5',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
    },
    piecesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    pieceBtn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#4A3320',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activePiece: {
        backgroundColor: '#D35400',
        borderColor: '#FFD700',
    },
    pieceBtnText: {
        fontSize: 13,
        color: '#EBE3D5',
        fontWeight: '600',
    },
    startBtn: {
        backgroundColor: '#4CAF50', // Vibrant green
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginVertical: 30,
        elevation: 8,
        shadowColor: '#4CAF50',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    startBtnText: {
        color: 'white',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
