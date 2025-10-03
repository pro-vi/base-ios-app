// Mini-app registry - imports and registers all available apps
import { MiniApp } from './types';

// Import apps from their packages
import { foundationApp } from '@/apps/foundation';
import { creativeApp } from '@/apps/creative';

// Registry of all available apps
export const miniAppRegistry = {
  foundation: foundationApp,
  creative: creativeApp,
};

export const getMiniApp = (appId: string): MiniApp => {
  return miniAppRegistry[appId as keyof typeof miniAppRegistry] || foundationApp;
};

// Export for backwards compatibility
export type { MiniApp, TabConfig } from './types';
