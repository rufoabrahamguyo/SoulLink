import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  BUBBLE_IN,
  BUBBLE_OUT,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type ChatBubbleProps = {
  text: string;
  outgoing?: boolean;
  username?: string;
  time?: string;
  initials?: string;
  showAvatar?: boolean;
};

export default function ChatBubble({
  text,
  outgoing = false,
  username,
  time,
  initials,
  showAvatar = false,
}: ChatBubbleProps) {
  return (
    <View style={[styles.row, outgoing && styles.rowOut]}>
      {!outgoing && showAvatar ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{(initials ?? username ?? '?').slice(0, 2).toUpperCase()}</Text>
        </View>
      ) : null}
      <View style={[styles.col, outgoing && styles.colOut]}>
        {!outgoing && username ? <Text style={styles.username}>{username}</Text> : null}
        <View style={[styles.bubble, outgoing ? styles.bubbleOut : styles.bubbleIn]}>
          <Text style={[styles.text, outgoing && styles.textOut]}>{text}</Text>
        </View>
        {time ? (
          <Text style={[styles.time, outgoing && styles.timeOut]}>
            {outgoing ? `Sent ${time}` : time}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    paddingHorizontal: 16,
    maxWidth: '100%',
  },
  rowOut: { justifyContent: 'flex-end' },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: SOFT_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 18,
  },
  avatarText: { fontSize: 10, fontWeight: '700', color: PRIMARY_PURPLE },
  col: { maxWidth: '78%' },
  colOut: { alignItems: 'flex-end' },
  username: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleIn: { backgroundColor: BUBBLE_IN },
  bubbleOut: { backgroundColor: BUBBLE_OUT },
  text: { fontSize: 15, lineHeight: 21, color: TEXT_DARK },
  textOut: { color: '#FFFFFF' },
  time: { fontSize: 11, color: TEXT_MUTED, marginTop: 4, marginLeft: 4 },
  timeOut: { marginRight: 4 },
});
