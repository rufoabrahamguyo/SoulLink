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
import { PRIMARY_PURPLE, TEXT_DARK, TEXT_MUTED } from '../constants/theme';
import WaveCurve from '../components/WaveCurve';
import SocialAuthButtons from '../components/SocialAuthButtons';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  UsernameSelection: undefined;
};

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'SignUp'
>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Missing fields', 'Please enter your email, password, and confirm password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please make sure your passwords match.');
      return;
    }
    setIsLoading(true);
    try {
      // TODO: Implement actual sign up
      await new Promise((r) => setTimeout(r, 500));
      navigation.replace('UsernameSelection');
    } finally {
      setIsLoading(false);
    }
  };

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      const { signInWithGoogle } = await import('../utils/googleAuth');
      const result = await signInWithGoogle();
      if (result.success) {
        navigation.replace('EmotionSelection');
      }
    } catch {
      Alert.alert('Error', 'Sign in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignInWithApple = () => {
    // TODO: Implement Apple auth
    navigation.replace('UsernameSelection');
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
          <View style={styles.titleRow}>
            <Text style={styles.title}>Sign up</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={TEXT_MUTED}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={TEXT_MUTED}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={[styles.inputUnderline, styles.inputUnderlineActive]} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={TEXT_MUTED}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="create a password"
                placeholderTextColor={TEXT_MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={TEXT_MUTED}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={TEXT_MUTED}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="confirm your password"
                placeholderTextColor={TEXT_MUTED}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={TEXT_MUTED}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
          </View>

          <TouchableOpacity
            style={styles.signUpBtn}
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signUpBtnText}>Sign up</Text>
            )}
          </TouchableOpacity>

          <SocialAuthButtons
            onGoogle={handleSignInWithGoogle}
            onApple={handleSignInWithApple}
            googleLoading={isGoogleLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleRow: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  titleUnderline: {
    width: 50,
    height: 4,
    backgroundColor: PRIMARY_PURPLE,
    marginTop: 4,
    borderRadius: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  inputRow: {
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
  eyeBtn: {
    padding: 4,
  },
  inputUnderline: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  inputUnderlineActive: {
    backgroundColor: PRIMARY_PURPLE,
  },
  signUpBtn: {
    backgroundColor: PRIMARY_PURPLE,
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
    minHeight: 54,
    justifyContent: 'center',
  },
  signUpBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 15,
    color: TEXT_MUTED,
  },
  signInLink: {
    fontSize: 15,
    fontWeight: '700',
    color: PRIMARY_PURPLE,
  },
});
