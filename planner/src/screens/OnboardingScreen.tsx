import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#f5f7fa', '#e9edf2']}
      style={styles.container}
    >
      <View style={styles.card}>
        <Image source={require('../../assets/splash-icon.png')} style={styles.image} />
        <Text style={styles.title}>Welcome to Planner</Text>
        <Text style={styles.subtitle}>
          Your personal task manager. Organize your day, set reminders, and boost your productivity.
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.replace('Home')}
          style={styles.button}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Get Started →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    width: width - 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 24,
    borderRadius: 70,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2d3748',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  button: {
    width: '100%',
    borderRadius: 40,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});