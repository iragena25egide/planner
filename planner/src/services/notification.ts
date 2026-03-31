import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Task } from '../types/task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('task-reminders', {
      name: 'Task Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default', // change to 'custom.wav' if you have a sound file in assets
    });
  }
};

export const scheduleTaskNotification = async (task: Task) => {
  await Notifications.cancelScheduledNotificationAsync(task.id);
  const trigger = new Date(task.date);
  if (trigger <= new Date()) return;
  await Notifications.scheduleNotificationAsync({
    identifier: task.id,
    content: {
      title: 'Task Reminder',
      body: task.title + (task.description ? `: ${task.description}` : ''),
      sound: 'default',
    },
    trigger,
  });
};

export const cancelTaskNotification = async (taskId: string) => {
  await Notifications.cancelScheduledNotificationAsync(taskId);
};