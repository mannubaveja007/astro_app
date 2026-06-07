import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';
import { FAQ_ITEMS } from '@/constants/astro-data';
import { FAQAccordionItem } from '@/components/astro/faq-accordion';

interface SupportScreenProps {
  supportVisible: boolean;
  setSupportVisible: (visible: boolean) => void;
  copySupportEmail: () => void;
}

export function SupportScreenView({
  supportVisible,
  setSupportVisible,
  copySupportEmail,
}: SupportScreenProps) {
  if (!supportVisible) return null;

  return (
    <Animated.View entering={FadeIn.duration(250)} style={[StyleSheet.absoluteFill, styles.overlayModalBg]}>
      <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
        <View style={styles.modalContentCard}>
          <View style={styles.modalHeader}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSupportVisible(false);
              }}
              style={styles.modalBackBtn}>
              <Ionicons name="arrow-back" size={16} color={Colors.light.violet} />
              <Text style={styles.modalBackText}>Back</Text>
            </Pressable>
            <Text style={styles.modalHeaderTitle}>Help & Support</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.supportIntroduction}>
              <View style={styles.supportQMark}>
                <Text style={styles.supportQText}>?</Text>
              </View>
              <View>
                <Text style={styles.supportIntroductionTitle}>Need a hand?</Text>
                <Text style={styles.supportIntroductionSub}>We usually reply within a few hours.</Text>
              </View>
            </View>

            <Text style={styles.supportBodyText}>
              {"We're here for anything — your reading, delivery, or account. Your reading remains safely in progress while we help."}
            </Text>

            {/* Email Support Card */}
            <View style={styles.card}>
              <View style={styles.emailCardRow}>
                <View style={styles.emailTextCol}>
                  <Text style={styles.emailCardTitle}>Email support</Text>
                  <Text style={styles.emailAddressText}>support@oria.org</Text>
                </View>
                <Pressable
                  onPress={copySupportEmail}
                  style={({ pressed }) => [styles.copyBtn, pressed && { backgroundColor: 'rgba(0,0,0,0.03)' }]}>
                  <Ionicons name="copy-outline" size={14} color={Colors.light.textSecondary} />
                </Pressable>
              </View>
            </View>

            {/* Accordions */}
            <View style={styles.faqSection}>
              <Text style={styles.faqLabel}>FREQUENT QUESTIONS</Text>
              {FAQ_ITEMS.map((item, idx) => (
                <FAQAccordionItem key={idx} title={item.title} content={item.content} />
              ))}
            </View>

            <Text style={styles.supportFooterText}>
              Thank you for supporting our readers, artists, and small team. ✦
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
  overlayModalBg: {
    backgroundColor: 'rgba(30, 22, 18, 0.4)',
    zIndex: 100,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalContentCard: {
    flex: 1,
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundElement,
  },
  modalBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalBackText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.light.violet,
  },
  modalHeaderTitle: {
    fontFamily: 'ui-serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
  },
  modalScrollContent: {
    padding: 16,
    gap: 16,
  },
  supportIntroduction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  supportQMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAF6FC',
    borderWidth: 1,
    borderColor: 'rgba(108,82,153,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportQText: {
    fontSize: 18,
    color: Colors.light.violet,
    fontWeight: '600',
  },
  supportIntroductionTitle: {
    fontFamily: 'ui-serif',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  supportIntroductionSub: {
    fontSize: 10.5,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  supportBodyText: {
    fontSize: 11,
    lineHeight: 15,
    color: Colors.light.textSecondary,
  },
  emailCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emailTextCol: {
    flex: 1,
  },
  emailCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  emailAddressText: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  copyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqSection: {
    gap: 8,
  },
  faqLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  supportFooterText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 10.5,
    color: Colors.light.textSecondary,
    fontFamily: 'ui-serif',
    fontStyle: 'italic',
  },
});
