import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ACCENT_PURPLE,
  BORDER,
  CARD_BG,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

export type NotificationKind = 'match' | 'message' | 'capsule' | 'insight';

export type NotificationItem = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

const KIND_STYLE: Record<
  NotificationKind,
  { icon: keyof typeof MaterialCommunityIcons.glyphMap; bg: string; color: string }
> = {
  match: { icon: 'heart', bg: '#F3E8FF', color: PRIMARY_PURPLE },
  message: { icon: 'message-text', bg: '#DBEAFE', color: '#3B82F6' },
  capsule: { icon: 'timer-sand', bg: '#FCE7F3', color: '#DB2777' },
  insight: { icon: 'auto-fix', bg: '#E0E7FF', color: '#6366F1' },
};

export default function NotificationCard({
  item,
  onPress,
}: {
  item: NotificationItem;
  onPress?: () => void;
}) {
  const style = KIND_STYLE[item.kind];
  return (
    <TouchableOpacity
      style={[styles.card, item.unread && styles.cardUnread]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {item.unread ? <View style={styles.unreadBar} /> : null}
      <View style={[styles.iconWrap, { backgroundColor: style.bg }]}>
        <MaterialCommunityIcons name={style.icon} size={22} color={style.color} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.time}>{item.time}</Text>
            {item.unread ? <View style={styles.dot} /> : null}
          </View>
        </View>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  cardUnread: {
    backgroundColor: '#FAFBFF',
  },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: ACCENT_PURPLE,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  title: { flex: 1, fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  time: { fontSize: 12, color: TEXT_MUTED },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_PURPLE,
  },
  subtitle: { fontSize: 14, lineHeight: 20, color: TEXT_MUTED },
});
