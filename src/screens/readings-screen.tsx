import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';
import { LOCKED_READINGS } from '@/constants/astro-data';

interface ReadingsScreenProps {
  pastLifeExpanded: boolean;
  setPastLifeExpanded: (val: boolean) => void;
  setActiveTab: (tab: 'home' | 'readings' | 'chat' | 'journey' | 'you') => void;
}

export function ReadingsScreenView({
  pastLifeExpanded,
  setPastLifeExpanded,
  setActiveTab,
}: ReadingsScreenProps) {
  return (
    <Animated.ScrollView
      entering={FadeIn.duration(400)}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      {/* Banner */}
      <View style={styles.readyBanner}>
        <Text style={styles.readyIcon}>🪐</Text>
        <View style={styles.readyTextGroup}>
          <Text style={styles.readyTitle}>Your Soul Portrait is Aligned</Text>
          <Text style={styles.readySub}>Your past life insights are ready to be read</Text>
        </View>
      </View>

      {/* Unlocked Readings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>UNLOCKED READINGS</Text>
        <View style={styles.sectionDivider} />

        <Animated.View style={[styles.card, styles.unlockedCard]}>
          <LinearGradient
            colors={['#FFFDFB', '#FAF7F2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.unlockedRow}>
            <Text style={styles.unlockedEmoji}>🌙</Text>
            <View style={styles.unlockedBadge}>
              <Text style={styles.unlockedBadgeText}>Unlocked</Text>
            </View>
          </View>
          <Text style={styles.readingCardTitle}>Past Life Reading</Text>
          <Text style={styles.readingCardSub}>{"The lessons that shaped your soul's current path"}</Text>
          
          {pastLifeExpanded && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.expandedContent}>
              <Text style={styles.readingContentText}>
                Your past life was lived in a quiet sanctuary of learning, where you studied the stars and natural philosophies. This left you with a deep, intuitive seeking in this life, yet you struggle with sharing your inner discoveries. Unlocking your purpose here requires letting others see your light.
              </Text>
            </Animated.View>
          )}

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setPastLifeExpanded(!pastLifeExpanded);
            }}
            style={({ pressed }) => [styles.btnReadNow, pressed && { opacity: 0.8 }]}>
            <Text style={styles.btnReadNowText}>{pastLifeExpanded ? 'Close read ↑' : 'Read now ↓'}</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Locked Readings */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>UPCOMING READINGS</Text>
        <View style={styles.sectionDivider} />

        <View style={styles.lockedStack}>
          {LOCKED_READINGS.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => Alert.alert('✦ Reading Locked ✦', `Your "${item.type}" reading is currently being aligned. Complete your current Daily Journey exercises or expedite to unlock instantly.`)}
              style={({ pressed }) => [styles.lockedCard, pressed && styles.cardPressed]}>
              <View style={styles.lockedIconContainer}>
                <Text style={styles.lockedIcon}>{item.icon}</Text>
              </View>
              <View style={styles.lockedInfo}>
                <Text style={styles.lockedTitle}>{item.title}</Text>
                <Text style={styles.lockedSub}>{item.type} · Channeling...</Text>
              </View>
              <View style={styles.lockBadge}>
                <Ionicons name="lock-closed" size={10} color={Colors.light.gold} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  readyBanner: {
    backgroundColor: '#FDF6EB',
    borderWidth: 1,
    borderColor: Colors.light.borderGlow,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  readyIcon: {
    fontSize: 18,
  },
  readyTextGroup: {
    flex: 1,
  },
  readyTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.light.gold,
  },
  readySub: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginTop: 6,
    marginBottom: 12,
  },
  unlockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unlockedEmoji: {
    fontSize: 24,
  },
  unlockedBadge: {
    backgroundColor: 'rgba(108,82,153,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(108,82,153,0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  unlockedBadgeText: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.light.violet,
  },
  readingCardTitle: {
    fontFamily: 'ui-serif',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 12,
  },
  readingCardSub: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  expandedContent: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    marginTop: 8,
  },
  readingContentText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#554C42',
  },
  btnReadNow: {
    marginTop: 4,
  },
  btnReadNowText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.violet,
  },
  lockedStack: {
    gap: 12,
  },
  lockedCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockedIcon: {
    fontSize: 16,
  },
  lockedInfo: {
    flex: 1,
  },
  lockedTitle: {
    fontFamily: 'ui-serif',
    fontSize: 12.5,
    fontWeight: '500',
    color: Colors.light.text,
  },
  lockedSub: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  lockBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
