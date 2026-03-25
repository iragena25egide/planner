import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../context/taskContext';
import { Task } from '../types/task';

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mark dates with tasks
  const markedDates = tasks.reduce((acc, task) => {
    const dateStr = new Date(task.date).toISOString().split('T')[0];
    acc[dateStr] = { marked: true, dotColor: '#667eea' };
    return acc;
  }, {} as any);

  // Also add selected date marking
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#667eea',
  };

  const tasksForSelectedDate = tasks.filter(task => {
    const taskDateStr = new Date(task.date).toISOString().split('T')[0];
    return taskDateStr === selectedDate;
  });

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskTime}>{new Date(item.date).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#f5f7fa', '#e9edf2']} style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#667eea',
          selectedDayBackgroundColor: '#667eea',
          arrowColor: '#667eea',
        }}
      />
      <View style={styles.tasksContainer}>
        <Text style={styles.sectionTitle}>Tasks for {selectedDate}</Text>
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
          ListEmptyComponent={<Text style={styles.emptyText}>No tasks for this day</Text>}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  tasksContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#2d3748' },
  taskItem: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
  taskTitle: { fontSize: 16, fontWeight: '500' },
  taskTime: { fontSize: 14, color: '#718096' },
  emptyText: { fontSize: 14, color: '#a0aec0', textAlign: 'center', marginTop: 20 },
});