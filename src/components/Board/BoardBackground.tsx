import React from 'react';
import Svg, { Rect, Line, Defs, RadialGradient, Stop } from 'react-native-svg';
import { getSafeZones, BoardType, BOARD_SIZE } from '../../constants/board';

type BoardBackgroundProps = {
    boardSize: number;
    cellSize: number;
    boardType: BoardType;
};

const BoardBackground: React.FC<BoardBackgroundProps> = ({ boardSize, cellSize, boardType }) => {
    const renderSafeZoneCross = (index: number) => {
        const row = Math.floor(index / BOARD_SIZE);
        const col = index % BOARD_SIZE;
        const x = col * cellSize + cellSize / 2;
        const y = row * cellSize + cellSize / 2;
        const offset = cellSize * 0.35;

        return (
            <React.Fragment key={`safe-${index}`}>
                <Line
                    x1={x - offset} y1={y - offset}
                    x2={x + offset} y2={y + offset}
                    stroke="rgba(255, 255, 240, 0.85)"
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

    return (
        <Svg height="100%" width="100%" style={{ overflow: 'visible' }}>
            <Defs>
                <RadialGradient id="groundShadow" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                    <Stop offset="0%" stopColor="#8c5835" stopOpacity="0.6" />
                    <Stop offset="100%" stopColor="#4a2e1b" stopOpacity="0.95" />
                </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#groundShadow)" rx="10" />

            {/* Horizontal Lines */}
            {Array.from({ length: BOARD_SIZE + 1 }).map((_, i) => (
                <Line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * cellSize}
                    x2={boardSize}
                    y2={i * cellSize}
                    stroke="rgba(255, 255, 240, 0.9)"
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

            {getSafeZones(boardType).map((safeIndex: number) => renderSafeZoneCross(safeIndex))}
        </Svg>
    );
};

// Memoized to prevent expensive SVG re-renders during piece animations
export default React.memo(BoardBackground);