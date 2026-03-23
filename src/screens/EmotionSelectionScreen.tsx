import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GRADIENT_COLORS, TEXT_DARK, TEXT_MUTED } from '../constants/theme';

type EmotionSelectionScreenNavigationProp = StackNavigationProp<
  { EmotionSelection: undefined; UsernameSelection: undefined },
  'EmotionSelection'
>;

export default function EmotionSelectionScreen() {
  const navigation = useNavigation<EmotionSelectionScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const backButtonTop = Math.max(insets.top, Platform.OS === 'android' ? 24 : 0) + 8;

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={styles.container}
    >
      <StatusBar style="dark" />
      {navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { top: backButtonTop }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color={TEXT_DARK} />
        </TouchableOpacity>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.subtitle}>Emotion selection coming soon</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
  },
});
