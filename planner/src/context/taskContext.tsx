import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Task } from '../types/task';
import uuid from 'react-native-uuid';

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, 
    description: string, 
    date: Date) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  
  useEffect(() => {
    loadTasks();
  }, []);

 
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('tasks');
      if (stored) {
        const parsed = JSON.parse(stored);
       
        const tasksWithDates = parsed.map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));
        setTasks(tasksWithDates);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks', error);
    }
  };

  const scheduleNotification = async (taskId: string, title: string, date: Date) => {
   
    await Notifications.cancelScheduledNotificationAsync(taskId);
    
    
    if (date > new Date()) {
      const trigger = new Date(date);
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: title,
          sound: 'default', 
          data: { taskId },
        },
        trigger,
        identifier: taskId, 
      });
      return notificationId;
    }
    return null;
  };

  const addTask = async (title: string, description: string, date: Date) => {
    const newTask: Task = {
      id: uuid.v4().toString(),
      title,
      description,
      date,
      completed: false,
    };
    // Schedule notification
    await scheduleNotification(newTask.id, newTask.title, newTask.date);
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskCompletion = async (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (id: string) => {
   
    await Notifications.cancelScheduledNotificationAsync(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};