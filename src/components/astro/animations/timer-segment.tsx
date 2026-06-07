import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

interface TimerSegmentProps {
  value: string;
  label: string;
}

export function TimerSegment({ value, label }: TimerSegmentProps) {
  const scale = useSharedValue(1);

  // Trigger scale bounce when value changes
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
  }, [value, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.segmentWrapper}>
      <Animated.View style={[styles.segmentCard, animatedStyle]}>
        <LinearGradient
          colors={['#FFFDFB', '#FDFBF7']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.segmentNumber}>{value}</Text>
      </Animated.View>
      <Text style={styles.segmentLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  segmentWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  segmentCard: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(197, 155, 39, 0.06)',
  },
  segmentNumber: {
    fontFamily: 'ui-serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    fontVariant: ['tabular-nums'],
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
