import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {TaskContext} from './src/context/TaskContext';
import { ThemeProvider } from './src/context/ThemeContext';
import {TaskProvider} from './src/context/TaskContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}