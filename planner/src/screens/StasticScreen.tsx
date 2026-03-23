import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function StatisticsScreen() {
  return (
    <LinearGradient colors={['#f5f7fa', '#e9edf2']} style={styles.container}>
      <Text style={styles.title}>Task Statistics</Text>
      <Text style={styles.subtitle}>View your productivity insights</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#2d3748' },
  subtitle: { fontSize: 16, color: '#718096', textAlign: 'center' },
});