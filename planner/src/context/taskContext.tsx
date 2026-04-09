import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Task, Repeat, Category } from '../types/task';
import { scheduleTaskNotification, cancelTaskNotification } from '../services/notification';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getStats: () => { total: number; completed: number; byCategory: Record<Category, number> };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = '@tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
    Notifications.requestPermissionsAsync();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const tasksWithDates = parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTasks(tasksWithDates);
        // reschedule notifications
        tasksWithDates.forEach((task: Task) => {
          if (!task.completed && task.date > new Date()) {
            scheduleTaskNotification(task);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    if (!newTask.completed && newTask.date > new Date()) {
      await scheduleTaskNotification(newTask);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id'>>) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;
    const oldTask = tasks[taskIndex];
    const updatedTask = { ...oldTask, ...updates };
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
    // reschedule notification if date changed
    if (updates.date) {
      cancelTaskNotification(id);
      if (!updatedTask.completed && updatedTask.date > new Date()) {
        scheduleTaskNotification(updatedTask);
      }
    }
  };

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const completed = !task.completed;
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed } : t
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);

    if (completed && task.repeat && task.repeat !== 'none') {
      // create a new recurring task
      const nextDate = new Date(task.date);
      switch (task.repeat) {
        case 'daily': nextDate.setDate(nextDate.getDate() + 1); break;
        case 'weekly': nextDate.setDate(nextDate.getDate() + 7); break;
        case 'monthly': nextDate.setMonth(nextDate.getMonth() + 1); break;
      }
      if (nextDate > new Date()) {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          date: nextDate,
          completed: false,
        };
        setTasks(prev => [newTask, ...prev]);
        await saveTasks([newTask, ...updatedTasks]);
        scheduleTaskNotification(newTask);
      }
    } else {
      if (completed) {
        cancelTaskNotification(id);
      } else {
        scheduleTaskNotification(task);
      }
    }
  };

  const deleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) cancelTaskNotification(id);
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const getStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const byCategory: Record<Category, number> = {
      Work: 0,
      Personal: 0,
      Shopping: 0,
      Other: 0,
    };
    tasks.forEach(task => {
      if (task.category) byCategory[task.category] += 1;
    });
    return { total, completed, byCategory };
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, toggleTaskComplete, deleteTask, getStats }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};