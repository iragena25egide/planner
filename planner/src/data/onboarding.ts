export interface OnboardingSlide {
  id: string;
  image: any;         
  title: string;
  description: string;
}

export const slides: OnboardingSlide[] = [
  {
    id: '1',
    image: require('../../assets/onboarding1.png'), 
    title: 'Plan Your Day',
    description: 'Organize your tasks with a simple and intuitive interface.',
  },
  {
    id: '2',
    image: require('../../assets/onboarding2.png'),
    title: 'Set Reminders',
    description: 'Never miss a deadline with smart notifications.',
  },
  {
    id: '3',
    image: require('../../assets/onboarding3.png'),
    title: 'Achieve More',
    description: 'Track your progress and boost your productivity.',
  },
];