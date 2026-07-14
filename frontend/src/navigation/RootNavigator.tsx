import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { PRIMARY_PURPLE } from '../constants/theme';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UsernameSelectionScreen from '../screens/UsernameSelectionScreen';
import EmotionSelectionScreen from '../screens/EmotionSelectionScreen';
import MainTabNavigator from './MainTabNavigator';
import NotificationsScreen from '../screens/NotificationsScreen';
import MatchChatScreen from '../screens/MatchChatScreen';
import SpaceChatScreen from '../screens/SpaceChatScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  UsernameSelection: undefined;
  EmotionSelection: undefined;
  MainTabs: undefined;
  Notifications: undefined;
  MatchChat: { matchId: string; peerName: string; emotion?: string };
  SpaceChat: { spaceId: string; title: string; online: number };
};

const Stack = createStackNavigator<RootStackParamList>();

function routeForPhase(phase: string): keyof RootStackParamList {
  switch (phase) {
    case 'splash':
      return 'Splash';
    case 'onboarding':
      return 'Onboarding';
    case 'auth':
      return 'Login';
    case 'username':
      return 'UsernameSelection';
    case 'emotion':
      return 'EmotionSelection';
    case 'main':
    default:
      return 'MainTabs';
  }
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={PRIMARY_PURPLE} />
    </View>
  );
}

export default function RootNavigator() {
  const { phase, isLoading } = useAuth();

  if (isLoading && phase !== 'splash') {
    return <LoadingScreen />;
  }

  const initialRoute = routeForPhase(phase);

  return (
    <NavigationContainer key={phase}>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="UsernameSelection" component={UsernameSelectionScreen} />
        <Stack.Screen name="EmotionSelection" component={EmotionSelectionScreen} />
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="MatchChat" component={MatchChatScreen} />
        <Stack.Screen name="SpaceChat" component={SpaceChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_PURPLE,
  },
});
