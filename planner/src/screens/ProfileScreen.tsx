import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState('Egide Ntabashwa');
  const [email, setEmail] = useState('iragenaegide205@gmail.com');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
      const savedName = await AsyncStorage.getItem('username');
      if (savedName) setUsername(savedName);
      const savedEmail = await AsyncStorage.getItem('email');
      if (savedEmail) setEmail(savedEmail);
    } catch (error) {
      console.error('Failed to load profile', error);
    }
  };

  const saveProfile = async (image: string | null, name: string, emailAddr: string) => {
    try {
      if (image) await AsyncStorage.setItem('profileImage', image);
      await AsyncStorage.setItem('username', name);
      await AsyncStorage.setItem('email', emailAddr);
    } catch (error) {
      console.error('Failed to save profile', error);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your photos to set profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await saveProfile(uri, username, email);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'We need access to your camera to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await saveProfile(uri, username, email);
    }
  };

  const showImageOptions = () => {
    Alert.alert('Profile Picture', 'Choose an option', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#e9edf2']} style={styles.container}>
      <TouchableOpacity onPress={showImageOptions} style={styles.avatarContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={80} color="#cbd5e0" />
          </View>
        )}
        <View style={styles.editIcon}>
          <MaterialIcons name="camera-alt" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.email}>{email}</Text>
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="notifications" size={24} color="#667eea" />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="dark-mode" size={24} color="#667eea" />
          <Text style={styles.settingText}>Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <MaterialIcons name="logout" size={24} color="#e53e3e" />
          <Text style={[styles.settingText, { color: '#e53e3e' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80 },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: '#fff' },
  avatarPlaceholder: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#edf2f7', justifyContent: 'center', alignItems: 'center' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#667eea', borderRadius: 20, padding: 6 },
  username: { fontSize: 24, fontWeight: '700', color: '#2d3748', marginTop: 10 },
  email: { fontSize: 16, color: '#718096', marginTop: 4 },
  editButton: { marginTop: 16, backgroundColor: '#667eea', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  editButtonText: { color: '#fff', fontWeight: '600' },
  settingsCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, width: '90%', marginTop: 40 },
  settingItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  settingText: { fontSize: 16, marginLeft: 12, color: '#4a5568' },
});