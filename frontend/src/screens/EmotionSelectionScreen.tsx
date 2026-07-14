import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { EMOTIONS, type EmotionId } from '../constants/emotions';
import { GRADIENT_COLORS, PRIMARY_PURPLE, TEXT_DARK, TEXT_MUTED } from '../constants/theme';
import { RootStackParamList } from '../navigation/RootNavigator';

type EmotionSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EmotionSelection'
>;

export default function EmotionSelectionScreen() {
  const navigation = useNavigation<EmotionSelectionScreenNavigationProp>();
  const { user, updateUser, phase } = useAuth();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<EmotionId | null>(
    (user?.emotion as EmotionId) ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const backButtonTop = Math.max(insets.top, Platform.OS === 'android' ? 24 : 0) + 8;
  const isFromMain = phase === 'main';

  const handleContinue = async () => {
    if (!selected) return;
    setIsLoading(true);
    try {
      await updateUser({ emotion: selected });
      if (isFromMain) {
        navigation.goBack();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.container}>
      <StatusBar style="dark" />
      {(navigation.canGoBack() || isFromMain) && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { top: backButtonTop }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>
          Choose the emotion that best describes you right now. This helps us connect you with
          others who understand.
        </Text>

        <View style={styles.grid}>
          {EMOTIONS.map((emotion) => {
            const isSelected = selected === emotion.id;
            return (
              <TouchableOpacity
                key={emotion.id}
                style={[
                  styles.emotionCard,
                  isSelected && { borderColor: emotion.color, borderWidth: 2 },
                ]}
                onPress={() => setSelected(emotion.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.emotionIcon, { backgroundColor: emotion.color + '22' }]}>
                  <MaterialCommunityIcons
                    name={emotion.icon as keyof typeof MaterialCommunityIcons.glyphMap}
                    size={28}
                    color={emotion.color}
                  />
                </View>
                <Text style={[styles.emotionLabel, isSelected && { color: emotion.color }]}>
                  {emotion.label}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={emotion.color}
                    style={styles.check}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.continueBtn, (!selected || isLoading) && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!selected || isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.continueBtnText}>
              {isFromMain ? 'Update emotion' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { position: 'absolute', left: 20, zIndex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
  },
  emotionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E9EC',
    position: 'relative',
  },
  emotionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emotionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  continueBtn: {
    backgroundColor: PRIMARY_PURPLE,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    minHeight: 54,
    justifyContent: 'center',
  },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
