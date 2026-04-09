import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {TaskContext} from './src/context/taskContext';
import { ThemeProvider } from './src/context/themeContext';
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