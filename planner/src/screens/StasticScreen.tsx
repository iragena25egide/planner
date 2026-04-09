import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

export default function StatisticsScreen() {
  const { tasks, getStats } = useTasks();
  const { colors } = useTheme();
  const { total, completed, byCategory } = getStats();
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : (completed / total) * 100;

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{total}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Total Tasks</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{completed}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>{pending}</Text>
            <Text style={[styles.statLabel, { color: colors.subtext }]}>Pending</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${completionRate}%`, backgroundColor: colors.accent }]} />
        </View>
        <Text style={[styles.rateText, { color: colors.subtext }]}>{completionRate.toFixed(0)}% Complete</Text>

        <Text style={[styles.subtitle, { color: colors.text, marginTop: 24 }]}>By Category</Text>
        {Object.entries(byCategory).map(([cat, count]) => (
          <View key={cat} style={styles.categoryRow}>
            <Text style={[styles.categoryName, { color: colors.text }]}>{cat}</Text>
            <Text style={[styles.categoryCount, { color: colors.accent }]}>{count}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { borderRadius: 24, padding: 24, width: '100%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold' },
  statLabel: { fontSize: 14, marginTop: 4 },
  progressBarContainer: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBar: { height: '100%' },
  rateText: { textAlign: 'center', fontSize: 14 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  categoryName: { fontSize: 16 },
  categoryCount: { fontSize: 16, fontWeight: 'bold' },
});