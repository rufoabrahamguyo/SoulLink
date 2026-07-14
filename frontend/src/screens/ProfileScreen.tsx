import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
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
import {
  DEMO_HEATMAP,
  DEMO_HEATMAP_LABELS,
  DEMO_PROFILE_STATS,
  initialsFromName,
} from '../data/demo';
import type { MainTabParamList } from '../navigation/MainTabNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  BACKGROUND,
  BORDER,
  CARD_BG,
  DANGER,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Profile'>,
  StackNavigationProp<RootStackParamList>
>;

const HEAT_COLORS = ['#F3E8FF', '#DDD6FE', '#C4B5FD', '#A78BFA', '#7C3AED'];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation<Nav>();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [privacyOn, setPrivacyOn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : 'this season';

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
          } finally {
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AppHeader
          initials={initialsFromName(user?.username || 'SL')}
          onPressNotifications={() => navigation.navigate('Notifications')}
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>
                {initialsFromName(user?.username || 'JD')}
              </Text>
            </View>
            <Text style={styles.username}>{user?.username || 'Anonymous'}</Text>
            <Text style={styles.member}>Member since {memberSince}</Text>
          </View>

          <View style={styles.statsRow}>
            <StatCard value={String(DEMO_PROFILE_STATS.connections)} label="CONNECTIONS" />
            <StatCard value={String(DEMO_PROFILE_STATS.days)} label="DAYS" />
            <StatCard value={String(DEMO_PROFILE_STATS.emotions)} label="EMOTIONS" />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.cardTitle}>Emotion History</Text>
              <MaterialCommunityIcons name="chart-line" size={20} color={PRIMARY_PURPLE} />
            </View>
            {DEMO_HEATMAP.map((row, ri) => (
              <View key={ri} style={styles.heatRow}>
                {row.map((v, ci) => (
                  <View
                    key={`${ri}-${ci}`}
                    style={[styles.heatCell, { backgroundColor: HEAT_COLORS[v] ?? HEAT_COLORS[0] }]}
                  />
                ))}
              </View>
            ))}
            <View style={styles.heatLabels}>
              {DEMO_HEATMAP_LABELS.map((l) => (
                <Text key={l} style={styles.heatLabel}>
                  {l}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <SettingsRow
              icon="bell-outline"
              title="Notifications"
              subtitle="Daily reminders & alerts"
              right={
                <Switch
                  value={notificationsOn}
                  onValueChange={setNotificationsOn}
                  trackColor={{ false: '#D1D5DB', true: PRIMARY_PURPLE }}
                  thumbColor="#FFF"
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="lock-outline"
              title="Privacy"
              subtitle="Anonymous profile visibility"
              right={
                <Switch
                  value={privacyOn}
                  onValueChange={setPrivacyOn}
                  trackColor={{ false: '#D1D5DB', true: PRIMARY_PURPLE }}
                  thumbColor="#FFF"
                />
              }
            />
            <View style={styles.divider} />
            <SettingsRow
              icon="trash-can-outline"
              title="Delete Account"
              subtitle="This action is permanent"
              danger
              right={
                <MaterialCommunityIcons name="chevron-right" size={22} color={DANGER} />
              }
              onPress={() =>
                Alert.alert('Delete Account', 'Demo only — account deletion is not enabled yet.')
              }
            />
            <View style={styles.divider} />
            <TouchableOpacity style={styles.signOutRow} onPress={handleSignOut} disabled={signingOut}>
              {signingOut ? (
                <ActivityIndicator color={DANGER} />
              ) : (
                <>
                  <MaterialCommunityIcons name="logout" size={22} color={DANGER} />
                  <Text style={styles.signOutText}>Sign out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.changeEmotion}
            onPress={() => navigation.navigate('EmotionSelection')}
          >
            <Text style={styles.changeEmotionText}>Change current emotion</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({
  icon,
  title,
  subtitle,
  right,
  danger,
  onPress,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  right: React.ReactNode;
  danger?: boolean;
  onPress?: () => void;
}) {
  const Inner = (
    <>
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={danger ? DANGER : PRIMARY_PURPLE}
        style={{ marginRight: 12 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingsTitle, danger && { color: DANGER }]}>{title}</Text>
        <Text style={styles.settingsSub}>{subtitle}</Text>
      </View>
      {right}
    </>
  );
  if (onPress) {
    return (
      <TouchableOpacity style={styles.settingsRow} onPress={onPress} activeOpacity={0.8}>
        {Inner}
      </TouchableOpacity>
    );
  }
  return <View style={styles.settingsRow}>{Inner}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  hero: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: SOFT_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bigAvatarText: { fontSize: 28, fontWeight: '700', color: PRIMARY_PURPLE },
  username: { fontSize: 22, fontWeight: '700', color: TEXT_DARK },
  member: { fontSize: 14, color: TEXT_MUTED, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  statValue: { fontSize: 20, fontWeight: '800', color: TEXT_DARK },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: TEXT_MUTED,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  heatRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  heatCell: { flex: 1, aspectRatio: 1, borderRadius: 6 },
  heatLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  heatLabel: { fontSize: 12, color: TEXT_MUTED, fontWeight: '600' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  settingsTitle: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
  settingsSub: { fontSize: 12, color: TEXT_MUTED, marginTop: 2 },
  divider: { height: 1, backgroundColor: BORDER },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: DANGER },
  changeEmotion: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  changeEmotionText: { color: PRIMARY_PURPLE, fontWeight: '700', fontSize: 15 },
});
