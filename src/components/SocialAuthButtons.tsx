import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import GoogleLogo from './GoogleLogo';

const styles = StyleSheet.create({
  container: {
    gap: 14,
    marginTop: 20,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  socialBtnIcon: {
    position: 'absolute',
    left: 20,
  },
  socialBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3142',
  },
});

type SocialAuthButtonsProps = {
  onGoogle: () => void;
  onApple: () => void;
  googleLoading?: boolean;
};

export default function SocialAuthButtons({ onGoogle, onApple, googleLoading }: SocialAuthButtonsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.socialBtn}
        onPress={onGoogle}
        activeOpacity={0.8}
        disabled={googleLoading}
      >
        <View style={styles.socialBtnIcon}>
          {googleLoading ? (
            <ActivityIndicator size="small" color="#2D3142" />
          ) : (
            <GoogleLogo size={22} />
          )}
        </View>
        <Text style={styles.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialBtn} onPress={onApple} activeOpacity={0.8}>
        <FontAwesome5
          name="apple"
          size={22}
          color="#000000"
          style={styles.socialBtnIcon}
        />
        <Text style={styles.socialBtnText}>Continue With Apple</Text>
      </TouchableOpacity>
    </View>
  );
}
