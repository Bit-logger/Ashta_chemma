import { Audio } from 'expo-av';

let diceSound: Audio.Sound | null = null;
let moveSound: Audio.Sound | null = null;

export const loadSounds = async () => {
    try {
        const { sound: dice } = await Audio.Sound.createAsync(
            require('../assets/sounds/dice.wav')
        );
        diceSound = dice;

        const { sound: move } = await Audio.Sound.createAsync(
            require('../assets/sounds/move.wav')
        );
        moveSound = move;
    } catch (error) {
        console.warn("Failed to load sounds", error);
    }
};

export const playDiceSound = async () => {
    try {
        if (diceSound) {
            await diceSound.replayAsync();
        }
    } catch (error) {
        console.error("Failed to play dice sound:", error);
    }
};

export const playMoveSound = async () => {
    try {
        if (moveSound) {
            await moveSound.replayAsync();
        }
    } catch (error) {
        console.error("Failed to play move sound:", error);
    }
};

export const unloadSounds = async () => {
    if (diceSound) {
        await diceSound.unloadAsync();
        diceSound = null;
    }
    if (moveSound) {
        await moveSound.unloadAsync();
        moveSound = null;
    }
};
