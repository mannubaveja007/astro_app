import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown, SharedValue } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { TimerSegment } from '@/components/astro/animations/timer-segment';
import { ParticleBurst } from '@/components/astro/animations/particle-burst';
import { AvatarPulse } from '@/components/astro/animations/avatar-pulse';

interface HomeScreenProps {
  countdownSeconds: number;
  expedited: boolean;
  triggerExpedite: () => void;
  countdownBurstProgress: SharedValue<number>;
  setActiveTab: (tab: 'home' | 'readings' | 'chat' | 'journey' | 'you') => void;
}

export function HomeScreenView({
  countdownSeconds,
  expedited,
  triggerExpedite,
  countdownBurstProgress,
  setActiveTab,
}: HomeScreenProps) {
  return (
    <Animated.ScrollView
      entering={FadeIn.duration(400)}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      <LinearGradient
        colors={['rgba(108,82,153,0.06)', 'rgba(197,155,39,0.04)', 'transparent']}
        style={styles.heroBand}
      />

      {/* Reader Card */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.card, styles.readerCard]}>
        <LinearGradient
          colors={['#FFFDFB', '#FAF7F2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.readerHeader}>
          <View style={styles.avatarContainer}>
            <AvatarPulse />
            <LinearGradient colors={['#6C5299', '#C59B27']} style={styles.avatarGradient}>
              <Ionicons name="moon" size={20} color="#FFFDFB" />
            </LinearGradient>
          </View>
          <View style={styles.readerInfo}>
            <Text style={styles.readerName}>Alyssa</Text>
            <Text style={styles.readerSpecialty}>Soul Reader · Cosmic Interpreter</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.starText}>★★★★★</Text>
              <Text style={styles.ratingText}>4.9 · 14,207 readings</Text>
            </View>
          </View>
        </View>
        <Text style={styles.readerBio}>
          Alyssa has been interpreting cosmic signals and soulmate energy for over 12 years.
        </Text>
      </Animated.View>

      {/* Countdown timer card */}
      <View style={{ position: 'relative', alignItems: 'center', width: '100%' }}>
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.card, styles.countdownCard]}>
          <LinearGradient
            colors={['#FFFDFB', '#FAF8F3']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.countdownLabel}>YOUR SKETCH WILL BE READY IN</Text>
          
          {(() => {
            const hrs = Math.floor(countdownSeconds / 3600);
            const mins = Math.floor((countdownSeconds % 3600) / 60);
            const secs = countdownSeconds % 60;
            const pad = (n: number) => String(n).padStart(2, '0');
            return (
              <View style={styles.timerContainer}>
                <TimerSegment value={pad(hrs)} label="hours" />
                <Text style={styles.timerSeparator}>:</Text>
                <TimerSegment value={pad(mins)} label="mins" />
                <Text style={styles.timerSeparator}>:</Text>
                <TimerSegment value={pad(secs)} label="secs" />
              </View>
            );
          })()}

          <Text style={styles.countdownStatus}>
            {expedited ? 'Reading expedited: Alyssa is channeling actively.' : 'Alyssa is channeling your reading…'}
          </Text>
        </Animated.View>
        <ParticleBurst progress={countdownBurstProgress} />
      </View>

      {/* Expedite button */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)}>
        <Pressable
          onPress={triggerExpedite}
          style={({ pressed }) => [
            styles.btnPrimary,
            expedited && styles.btnDisabled,
            pressed && !expedited && styles.btnPrimaryPressed,
          ]}>
          <Text style={styles.btnText}>
            {expedited ? 'Expedited to 12 Hours ✦' : 'Expedite Your Reading to 12 Hours'}
          </Text>
        </Pressable>
        <View style={styles.inProgressBadge}>
          <Text style={styles.inProgressText}>✦ Reading in progress · Alignment ongoing ✦</Text>
        </View>
      </Animated.View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerStar}>✦</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Explore Readings grid */}
      <View style={styles.exploreSection}>
        <View style={styles.exploreHeader}>
          <Text style={styles.exploreLabel}>Explore readings</Text>
          <Pressable onPress={() => setActiveTab('readings')}>
            <Text style={styles.seeAllText}>See all →</Text>
          </Pressable>
        </View>

        <View style={styles.exploreGrid}>
          {/* Past Life */}
          <Pressable
            onPress={() => setActiveTab('readings')}
            style={({ pressed }) => [styles.exploreCard, styles.exploreCardViolet, pressed && styles.cardPressed]}>
            <Text style={styles.exploreIcon}>🌙</Text>
            <Text style={styles.exploreTitle}>Past Life</Text>
            <Text style={styles.exploreSub}>Reading</Text>
          </Pressable>
          {/* Soulmate */}
          <Pressable
            onPress={() => setActiveTab('journey')}
            style={({ pressed }) => [styles.exploreCard, styles.exploreCardGold, pressed && styles.cardPressed]}>
            <Text style={styles.exploreIcon}>💫</Text>
            <Text style={styles.exploreTitle}>Soulmate</Text>
            <Text style={styles.exploreSub}>Reading</Text>
          </Pressable>
          {/* Numerology */}
          <Pressable
            onPress={() => setActiveTab('you')}
            style={({ pressed }) => [styles.exploreCard, styles.exploreCardTeal, pressed && styles.cardPressed]}>
            <Text style={styles.exploreIcon}>🔮</Text>
            <Text style={styles.exploreTitle}>Numerology</Text>
            <Text style={styles.exploreSub}>Reading</Text>
          </Pressable>
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
  heroBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
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
  readerHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readerInfo: {
    flex: 1,
  },
  readerName: {
    fontFamily: 'ui-serif',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  readerSpecialty: {
    fontSize: 10.5,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  starText: {
    color: Colors.light.gold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  ratingText: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  readerBio: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.light.textSecondary,
    fontWeight: '400',
  },
  readerCard: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.gold,
    boxShadow: '0 4px 12px rgba(108, 82, 153, 0.03)',
  },
  countdownCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderColor: Colors.light.borderGlow,
    backgroundColor: Colors.light.backgroundElement,
    boxShadow: '0 8px 24px rgba(197, 155, 39, 0.08)',
  },
  countdownLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  countdownStatus: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '400',
  },
  btnPrimary: {
    backgroundColor: Colors.light.gold,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(197, 155, 39, 0.15)',
  },
  btnPrimaryPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#A8811F',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: '#FFFDFB',
    fontSize: 13,
    fontWeight: '600',
  },
  inProgressBadge: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#FDF9F2',
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.15)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  inProgressText: {
    fontSize: 9.5,
    color: Colors.light.gold,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerStar: {
    color: Colors.light.gold,
    fontSize: 10,
    opacity: 0.7,
  },
  exploreSection: {
    paddingBottom: 16,
  },
  exploreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exploreLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.violet,
  },
  exploreGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  exploreCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundElement,
  },
  exploreCardViolet: { backgroundColor: 'rgba(108,82,153,0.02)' },
  exploreCardGold: { backgroundColor: 'rgba(197,155,39,0.02)' },
  exploreCardTeal: { backgroundColor: 'rgba(74,157,140,0.02)' },
  exploreIcon: {
    fontSize: 18,
    marginBottom: 8,
  },
  exploreTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.text,
  },
  exploreSub: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 16,
  },
  timerSeparator: {
    fontFamily: 'ui-serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.gold,
    marginTop: -12,
  },
});
