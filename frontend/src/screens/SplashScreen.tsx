import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { GRADIENT_DARK, PRIMARY_PURPLE } from '../constants/theme';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Splash'
>;

export default function SplashScreen() {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const { width, height } = useWindowDimensions();
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, logoOpacity]);

  const gradientStyle =
    Platform.OS === 'android'
      ? [styles.container, { width, height }]
      : styles.container;

  const heartIcon = '♥';

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={GRADIENT_DARK}
        style={gradientStyle}
      >
        <StatusBar style="light" />
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacity }]}>
            <Text style={styles.logo}>{heartIcon}</Text>
          </Animated.View>
          <Text style={styles.title}>SoulLink</Text>
          <Text style={styles.subtitle}>Connect through emotions</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: PRIMARY_PURPLE,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 80,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '400',
    letterSpacing: 0.5,
  },
});
