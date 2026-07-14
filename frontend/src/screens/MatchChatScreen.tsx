import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import ChatBubble from '../components/ChatBubble';
import { DEMO_MATCH_MESSAGES, type DemoChatMessage, initialsFromName } from '../data/demo';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  BACKGROUND,
  BORDER,
  BUBBLE_IN,
  CARD_BG,
  DANGER,
  HEADER_BG,
  PRIMARY_PURPLE,
  SOFT_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = StackNavigationProp<RootStackParamList, 'MatchChat'>;
type R = RouteProp<RootStackParamList, 'MatchChat'>;

export default function MatchChatScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const { peerName } = route.params;
  const [messages, setMessages] = useState<DemoChatMessage[]>(DEMO_MATCH_MESSAGES);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);
  const initials = initialsFromName(peerName);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `out_${Date.now()}`,
        text,
        outgoing: true,
        time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
      },
    ]);
    setDraft('');
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const endMatch = () => {
    Alert.alert('End Match', `End your connection with ${peerName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End Match',
        style: 'destructive',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={TEXT_DARK} />
          </TouchableOpacity>
          <View style={styles.peerAvatar}>
            <Text style={styles.peerAvatarText}>{initials}</Text>
          </View>
          <View style={styles.peerInfo}>
            <Text style={styles.peerName}>Matched with {peerName}</Text>
            <Text style={styles.peerSub}>Seeing each other</Text>
          </View>
          <TouchableOpacity style={styles.endBtn} onPress={endMatch}>
            <Text style={styles.endBtnText}>End Match</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={8}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.systemChip}>
                <Text style={styles.systemText}>SoulLink connected you both 12 minutes ago.</Text>
              </View>
            }
            renderItem={({ item }) => (
              <ChatBubble
                text={item.text}
                outgoing={item.outgoing}
                time={item.time}
                initials={item.initials ?? initials}
                showAvatar={!item.outgoing}
              />
            )}
            ListFooterComponent={
              <View style={styles.typingRow}>
                <View style={styles.peerAvatarSmall}>
                  <Text style={styles.peerAvatarText}>{initials}</Text>
                </View>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingDots}>···</Text>
                </View>
              </View>
            }
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />

          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <MaterialCommunityIcons name="heart" size={18} color="#FFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Deepening Connection</Text>
              <Text style={styles.bannerSub}>You both talk about feelings.</Text>
            </View>
            <View style={styles.overlap}>
              <View style={[styles.miniAvatar, { backgroundColor: SOFT_PURPLE }]}>
                <Text style={styles.miniText}>You</Text>
              </View>
              <View style={[styles.miniAvatar, styles.miniAvatar2]}>
                <Text style={styles.miniText}>{initials}</Text>
              </View>
            </View>
          </View>

          <View style={styles.composer}>
            <TouchableOpacity hitSlop={8}>
              <MaterialCommunityIcons name="plus" size={26} color={PRIMARY_PURPLE} />
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={TEXT_MUTED}
                value={draft}
                onChangeText={setDraft}
              />
              <MaterialCommunityIcons name="earth" size={18} color={TEXT_MUTED} />
            </View>
            <TouchableOpacity style={styles.sendBtn} onPress={send}>
              <MaterialCommunityIcons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: CARD_BG },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: HEADER_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  peerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peerAvatarText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  peerInfo: { flex: 1 },
  peerName: { fontSize: 15, fontWeight: '700', color: TEXT_DARK },
  peerSub: { fontSize: 12, color: TEXT_MUTED },
  endBtn: {
    borderWidth: 1,
    borderColor: DANGER,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF',
  },
  endBtnText: { color: DANGER, fontWeight: '700', fontSize: 12 },
  list: { paddingVertical: 16, paddingBottom: 8 },
  systemChip: {
    alignSelf: 'center',
    backgroundColor: '#EEF2F7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  systemText: { fontSize: 12, color: TEXT_MUTED },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
  },
  peerAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: BUBBLE_IN,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typingDots: { color: TEXT_MUTED, fontWeight: '700', letterSpacing: 2 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#E0ECFA',
    borderRadius: 14,
    padding: 12,
  },
  bannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: DANGER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: TEXT_DARK },
  bannerSub: { fontSize: 12, color: TEXT_MUTED },
  overlap: { flexDirection: 'row' },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E0ECFA',
  },
  miniAvatar2: { marginLeft: -8, backgroundColor: PRIMARY_PURPLE },
  miniText: { fontSize: 8, fontWeight: '700', color: TEXT_DARK },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BACKGROUND,
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BUBBLE_IN,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
  },
  input: { flex: 1, fontSize: 15, color: TEXT_DARK, paddingVertical: 6 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
