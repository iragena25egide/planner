import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { tasks, addTask } = useTasks();
  const { theme, toggleTheme, colors } = useTheme();

  const exportData = async () => {
    try {
      const json = JSON.stringify(tasks, null, 2);
      const fileUri = FileSystem.documentDirectory + 'tasks_backup.json';
      await FileSystem.writeAsStringAsync(fileUri, json);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing not available');
      }
    } catch (err) {
      Alert.alert('Export failed', err.message);
    }
  };

  const importData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        const imported = JSON.parse(content);
        // clear existing tasks? Or merge? For simplicity, we'll add them all.
        for (const task of imported) {
          await addTask({ ...task, id: undefined }); // let addTask generate new id
        }
        Alert.alert('Import successful');
      }
    } catch (err) {
      Alert.alert('Import failed', err.message);
    }
  };

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity style={styles.option} onPress={toggleTheme}>
            <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={exportData}>
            <MaterialIcons name="file-download" size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Export Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={importData}>
            <MaterialIcons name="file-upload" size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Import Tasks</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.title, { color: colors.text }]}>About</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Planner App v1.0</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Organize your tasks with ease</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  card: { borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  optionText: { fontSize: 16 },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
});