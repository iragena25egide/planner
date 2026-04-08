import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { tasks, addTask } = useTasks();
  const { theme, toggleTheme, colors } = useTheme();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null); // for preview before save
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved profile image on mount
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const saved = await AsyncStorage.getItem('@profile_image');
      if (saved) setProfileImage(saved);
    } catch (error) {
      console.error('Failed to load profile image', error);
    }
  };

  const saveProfileImage = async (uri: string) => {
    try {
      await AsyncStorage.setItem('@profile_image', uri);
      setProfileImage(uri);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile picture');
    }
  };

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert('Permission needed', `Please allow access to ${useCamera ? 'camera' : 'gallery'}.`);
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

    if (!result.canceled && result.assets[0]) {
      setTempImage(result.assets[0].uri);
      setShowPreview(true);
    }
  };

  const confirmSave = () => {
    if (tempImage) {
      saveProfileImage(tempImage);
      setShowPreview(false);
      setTempImage(null);
    }
  };

  const discardImage = () => {
    setTempImage(null);
    setShowPreview(false);
  };

  const removeProfileImage = async () => {
    Alert.alert(
      'Remove Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('@profile_image');
            setProfileImage(null);
            Alert.alert('Removed', 'Profile picture has been removed.');
          },
        },
      ]
    );
  };

  const exportData = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const importData = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.type === 'success') {
        const content = await FileSystem.readAsStringAsync(result.uri);
        const imported = JSON.parse(content);
        for (const task of imported) {
          await addTask({ ...task, id: undefined });
        }
        Alert.alert('Import successful');
      }
    } catch (err) {
      Alert.alert('Import failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.background} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Picture Section */}
        <View style={[styles.card, { backgroundColor: colors.card, alignItems: 'center' }]}>
          <TouchableOpacity onPress={() => pickImage(false)} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
                <MaterialIcons name="person" size={50} color={colors.subtext} />
              </View>
            )}
            <View style={styles.editIcon}>
              <MaterialIcons name="camera-alt" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.text }]}>User</Text>
          <Text style={[styles.userEmail, { color: colors.subtext }]}>user@example.com</Text>
          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.imageActionBtn} onPress={() => pickImage(false)}>
              <MaterialIcons name="photo-library" size={20} color={colors.accent} />
              <Text style={[styles.imageActionText, { color: colors.text }]}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageActionBtn} onPress={() => pickImage(true)}>
              <MaterialIcons name="camera-alt" size={20} color={colors.accent} />
              <Text style={[styles.imageActionText, { color: colors.text }]}>Camera</Text>
            </TouchableOpacity>
            {profileImage && (
              <TouchableOpacity style={styles.imageActionBtn} onPress={removeProfileImage}>
                <MaterialIcons name="delete" size={20} color="#e53e3e" />
                <Text style={[styles.imageActionText, { color: '#e53e3e' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        
        <View style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <TouchableOpacity style={styles.option} onPress={toggleTheme}>
            <MaterialIcons name={theme === 'light' ? 'dark-mode' : 'light-mode'} size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={exportData} disabled={isLoading}>
            <MaterialIcons name="file-download" size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Export Tasks</Text>
            {isLoading && <ActivityIndicator size="small" color={colors.accent} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={importData} disabled={isLoading}>
            <MaterialIcons name="file-upload" size={24} color={colors.accent} />
            <Text style={[styles.optionText, { color: colors.text }]}>Import Tasks</Text>
            {isLoading && <ActivityIndicator size="small" color={colors.accent} />}
          </TouchableOpacity>
        </View>

        
        <View style={[styles.card, { backgroundColor: colors.card, marginTop: 16 }]}>
          <Text style={[styles.title, { color: colors.text }]}>About</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Planner App v1.0</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>Organize your tasks with ease</Text>
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal visible={showPreview} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Preview Profile Picture</Text>
            {tempImage && (
              <Image source={{ uri: tempImage }} style={styles.previewImage} />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#e53e3e' }]} onPress={discardImage}>
                <Text style={styles.modalBtnText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: colors.accent }]} onPress={confirmSave}>
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  card: { borderRadius: 24, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  optionText: { fontSize: 16, flex: 1 },
  subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
  // Profile image styles
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#667eea',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#667eea',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#667eea',
    borderRadius: 20,
    padding: 6,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 8,
  },
  imageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  imageActionText: {
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 40,
    minWidth: 100,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});