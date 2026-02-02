import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Task } from '../types/task';
import uuid from 'react-native-uuid';
import { FAB, Card } from 'react-native-paper';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleAddTask = () => {
    if (!title) return;
    const newTask: Task = {
      id: uuid.v4().toString(),
      title,
      description,
      date,
    };
    setTasks([newTask, ...tasks]);
    setTitle('');
    setDescription('');
    setDate(new Date());
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const renderTask = ({ item }: { item: Task }) => {
    const fadeAnim = new Animated.Value(0);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <Card style={styles.card}>
          <Card.Title title={item.title} />
          <Card.Content>
            <Text>{item.description}</Text>
            <Text style={styles.dateText}>{item.date.toLocaleString()}</Text>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Task</Text>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>Pick Date & Time: {date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        style={{ marginTop: 20 }}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('FAB pressed')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dateButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card: { marginBottom: 10, backgroundColor: '#fff' },
  dateText: { marginTop: 5, color: '#666', fontSize: 12 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007bff',
  },
});
