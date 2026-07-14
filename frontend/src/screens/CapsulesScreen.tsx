import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import { DEMO_CAPSULES, type DemoCapsule, initialsFromName } from '../data/demo';
import { EMOTIONS } from '../constants/emotions';
import type { MainTabParamList } from '../navigation/MainTabNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  ACCENT_PURPLE,
  BACKGROUND,
  BORDER,
  CARD_BG,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Capsules'>,
  StackNavigationProp<RootStackParamList>
>;

const TONE_COLORS: Record<DemoCapsule['emotionTone'], string> = {
  hopeful: '#F9A8D4',
  inspiring: '#C4B5FD',
  melancholy: '#93C5FD',
  grateful: '#FCD34D',
};

export default function CapsulesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [tab, setTab] = useState<'list' | 'create'>('list');
  const [capsules, setCapsules] = useState<DemoCapsule[]>(DEMO_CAPSULES);
  const [message, setMessage] = useState('');
  const [emotionId, setEmotionId] = useState('grateful');
  const [deliveryDate, setDeliveryDate] = useState('07/14/2028');

  const emotionLabel = useMemo(
    () => EMOTIONS.find((e) => e.id === emotionId)?.label ?? 'Grateful',
    [emotionId],
  );

  const buryCapsule = () => {
    if (!message.trim()) {
      Alert.alert('Write a message', 'Capture how you feel before burying this capsule.');
      return;
    }
    const next: DemoCapsule = {
      id: `local_${Date.now()}`,
      title: 'Bury a New Memory',
      emotionLabel: emotionLabel.toUpperCase(),
      emotionTone: 'grateful',
      body: message.trim(),
      status: 'locked',
      footer: `UNLOCKS ON ${deliveryDate}`,
    };
    setCapsules((prev) => [next, ...prev]);
    setMessage('');
    setTab('list');
    Alert.alert('Sealed', 'Your time capsule is buried until the delivery date.');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppHeader
          initials={initialsFromName(user?.username || 'SL')}
          onPressNotifications={() => navigation.navigate('Notifications')}
          onPressAvatar={() => navigation.navigate('Profile')}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Time Capsules</Text>
          <Text style={styles.subtitle}>
            Preserve your current state of mind. Write a message to your future self and seal it
            until the time is right.
          </Text>

          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => setTab('list')} style={styles.tabBtn}>
              <Text style={[styles.tabText, tab === 'list' && styles.tabTextActive]}>
                MY CAPSULES
              </Text>
              {tab === 'list' ? <View style={styles.tabUnderline} /> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('create')} style={styles.tabBtn}>
              <Text style={[styles.tabText, tab === 'create' && styles.tabTextActive]}>
                CREATE NEW
              </Text>
              {tab === 'create' ? <View style={styles.tabUnderline} /> : null}
            </TouchableOpacity>
          </View>

          {tab === 'create' ? (
            <View style={styles.formCard}>
              <View style={styles.formHead}>
                <View style={styles.plusIcon}>
                  <MaterialCommunityIcons name="plus-circle" size={22} color={PRIMARY_PURPLE} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formTitle}>Bury a New Memory</Text>
                  <Text style={styles.formSub}>
                    Capture a moment today to revisit when you need it most tomorrow.
                  </Text>
                </View>
              </View>

              <Text style={styles.label}>Choose Emotion</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
                {EMOTIONS.map((e) => (
                  <TouchableOpacity
                    key={e.id}
                    style={[styles.emotionChip, emotionId === e.id && styles.emotionChipOn]}
                    onPress={() => setEmotionId(e.id)}
                  >
                    <Text
                      style={[
                        styles.emotionChipText,
                        emotionId === e.id && styles.emotionChipTextOn,
                      ]}
                    >
                      {e.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Your Message</Text>
              <TextInput
                style={styles.textarea}
                multiline
                placeholder="How are you feeling right now? What do you want to remember?"
                placeholderTextColor={TEXT_MUTED}
                value={message}
                onChangeText={setMessage}
              />

              <Text style={styles.label}>Delivery Date</Text>
              <TextInput
                style={styles.dateInput}
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                placeholder="MM/DD/YYYY"
                placeholderTextColor={TEXT_MUTED}
              />

              <TouchableOpacity style={styles.buryBtn} onPress={buryCapsule} activeOpacity={0.85}>
                <MaterialCommunityIcons name="lock" size={18} color="#FFF" />
                <Text style={styles.buryBtnText}>Bury Time Capsule</Text>
              </TouchableOpacity>
            </View>
          ) : (
            capsules.map((c) => <CapsuleCard key={c.id} capsule={c} />)
          )}

          <View style={styles.footerBlurb}>
            <View style={styles.hourglass}>
              <MaterialCommunityIcons name="timer-sand" size={28} color={PRIMARY_PURPLE} />
            </View>
            <Text style={styles.blurbTitle}>Time Heals and Reveals</Text>
            <Text style={styles.blurbText}>
              Every thought you bury today becomes a gift for your future self. There is no right
              or wrong way to feel—just your way.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function CapsuleCard({ capsule }: { capsule: DemoCapsule }) {
  const isReady = capsule.status === 'ready';
  const isOpened = capsule.status === 'opened';
  return (
    <View
      style={[
        styles.capsuleCard,
        isReady && styles.capsuleReady,
        isOpened && styles.capsuleOpened,
      ]}
    >
      <View style={styles.capsuleTop}>
        <MaterialCommunityIcons
          name="emoticon-outline"
          size={20}
          color={isReady ? '#FFF' : PRIMARY_PURPLE}
        />
        <View
          style={[
            styles.toneTag,
            { backgroundColor: TONE_COLORS[capsule.emotionTone] + (isReady ? '55' : 'FF') },
          ]}
        >
          <Text style={[styles.toneText, isReady && { color: '#FFF' }]}>
            {capsule.emotionLabel}
          </Text>
        </View>
        <View style={styles.statusWrap}>
          <Text style={[styles.statusText, isReady && { color: '#FFF' }]}>
            {capsule.status.toUpperCase()}
          </Text>
          <MaterialCommunityIcons
            name={
              capsule.status === 'locked'
                ? 'lock'
                : capsule.status === 'ready'
                  ? 'circle-medium'
                  : 'check-circle'
            }
            size={16}
            color={isReady ? '#FFF' : TEXT_MUTED}
          />
        </View>
      </View>
      <Text style={[styles.capsuleBody, isReady && { color: '#FFF' }]}>{capsule.body}</Text>
      <View style={styles.capsuleFoot}>
        <Text style={[styles.capsuleFooter, isReady && { color: '#E8E0FF' }]}>
          {capsule.footer}
        </Text>
        {isReady ? (
          <TouchableOpacity style={styles.openBtn}>
            <Text style={styles.openBtnText}>OPEN NOW</Text>
          </TouchableOpacity>
        ) : isOpened ? (
          <Text style={styles.reread}>RE-READ</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT_DARK, marginTop: 8 },
  subtitle: { fontSize: 14, color: TEXT_MUTED, marginTop: 8, lineHeight: 21, marginBottom: 16 },
  tabs: { flexDirection: 'row', gap: 24, marginBottom: 18 },
  tabBtn: { paddingBottom: 8 },
  tabText: { fontSize: 13, fontWeight: '700', color: TEXT_MUTED, letterSpacing: 0.4 },
  tabTextActive: { color: PRIMARY_PURPLE },
  tabUnderline: {
    marginTop: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: PRIMARY_PURPLE,
  },
  formCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  formHead: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  plusIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: SOFT_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  formSub: { fontSize: 13, color: TEXT_MUTED, marginTop: 2, lineHeight: 18 },
  label: { fontSize: 13, fontWeight: '600', color: TEXT_DARK, marginBottom: 8 },
  emotionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    marginRight: 8,
  },
  emotionChipOn: { backgroundColor: PRIMARY_PURPLE },
  emotionChipText: { fontSize: 13, fontWeight: '600', color: TEXT_DARK },
  emotionChipTextOn: { color: '#FFF' },
  textarea: {
    minHeight: 100,
    backgroundColor: '#E8EEF8',
    borderRadius: 14,
    padding: 14,
    textAlignVertical: 'top',
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 14,
  },
  dateInput: {
    backgroundColor: '#E8EEF8',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: TEXT_DARK,
    marginBottom: 16,
  },
  buryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PRIMARY_PURPLE,
    borderRadius: 16,
    paddingVertical: 14,
  },
  buryBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  capsuleCard: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  capsuleReady: {
    backgroundColor: PRIMARY_PURPLE,
    borderColor: PRIMARY_PURPLE,
  },
  capsuleOpened: { backgroundColor: '#EEF2F7' },
  capsuleTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  toneTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  toneText: { fontSize: 11, fontWeight: '800', color: TEXT_DARK },
  statusWrap: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 11, fontWeight: '700', color: TEXT_MUTED },
  capsuleBody: { fontSize: 14, lineHeight: 21, color: TEXT_DARK, marginBottom: 12 },
  capsuleFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  capsuleFooter: { fontSize: 11, fontWeight: '700', color: TEXT_MUTED },
  openBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  openBtnText: { fontSize: 12, fontWeight: '800', color: PRIMARY_PURPLE },
  reread: { fontSize: 12, fontWeight: '800', color: ACCENT_PURPLE },
  footerBlurb: { alignItems: 'center', marginTop: 20, paddingHorizontal: 12 },
  hourglass: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  blurbTitle: { fontSize: 17, fontWeight: '700', color: TEXT_DARK, marginBottom: 8 },
  blurbText: { fontSize: 14, color: TEXT_MUTED, textAlign: 'center', lineHeight: 21 },
});
