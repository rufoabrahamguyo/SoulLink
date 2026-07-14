import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  PRIMARY_PURPLE,
  TAB_INACTIVE,
} from '../constants/theme';
import EmotionScreen from '../screens/EmotionScreen';
import SpacesScreen from '../screens/SpacesScreen';
import MatchesScreen from '../screens/MatchesScreen';
import CapsulesScreen from '../screens/CapsulesScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type MainTabParamList = {
  Emotion: undefined;
  Spaces: undefined;
  Matches: undefined;
  Capsules: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({
  name,
  color,
  focused,
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <MaterialCommunityIcons name={name} size={22} color={focused ? '#FFF' : color} />
    </View>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8EAF0',
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarActiveBackgroundColor: 'transparent',
      }}
    >
      <Tab.Screen
        name="Emotion"
        component={EmotionScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="emoticon-outline" color={color} focused={focused} />
          ),
          tabBarActiveTintColor: PRIMARY_PURPLE,
        }}
      />
      <Tab.Screen
        name="Spaces"
        component={SpacesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="account-group-outline" color={color} focused={focused} />
          ),
          tabBarActiveTintColor: PRIMARY_PURPLE,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="heart-outline" color={color} focused={focused} />
          ),
          tabBarActiveTintColor: PRIMARY_PURPLE,
        }}
      />
      <Tab.Screen
        name="Capsules"
        component={CapsulesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="star-four-points" color={color} focused={focused} />
          ),
          tabBarActiveTintColor: PRIMARY_PURPLE,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="account-outline" color={color} focused={focused} />
          ),
          tabBarActiveTintColor: PRIMARY_PURPLE,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: PRIMARY_PURPLE,
  },
});
