import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

type SplintPieceProps = {
    size?: number;
};

const SplintPiece: React.FC<SplintPieceProps> = ({ size = 30 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100" style={{ transform: [{ rotate: '45deg' }] }}>
                <Defs>
                    {/* Bright Golden/Bamboo Splint Pattern */}
                    <LinearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#FFE066" stopOpacity="1" />
                        <Stop offset="50%" stopColor="#FFB300" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#F57C00" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {/* Thin, Long Rect for Splint */}
                <Rect
                    x="42"
                    y="10"
                    width="16"
                    height="80"
                    rx="8"
                    ry="8"
                    fill="url(#woodGrain)"
                    stroke="#D84315"
                    strokeWidth="2"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 1.5,
        elevation: 3,
    }
});

export default SplintPiece;
