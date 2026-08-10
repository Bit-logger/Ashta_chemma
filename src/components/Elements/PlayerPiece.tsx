import React from 'react';
import BanglePiece from './BanglePiece';
import PebblePiece from './PebblePiece';
import SplintPiece from './SplintPiece';
import ButtonPiece from './ButtonPiece';

type PlayerPieceProps = {
    type: string;
    size?: number;
};

const PIECE_COLORS = ['#FF4136', '#0074D9', '#2ECC40', '#FFDC00']; // Default player colors

// ⚡ Bolt Optimization: Memoized PlayerPiece to prevent redundant re-renders
// when other parts of the game state update but the piece hasn't changed.
export const PlayerPiece = React.memo(function PlayerPiece({ type, size = 30 }: PlayerPieceProps) {
    switch (type) {
        case 'bangle':
            return <BanglePiece size={size} color={PIECE_COLORS[0]} />; // Will add dynamic colors later if needed
        case 'stone':
            return <PebblePiece size={size} />;
        case 'splint':
            return <SplintPiece size={size} />;
        case 'button':
            return <ButtonPiece size={size} color={PIECE_COLORS[1]} />;
        default:
            return <BanglePiece size={size} />;
    }
});
