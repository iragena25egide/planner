import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: {
    background: string[];
    text: string;
    subtext: string;
    card: string;
    accent: string;
    border: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem('@theme');
    if (saved === 'dark' || saved === 'light') setTheme(saved);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('@theme', newTheme);
  };

  const colors = {
    background: theme === 'light' ? ['#f5f7fa', '#e9edf2'] : ['#1a202c', '#2d3748'],
    text: theme === 'light' ? '#2d3748' : '#f7fafc',
    subtext: theme === 'light' ? '#718096' : '#a0aec0',
    card: theme === 'light' ? '#ffffff' : '#2d3748',
    accent: '#667eea',
    border: theme === 'light' ? '#e2e8f0' : '#4a5568',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};