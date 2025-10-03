import { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { initializeRevenueCat, isRevenueCatAvailable } from './service';

/**
 * Hook to initialize RevenueCat on app startup
 * Usage: Call this in your root layout component
 */
export const useRevenueCatInit = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const success = await initializeRevenueCat();
        setIsInitialized(success);

        if (!success) {
          logger.info('RevenueCat initialization skipped or failed', null, 'RevenueCat');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        logger.error('RevenueCat initialization error', err, 'RevenueCat');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    isAvailable: isRevenueCatAvailable(),
  };
};

/**
 * Hook to check if RevenueCat is available
 * Use this in components that need to conditionally show purchase UI
 */
export const useRevenueCatAvailability = () => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    // Check availability after a short delay to ensure initialization has completed
    const timer = setTimeout(() => {
      setIsAvailable(isRevenueCatAvailable());
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return isAvailable;
};
