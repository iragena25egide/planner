import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../context/taskContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function StatisticsScreen() {
  const { tasks } = useTasks();
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : (completed / total) * 100;

  return (
    <LinearGradient colors={['#f5f7fa', '#e9edf2']} style={styles.container}>
      <Text style={styles.title}>Task Statistics</Text>
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <MaterialIcons name="assignment" size={32} color="#667eea" />
          <Text style={styles.statNumber}>{total}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="check-circle" size={32} color="#48bb78" />
          <Text style={styles.statNumber}>{completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="pending" size={32} color="#ed8936" />
          <Text style={styles.statNumber}>{pending}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>
      <View style={styles.rateCard}>
        <Text style={styles.rateTitle}>Completion Rate</Text>
        <Text style={styles.ratePercentage}>{completionRate.toFixed(0)}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#2d3748', marginBottom: 30 },
  statsCard: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 40 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2d3748', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#718096', marginTop: 4 },
  rateCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, width: '100%', alignItems: 'center' },
  rateTitle: { fontSize: 18, fontWeight: '600', color: '#2d3748' },
  ratePercentage: { fontSize: 48, fontWeight: '800', color: '#667eea', marginVertical: 10 },
  progressBar: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, width: '80%', overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#667eea', borderRadius: 4 },
});