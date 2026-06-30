import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types/note';

interface NoteContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);
const STORAGE_KEY = '@notes';

export const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotes(parsed.map((n: any) => ({ 
          ...n, 
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt) 
        })));
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  const saveNotes = async (updated: Note[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  const addNote = async (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = { 
      ...data, 
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    await saveNotes(updated);
  };

  const updateNote = async (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const updated = notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n);
    setNotes(updated);
    await saveNotes(updated);
  };

  const deleteNote = async (id: string) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    await saveNotes(updated);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) throw new Error('useNotes must be used within NoteProvider');
  return context;
};
