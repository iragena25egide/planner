export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
}