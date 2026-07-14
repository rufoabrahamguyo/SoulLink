import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import NotificationCard from '../components/NotificationCard';
import { DEMO_NOTIFICATIONS } from '../data/demo';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  BACKGROUND,
  CARD_BG,
  PRIMARY_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = StackNavigationProp<RootStackParamList, 'Notifications'>;

export default function NotificationsScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [items, setItems] = useState(DEMO_NOTIFICATIONS);

  const visible =
    filter === 'unread' ? items.filter((n) => n.unread) : items;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={TEXT_DARK} />
          </TouchableOpacity>
          <Text style={styles.topTitle}>SoulLink</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.username || 'SL').slice(0, 2).toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>Notifications</Text>

        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, filter === 'all' && styles.segmentActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.segmentText, filter === 'all' && styles.segmentTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, filter === 'unread' && styles.segmentActive]}
            onPress={() => setFilter('unread')}
          >
            <Text
              style={[styles.segmentText, filter === 'unread' && styles.segmentTextActive]}
            >
              Unread
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NotificationCard
              item={item}
              onPress={() =>
                setItems((prev) =>
                  prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n)),
                )
              }
            />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>You are all caught up.</Text>
          }
        />

        <View style={styles.hint}>
          <Text style={styles.hintText}>✓ Swipe left to read</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BACKGROUND },
  safe: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topTitle: { fontSize: 17, fontWeight: '700', color: PRIMARY_PURPLE },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  segment: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
  },
  segmentBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  segmentActive: { backgroundColor: CARD_BG },
  segmentText: { fontSize: 14, fontWeight: '600', color: TEXT_MUTED },
  segmentTextActive: { color: TEXT_DARK },
  list: { paddingHorizontal: 20, paddingBottom: 80 },
  empty: { textAlign: 'center', color: TEXT_MUTED, marginTop: 40 },
  hint: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: 'rgba(91,75,138,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  hintText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
});
