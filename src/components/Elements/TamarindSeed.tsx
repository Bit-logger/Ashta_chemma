import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, LinearGradient } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing, withSpring } from 'react-native-reanimated';

type SeedProps = {
    isOpen: boolean; // True = White Side (Point), False = Dark Bound Side (Ashta/0 point)
    size?: number;
    isRolling?: boolean;
};

const TamarindSeed: React.FC<SeedProps> = ({ isOpen, size = 40, isRolling = false }) => {

    const translateY = useSharedValue(0);
    const translateX = useSharedValue(0);
    const scale = useSharedValue(1);
    const rotate = useSharedValue(Math.random() * 40 - 20); // Initial random slight tilt

    React.useEffect(() => {
        if (isRolling) {
            // Strict physics timings for perfect synchronization
            const randomHeight = -30 - Math.random() * 50;
            const randomSpin = (Math.random() > 0.5 ? 1 : -1) * 360; // Exactly one full rotation
            const randomX = (Math.random() - 0.5) * 30;
            const airTime = 400 + Math.random() * 100; // Total time in air

            translateY.value = withSequence(
                withTiming(randomHeight, { duration: airTime / 2, easing: Easing.out(Easing.ease) }),
                withTiming(0, { duration: airTime / 2, easing: Easing.bounce }) // Land with a slight bounce
            );
            translateX.value = withTiming(randomX, { duration: airTime, easing: Easing.out(Easing.ease) });
            scale.value = withSequence(
                withTiming(1.3, { duration: airTime / 2 }),
                withTiming(1, { duration: airTime / 2 })
            );

            // Rotation perfectly tied to air time, no swirling afterwards
            rotate.value = withTiming(rotate.value + randomSpin, { duration: airTime, easing: Easing.out(Easing.ease) });
        }
    }, [isRolling]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
                { rotate: `${rotate.value}deg` }
            ]
        };
    });

    return (
        <Animated.View style={[styles.container, { width: size, height: size * 1.5 }, animatedStyle]}>
            <Svg height="100%" width="100%" viewBox="0 0 100 150">
                <Defs>
                    {/* Dark Outer Shell Texture */}
                    <RadialGradient id="darkShell" cx="50%" cy="50%" rx="50%" ry="50%" fx="30%" fy="30%">
                        <Stop offset="0%" stopColor="#4A2F1D" stopOpacity="1" />
                        <Stop offset="70%" stopColor="#2A1608" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#110803" stopOpacity="1" />
                    </RadialGradient>

                    {/* Inner White/Creamy Face Texture */}
                    <RadialGradient id="whiteFace" cx="50%" cy="50%" rx="50%" ry="50%" fx="50%" fy="50%">
                        <Stop offset="0%" stopColor="#FFFDD0" stopOpacity="1" />
                        <Stop offset="80%" stopColor="#E6DEBB" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#C4B78F" stopOpacity="1" />
                    </RadialGradient>

                    {/* Edge for the split shell */}
                    <LinearGradient id="edgeBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                        <Stop offset="0%" stopColor="#3E2413" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#2A1608" stopOpacity="1" />
                    </LinearGradient>
                </Defs>

                {isOpen ? (
                    // White Open Side (Chamma/Kanu points)
                    // We draw the dark rim first, then the creamy inner part
                    <>
                        {/* The outer rim of the broken shell */}
                        <Path
                            d="M 20 20 C 50 -10 80 20 90 70 C 100 120 70 140 50 145 C 30 140 0 120 10 70 C 15 45 15 25 20 20 Z"
                            fill="url(#edgeBorder)"
                        />
                        {/* The inner fleshy face */}
                        <Path
                            d="M 25 25 C 50 0 75 25 83 70 C 90 115 65 135 50 138 C 35 135 10 115 17 70 C 20 45 22 30 25 25 Z"
                            fill="url(#whiteFace)"
                        />
                    </>
                ) : (
                    // Dark Bound Side (Ashta points)
                    <Path
                        d="M 20 20 C 50 -10 80 20 90 70 C 100 120 70 140 50 145 C 30 140 0 120 10 70 C 15 45 15 25 20 20 Z"
                        fill="url(#darkShell)"
                    />
                )}
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        // Drop shadow implies it sitting on ground
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
        elevation: 6,
    }
});

export default TamarindSeed;
