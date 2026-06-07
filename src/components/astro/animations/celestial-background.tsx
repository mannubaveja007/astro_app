import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export function CelestialBackground() {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);

  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 160000, easing: Easing.linear }),
      -1,
      false
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 240000, easing: Easing.linear }),
      -1,
      false
    );
    rotation3.value = withRepeat(
      withTiming(360, { duration: 320000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation1, rotation2, rotation3]);

  const ringStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }],
  }));

  const ringStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }],
  }));

  const ringStyle3 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation3.value}deg` }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Astrological Axes Grid */}
      <View style={[styles.axisLine, styles.axisHorizontal]} />
      <View style={[styles.axisLine, styles.axisVertical]} />
      <View style={[styles.axisLine, styles.axisDiag1]} />
      <View style={[styles.axisLine, styles.axisDiag2]} />

      {/* Rotating concentric rings */}
      <Animated.View style={[styles.celestialRing, styles.ringOuter, ringStyle1]}>
        <View style={styles.ringNorthStar}>
          <Text style={styles.constellationLabel}>N</Text>
        </View>
        <View style={styles.ringSouthStar}>
          <Text style={styles.constellationLabel}>S</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.celestialRing, styles.ringMid, ringStyle2]}>
        <View style={styles.ringEastStar}>
          <Text style={styles.constellationLabel}>E</Text>
        </View>
        <View style={styles.ringWestStar}>
          <Text style={styles.constellationLabel}>W</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.celestialRing, styles.ringInner, ringStyle3]} />

      {/* Axis text anchors */}
      <View style={styles.axisLabelContainer}>
        <Text style={[styles.axisLabelText, { top: 60, left: '50%', transform: [{ translateX: -12 }] }]}>MC</Text>
        <Text style={[styles.axisLabelText, { bottom: 100, left: '50%', transform: [{ translateX: -10 }] }]}>IC</Text>
        <Text style={[styles.axisLabelText, { left: 20, top: '50%', transform: [{ translateY: -10 }] }]}>ASC</Text>
        <Text style={[styles.axisLabelText, { right: 20, top: '50%', transform: [{ translateY: -10 }] }]}>DSC</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axisLine: {
    position: 'absolute',
    backgroundColor: 'rgba(197, 155, 39, 0.025)',
  },
  axisHorizontal: {
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
  },
  axisVertical: {
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
  },
  axisDiag1: {
    left: -100,
    right: -100,
    top: '50%',
    height: 1,
    transform: [{ rotate: '45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(108, 82, 153, 0.02)',
    backgroundColor: 'transparent',
  },
  axisDiag2: {
    left: -100,
    right: -100,
    top: '50%',
    height: 1,
    transform: [{ rotate: '-45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(108, 82, 153, 0.02)',
    backgroundColor: 'transparent',
  },
  celestialRing: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    borderWidth: 0.75,
    borderColor: 'rgba(197, 155, 39, 0.04)',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 420,
    height: 420,
    borderRadius: 210,
    marginTop: -210,
    borderColor: 'rgba(197, 155, 39, 0.05)',
  },
  ringMid: {
    width: 320,
    height: 320,
    borderRadius: 160,
    marginTop: -160,
    borderStyle: 'dashed',
    borderColor: 'rgba(108, 82, 153, 0.04)',
  },
  ringInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginTop: -110,
    borderColor: 'rgba(197, 155, 39, 0.03)',
  },
  ringNorthStar: {
    position: 'absolute',
    top: -6,
    alignItems: 'center',
  },
  ringSouthStar: {
    position: 'absolute',
    bottom: -6,
    alignItems: 'center',
  },
  ringEastStar: {
    position: 'absolute',
    right: -6,
    justifyContent: 'center',
  },
  ringWestStar: {
    position: 'absolute',
    left: -6,
    justifyContent: 'center',
  },
  constellationLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    color: 'rgba(197, 155, 39, 0.2)',
    letterSpacing: 0.5,
  },
  axisLabelContainer: {
    position: 'absolute',
    inset: 0,
  },
  axisLabelText: {
    position: 'absolute',
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(122, 111, 102, 0.3)',
    letterSpacing: 1,
  },
});
