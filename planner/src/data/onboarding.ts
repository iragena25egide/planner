export interface OnboardingSlide {
  id: string;
  image: any;         
  title: string;
  description: string;
}

export const slides: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../../assets/no.jpeg'), 
    title: 'Plan Your Day',
    description: 'Organize your tasks with a simple and intuitive interface.',
  },
  {
    id: '2',
    image: require('../../assets/pay2.png'),
    title: 'Set Reminders',
    description: 'Never miss a deadline with smart notifications.',
  },
  {
    id: '3',
    image: require('../../assets/mes2.png'),
    title: 'Achieve More',
    description: 'Track your progress and boost your productivity.',
  },
];