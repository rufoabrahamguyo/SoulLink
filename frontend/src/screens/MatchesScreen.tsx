import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { fetchMatches, checkApiHealth, type ApiProfile } from '../services/api';
import { getEmotionById } from '../constants/emotions';
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
  BottomTabNavigationProp<MainTabParamList, 'Matches'>,
  StackNavigationProp<RootStackParamList>
>;

export default function MatchesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [matches, setMatches] = useState<ApiProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);

  const loadMatches = useCallback(async () => {
    if (!user?.emotion || !user?.id) {
      setMatches([]);
      setLoading(false);
      return;
    }
    const [results, online] = await Promise.all([
      fetchMatches(user.emotion),
      checkApiHealth(),
    ]);
    setMatches(results);
    setApiOnline(online);
    setLoading(false);
  }, [user?.emotion, user?.id]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

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
        <View style={styles.header}>
          <Text style={styles.title}>Matches</Text>
          <Text style={styles.subtitle}>
            {emotion
              ? `Souls feeling ${emotion.label.toLowerCase()} right now`
              : 'Set your emotion to find connections'}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY_PURPLE} style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={PRIMARY_PURPLE}
              />
            }
            renderItem={({ item }) => {
              const e = getEmotionById(item.emotion);
              return (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('MatchChat', {
                      matchId: item.id,
                      peerName: item.username || 'Soul',
                      emotion: item.emotion,
                    })
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {initialsFromName(item.username || 'SL')}
                    </Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.name}>{item.username}</Text>
                    {e ? (
                      <View style={styles.tag}>
                        <MaterialCommunityIcons
                          name={e.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                          size={14}
                          color={e.color}
                        />
                        <Text style={[styles.tagText, { color: e.color }]}>{e.label}</Text>
                      </View>
                    ) : null}
                    <Text style={styles.hint}>Tap to open soul chat</Text>
                  </View>
                  <MaterialCommunityIcons name="heart" size={22} color={PRIMARY_PURPLE} />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialCommunityIcons name="heart-outline" size={48} color={TEXT_MUTED} />
                <Text style={styles.emptyTitle}>No matches yet</Text>
                <Text style={styles.emptyText}>
                  {apiOnline
                    ? 'Be the first to share this emotion, or check back soon.'
                    : 'Start the API with npm run api:docker to sync matches.'}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT_DARK },
  subtitle: { fontSize: 15, color: TEXT_MUTED, marginTop: 4 },
  list: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: SOFT_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: PRIMARY_PURPLE },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  tagText: { fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 12, color: TEXT_MUTED, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 48, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: TEXT_DARK, marginTop: 16 },
  emptyText: {
    fontSize: 15,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
