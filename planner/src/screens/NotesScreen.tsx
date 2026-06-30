import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal } from 'react-native';
import { FAB, Card, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../context/ThemeContext';
import { Note } from '../types/note';

export default function NotesScreen() {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const { colors } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const openModal = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setTitle(note.title);
      setContent(note.content);
    } else {
      setEditingNote(null);
      setTitle('');
      setContent('');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;
    if (editingNote) {
      await updateNote(editingNote.id, { title: title.trim(), content: content.trim() });
    } else {
      await addNote({ title: title.trim(), content: content.trim() });
    }
    setModalVisible(false);
  };

  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <Card style={[styles.card, { backgroundColor: colors.card }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={[styles.noteTitle, { color: colors.text }]}>{item.title || 'Untitled'}</Text>
            <IconButton icon="delete" size={20} onPress={() => deleteNote(item.id)} />
          </View>
          <Text style={[styles.noteContent, { color: colors.subtext }]} numberOfLines={3}>{item.content}</Text>
          <Text style={[styles.date, { color: colors.subtext }]}>{new Date(item.updatedAt).toLocaleDateString()}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notebook</Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={renderNote}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="note" size={64} color={colors.subtext} />
            <Text style={[styles.emptyText, { color: colors.subtext }]}>No notes yet</Text>
          </View>
        }
      />

      <FAB icon="plus" style={[styles.fab, { backgroundColor: colors.accent }]} onPress={() => openModal()} color="#fff" />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {editingNote ? 'Edit Note' : 'New Note'}
              </Text>
              <IconButton icon="close" onPress={() => setModalVisible(false)} />
            </View>

            <TextInput
              style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
              placeholder="Title"
              placeholderTextColor={colors.subtext}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.textArea, { color: colors.text }]}
              placeholder="Write your note here..."
              placeholderTextColor={colors.subtext}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity onPress={handleSave} style={styles.addButton}>
              <LinearGradient colors={[colors.accent, '#764ba2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradientButton}>
                <Text style={styles.addButtonText}>Save</Text>
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
  headerTitle: { fontSize: 32, fontWeight: '800' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  row: { justifyContent: 'space-between' },
  card: { flex: 1, margin: 8, borderRadius: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  noteTitle: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  noteContent: { fontSize: 14, marginVertical: 8 },
  date: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, marginTop: 16 },
  fab: { position: 'absolute', right: 20, bottom: 20, borderRadius: 28 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, height: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700' },
  input: { fontSize: 24, fontWeight: 'bold', borderBottomWidth: 1, paddingVertical: 8, marginBottom: 16 },
  textArea: { flex: 1, fontSize: 16 },
  addButton: { borderRadius: 12, overflow: 'hidden', marginTop: 16 },
  gradientButton: { paddingVertical: 14, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
