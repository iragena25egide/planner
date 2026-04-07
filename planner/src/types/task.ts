export type Repeat = 'none' | 'daily' | 'weekly' | 'monthly';
export type Category = 'Work' | 'Personal' | 'Shopping' | 'Other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
  repeat?: Repeat;          
  category?: Category;      
}