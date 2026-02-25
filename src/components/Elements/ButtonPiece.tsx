import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

type ButtonPieceProps = {
    color?: string; // e.g. 'purple', 'white', 'blue'
    size?: number;
};

const ButtonPiece: React.FC<ButtonPieceProps> = ({ color = '#4169E1', size = 28 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Defs>
                    {/* Plastic Matte Surface */}
                    <RadialGradient id="plasticSurface" cx="30%" cy="30%" rx="60%" ry="60%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                        <Stop offset="40%" stopColor={color} stopOpacity="1" />
                        <Stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
                    </RadialGradient>

                    {/* Inner indent for holes */}
                    <RadialGradient id="innerIndent" cx="50%" cy="50%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#000000" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor={color} stopOpacity="0" />
                    </RadialGradient>
                </Defs>

                {/* Outer Rim */}
                <Circle cx="50" cy="50" r="45" fill="url(#plasticSurface)" />

                {/* Inner Indent */}
                <Circle cx="50" cy="50" r="28" fill="url(#innerIndent)" />

                {/* 4 Thread Holes */}
                <Circle cx="40" cy="40" r="4" fill="#202020" />
                <Circle cx="60" cy="40" r="4" fill="#202020" />
                <Circle cx="40" cy="60" r="4" fill="#202020" />
                <Circle cx="60" cy="60" r="4" fill="#202020" />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4,
    }
});

export default ButtonPiece;
