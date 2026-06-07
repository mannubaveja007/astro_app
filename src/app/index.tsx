import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  Alert,
  Clipboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeInDown,
  Layout,
  SharedValue,
} from 'react-native-reanimated';

// Custom icons using Lucide-style SVG shapes/Ionicons
import { Ionicons } from '@expo/vector-icons';

// Theme Constants
import { Colors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ----------------------------------------------------
// STAR COMPONENT (TWINKLING EFFECT)
// ----------------------------------------------------
interface StarProps {
  top: number;
  left: number;
  size: number;
  delay: number;
}

function Star({ top, left, size, delay }: StarProps) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = 0.1 + Math.random() * 0.3;
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 + Math.random() * 1000, easing: Easing.ease }),
        withTiming(0.1, { duration: 1500 + Math.random() * 1000, easing: Easing.ease })
      ),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: opacity.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        {
          top: `${top}%`,
          left: `${left}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

// ----------------------------------------------------
// FAQ ACCORDION COMPONENT
// ----------------------------------------------------
interface FAQItemProps {
  title: string;
  content: string;
}

function FAQAccordionItem({ title, content }: FAQItemProps) {
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

// ----------------------------------------------------
// CELESTIAL BACKGROUND & GRIDS
// ----------------------------------------------------
function CelestialBackground() {
  const rotation1 = useSharedValue(0);
  const rotation2 = useSharedValue(0);
  const rotation3 = useSharedValue(0);

  useEffect(() => {
    rotation1.value = withRepeat(
      withTiming(360, { duration: 160000, easing: Easing.linear }),
      -1,
      false
    );
    rotation2.value = withRepeat(
      withTiming(-360, { duration: 240000, easing: Easing.linear }),
      -1,
      false
    );
    rotation3.value = withRepeat(
      withTiming(360, { duration: 320000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation1, rotation2, rotation3]);

  const ringStyle1 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation1.value}deg` }],
  }));

  const ringStyle2 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation2.value}deg` }],
  }));

  const ringStyle3 = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation3.value}deg` }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Astrological Axes Grid */}
      <View style={[styles.axisLine, styles.axisHorizontal]} />
      <View style={[styles.axisLine, styles.axisVertical]} />
      <View style={[styles.axisLine, styles.axisDiag1]} />
      <View style={[styles.axisLine, styles.axisDiag2]} />

      {/* Rotating concentric rings */}
      <Animated.View style={[styles.celestialRing, styles.ringOuter, ringStyle1]}>
        <View style={styles.ringNorthStar}>
          <Text style={styles.constellationLabel}>N</Text>
        </View>
        <View style={styles.ringSouthStar}>
          <Text style={styles.constellationLabel}>S</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.celestialRing, styles.ringMid, ringStyle2]}>
        <View style={styles.ringEastStar}>
          <Text style={styles.constellationLabel}>E</Text>
        </View>
        <View style={styles.ringWestStar}>
          <Text style={styles.constellationLabel}>W</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.celestialRing, styles.ringInner, ringStyle3]} />

      {/* Axis text anchors */}
      <View style={styles.axisLabelContainer}>
        <Text style={[styles.axisLabelText, { top: 60, left: '50%', transform: [{ translateX: -12 }] }]}>MC</Text>
        <Text style={[styles.axisLabelText, { bottom: 100, left: '50%', transform: [{ translateX: -10 }] }]}>IC</Text>
        <Text style={[styles.axisLabelText, { left: 20, top: '50%', transform: [{ translateY: -10 }] }]}>ASC</Text>
        <Text style={[styles.axisLabelText, { right: 20, top: '50%', transform: [{ translateY: -10 }] }]}>DSC</Text>
      </View>
    </View>
  );
}

// ----------------------------------------------------
// CELESTIAL PARTICLE BURST
// ----------------------------------------------------
const PARTICLE_COUNT = 15;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i * 2 * Math.PI) / PARTICLE_COUNT;
  // Deterministic distances and sizes to avoid Math.random during render
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
    // Fade out towards the end
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

function ParticleBurst({ progress }: { progress: SharedValue<number> }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {PARTICLES.map((p) => (
        <BurstParticleItem key={p.id} progress={progress} p={p} />
      ))}
    </View>
  );
}

// ----------------------------------------------------
// PULSING ACTIVE DAY NODE
// ----------------------------------------------------
function ActiveNode({ children }: { children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.3, { duration: 1000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1000, easing: Easing.out(Easing.ease) }),
        withTiming(0.4, { duration: 0 })
      ),
      -1,
      false
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.activeNodeContainer}>
      <Animated.View style={[styles.nodeActivePulse, animatedStyle]} />
      <View style={styles.nodeActive}>
        {children}
      </View>
    </View>
  );
}

// ----------------------------------------------------
// TIMER DIGIT SEGMENT CARD
// ----------------------------------------------------
interface TimerSegmentProps {
  value: string;
  label: string;
}

function TimerSegment({ value, label }: TimerSegmentProps) {
  const scale = useSharedValue(1);

  // Trigger scale bounce when value changes
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.08, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 10, stiffness: 100 })
    );
  }, [value, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.segmentWrapper}>
      <Animated.View style={[styles.segmentCard, animatedStyle]}>
        <LinearGradient
          colors={['#FFFDFB', '#FDFBF7']}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.segmentNumber}>{value}</Text>
      </Animated.View>
      <Text style={styles.segmentLabel}>{label}</Text>
    </View>
  );
}

// ----------------------------------------------------
// FLOATING COMPOSER ANIMATED SEND BUTTON
// ----------------------------------------------------
interface SendButtonProps {
  text: string;
  onPress: () => void;
}

function AnimatedSendButton({ text, onPress }: SendButtonProps) {
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

// ----------------------------------------------------
// FLOATING TYPING DOT
// ----------------------------------------------------
function TypingDot() {
  const pulse = useSharedValue(0.4);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.4, { duration: 600 })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value }],
  }));

  return <Animated.View style={[styles.typingDot, animatedStyle]} />;
}

// ----------------------------------------------------
// Pulsating Astrologer Avatar Glow
// ----------------------------------------------------
function AvatarPulse() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.25, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(0.35, { duration: 0 })
      ),
      -1,
      false
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.avatarPulse, animatedStyle]} />;
}

// ----------------------------------------------------
// MAIN APPLICATION
// ----------------------------------------------------
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
  const [chatHistories, setChatHistories] = useState({
    alyssa: [
      { sender: 'alyssa', text: 'Hello Alex! I am currently channeling your past life energies. The connection is quite strong.', time: 'Yesterday' },
      { sender: 'user', text: 'Thank you Alyssa, I can feel a transition happening too.', time: 'Yesterday' },
      { sender: 'alyssa', text: 'Excellent. Have you been noticing repetitive symbols like numbers or animals?', time: '3:05 PM' },
      { sender: 'user', text: 'Thank you so much, this really resonated', time: '3:10 PM' }
    ],
    astro: [
      { sender: 'astro', text: 'Greetings! I am Astro, your cosmic assistant. Ask me anything about your astrological birth chart or reading statuses.', time: '10:00 AM' }
    ]
  });
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Layout Animation Variables
  const tabPillWidth = (SCREEN_WIDTH - 24) / 5;
  const tabIndicatorOffset = useSharedValue(0);
  
  // Animation triggers
  const countdownBurstProgress = useSharedValue(0);
  const journeyBurstProgress = useSharedValue(0);
  const chatScrollViewRef = useRef<ScrollView>(null);

  // Twinkling stars dataset (fixed random coordinates)
  const [stars] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
    }))
  );

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
      {/* Celestial Background & Star field */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <CelestialBackground />
        {stars.map((star) => (
          <Star key={star.id} top={star.top} left={star.left} size={star.size} delay={star.delay} />
        ))}
      </View>

      {/* Screen Headers */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <Text style={styles.topBarTitle}>
              {activeTab === 'home'
                ? 'astro'
                : activeTab === 'readings'
                ? 'Readings'
                : activeTab === 'chat'
                ? 'Chat'
                : activeTab === 'journey'
                ? '30-Day Journey'
                : 'You'}
            </Text>
            {activeTab === 'home' && <Text style={styles.topBarPlus}>+</Text>}
          </View>

          <View style={styles.topBarRight}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSupportVisible(true);
              }}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              hitSlop={8}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.light.textSecondary} />
            </Pressable>
            
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTab('you');
              }}
              style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              hitSlop={8}>
              <Ionicons name="person-outline" size={18} color={Colors.light.textSecondary} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      {/* Screens Viewport */}
      <View style={styles.viewport}>

        {/* ==================================================== */}
        {/* SCREEN 1: HOME */}
        {/* ==================================================== */}
        {activeTab === 'home' && (
          <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            <LinearGradient
              colors={['rgba(108,82,153,0.06)', 'rgba(197,155,39,0.04)', 'transparent']}
              style={styles.heroBand}
            />

            {/* Reader Card */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.card}>
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
              <Text style={styles.inProgressText}>Your reading is in progress ✦</Text>
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
        )}

        {/* ==================================================== */}
        {/* SCREEN 2: READINGS */}
        {/* ==================================================== */}
        {activeTab === 'readings' && (
          <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            {/* Banner */}
            <View style={styles.readyBanner}>
              <Text style={styles.readyIcon}>🎉</Text>
              <View style={styles.readyTextGroup}>
                <Text style={styles.readyTitle}>Ready! Your complete reading</Text>
                <Text style={styles.readySub}>Progress shown for all · unlock instantly</Text>
              </View>
            </View>

            {/* Unlocked Readings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>UNLOCKED READINGS</Text>
              <View style={styles.sectionDivider} />

              <Animated.View style={styles.card}>
                <View style={styles.unlockedRow}>
                  <Text style={styles.unlockedEmoji}>🌿</Text>
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
                  style={({ pressed }) => [styles.btnReadNow, pressed && { opacity: 0.7 }]}>
                  <Text style={styles.btnReadNowText}>{pastLifeExpanded ? 'Close read ↑' : 'Read now ↓'}</Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Locked Readings */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>UPCOMING READINGS</Text>
              <View style={styles.sectionDivider} />

              <View style={styles.lockedStack}>
                {[
                  { title: 'What you were before this life', icon: '🧭', type: 'Life Purpose' },
                  { title: 'How your love story really unfolds', icon: '💞', type: 'Soulmate Connection' },
                  { title: 'What the universe is pulling you toward', icon: '🌌', type: 'Cosmic Destiny' }
                ].map((item, index) => (
                  <Pressable
                    key={index}
                    onPress={() => Alert.alert('✦ Reading Locked ✦', `Your "${item.type}" reading is currently being aligned. Complete your current Daily Journey exercises or expedite to unlock instantly.`)}
                    style={({ pressed }) => [styles.lockedCard, pressed && styles.cardPressed]}>
                    <Text style={styles.lockedIcon}>{item.icon}</Text>
                    <View style={styles.lockedInfo}>
                      <Text style={styles.lockedTitle}>{item.title}</Text>
                      <Text style={styles.lockedSub}>{item.type}</Text>
                    </View>
                    <View style={styles.lockBadge}>
                      <Ionicons name="lock-closed" size={10} color={Colors.light.textSecondary} />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

          </Animated.ScrollView>
        )}

        {/* ==================================================== */}
        {/* SCREEN 3: CHAT */}
        {/* ==================================================== */}
        {activeTab === 'chat' && (
          <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>

            {/* AI Assistant Promo */}
            <View style={styles.chatAIPromo}>
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
                <Text style={styles.btnTextCompact}>Start chat →</Text>
              </Pressable>
            </View>

            {/* Relationship Sketch Card */}
            <LinearGradient
              colors={['#6C5299', '#4D337A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chatReadingPromo}>
              <View style={styles.promoFlex}>
                <View style={styles.promoTextCol}>
                  <Text style={styles.promoEmoji}>🔮</Text>
                  <Text style={styles.promoTitle}>Soulmate Sketch &amp; Relationship Reading</Text>
                  <Text style={styles.promoSub}>{"Your soul's love portrait"}</Text>
                </View>
                <Pressable
                  onPress={() => setActiveTab('readings')}
                  style={({ pressed }) => [styles.btnSecondary, styles.promoBtn, pressed && { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
                  <Text style={styles.promoBtnText}>View results</Text>
                </Pressable>
              </View>
            </LinearGradient>

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
                </Pressable>
              </View>
            </View>

          </Animated.ScrollView>
        )}

        {/* ==================================================== */}
        {/* SCREEN 4: PROFILE & NUMEROLOGY ("YOU") */}
        {/* ==================================================== */}
        {activeTab === 'you' && (
          <Animated.ScrollView
            entering={FadeIn.duration(400)}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            
            {/* User Profile Info (Fixed Corgi/Alyssa overlap) */}
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
        )}

        {/* ==================================================== */}
        {/* SCREEN 5: JOURNEY ("GUIDES") */}
        {/* ==================================================== */}
        {activeTab === 'journey' && (
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
                      <Text style={styles.lockStatusText}>🔒 Tomorrow</Text>
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
                    <Text style={styles.lockStatusText}>🔒 2 days</Text>
                  </View>
                </View>
              </Animated.View>
            </View>

          </Animated.ScrollView>
        )}

      </View>

      {/* ==================================================== */}
      {/* SCREEN 6: HELP & SUPPORT SLIDE-IN MODAL */}
      {/* ==================================================== */}
      {supportVisible && (
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
                  
                  <FAQAccordionItem
                    title="Questions about your reading"
                    content="All readings are channeled individually by Alyssa. If you have expedited your reading, it will be complete within 12 hours. Normal readings take between 24 and 48 hours depending on reader alignment."
                  />
                  
                  <FAQAccordionItem
                    title="Help with your account or order"
                    content="Transactions are secured. If you did not receive a confirmation email or need to restore a previous purchase, click the Email support link above and include your order reference number."
                  />
                  
                  <FAQAccordionItem
                    title="Fast, friendly support from our team"
                    content="Our small, dedicated support team works directly with our artists and astrologers to resolve issues quickly. We guarantee a resolution to all questions within 24 hours."
                  />
                </View>

                <Text style={styles.supportFooterText}>
                  Thank you for supporting our readers, artists, and small team. ✦
                </Text>
              </ScrollView>
            </View>
          </SafeAreaView>
        </Animated.View>
      )}

      {/* ==================================================== */}
      {/* SCREEN 7: CHAT DIALOG SLIDE-UP MODAL */}
      {/* ==================================================== */}
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
        {/* Custom animated pill behind active tab */}
        <Animated.View style={[styles.tabIndicatorPill, { width: tabPillWidth }, animatedIndicatorStyle]} />

        {/* Home Tab */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveTab('home');
          }}
          style={styles.tabItem}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={18}
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
            size={18}
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
            size={18}
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
            size={18}
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
            size={18}
            color={activeTab === 'you' ? Colors.light.violet : Colors.light.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'you' && styles.tabTextActive]}>You</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ----------------------------------------------------
// STYLESHEET
// ----------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  star: {
    position: 'absolute',
    backgroundColor: Colors.light.gold,
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
  headerButtonPressed: {
    backgroundColor: '#f0eae0',
    transform: [{ scale: 0.96 }],
  },
  viewport: {
    flex: 1,
  },
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
  avatarPulse: {
    position: 'absolute',
    inset: -2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    opacity: 0.35,
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
  countdownCard: {
    alignItems: 'center',
    paddingVertical: 24,
    borderColor: Colors.light.borderGlow,
    backgroundColor: Colors.light.backgroundElement,
  },
  countdownLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  countdownTime: {
    fontFamily: 'ui-serif',
    fontSize: 38,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: Colors.light.text,
    marginVertical: 4,
  },
  countdownStatus: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    fontWeight: '400',
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
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: Colors.light.backgroundElement,
    fontSize: 13,
    fontWeight: '600',
  },
  btnTextCompact: {
    color: Colors.light.backgroundElement,
    fontSize: 11,
    fontWeight: '600',
  },
  inProgressText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
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

  // Readings Styles
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

  // Chat Styles
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
  },
  chatReadingPromo: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
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
  promoEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  promoTitle: {
    fontFamily: 'ui-serif',
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFDFB',
    lineHeight: 18,
  },
  promoSub: {
    fontSize: 10,
    color: '#E9E3F3',
    marginTop: 2,
  },
  promoBtn: {
    backgroundColor: '#FFFDFB',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0,
  },
  promoBtnText: {
    color: Colors.light.violet,
    fontSize: 11,
    fontWeight: '600',
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

  // You/Profile Styles
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

  // Journey Styles
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
  nodeActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.light.gold,
    alignItems: 'center',
    justifyContent: 'center',
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
  dayCardLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.45,
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
    borderColor: Colors.light.border,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: '#FAF8F5',
  },
  lockStatusText: {
    fontSize: 9,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },

  // Modal Common Styles
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
  supportFooterText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 10.5,
    color: Colors.light.textSecondary,
    fontFamily: 'ui-serif',
    fontStyle: 'italic',
  },

  // Active Chat Screen Styles
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
    backgroundColor: Colors.light.text,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 2,
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
    color: Colors.light.backgroundElement,
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
    height: 64,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  btnSend: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Day Modal Styles
  centerModal: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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

  // Bottom Navigation Bar
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
    top: 4,
    bottom: 4,
    backgroundColor: 'rgba(108, 82, 153, 0.04)',
    borderRadius: 12,
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
  btnSendActive: {
    backgroundColor: Colors.light.violet,
    boxShadow: '0 2px 6px rgba(108, 82, 153, 0.2)',
  },
  btnSendDisabled: {
    backgroundColor: Colors.light.textSecondary,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.light.gold,
  },
  axisLine: {
    position: 'absolute',
    backgroundColor: 'rgba(197, 155, 39, 0.025)',
  },
  axisHorizontal: {
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
  },
  axisVertical: {
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
  },
  axisDiag1: {
    left: -100,
    right: -100,
    top: '50%',
    height: 1,
    transform: [{ rotate: '45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(108, 82, 153, 0.02)',
    backgroundColor: 'transparent',
  },
  axisDiag2: {
    left: -100,
    right: -100,
    top: '50%',
    height: 1,
    transform: [{ rotate: '-45deg' }],
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(108, 82, 153, 0.02)',
    backgroundColor: 'transparent',
  },
  celestialRing: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    borderWidth: 0.75,
    borderColor: 'rgba(197, 155, 39, 0.04)',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 420,
    height: 420,
    borderRadius: 210,
    marginTop: -210,
    borderColor: 'rgba(197, 155, 39, 0.05)',
  },
  ringMid: {
    width: 320,
    height: 320,
    borderRadius: 160,
    marginTop: -160,
    borderStyle: 'dashed',
    borderColor: 'rgba(108, 82, 153, 0.04)',
  },
  ringInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginTop: -110,
    borderColor: 'rgba(197, 155, 39, 0.03)',
  },
  ringNorthStar: {
    position: 'absolute',
    top: -6,
    alignItems: 'center',
  },
  ringSouthStar: {
    position: 'absolute',
    bottom: -6,
    alignItems: 'center',
  },
  ringEastStar: {
    position: 'absolute',
    right: -6,
    justifyContent: 'center',
  },
  ringWestStar: {
    position: 'absolute',
    left: -6,
    justifyContent: 'center',
  },
  constellationLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    color: 'rgba(197, 155, 39, 0.2)',
    letterSpacing: 0.5,
  },
  axisLabelContainer: {
    position: 'absolute',
    inset: 0,
  },
  axisLabelText: {
    position: 'absolute',
    fontSize: 8,
    fontWeight: '700',
    color: 'rgba(122, 111, 102, 0.3)',
    letterSpacing: 1,
  },
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
  activeNodeContainer: {
    position: 'relative',
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeActivePulse: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: Colors.light.gold,
    backgroundColor: 'rgba(197, 155, 39, 0.15)',
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
  segmentWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  segmentCard: {
    width: 64,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.light.borderGlow,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(197, 155, 39, 0.06)',
  },
  segmentNumber: {
    fontFamily: 'ui-serif',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    fontVariant: ['tabular-nums'],
  },
  segmentLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
