import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FAB, Card, IconButton, Checkbox, Chip } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { Task, Category, Repeat } from '../types/task';

const categories: Category[] = ['Work', 'Personal', 'Shopping', 'Other'];
const repeatOptions: Repeat[] = ['none', 'daily', 'weekly', 'monthly'];

export default function HomeScreen() {
  const { tasks, addTask, updateTask, toggleTaskComplete, deleteTask } = useTasks();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState<Category>('Other');
  const [repeat, setRepeat] = useState<Repeat>('none');
  const [showPicker, setShowPicker] = useState(false);

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setDate(new Date(task.date));
      setCategory(task.category || 'Other');
      setRepeat(task.repeat || 'none');
    } else {
      setEditingTask(null);
      setTitle('');
      setDescription('');
      setDate(new Date());
      setCategory('Other');
      setRepeat('none');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    const taskData = {
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      category,
      repeat,
      completed: false,
    };
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await addTask(taskData);
    }
    setModalVisible(false);
    setEditingTask(null);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  const renderTask = ({ item }: { item: Task }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <TouchableOpacity onPress={() => openModal(item)}>
          <Card style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Card.Content style={styles.cardContent}>
              <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                onPress={() => toggleTaskComplete(item.id)}
                color={colors.accent}
              />
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, { color: colors.text }, item.completed && styles.completedTask]}>
                  {item.title}
                </Text>
                {item.description && <Text style={[styles.taskDesc, { color: colors.subtext }]}>{item.description}</Text>}
                <View style={styles.metaRow}>
                  <View style={styles.dateRow}>
                    <MaterialIcons name="event" size={14} color={colors.subtext} />
                    <Text style={[styles.dateText, { color: colors.subtext }]}>
                      {new Date(item.date).toLocaleString()}
                    </Text>
                  </View>
                  {item.category && (
                    <Chip style={styles.categoryChip} textStyle={{ fontSize: 10 }}>{item.category}</Chip>
                  )}
                  {item.repeat && item.repeat !== 'none' && (
                    <MaterialIcons name="repeat" size={14} color={colors.subtext} />
                  )}
                </View>
              </View>
              <IconButton icon="delete" size={20} onPress={() => deleteTask(item.id)} />
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>My Tasks</Text>
        <Text style={[styles.headerSubtitle, { color: colors.subtext }]}>
          {tasks.filter(t => !t.completed).length} pending
        </Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor={colors.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No tasks yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.subtext }]}>Tap + to add your first task</Text>
          </View>
        }
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => openModal()} color="#fff" />

      {/* Add/Edit Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </Text>
              <IconButton icon="close" onPress={() => setModalVisible(false)} />
            </View>

            <TextInput
              style={[styles.input, { backgroundColor: colors.background[0], borderColor: colors.border, color: colors.text }]}
              placeholder="Task Title"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background[0], borderColor: colors.border, color: colors.text }]}
              placeholder="Description (optional)"
              placeholderTextColor={colors.subtext}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity onPress={() => setShowPicker(true)} style={[styles.dateButton, { backgroundColor: colors.background[0] }]}>
              <MaterialIcons name="event" size={20} color={colors.accent} />
              <Text style={[styles.dateButtonText, { color: colors.text }]}>{date.toLocaleString()}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker value={date} mode="datetime" display="default" onChange={onChangeDate} />
            )}

            <View style={styles.pickerRow}>
              <View style={styles.pickerContainer}>
                <Text style={[styles.pickerLabel, { color: colors.subtext }]}>Category</Text>
                <Picker
                  selectedValue={category}
                  onValueChange={(val) => setCategory(val as Category)}
                  style={{ color: colors.text }}
                >
                  {categories.map(cat => <Picker.Item key={cat} label={cat} value={cat} />)}
                </Picker>
              </View>
              <View style={styles.pickerContainer}>
                <Text style={[styles.pickerLabel, { color: colors.subtext }]}>Repeat</Text>
                <Picker
                  selectedValue={repeat}
                  onValueChange={(val) => setRepeat(val as Repeat)}
                  style={{ color: colors.text }}
                >
                  {repeatOptions.map(opt => <Picker.Item key={opt} label={opt === 'none' ? 'Never' : opt} value={opt} />)}
                </Picker>
              </View>
            </View>

            <TouchableOpacity onPress={handleSave} style={styles.addButton}>
              <LinearGradient colors={[colors.accent, '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                <Text style={styles.addButtonText}>{editingTask ? 'Update Task' : 'Add Task'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: '800', marginBottom: 4 },
  headerSubtitle: { fontSize: 16 },
  searchInput: {
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
  },
  listContainer: { paddingHorizontal: 20, paddingBottom: 80 },
  card: { marginBottom: 12, borderRadius: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  cardContent: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  taskInfo: { flex: 1, marginLeft: 8 },
  taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  completedTask: { textDecorationLine: 'line-through', opacity: 0.6 },
  taskDesc: { fontSize: 14, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, marginLeft: 4 },
  categoryChip: { height: 24, justifyContent: 'center', backgroundColor: '#e2e8f0' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 16 },
  emptySubtext: { fontSize: 14, marginTop: 8 },
  fab: { position: 'absolute', right: 20, bottom: 20, borderRadius: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700' },
  input: { borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 16, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  dateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, marginBottom: 16, gap: 8 },
  dateButtonText: { fontSize: 16 },
  pickerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 16 },
  pickerContainer: { flex: 1 },
  pickerLabel: { fontSize: 12, marginBottom: 4 },
  addButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  gradientButton: { paddingVertical: 14, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});