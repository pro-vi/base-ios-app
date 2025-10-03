import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMiniApp, miniAppRegistry } from './registry';
import { MiniApp } from './types';

interface MiniAppContextValue {
  activeApp: MiniApp;
  availableApps: MiniApp[];
  switchApp: (appId: string) => Promise<void>;
  isLoading: boolean;
}

const MiniAppContext = createContext<MiniAppContextValue | undefined>(undefined);

const STORAGE_KEY = '@active_mini_app';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [activeAppId, setActiveAppId] = useState<string>('foundation');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved app preference
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((savedAppId) => {
      if (savedAppId && miniAppRegistry[savedAppId as keyof typeof miniAppRegistry]) {
        setActiveAppId(savedAppId);
      }
      setIsLoading(false);
    });
  }, []);

  const switchApp = async (appId: string) => {
    setActiveAppId(appId);
    await AsyncStorage.setItem(STORAGE_KEY, appId);
  };

  const activeApp = getMiniApp(activeAppId);

  const value: MiniAppContextValue = {
    activeApp,
    availableApps: Object.values(miniAppRegistry),
    switchApp,
    isLoading,
  };

  return <MiniAppContext.Provider value={value}>{children}</MiniAppContext.Provider>;
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);
  if (!context) {
    throw new Error('useMiniApp must be used within MiniAppProvider');
  }
  return context;
}
