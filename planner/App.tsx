import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/context/ThemeContext';
import { TaskProvider } from './src/context/TaskContext';
import { FinanceProvider } from './src/context/FinanceContext';
import { NoteProvider } from './src/context/NoteContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TaskProvider>
          <FinanceProvider>
            <NoteProvider>
              <AppNavigator />
            </NoteProvider>
          </FinanceProvider>
        </TaskProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}