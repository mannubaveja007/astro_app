import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';

interface FAQItemProps {
  title: string;
  content: string;
}

export function FAQAccordionItem({ title, content }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const height = useSharedValue(0);

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen(!isOpen);
    height.value = withSpring(isOpen ? 0 : 90, { damping: 15 });
  };

  const animatedPanelStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: withTiming(isOpen ? 1 : 0, { duration: 200 }),
    paddingVertical: withTiming(isOpen ? 8 : 0, { duration: 200 }),
  }));

  return (
    <View style={styles.faqAccordionContainer}>
      <Pressable onPress={toggle} style={styles.faqAccordionHeader}>
        <Text style={styles.faqTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color={Colors.light.textSecondary}
        />
      </Pressable>
      <Animated.View style={[styles.faqAccordionContent, animatedPanelStyle]}>
        <Text style={styles.faqBodyText}>{content}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  faqAccordionContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundElement,
    overflow: 'hidden',
  },
  faqAccordionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
  },
  faqAccordionContent: {
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  faqBodyText: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.light.textSecondary,
  },
});
