import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY_PURPLE, SOFT_PURPLE, BACKGROUND, TEXT_DARK, TEXT_MUTED } from '../constants/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  EmotionSelection: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

function FeatureCard({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureIconBg}>{icon}</View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleContinue = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <TouchableOpacity onPress={handleContinue} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.illustration}>
          <View style={styles.circlesRow}>
            <View style={[styles.circle, styles.circleLeft]} />
            <View style={[styles.circle, styles.circleRight]} />
          </View>
          <View style={styles.eyeOverlay} />
        </View>

        <Text style={styles.title}>Connect Through Emotions, Not Identity</Text>
        <Text style={styles.subtitle}>
          An anonymous space where your feelings matter
        </Text>

        <FeatureCard
          icon={<MaterialCommunityIcons name="heart" size={24} color={PRIMARY_PURPLE} />}
          text="Express emotions freely"
        />
        <FeatureCard
          icon={<MaterialCommunityIcons name="link" size={24} color={PRIMARY_PURPLE} />}
          text="Find emotional connections"
        />
        <FeatureCard
          icon={<MaterialCommunityIcons name="shield-account" size={24} color={PRIMARY_PURPLE} />}
          text="Safe and anonymous"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.primaryBtnText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  skipBtn: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    color: TEXT_MUTED,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  illustration: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
  },
  circlesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  circleLeft: {
    backgroundColor: '#E0D5FF',
    marginRight: -30,
  },
  circleRight: {
    backgroundColor: '#FFD5E0',
  },
  eyeOverlay: {
    position: 'absolute',
    width: 50,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7B61FF',
    top: 75,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E9EC',
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SOFT_PURPLE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
    color: TEXT_DARK,
    flex: 1,
  },
  primaryBtn: {
    backgroundColor: PRIMARY_PURPLE,
    paddingVertical: 16,
    borderRadius: 28,
    marginHorizontal: 24,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    paddingBottom: 24,
  },
});
