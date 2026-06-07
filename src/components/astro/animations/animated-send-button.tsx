import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface SendButtonProps {
  text: string;
  onPress: () => void;
}

export function AnimatedSendButton({ text, onPress }: SendButtonProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.5);

  const hasText = text.trim().length > 0;

  useEffect(() => {
    scale.value = withSpring(hasText ? 1 : 0.8, { damping: 12 });
    opacity.value = withTiming(hasText ? 1 : 0.5, { duration: 150 });
  }, [hasText, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        disabled={!hasText}
        style={({ pressed }) => [
          styles.btnSend,
          hasText ? styles.btnSendActive : styles.btnSendDisabled,
          pressed && { transform: [{ scale: 0.95 }] },
        ]}>
        <Ionicons name="send" size={14} color="#FFFDFB" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btnSend: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSendActive: {
    backgroundColor: Colors.light.violet,
    boxShadow: '0 2px 6px rgba(108, 82, 153, 0.2)',
  },
  btnSendDisabled: {
    backgroundColor: Colors.light.textSecondary,
  },
});
