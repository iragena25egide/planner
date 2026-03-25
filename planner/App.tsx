import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { TaskProvider } from './src/context/taskContext';
import { registerForPushNotificationsAsync } from './src/services/notification';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TaskProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </TaskProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}