import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FEATURE_FLAGS as DEFAULT_FLAGS } from '@/config/featureFlags';

type FeatureFlags = typeof DEFAULT_FLAGS;
type FeatureFlagKey = keyof FeatureFlags;

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  toggleFlag: (key: FeatureFlagKey) => void;
  updateFlag: (key: FeatureFlagKey, value: boolean) => void;
  resetFlags: () => void;
  isFeatureEnabled: (key: FeatureFlagKey) => boolean;
}

const STORAGE_KEY = '@feature_flags';

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedFlags = JSON.parse(stored);
        setFlags({ ...DEFAULT_FLAGS, ...parsedFlags });
      }
    } catch (error) {
      console.error('Failed to load feature flags:', error);
    }
  };

  const saveFlags = async (newFlags: FeatureFlags) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFlags));
    } catch (error) {
      console.error('Failed to save feature flags:', error);
    }
  };

  const toggleFlag = useCallback((key: FeatureFlagKey) => {
    setFlags((prev) => {
      const newFlags = { ...prev, [key]: !prev[key] };
      saveFlags(newFlags);
      return newFlags;
    });
  }, []);

  const updateFlag = useCallback((key: FeatureFlagKey, value: boolean) => {
    setFlags((prev) => {
      const newFlags = { ...prev, [key]: value };
      saveFlags(newFlags);
      return newFlags;
    });
  }, []);

  const resetFlags = useCallback(() => {
    setFlags(DEFAULT_FLAGS);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const isFeatureEnabled = useCallback(
    (key: FeatureFlagKey) => {
      return flags[key];
    },
    [flags]
  );

  return (
    <FeatureFlagsContext.Provider
      value={{ flags, toggleFlag, updateFlag, resetFlags, isFeatureEnabled }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
};

export type { FeatureFlags, FeatureFlagsContextType };
