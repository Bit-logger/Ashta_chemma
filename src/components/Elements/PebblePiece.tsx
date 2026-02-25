import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop } from 'react-native-svg';

type PebblePieceProps = {
    size?: number;
};

const PebblePiece: React.FC<PebblePieceProps> = ({ size = 26 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Defs>
                    {/* Matte Stone Texture */}
                    <RadialGradient id="stoneTexture" cx="40%" cy="40%" rx="60%" ry="60%">
                        <Stop offset="0%" stopColor="#A9A9A9" stopOpacity="1" />
                        <Stop offset="70%" stopColor="#696969" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#303030" stopOpacity="1" />
                    </RadialGradient>
                </Defs>

                {/* Irregular Pebble Polygon */}
                <Path
                    d="M 20 20 Q 50 0 80 30 T 90 70 Q 60 100 30 90 T 5 50 Q 0 30 20 20 Z"
                    fill="url(#stoneTexture)"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 5,
    }
});

export default PebblePiece;
