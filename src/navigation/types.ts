import { BoardType } from '../constants/board';

export type RootStackParamList = {
    Setup: undefined;
    Game: {
        players: { id: number; name: string; pieceType: string }[];
        boardType: BoardType;
    };
};
