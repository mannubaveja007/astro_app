import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  SharedValue,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

const PARTICLE_COUNT = 15;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i * 2 * Math.PI) / PARTICLE_COUNT;
  const distance = 80 + (i % 3) * 35;
  return {
    id: i,
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance,
    size: 4 + (i % 2) * 2,
  };
});

interface BurstParticleItemProps {
  progress: SharedValue<number>;
  p: typeof PARTICLES[number];
}

function BurstParticleItem({ progress, p }: BurstParticleItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const val = progress.value;
    if (val === 0 || val === 1) {
      return { opacity: 0, transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 0 }] };
    }
    const tx = p.dx * val;
    const ty = p.dy * val;
    const opacity = val < 0.2 ? val / 0.2 : 1 - (val - 0.2) / 0.8;
    const scale = 1.5 - val * 0.5;
    return {
      transform: [{ translateX: tx }, { translateY: ty }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.burstParticle,
        {
          width: p.size,
          height: p.size,
          borderRadius: p.size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

interface ParticleBurstProps {
  progress: SharedValue<number>;
}

export function ParticleBurst({ progress }: ParticleBurstProps) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLES.map((p) => (
        <BurstParticleItem key={p.id} progress={progress} p={p} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  burstParticle: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    backgroundColor: Colors.light.gold,
    shadowColor: Colors.light.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
