import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ACCENT_PURPLE,
  HEADER_BG,
  PRIMARY_PURPLE,
  TEXT_DARK,
} from '../constants/theme';

type AppHeaderProps = {
  onPressAvatar?: () => void;
  onPressNotifications?: () => void;
  initials?: string;
  showBell?: boolean;
};

export default function AppHeader({
  onPressAvatar,
  onPressNotifications,
  initials = 'SL',
  showBell = true,
}: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoDots}>
          <View style={[styles.dot, styles.dotA]} />
          <View style={[styles.dot, styles.dotB]} />
          <View style={[styles.dot, styles.dotC]} />
        </View>
        <Text style={styles.brand}>SoulLink</Text>
      </View>
      <View style={styles.actions}>
        {showBell && (
          <TouchableOpacity
            onPress={onPressNotifications}
            style={styles.iconBtn}
            hitSlop={8}
          >
            <MaterialCommunityIcons name="bell-outline" size={22} color={PRIMARY_PURPLE} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onPressAvatar} style={styles.avatar} hitSlop={8}>
          <Text style={styles.avatarText}>{initials.slice(0, 2).toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: HEADER_BG,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoDots: { width: 22, height: 16, position: 'relative' },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_PURPLE,
  },
  dotA: { left: 0, top: 4 },
  dotB: { left: 7, top: 0, backgroundColor: PRIMARY_PURPLE },
  dotC: { left: 14, top: 4, backgroundColor: '#A78BFA' },
  brand: {
    fontSize: 18,
    fontWeight: '700',
    color: PRIMARY_PURPLE,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: { padding: 4 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});
