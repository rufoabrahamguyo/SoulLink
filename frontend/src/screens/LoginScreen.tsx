import React, { useEffect, useState } from 'react';
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
import { RootStackParamList } from '../navigation/RootNavigator';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  resetPassword,
  isGoogleSignInAvailable,
} from '../services/auth';
import {
  getRememberedEmail,
  setRememberedEmail,
  clearRememberedEmail,
} from '../utils/storage';
import WaveCurve from '../components/WaveCurve';
import SocialAuthButtons from '../components/SocialAuthButtons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  useEffect(() => {
    getRememberedEmail().then((saved) => {
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    });
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (!result.success) {
        Alert.alert('Sign in failed', result.message);
        return;
      }
      if (rememberMe) {
        await setRememberedEmail(email.trim());
      } else {
        await clearRememberedEmail();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter email', 'Enter your email address first.');
      return;
    }
    const result = await resetPassword(email);
    Alert.alert(result.success ? 'Email sent' : 'Could not reset', result.message);
  };

  const handleSignInWithGoogle = async () => {
    if (!isGoogleSignInAvailable()) {
      Alert.alert(
        'Development build required',
        'Google Sign-In needs the SoulLink dev app. From the repo root run: npm run android or npm run ios, then open SoulLink (not Expo Go).',
      );
      return;
    }
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (!result.success && !result.cancelled) {
        Alert.alert('Sign in failed', result.message ?? 'Please try again.');
      }
    } catch {
      Alert.alert('Error', 'Sign in failed. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignInWithApple = async () => {
    setIsAppleLoading(true);
    try {
      const result = await signInWithApple();
      if (!result.success && !result.cancelled) {
        Alert.alert('Sign in failed', result.message ?? 'Please try again.');
      }
    } finally {
      setIsAppleLoading(false);
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
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
            <Text style={styles.title}>Sign in</Text>
            <View style={styles.titleUnderline} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <MaterialCommunityIcons name="email-outline" size={20} color={TEXT_MUTED} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="user@gmail.com"
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
              <MaterialCommunityIcons name="lock-outline" size={20} color={TEXT_MUTED} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="enter your password"
                placeholderTextColor={TEXT_MUTED}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={TEXT_MUTED}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputUnderline} />
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <MaterialCommunityIcons name="check" size={14} color="#FFF" />}
              </View>
              <Text style={styles.checkboxLabel}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Login</Text>
            )}
          </TouchableOpacity>

          <SocialAuthButtons
            onGoogle={handleSignInWithGoogle}
            onApple={handleSignInWithApple}
            googleLoading={isGoogleLoading}
            appleLoading={isAppleLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an Account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  headerSection: { height: '25%', minHeight: 160, backgroundColor: PRIMARY_PURPLE },
  backBtn: { position: 'absolute', top: 16, left: 16, zIndex: 1 },
  formSection: { flex: 1, backgroundColor: '#FFFFFF' },
  formContent: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 40 },
  titleRow: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '700', color: TEXT_DARK },
  titleUnderline: { width: 50, height: 4, backgroundColor: PRIMARY_PURPLE, marginTop: 4, borderRadius: 2 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: TEXT_DARK, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: TEXT_DARK, paddingVertical: 12 },
  eyeBtn: { padding: 4 },
  inputUnderline: { height: 1, backgroundColor: '#E0E0E0' },
  inputUnderlineActive: { backgroundColor: PRIMARY_PURPLE },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center' },
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: PRIMARY_PURPLE,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  checkboxChecked: { backgroundColor: PRIMARY_PURPLE },
  checkboxLabel: { fontSize: 15, fontWeight: '600', color: TEXT_DARK },
  forgotLink: { fontSize: 14, fontWeight: '500', color: PRIMARY_PURPLE },
  loginBtn: {
    backgroundColor: PRIMARY_PURPLE, paddingVertical: 16, borderRadius: 28,
    alignItems: 'center', marginBottom: 20, minHeight: 54, justifyContent: 'center',
  },
  loginBtnText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28 },
  footerText: { fontSize: 15, color: TEXT_MUTED },
  signUpLink: { fontSize: 15, fontWeight: '700', color: PRIMARY_PURPLE },
});
