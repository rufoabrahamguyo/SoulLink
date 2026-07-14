import React from 'react';
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
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AppHeader from '../components/AppHeader';
import { DEMO_SPACES, initialsFromName } from '../data/demo';
import { getEmotionById } from '../constants/emotions';
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
  BottomTabNavigationProp<MainTabParamList, 'Spaces'>,
  StackNavigationProp<RootStackParamList>
>;

export default function SpacesScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();

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
          <Text style={styles.title}>Spaces</Text>
          <Text style={styles.subtitle}>Anonymous rooms for shared feelings</Text>
        </View>
        <FlatList
          data={DEMO_SPACES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const emotion = getEmotionById(item.emotion);
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('SpaceChat', {
                    spaceId: item.id,
                    title: item.title,
                    online: item.online,
                  })
                }
              >
                <View style={[styles.icon, { backgroundColor: SOFT_PURPLE }]}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={26}
                    color={PRIMARY_PURPLE}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.desc} numberOfLines={2}>
                    {item.description}
                  </Text>
                  <View style={styles.meta}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.metaText}>{item.online} online</Text>
                    {emotion ? (
                      <Text style={[styles.metaText, { color: emotion.color }]}>
                        · {emotion.label}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={TEXT_MUTED} />
              </TouchableOpacity>
            );
          }}
        />
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
  list: { paddingHorizontal: 20, paddingBottom: 24 },
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
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  desc: { fontSize: 13, color: TEXT_MUTED, marginTop: 4, lineHeight: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 4 },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#60A5FA',
  },
  metaText: { fontSize: 12, color: TEXT_MUTED, fontWeight: '600' },
});
