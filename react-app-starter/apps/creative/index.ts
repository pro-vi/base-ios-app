import { MiniApp } from '@/lib/apps/types';

export const creativeApp: MiniApp = {
  id: 'creative',
  name: 'Creative Suite',
  description: 'Full creative toolkit',
  tabs: [
    {
      id: 'discover',
      name: 'Discover',
      icon: 'sparkles',
      component: 'discover',
    },
    {
      id: 'nano',
      name: 'Nano',
      icon: 'wand.and.stars',
      component: 'nano',
    },
    {
      id: 'video',
      name: 'Video',
      icon: 'video.fill',
      component: 'video',
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: 'gearshape.fill',
      component: 'settings',
    },
  ],
};

export default creativeApp;
