import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

type BanglePieceProps = {
    color?: string; // e.g. 'green', 'red'
    size?: number;
};

const BanglePiece: React.FC<BanglePieceProps> = ({ color = '#00AA55', size = 30 }) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 100">
                <Defs>
                    {/* Glass Glare Gradient */}
                    <LinearGradient id="glassGlare" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                        <Stop offset="30%" stopColor={color} stopOpacity="1" />
                        <Stop offset="70%" stopColor={color} stopOpacity="0.8" />
                        <Stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                    </LinearGradient>
                </Defs>

                {/* Curved Broken Bangle Shape */}
                <Path
                    d="M 10 90 L 20 85 C 10 60 20 20 50 10 C 80 0 95 30 90 40 L 95 50 C 95 20 70 -10 40 5 C 10 20 -10 60 10 90 Z"
                    fill="url(#glassGlare)"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 4,
    }
});

export default BanglePiece;
