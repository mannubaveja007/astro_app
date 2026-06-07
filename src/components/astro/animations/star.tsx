import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface StarProps {
  top: number;
  left: number;
  size: number;
}

export function Star({ top, left, size }: StarProps) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    // Generate deterministic duration based on positions to maintain purity
    const baseDuration = 1500 + Math.floor((top * 10) % 1000);
    opacity.value = 0.1 + ((left * 10) % 3) * 0.1;
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: baseDuration, easing: Easing.ease }),
        withTiming(0.1, { duration: baseDuration, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, [top, left, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: Colors.light.gold,
  },
});
