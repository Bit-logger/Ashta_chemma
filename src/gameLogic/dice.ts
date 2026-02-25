// Tamarind Seed Logic (Gavvalu)
// White side up = 1, Dark side up = 0.
// A roll consists of 4 seeds.

export type RollResult = {
    value: number;
    points: number;
    isExtraTurn: boolean;
};

export const rollSeeds = (): RollResult => {
    // Randomly generate 4 boolean values (true = white/up, false = dark/down)
    const seeds = Array.from({ length: 4 }, () => Math.random() > 0.5);
    return calculateScore(seeds);
};

export const calculateScore = (seeds: boolean[]): RollResult => {
    const openCount = seeds.filter(Boolean).length;

    switch (openCount) {
        case 1:
            return { value: 1, points: 1, isExtraTurn: false }; // Kanu
        case 2:
            return { value: 2, points: 2, isExtraTurn: false }; // Rendu
        case 3:
            return { value: 3, points: 3, isExtraTurn: false }; // Moodu
        case 4:
            return { value: 4, points: 4, isExtraTurn: true }; // Chamma
        case 0:
            return { value: 0, points: 8, isExtraTurn: true }; // Ashta
        default:
            return { value: 0, points: 0, isExtraTurn: false }; // Should never hit
    }
};
