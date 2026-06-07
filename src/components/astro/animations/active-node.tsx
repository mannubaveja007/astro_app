import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface ActiveNodeProps {
  children: React.ReactNode;
}

export function ActiveNode({ children }: ActiveNodeProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(0.4, { duration: 0 })
      ),
      -1,
      false
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.activeNodeContainer}>
      <Animated.View style={[styles.nodeActivePulse, animatedStyle]} />
      <View style={styles.nodeActive}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activeNodeContainer: {
    position: 'relative',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActivePulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    backgroundColor: 'rgba(197, 155, 39, 0.15)',
  },
  nodeActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
});
