import React from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';
import { ChatHistories } from '@/constants/astro-data';
import { AnimatedSendButton } from '@/components/astro/animations/animated-send-button';
import { TypingDot } from '@/components/astro/animations/typing-dot';

interface ChatScreenProps {
  chatHistories: ChatHistories;
  activeChatAgent: 'alyssa' | 'astro';
  setActiveChatAgent: (agent: 'alyssa' | 'astro') => void;
  chatDialogVisible: boolean;
  setChatDialogVisible: (visible: boolean) => void;
  inputText: string;
  setInputText: (text: string) => void;
  isTyping: boolean;
  handleSendMessage: () => void;
  chatScrollViewRef: React.RefObject<ScrollView | null>;
  setActiveTab: (tab: 'home' | 'readings' | 'chat' | 'journey' | 'you') => void;
}

export function ChatScreenView({
  chatHistories,
  activeChatAgent,
  setActiveChatAgent,
  chatDialogVisible,
  setChatDialogVisible,
  inputText,
  setInputText,
  isTyping,
  handleSendMessage,
  chatScrollViewRef,
  setActiveTab,
}: ChatScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <Animated.ScrollView
      entering={FadeIn.duration(400)}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* AI Assistant Promo */}
      <View style={[styles.chatAIPromo, { overflow: 'hidden', position: 'relative' }]}>
        <LinearGradient
          colors={['#FFFDFB', '#FAF8F4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.chatAILeft}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>✨</Text>
          </View>
          <View>
            <Text style={styles.chatAITitle}>Ask Astro anything</Text>
            <View style={styles.chatAIStatusRow}>
              <View style={styles.aiStatusDot} />
              <Text style={styles.chatAIStatusText}>Available now</Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveChatAgent('astro');
            setChatDialogVisible(true);
          }}
          style={({ pressed }) => [styles.btnPrimary, styles.chatAIButton, pressed && styles.btnPrimaryPressed]}>
          <Text style={styles.btnTextCompactGold}>Start chat →</Text>
        </Pressable>
      </View>

      {/* Relationship Sketch Card - Harmonized Light Theme */}
      <View style={styles.chatReadingPromoContainer}>
        <LinearGradient
          colors={['#FFFDFB', '#F9F5FD']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.promoFlex}>
          <View style={styles.promoTextCol}>
            <View style={styles.promoHeaderRow}>
              <Text style={styles.promoEmoji}>🔮</Text>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>Soulmate</Text>
              </View>
            </View>
            <Text style={styles.promoTitle}>Soulmate Sketch &amp; Relationship Reading</Text>
            <Text style={styles.promoSub}>{"Your soul's love portrait"}</Text>
          </View>
          <Pressable
            onPress={() => setActiveTab('readings')}
            style={({ pressed }) => [styles.btnPrimary, styles.promoBtn, pressed && styles.promoBtnPressed]}>
            <Text style={styles.promoBtnText}>View results</Text>
          </Pressable>
        </View>
      </View>

      {/* Conversations list */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>RECENT CONVERSATIONS</Text>
        <View style={styles.sectionDivider} />

        <View style={styles.threadContainer}>
          {/* Alyssa thread */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveChatAgent('alyssa');
              setChatDialogVisible(true);
            }}
            style={({ pressed }) => [styles.threadRow, pressed && styles.cardPressed]}>
            <View style={[styles.threadAvatar, { backgroundColor: '#f8eef2' }]}>
              <Text style={styles.threadAvatarEmoji}>🌙</Text>
            </View>
            <View style={styles.threadInfo}>
              <View style={styles.threadHeaderRow}>
                <Text style={styles.threadTitleText}>Chat with Alyssa</Text>
                <Text style={styles.threadTime}>3:10 PM</Text>
              </View>
              <Text style={styles.threadSnippet} numberOfLines={1}>
                {chatHistories.alyssa[chatHistories.alyssa.length - 1].text}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.light.textSecondary} style={{ alignSelf: 'center', opacity: 0.7 }} />
          </Pressable>

          {/* Astro thread */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveChatAgent('astro');
              setChatDialogVisible(true);
            }}
            style={({ pressed }) => [styles.threadRow, styles.threadRowBorderNone, pressed && styles.cardPressed]}>
            <View style={[styles.threadAvatar, { backgroundColor: '#ede8f6' }]}>
              <Text style={styles.threadAvatarEmoji}>✨</Text>
            </View>
            <View style={styles.threadInfo}>
              <View style={styles.threadHeaderRow}>
                <Text style={styles.threadTitleText}>General Guidance</Text>
                <Text style={styles.threadTime}>May 21</Text>
              </View>
              <View style={styles.threadSnippetRow}>
                <Text style={styles.threadSnippet} numberOfLines={1}>
                  {chatHistories.astro[chatHistories.astro.length - 1].text}
                </Text>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>active</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.light.textSecondary} style={{ alignSelf: 'center', opacity: 0.7 }} />
          </Pressable>
        </View>
      </View>

      {/* Cosmic Wisdom Card to fill the empty space */}
      <View style={styles.wisdomCard}>
        <Text style={styles.wisdomIcon}>✦</Text>
        <Text style={styles.wisdomText}>
          {"\"The stars do not pull us, they guide us. In silence, the soul hears the whisper of the cosmos.\""}
        </Text>
        <Text style={styles.wisdomAuthor}>· Daily Astro Tip ·</Text>
      </View>

      {/* Floating Modal dialogue */}
      {chatDialogVisible && (
        <Animated.View entering={FadeIn.duration(250)} style={[StyleSheet.absoluteFill, styles.overlayModalBg]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalContentCard}>
              <View style={styles.modalHeader}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setChatDialogVisible(false);
                  }}
                  style={styles.modalBackBtn}>
                  <Ionicons name="chevron-down" size={16} color={Colors.light.violet} />
                  <Text style={styles.modalBackText}>Close</Text>
                </Pressable>
                <Text style={styles.modalHeaderTitle}>
                  {activeChatAgent === 'alyssa' ? 'Chat with Alyssa' : 'Astro Assistant'}
                </Text>
                <View style={{ width: 45 }} />
              </View>

              {/* Message History View */}
              <View style={{ flex: 1, position: 'relative' }}>
                <ScrollView
                  ref={chatScrollViewRef}
                  onContentSizeChange={() => chatScrollViewRef.current?.scrollToEnd({ animated: true })}
                  contentContainerStyle={[
                    styles.chatScrollContent,
                    { paddingBottom: insets.bottom > 0 ? insets.bottom + 76 : 84 }
                  ]}
                  showsVerticalScrollIndicator={false}>
                  {chatHistories[activeChatAgent].map((msg, idx) => (
                    <Animated.View
                      entering={FadeInDown.springify().mass(0.8).damping(14)}
                      key={idx}
                      style={[
                        styles.chatBubbleRow,
                        msg.sender === 'user' ? styles.bubbleUserRow : styles.bubbleAgentRow,
                      ]}>
                      {msg.sender !== 'user' && (
                        <View style={styles.bubbleAvatar}>
                          <Text style={styles.bubbleAvatarText}>
                            {activeChatAgent === 'alyssa' ? '🌙' : '✨'}
                          </Text>
                        </View>
                      )}
                      <View
                        style={[
                          styles.bubbleContent,
                          msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAgent,
                        ]}>
                        <Text style={msg.sender === 'user' ? styles.bubbleUserText : styles.bubbleAgentText}>
                          {msg.text}
                        </Text>
                        <Text style={styles.bubbleTime}>{msg.time}</Text>
                      </View>
                    </Animated.View>
                  ))}
                </ScrollView>

                {/* Typing indicator */}
                {isTyping && (
                  <Animated.View
                    entering={FadeInDown.duration(200)}
                    style={[
                      styles.typingIndicatorRow,
                      { bottom: insets.bottom > 0 ? insets.bottom + 68 : 76 }
                    ]}
                  >
                    <TypingDot />
                    <Text style={styles.typingText}>
                      {activeChatAgent === 'alyssa' ? 'Alyssa is channeling…' : 'Astro is typing…'}
                    </Text>
                  </Animated.View>
                )}

                {/* Message Composer input */}
                <BlurView
                  intensity={90}
                  tint="light"
                  style={[
                    styles.chatComposer,
                    { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
                  ]}
                >
                  <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask about your reading..."
                    placeholderTextColor={Colors.light.textSecondary}
                    style={styles.chatInput}
                  />
                  <AnimatedSendButton text={inputText} onPress={handleSendMessage} />
                </BlurView>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
    flexGrow: 1,
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
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  chatAIPromo: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: 'rgba(108,82,153,0.15)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  chatAILeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EDE8F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiAvatarText: {
    fontSize: 18,
  },
  chatAITitle: {
    fontFamily: 'ui-serif',
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.light.text,
  },
  chatAIStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  aiStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  chatAIStatusText: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  chatAIButton: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.gold,
  },
  btnTextCompactGold: {
    color: '#FAF8F5',
    fontSize: 11,
    fontWeight: '600',
  },
  chatReadingPromoContainer: {
    borderRadius: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.light.violet,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(108, 82, 153, 0.03)',
  },
  promoFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  promoTextCol: {
    flex: 1,
  },
  promoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  promoEmoji: {
    fontSize: 20,
  },
  promoBadge: {
    backgroundColor: 'rgba(108, 82, 153, 0.05)',
    borderColor: 'rgba(108, 82, 153, 0.15)',
    borderWidth: 1,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  promoBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.light.violet,
    textTransform: 'uppercase',
  },
  promoTitle: {
    fontFamily: 'ui-serif',
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    lineHeight: 18,
  },
  promoSub: {
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: Colors.light.violet,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0,
    boxShadow: '0 2px 6px rgba(108, 82, 153, 0.15)',
  },
  promoBtnPressed: {
    backgroundColor: '#523A7A',
    transform: [{ scale: 0.96 }],
  },
  promoBtnText: {
    color: '#FFFDFB',
    fontSize: 11,
    fontWeight: '600',
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
  threadContainer: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    overflow: 'hidden',
  },
  threadRow: {
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  threadRowBorderNone: {
    borderBottomWidth: 0,
  },
  threadAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadAvatarEmoji: {
    fontSize: 18,
  },
  threadInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  threadHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  threadTitleText: {
    fontFamily: 'ui-serif',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.text,
  },
  threadTime: {
    fontSize: 9.5,
    color: Colors.light.textSecondary,
  },
  threadSnippetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  threadSnippet: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    flex: 1,
  },
  activeBadge: {
    backgroundColor: Colors.light.backgroundSelected,
    borderWidth: 1,
    borderColor: Colors.light.borderGlow,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.light.gold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wisdomCard: {
    alignSelf: 'center',
    width: '100%',
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: 'rgba(197, 155, 39, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  wisdomIcon: {
    color: Colors.light.gold,
    fontSize: 12,
    marginBottom: 6,
  },
  wisdomText: {
    fontFamily: 'ui-serif',
    fontSize: 11,
    fontStyle: 'italic',
    color: '#6E645A',
    lineHeight: 16,
    textAlign: 'center',
  },
  wisdomAuthor: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.light.gold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
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
  chatScrollContent: {
    padding: 16,
    gap: 12,
    backgroundColor: '#FDFBF7',
  },
  chatBubbleRow: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '80%',
  },
  bubbleUserRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  bubbleAgentRow: {
    alignSelf: 'flex-start',
  },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  bubbleAvatarText: {
    fontSize: 12,
  },
  bubbleContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleUser: {
    backgroundColor: Colors.light.violet,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 2,
    boxShadow: '0 2px 6px rgba(108, 82, 153, 0.12)',
  },
  bubbleAgent: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 16,
  },
  bubbleUserText: {
    color: '#FFFDFB',
    fontSize: 11.5,
  },
  bubbleAgentText: {
    color: Colors.light.text,
    fontSize: 11.5,
  },
  bubbleTime: {
    fontSize: 8,
    opacity: 0.5,
    marginTop: 4,
    textAlign: 'right',
    color: Colors.light.textSecondary,
  },
  typingIndicatorRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 253, 251, 0.95)',
    borderWidth: 1,
    borderColor: Colors.light.borderGlow,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  typingText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  chatComposer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 253, 251, 0.95)',
  },
  chatInput: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 12,
    fontSize: 11.5,
    color: Colors.light.text,
  },
  btnTextCompact: {
    color: Colors.light.backgroundElement,
    fontSize: 11,
    fontWeight: '600',
  },
});
