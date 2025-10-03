import { MiniApp } from '@/lib/apps/types';

export const foundationApp: MiniApp = {
  id: 'foundation',
  name: 'Foundation',
  description: 'Essential tools',
  tabs: [
    {
      id: 'index',
      name: 'Home',
      icon: 'house.fill',
      component: 'posts',
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: 'note.text',
      component: 'notes',
    },
    {
      id: 'settings',
      name: 'Me',
      icon: 'person.fill',
      component: 'settings',
    },
  ],
};

export default foundationApp;
