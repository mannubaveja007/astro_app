import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeIn, FadeInDown, SharedValue, Layout } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';
import { ActiveNode } from '@/components/astro/animations/active-node';
import { ParticleBurst } from '@/components/astro/animations/particle-burst';

interface JourneyScreenProps {
  journeyProgress: number;
  journeyUnlockedCount: number;
  day3Completed: boolean;
  setDayModalVisible: (visible: boolean) => void;
  journeyBurstProgress: SharedValue<number>;
}

export function JourneyScreenView({
  journeyProgress,
  journeyUnlockedCount,
  day3Completed,
  setDayModalVisible,
  journeyBurstProgress,
}: JourneyScreenProps) {
  return (
    <Animated.ScrollView
      entering={FadeIn.duration(400)}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      <View style={styles.journeyHeader}>
        <View style={styles.journeyBadge}>
          <Text style={styles.journeyBadgeText}>✦ 30-Day Journey</Text>
        </View>
        <Text style={styles.journeyTitle}>30-Day Path to Your Soulmate</Text>
        <Text style={styles.journeyDescription}>
          {"Over 30 days you'll discover who your soulmate is, what they're like, when your paths may cross, and how to prepare."}
        </Text>
      </View>

      {/* Progress bar card */}
      <View style={styles.card}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressPercentText}>
            {Math.round(journeyProgress * 100)}% complete
          </Text>
          <Text style={styles.progressCountText}>
            {journeyUnlockedCount} of 30 unlocked
          </Text>
        </View>
        <View style={styles.progressBarBg}>
          <Animated.View
            layout={Layout.springify()}
            style={[styles.progressBarFill, { width: `${journeyProgress * 100}%` }]}
          />
        </View>
      </View>

      {/* Journey steps with connecting path */}
      <View style={styles.journeyStepsContainer}>
        <View style={styles.journeyTimelinePath} />

        <Text style={styles.journeyStepsLabel}>YOUR DAILY JOURNEY</Text>

        <Animated.View layout={Layout.springify()} style={styles.journeyDaysStack}>
          {/* Day 1: Completed */}
          <View style={styles.dayCardCompleted}>
            <View style={styles.nodeCompleted}>
              <Ionicons name="checkmark" size={12} color={Colors.light.violet} />
            </View>
            <View style={styles.dayTextGroup}>
              <Text style={styles.dayLabel}>Day 1</Text>
              <Text style={styles.dayTitleCompleted}>Begin where you are</Text>
            </View>
          </View>

          {/* Day 2: Completed */}
          <View style={styles.dayCardCompleted}>
            <View style={styles.nodeCompleted}>
              <Ionicons name="checkmark" size={12} color={Colors.light.violet} />
            </View>
            <View style={styles.dayTextGroup}>
              <Text style={styles.dayLabel}>Day 2</Text>
              <Text style={styles.dayTitleCompleted}>Listen to your own voice</Text>
            </View>
          </View>

          {/* Day 3: Completed or Active */}
          <View style={{ position: 'relative' }}>
            {day3Completed ? (
              <Animated.View entering={FadeIn.duration(400)} style={styles.dayCardCompleted}>
                <View style={styles.nodeCompleted}>
                  <Ionicons name="checkmark" size={12} color={Colors.light.violet} />
                </View>
                <View style={styles.dayTextGroup}>
                  <Text style={styles.dayLabel}>Day 3</Text>
                  <Text style={styles.dayTitleCompleted}>{"Recognize the love you're calling in"}</Text>
                </View>
              </Animated.View>
            ) : (
              <View style={styles.dayCardActive}>
                <ActiveNode>
                  <Text style={styles.nodeActiveText}>3</Text>
                </ActiveNode>
                <View style={styles.dayTextGroup}>
                  <Text style={styles.dayLabelActive}>Day 3</Text>
                  <Text style={styles.dayTitleActive}>{"Recognize the love you're calling in"}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDayModalVisible(true);
                  }}
                  style={({ pressed }) => [styles.btnPrimary, styles.dayOpenBtn, pressed && styles.btnPrimaryPressed]}>
                  <Text style={styles.btnTextCompact}>Open →</Text>
                </Pressable>
              </View>
            )}
            <ParticleBurst progress={journeyBurstProgress} />
          </View>

          {/* Day 4: Locked or unlocked based on Day 3 */}
          {day3Completed ? (
            <Animated.View entering={FadeInDown.springify().mass(0.8)} style={styles.dayCardActive}>
              <ActiveNode>
                <Text style={styles.nodeActiveText}>4</Text>
              </ActiveNode>
              <View style={styles.dayTextGroup}>
                <Text style={styles.dayLabelActive}>Day 4</Text>
                <Text style={styles.dayTitleActive}>
                  What your soulmate may be feeling
                </Text>
              </View>
              <Pressable
                onPress={() => Alert.alert('Day 4 Reflection', 'Journaling opens tomorrow!')}
                style={({ pressed }) => [styles.btnPrimary, styles.dayOpenBtn, pressed && styles.btnPrimaryPressed]}>
                <Text style={styles.btnTextCompact}>Open →</Text>
              </Pressable>
            </Animated.View>
          ) : (
            <View style={styles.dayCardLocked}>
              <View style={styles.nodeLocked}>
                <Text style={styles.nodeLockedText}>4</Text>
              </View>
              <View style={styles.dayTextGroup}>
                <Text style={styles.dayLabel}>Day 4</Text>
                <Text style={styles.dayTitleLocked}>
                  What your soulmate may be feeling
                </Text>
              </View>
              <View style={styles.lockStatusBadge}>
                <Ionicons name="lock-closed" size={8} color={Colors.light.gold} style={{ marginRight: 2 }} />
                <Text style={styles.lockStatusText}>Tomorrow</Text>
              </View>
            </View>
          )}

          {/* Day 5: Locked */}
          <View style={styles.dayCardLocked}>
            <View style={styles.nodeLocked}>
              <Text style={styles.nodeLockedText}>5</Text>
            </View>
            <View style={styles.dayTextGroup}>
              <Text style={styles.dayLabel}>Day 5</Text>
              <Text style={styles.dayTitleLocked}>Signs your paths are aligning</Text>
            </View>
            <View style={styles.lockStatusBadge}>
              <Ionicons name="lock-closed" size={8} color={Colors.light.gold} style={{ marginRight: 2 }} />
              <Text style={styles.lockStatusText}>2 days</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Roadmap Card */}
      <View style={[styles.card, styles.roadmapCard]}>
        <LinearGradient
          colors={['#FFFDFB', '#FAF7F2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.roadmapLabel}>30-DAY JOURNEY ROADMAP</Text>
        <Text style={styles.roadmapTitle}>Your Spiritual Milestones</Text>
        <View style={styles.roadmapDivider} />
        
        <View style={styles.roadmapItem}>
          <View style={styles.roadmapItemIconContainer}>
            <Text style={styles.roadmapEmoji}>💫</Text>
          </View>
          <View style={styles.roadmapTextCol}>
            <Text style={styles.roadmapItemTitle}>Self Alignment (Days 1-10)</Text>
            <Text style={styles.roadmapItemSub}>Clear blockages, establish daily intention, and sync cosmic numbers.</Text>
          </View>
        </View>
        
        <View style={styles.roadmapItem}>
          <View style={styles.roadmapItemIconContainer}>
            <Text style={styles.roadmapEmoji}>🪐</Text>
          </View>
          <View style={styles.roadmapTextCol}>
            <Text style={styles.roadmapItemTitle}>Synastry Transits (Days 11-20)</Text>
            <Text style={styles.roadmapItemSub}>Explore astrology charts, planetary aspects, and soulmate attributes.</Text>
          </View>
        </View>

        <View style={styles.roadmapItem}>
          <View style={styles.roadmapItemIconContainer}>
            <Text style={styles.roadmapEmoji}>✨</Text>
          </View>
          <View style={styles.roadmapTextCol}>
            <Text style={styles.roadmapItemTitle}>Connection &amp; Harmony (Days 21-30)</Text>
            <Text style={styles.roadmapItemSub}>Synchronize dream channels, calculate alignment dates, and finalize sketch.</Text>
          </View>
        </View>
      </View>

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 130,
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
  btnPrimary: {
    backgroundColor: Colors.light.text,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  btnPrimaryPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#2e241e',
  },
  journeyHeader: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  journeyBadge: {
    backgroundColor: 'rgba(108,82,153,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(108,82,153,0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    marginBottom: 6,
  },
  journeyBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.violet,
  },
  journeyTitle: {
    fontFamily: 'ui-serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  journeyDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.light.textSecondary,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressPercentText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  progressCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.light.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.violet,
    borderRadius: 3,
  },
  journeyStepsContainer: {
    position: 'relative',
    paddingLeft: 36,
    marginTop: 4,
  },
  journeyTimelinePath: {
    position: 'absolute',
    top: 24,
    bottom: 12,
    left: 13,
    width: 2,
    backgroundColor: Colors.light.border,
  },
  journeyStepsLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.textSecondary,
    marginBottom: 12,
    marginLeft: -36,
  },
  journeyDaysStack: {
    gap: 16,
  },
  dayCardCompleted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nodeCompleted: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(108,82,153,0.06)',
    borderWidth: 1.5,
    borderColor: Colors.light.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTextGroup: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 8.5,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  dayTitleCompleted: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  dayCardActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: 'rgba(197,155,39,0.3)',
    borderRadius: 16,
    padding: 10,
  },
  nodeActiveText: {
    fontSize: 11,
    color: Colors.light.backgroundElement,
    fontWeight: '700',
  },
  dayLabelActive: {
    fontSize: 8.5,
    color: Colors.light.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  dayTitleActive: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.light.text,
  },
  dayOpenBtn: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnTextCompact: {
    color: Colors.light.backgroundElement,
    fontSize: 11,
    fontWeight: '600',
  },
  dayCardLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.6,
  },
  nodeLocked: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FAF8F5',
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLockedText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '700',
  },
  dayTitleLocked: {
    fontSize: 13,
    color: Colors.light.text,
  },
  lockStatusBadge: {
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.15)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockStatusText: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  roadmapCard: {
    borderTopWidth: 3,
    borderTopColor: Colors.light.gold,
    marginTop: 8,
    marginBottom: 20,
    boxShadow: '0 4px 12px rgba(197, 155, 39, 0.03)',
  },
  roadmapLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.textSecondary,
    marginBottom: 4,
    zIndex: 2,
  },
  roadmapTitle: {
    fontFamily: 'ui-serif',
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
    zIndex: 2,
  },
  roadmapDivider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
    zIndex: 2,
  },
  roadmapItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
    zIndex: 2,
  },
  roadmapItemIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadmapEmoji: {
    fontSize: 12,
  },
  roadmapTextCol: {
    flex: 1,
  },
  roadmapItemTitle: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.light.text,
  },
  roadmapItemSub: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
    lineHeight: 14,
  },
});
