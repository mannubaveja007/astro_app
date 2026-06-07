import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export function ReportScreenView() {
  return (
    <Animated.ScrollView
      entering={FadeIn.duration(400)}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      
      {/* User Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Ionicons name="compass" size={24} color={Colors.light.gold} />
        </View>
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>Alex B.</Text>
          <Text style={styles.profileDate}>11 Sep 1994 · The Truth Seeker</Text>
          <Text style={styles.profileCosmic}>♎ Libra Sun ● ♒ Aquarius Moon ● ♊ Gemini Rising</Text>
        </View>
        <Pressable
          onPress={() => Alert.alert('Edit Profile', 'Birth configuration editing is currently restricted.')}
          style={({ pressed }) => [styles.btnSecondary, styles.profileEditBtn, pressed && { backgroundColor: 'rgba(0,0,0,0.03)' }]}>
          <Text style={styles.profileEditBtnText}>Edit</Text>
        </Pressable>
      </View>

      {/* Numerology Card */}
      <View style={styles.card}>
        <View style={styles.numerologyHeader}>
          <View style={styles.emblemContainer}>
            <View style={styles.emblemCircleInner} />
            <Text style={styles.emblemNumber}>7</Text>
          </View>
          <View style={styles.numerologyTextCol}>
            <Text style={styles.numerologyLabel}>NUMEROLOGY · LIFE PATH NUMBER</Text>
            <Text style={styles.numerologyTitle}>The Spiritual Archetype</Text>
          </View>
        </View>
        <Text style={styles.numerologyBio}>
          Deep seeking, spiritual insight, and inner wisdom define your path. This year encourages you to integrate your analytical intellect with your core intuition, revealing hidden answers.
        </Text>
      </View>

      {/* Traits Card */}
      <View style={styles.card}>
        <Text style={styles.traitsLabel}>TRAITS YOU MAY EXHIBIT</Text>
        <View style={styles.traitsWrap}>
          {['Deep thinker', 'Intuitive', 'Analytical', 'Introspective', 'Private'].map((trait, index) => (
            <View key={index} style={styles.traitBadge}>
              <Text style={styles.traitBadgeText}>{trait}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Cosmic Cells grid */}
      <View style={styles.cosmicCellsGrid}>
        <View style={styles.cosmicCellCard}>
          <Text style={styles.cosmicCellLabel}>Life Path</Text>
          <Text style={styles.cosmicCellNumber}>7</Text>
        </View>
        <View style={styles.cosmicCellCard}>
          <Text style={styles.cosmicCellLabel}>Expression</Text>
          <Text style={styles.cosmicCellNumber}>11</Text>
        </View>
        <View style={styles.cosmicCellCard}>
          <Text style={styles.cosmicCellLabel}>Personal No.</Text>
          <Text style={styles.cosmicCellNumber}>6</Text>
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
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF6FC',
    borderWidth: 1,
    borderColor: 'rgba(197,155,39,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'ui-serif',
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.light.text,
  },
  profileDate: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  profileCosmic: {
    fontSize: 9.5,
    color: Colors.light.gold,
    fontWeight: '600',
    marginTop: 2,
  },
  profileEditBtn: {
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  profileEditBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.light.text,
  },
  numerologyHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  emblemContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundSelected,
    borderWidth: 1,
    borderColor: Colors.light.gold,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emblemCircleInner: {
    position: 'absolute',
    inset: 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.gold,
  },
  emblemNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.gold,
    marginTop: 1,
  },
  numerologyTextCol: {
    flex: 1,
  },
  numerologyLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.light.textSecondary,
  },
  numerologyTitle: {
    fontFamily: 'ui-serif',
    fontSize: 14.5,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 1,
  },
  numerologyBio: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.light.textSecondary,
  },
  traitsLabel: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 1,
    color: Colors.light.textSecondary,
    marginBottom: 10,
  },
  traitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  traitBadge: {
    backgroundColor: 'rgba(108,82,153,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(108,82,153,0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  traitBadgeText: {
    fontSize: 9.5,
    fontWeight: '500',
    color: Colors.light.violet,
  },
  cosmicCellsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  cosmicCellCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  cosmicCellLabel: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
  },
  cosmicCellNumber: {
    fontFamily: 'ui-serif',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 4,
  },
});
