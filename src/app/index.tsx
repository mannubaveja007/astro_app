import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  Clipboard,
  Pressable,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { INITIAL_CHAT_HISTORIES, ChatHistories } from '@/constants/astro-data';
import { CelestialBackground } from '@/components/astro/animations/celestial-background';
import { Star } from '@/components/astro/animations/star';

// Screens
import { HomeScreenView } from '@/screens/home-screen';
import { ReadingsScreenView } from '@/screens/readings-screen';
import { ChatScreenView } from '@/screens/chat-screen';
import { ReportScreenView } from '@/screens/report-screen';
import { JourneyScreenView } from '@/screens/journey-screen';
import { SupportScreenView } from '@/screens/support-screen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Twinkling stars dataset (fixed coordinate values for render purity)
const STARS_COUNT = 25;
const STARS_LIST = Array.from({ length: STARS_COUNT }, (_, i) => ({
  id: i,
  top: Math.floor(((i * 17) % 95) + 3),
  left: Math.floor(((i * 23) % 95) + 3),
  size: 1.5 + (i % 3) * 0.75,
}));

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'home' | 'readings' | 'chat' | 'journey' | 'you'>('home');
  const [supportVisible, setSupportVisible] = useState(false);
  const [chatDialogVisible, setChatDialogVisible] = useState(false);
  const [dayModalVisible, setDayModalVisible] = useState(false);

  // States
  const [countdownSeconds, setCountdownSeconds] = useState(47 * 3600 + 58 * 60 + 34); // 47:58:34
  const [expedited, setExpedited] = useState(false);
  const [pastLifeExpanded, setPastLifeExpanded] = useState(false);
  const [activeChatAgent, setActiveChatAgent] = useState<'alyssa' | 'astro'>('alyssa');
  const [journeyProgress, setJourneyProgress] = useState(0.17); // 17%
  const [journeyUnlockedCount, setJourneyUnlockedCount] = useState(5);
  const [day3Completed, setDay3Completed] = useState(false);
  const [day3Text, setDay3Text] = useState('');

  // Chat History
  const [chatHistories, setChatHistories] = useState<ChatHistories>(INITIAL_CHAT_HISTORIES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Layout Animation Variables
  const tabPillWidth = (SCREEN_WIDTH - 24) / 5;
  const tabIndicatorOffset = useSharedValue(0);

  // Particle bursts triggers
  const countdownBurstProgress = useSharedValue(0);
  const journeyBurstProgress = useSharedValue(0);
  const chatScrollViewRef = useRef<ScrollView | null>(null);

  // Ticking Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update Tab indicator offset when activeTab changes
  useEffect(() => {
    const tabIndices = { home: 0, readings: 1, chat: 2, journey: 3, you: 4 };
    const idx = tabIndices[activeTab];
    tabIndicatorOffset.value = withSpring(idx * tabPillWidth, { damping: 18, stiffness: 120 });
  }, [activeTab, tabIndicatorOffset, tabPillWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorOffset.value }],
  }));

  // Trigger Expedite Action
  const triggerExpedite = () => {
    if (expedited) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExpedited(true);

    // Initial burst
    countdownBurstProgress.value = 0;
    countdownBurstProgress.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });

    // Roll countdown value down to 11:59:59
    const target = 11 * 3600 + 59 * 60 + 59;
    let current = countdownSeconds;
    const step = Math.floor((current - target) / 25);
    
    let counter = 0;
    const interval = setInterval(() => {
      current -= step;
      if (current <= target || counter >= 24) {
        setCountdownSeconds(target);
        clearInterval(interval);
        // Final burst on completion
        countdownBurstProgress.value = 0;
        countdownBurstProgress.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) });
      } else {
        setCountdownSeconds(current);
      }
      counter++;
    }, 30);
  };

  // Send Chat message
  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg = {
      sender: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeChatAgent]: [...prev[activeChatAgent], userMsg],
    }));
    setInputText('');

    // Simulate agent reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentReplies = {
        alyssa: [
          'I feel a strong cosmic shift in your 5th house of romance. Ensure you log your dreams tonight.',
          'The stars indicate a clear connection unfolding soon. Give yourself 10 minutes of complete silence today.',
          'You are welcome! The past life is a foundation, but your current actions are what construct your destiny.'
        ],
        astro: [
          'Your Life Path is 7, which denotes the seeker archetype. This means your primary growth occurs through introspection.',
          'The Saturn transit is bringing structural discipline to your career sector right now. Embrace the quiet work.',
          'Yes! The symbol of the crescent moon in your sketch represents emerging intuition and new emotional cycles.'
        ]
      };
      
      const replies = agentReplies[activeChatAgent];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const systemReply = {
        sender: activeChatAgent,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistories((prev) => ({
        ...prev,
        [activeChatAgent]: [...prev[activeChatAgent], systemReply],
      }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1800);
  };

  // Submit Journey reflection
  const submitDay3 = () => {
    if (!day3Text.trim()) {
      Alert.alert('Exercise Incomplete', 'Please type a short reflection to complete your journey step!');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setDay3Completed(true);
    setJourneyProgress(0.2); // Fills progress bar to 20%
    setJourneyUnlockedCount(6);
    setDayModalVisible(false);

    // Trigger journey particles celebration
    journeyBurstProgress.value = 0;
    journeyBurstProgress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) });
  };

  // Copy support email
  const copySupportEmail = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Clipboard.setString('support@oria.org');
    Alert.alert('Email Copied', 'support@oria.org has been copied to your clipboard.');
  };

  return (
    <View style={styles.container}>
      {/* Background Star field */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CelestialBackground />
        {STARS_LIST.map((star) => (
          <Star key={star.id} top={star.top} left={star.left} size={star.size} />
        ))}
      </View>

      {/* Screen Headers */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Text style={styles.topBarTitle}>astro</Text>
            <Text style={styles.topBarPlus}>+</Text>
          </View>

          <View style={styles.topBarCenter}>
            <Text style={styles.topBarSectionText}>
              {activeTab === 'home'
                ? 'Daily'
                : activeTab === 'readings'
                ? 'Readings'
                : activeTab === 'chat'
                ? 'Chat'
                : activeTab === 'journey'
                ? 'Guides'
                : 'You'}
            </Text>
          </View>

          <View style={styles.topBarRight}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSupportVisible(true);
              }}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              hitSlop={8}>
              <Ionicons name="help-circle-outline" size={18} color={Colors.light.textSecondary} />
            </Pressable>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('you');
              }}
              style={({ pressed }) => [
                styles.headerButton,
                activeTab === 'you' && styles.headerButtonActive,
                pressed && styles.headerButtonPressed
              ]}
              hitSlop={8}>
              <Ionicons name="person-outline" size={18} color={activeTab === 'you' ? Colors.light.violet : Colors.light.textSecondary} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Screens Viewport */}
      <View style={styles.viewport}>
        {activeTab === 'home' && (
          <HomeScreenView
            countdownSeconds={countdownSeconds}
            expedited={expedited}
            triggerExpedite={triggerExpedite}
            countdownBurstProgress={countdownBurstProgress}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'readings' && (
          <ReadingsScreenView
            pastLifeExpanded={pastLifeExpanded}
            setPastLifeExpanded={setPastLifeExpanded}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'chat' && (
          <ChatScreenView
            chatHistories={chatHistories}
            activeChatAgent={activeChatAgent}
            setActiveChatAgent={setActiveChatAgent}
            chatDialogVisible={chatDialogVisible}
            setChatDialogVisible={setChatDialogVisible}
            inputText={inputText}
            setInputText={setInputText}
            isTyping={isTyping}
            handleSendMessage={handleSendMessage}
            chatScrollViewRef={chatScrollViewRef}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === 'journey' && (
          <JourneyScreenView
            journeyProgress={journeyProgress}
            journeyUnlockedCount={journeyUnlockedCount}
            day3Completed={day3Completed}
            setDayModalVisible={setDayModalVisible}
            journeyBurstProgress={journeyBurstProgress}
          />
        )}
        {activeTab === 'you' && <ReportScreenView />}
      </View>

      {/* Support screen modal */}
      <SupportScreenView
        supportVisible={supportVisible}
        setSupportVisible={setSupportVisible}
        copySupportEmail={copySupportEmail}
      />

      {/* ==================================================== */}
      {/* SCREEN 8: DAY 3 JOURNEY STEP MODAL */}
      {/* ==================================================== */}
      {dayModalVisible && (
        <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFill, styles.overlayModalBg, styles.centerModal]}>
          <View style={[styles.card, styles.journeyDayModal]}>
            <View style={styles.dayModalHeader}>
              <Text style={styles.dayModalLabel}>JOURNEY STEP · DAY 3</Text>
              <Pressable
                onPress={() => setDayModalVisible(false)}
                hitSlop={8}>
                <Ionicons name="close" size={16} color={Colors.light.textSecondary} />
              </Pressable>
            </View>
            <Text style={styles.dayModalTitle}>{"Recognize the love you're calling in"}</Text>
            <Text style={styles.dayModalDescription}>
              {"Day 3 exercise invites you to sit in a quiet place, close your eyes, and notice what feelings arise when you imagine meeting your partner. Note down 3 specific qualities they reflect."}
            </Text>

            <View style={styles.textareaContainer}>
              <TextInput
                multiline
                numberOfLines={3}
                value={day3Text}
                onChangeText={setDay3Text}
                placeholder="Write your reflection here..."
                placeholderTextColor={Colors.light.textSecondary}
                style={styles.dayTextarea}
              />
            </View>

            <Pressable
              onPress={submitDay3}
              style={({ pressed }) => [styles.btnPrimary, pressed && styles.btnPrimaryPressed]}>
              <Text style={styles.btnText}>Complete Day 3</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      {/* ==================================================== */}
      {/* PERSISTENT BOTTOM NAVIGATION BAR */}
      {/* ==================================================== */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        {/* Custom animated dash below active tab */}
        <Animated.View style={[styles.tabIndicatorPill, { width: 12, left: (tabPillWidth - 12) / 2 }, animatedIndicatorStyle]} />

        {/* Home Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('home');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={20}
            color={activeTab === 'home' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>Home</Text>
        </Pressable>

        {/* Readings Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('readings');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'readings' ? 'book' : 'book-outline'}
            size={20}
            color={activeTab === 'readings' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'readings' && styles.tabTextActive]}>Readings</Text>
        </Pressable>

        {/* Chat Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('chat');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'chat' ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'}
            size={20}
            color={activeTab === 'chat' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'chat' && styles.tabTextActive]}>Chat</Text>
        </Pressable>

        {/* Guides (Journey) Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('journey');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'journey' ? 'triangle' : 'triangle-outline'}
            size={20}
            color={activeTab === 'journey' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'journey' && styles.tabTextActive]}>Guides</Text>
        </Pressable>

        {/* You (Profile) Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('you');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'you' ? 'person' : 'person-outline'}
            size={20}
            color={activeTab === 'you' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'you' && styles.tabTextActive]}>You</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  headerSafeArea: {
    backgroundColor: 'rgba(255, 253, 251, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  topBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  topBarTitle: {
    fontFamily: 'ui-serif',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: Colors.light.text,
  },
  topBarPlus: {
    fontFamily: 'system-ui',
    fontSize: 14,
    color: Colors.light.gold,
    fontWeight: 'bold',
    marginLeft: 2,
    alignSelf: 'flex-start',
  },
  topBarCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1, // Keep behind buttons for clicks
  },
  topBarSectionText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.light.textSecondary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.background,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonActive: {
    borderColor: 'rgba(108, 82, 153, 0.2)',
    backgroundColor: 'rgba(108, 82, 153, 0.04)',
  },
  headerButtonPressed: {
    backgroundColor: '#f0eae0',
    transform: [{ scale: 0.96 }],
  },
  viewport: {
    flex: 1,
  },
  overlayModalBg: {
    backgroundColor: 'rgba(30, 22, 18, 0.4)',
    zIndex: 100,
  },
  centerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
  journeyDayModal: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.light.backgroundElement,
  },
  dayModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayModalLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.light.gold,
  },
  dayModalTitle: {
    fontFamily: 'ui-serif',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  dayModalDescription: {
    fontSize: 11.5,
    color: '#554C42',
    lineHeight: 15.5,
    marginBottom: 16,
  },
  textareaContainer: {
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
  },
  dayTextarea: {
    height: 60,
    textAlignVertical: 'top',
    fontSize: 11,
    color: Colors.light.text,
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
  btnText: {
    color: Colors.light.backgroundElement,
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    height: 60,
    backgroundColor: 'rgba(255, 253, 251, 0.95)',
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabIndicatorPill: {
    position: 'absolute',
    bottom: 5,
    height: 3,
    backgroundColor: Colors.light.violet,
    borderRadius: 1.5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    zIndex: 10,
  },
  tabText: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.violet,
  },
});
