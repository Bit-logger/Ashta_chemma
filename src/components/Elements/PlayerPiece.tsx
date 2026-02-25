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

export const PlayerPiece: React.FC<PlayerPieceProps> = ({ type, size = 30 }) => {
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
};
