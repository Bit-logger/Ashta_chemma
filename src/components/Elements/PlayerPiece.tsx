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

// ⚡ Bolt: Wrapped PlayerPiece in React.memo to prevent unnecessary re-renders of up to 16 pieces every time the parent Board or GameScreen re-renders.
// Expected Impact: Significantly reduces React reconciliation work during dice rolls and turn changes, as only the moving pieces will need a re-render.
export const PlayerPiece: React.FC<PlayerPieceProps> = React.memo(function PlayerPieceComponent({ type, size = 30 }) {
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
