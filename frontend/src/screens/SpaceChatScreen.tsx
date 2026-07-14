import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import ChatBubble from '../components/ChatBubble';
import {
  DEMO_SPACE_MESSAGES,
  type DemoChatMessage,
} from '../data/demo';
import type { RootStackParamList } from '../navigation/RootNavigator';
import {
  BACKGROUND,
  BORDER,
  BUBBLE_IN,
  CARD_BG,
  HEADER_BG,
  PRIMARY_PURPLE,
  TEXT_DARK,
  TEXT_MUTED,
} from '../constants/theme';

type Nav = StackNavigationProp<RootStackParamList, 'SpaceChat'>;
type R = RouteProp<RootStackParamList, 'SpaceChat'>;

export default function SpaceChatScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<R>();
  const { spaceId, title, online } = route.params;
  const seed = useMemo(
    () => DEMO_SPACE_MESSAGES[spaceId] ?? DEMO_SPACE_MESSAGES['collective-healing'],
    [spaceId],
  );
  const [messages, setMessages] = useState<DemoChatMessage[]>(seed);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

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

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <MaterialCommunityIcons name="arrow-left" size={26} color={TEXT_DARK} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{online} online</Text>
            </View>
          </View>
          <TouchableOpacity hitSlop={8}>
            <MaterialCommunityIcons name="dots-vertical" size={22} color={TEXT_MUTED} />
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
              <View style={styles.dateChip}>
                <Text style={styles.dateText}>TODAY</Text>
              </View>
            }
            renderItem={({ item }) => (
              <View>
                <ChatBubble
                  text={item.text}
                  outgoing={item.outgoing}
                  username={item.username}
                  time={item.time}
                  initials={item.initials}
                />
                {item.image ? (
                  <View style={styles.imagePlaceholder}>
                    <MaterialCommunityIcons name="image-filter-hdr" size={36} color={PRIMARY_PURPLE} />
                    <Text style={styles.imageCaption}>Sunlight through the trees</Text>
                  </View>
                ) : null}
              </View>
            )}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          />

          <View style={styles.composerWrap}>
            <View style={styles.composer}>
              <TextInput
                style={styles.input}
                placeholder="Share how you're feeling..."
                placeholderTextColor={TEXT_MUTED}
                value={draft}
                onChangeText={setDraft}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={send}>
                <MaterialCommunityIcons name="send" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.encrypt}>END-TO-END ENCRYPTED · ANONYMOUS</Text>
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
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: HEADER_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerCenter: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: TEXT_DARK },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#60A5FA' },
  onlineText: { fontSize: 12, color: TEXT_MUTED },
  list: { paddingVertical: 16, paddingBottom: 12 },
  dateChip: {
    alignSelf: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  dateText: { fontSize: 11, fontWeight: '800', color: '#1E3A8A', letterSpacing: 0.6 },
  imagePlaceholder: {
    marginLeft: 16,
    marginBottom: 12,
    width: 220,
    height: 120,
    borderRadius: 14,
    backgroundColor: '#E8F0E8',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imageCaption: { fontSize: 12, color: TEXT_MUTED },
  composerWrap: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BACKGROUND,
  },
  composer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: {
    flex: 1,
    backgroundColor: BUBBLE_IN,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 15,
    color: TEXT_DARK,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  encrypt: {
    textAlign: 'center',
    fontSize: 10,
    color: TEXT_MUTED,
    marginTop: 8,
    letterSpacing: 0.8,
  },
});
