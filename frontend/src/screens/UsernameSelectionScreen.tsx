import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateAnonymousUsername } from '../constants/auth';
import { saveUser, StoredUser } from '../utils/storage';
import { PRIMARY_PURPLE, TEXT_DARK, TEXT_MUTED } from '../constants/theme';
import WaveCurve from '../components/WaveCurve';

export type RootStackParamList = {
  UsernameSelection: undefined;
  EmotionSelection: undefined;
};

type UsernameSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UsernameSelection'
>;

export default function UsernameSelectionScreen() {
  const navigation = useNavigation<UsernameSelectionScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setUsername(generateAnonymousUsername());
  };

  const handleContinue = async () => {
    const name = username.trim();
    if (!name) return;

    setIsLoading(true);
    try {
      const user: StoredUser = {
        id: `user_${Date.now()}`,
        username: name,
        authMethod: 'anonymous',
        createdAt: new Date().toISOString(),
      };
      await saveUser(user);
      navigation.replace('EmotionSelection');
    } catch {
      Alert.alert('Error', 'Failed to save username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.headerSection}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
            </TouchableOpacity>
          )}
          <WaveCurve fillColor="#FFFFFF" />
        </View>

        <ScrollView
          style={styles.formSection}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="account-edit"
              size={64}
              color={PRIMARY_PURPLE}
            />
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>Choose your username</Text>
            <Text style={styles.subtitle}>
              This is how others will see you. You can always change it later.
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <MaterialCommunityIcons
                name="account-outline"
                size={20}
                color={TEXT_MUTED}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. SilentWave284"
                placeholderTextColor={TEXT_MUTED}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={[styles.inputUnderline, styles.inputUnderlineActive]} />
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
              <MaterialCommunityIcons name="shuffle-variant" size={18} color={PRIMARY_PURPLE} />
              <Text style={styles.generateBtnText}>Generate random</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.continueBtn, (!username.trim() || isLoading) && styles.continueBtnDisabled]}
            onPress={handleContinue}
            disabled={!username.trim() || isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueBtnText}>Continue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  headerSection: {
    height: '25%',
    minHeight: 160,
    backgroundColor: PRIMARY_PURPLE,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
  },
  formSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formContent: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleRow: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: TEXT_DARK,
    paddingVertical: 12,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  inputUnderlineActive: {
    backgroundColor: PRIMARY_PURPLE,
  },
  generateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  generateBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY_PURPLE,
    marginLeft: 6,
  },
  continueBtn: {
    backgroundColor: PRIMARY_PURPLE,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    minHeight: 54,
    justifyContent: 'center',
  },
  continueBtnDisabled: {
    opacity: 0.6,
  },
  continueBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
