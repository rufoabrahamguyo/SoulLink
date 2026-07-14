import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { getEmotionById, EMOTIONS } from '../constants/emotions';
import AppHeader from '../components/AppHeader';
import { initialsFromName } from '../data/demo';
import type { MainTabParamList } from '../navigation/MainTabNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  BACKGROUND,
  BORDER,
  CARD_BG,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Emotion'>,
  StackNavigationProp<RootStackParamList>
>;

export default function EmotionScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const emotion = user?.emotion ? getEmotionById(user.emotion) : null;

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
          <Text style={styles.greeting}>How are you feeling?</Text>
          <Text style={styles.username}>{user?.username ?? 'Friend'}</Text>

          <View style={styles.emotionCard}>
            <Text style={styles.cardLabel}>Your current emotion</Text>
            {emotion ? (
              <View style={styles.emotionRow}>
                <View style={[styles.emotionIcon, { backgroundColor: emotion.color + '33' }]}>
                  <MaterialCommunityIcons
                    name={emotion.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={36}
                    color={emotion.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.emotionName}>{emotion.label}</Text>
                  <Text style={styles.emotionHint}>
                    Others feeling this are waiting in Matches & Spaces
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.emotionHint}>Pick an emotion to begin connecting</Text>
            )}
            <TouchableOpacity
              style={styles.changeBtn}
              onPress={() => navigation.navigate('EmotionSelection')}
            >
              <Text style={styles.changeBtnText}>Change emotion</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Quick shift</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {EMOTIONS.map((e) => (
              <TouchableOpacity
                key={e.id}
                style={[
                  styles.chip,
                  user?.emotion === e.id && styles.chipActive,
                ]}
                onPress={() => navigation.navigate('EmotionSelection')}
              >
                <MaterialCommunityIcons
                  name={e.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                  size={18}
                  color={user?.emotion === e.id ? '#FFF' : e.color}
                />
                <Text
                  style={[
                    styles.chipText,
                    user?.emotion === e.id && styles.chipTextActive,
                  ]}
                >
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="heart-multiple" size={26} color={PRIMARY_PURPLE} />
            <Text style={styles.tipText}>
              SoulLink connects you through feelings — not faces. Your username stays anonymous
              while your emotion opens the door.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },
  greeting: { fontSize: 15, color: TEXT_MUTED, marginTop: 8 },
  username: { fontSize: 30, fontWeight: '700', color: TEXT_DARK, marginBottom: 20 },
  emotionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 14,
  },
  emotionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  emotionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionName: { fontSize: 24, fontWeight: '700', color: TEXT_DARK },
  emotionHint: { fontSize: 14, color: TEXT_MUTED, marginTop: 4, lineHeight: 20 },
  changeBtn: {
    marginTop: 16,
    alignSelf: 'flex-start',
    backgroundColor: SOFT_PURPLE,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  changeBtnText: { fontSize: 14, fontWeight: '700', color: PRIMARY_PURPLE },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  chipScroll: { marginBottom: 20 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: { backgroundColor: PRIMARY_PURPLE, borderColor: PRIMARY_PURPLE },
  chipText: { fontSize: 13, fontWeight: '600', color: TEXT_DARK },
  chipTextActive: { color: '#FFF' },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  tipText: { flex: 1, fontSize: 15, lineHeight: 22, color: TEXT_DARK },
});
