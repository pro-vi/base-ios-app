import { useAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { revenueCatConfig, validateRevenueCatConfig } from './config';

// Import types from react-native-purchases
import type {
  CustomerInfo,
  PurchasesOffering,
  PurchasesOfferings,
  PurchasesPackage,
  PurchasesError,
  MakePurchaseResult,
} from 'react-native-purchases';

// Conditionally import RevenueCat module and enum
let Purchases: typeof import('react-native-purchases').default | null = null;
let PURCHASES_ERROR_CODE: typeof import('react-native-purchases').PURCHASES_ERROR_CODE | null =
  null;

// Check if we're in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RNPurchases = require('react-native-purchases');
    Purchases = RNPurchases.default;
    PURCHASES_ERROR_CODE = RNPurchases.PURCHASES_ERROR_CODE;
  } catch (error) {
    logger.warn('RevenueCat module not available', error, 'RevenueCat');
  }
}

// Types
interface RevenueCatContextType {
  isInitialized: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering[] | null;
  currentOffering: PurchasesOffering | null;
  loading: boolean;
  error: Error | null;
  purchasePackage: (pack: PurchasesPackage) => Promise<void>;
  restorePurchases: () => Promise<CustomerInfo>;
  getCustomerInfo: () => Promise<CustomerInfo>;
  checkSubscription: (entitlementId: string) => boolean;
  logout: () => Promise<void>;
}

// Context
const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

// Provider Props
interface RevenueCatProviderProps {
  children: ReactNode;
}

// Provider Component
export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({ children }) => {
  const { user } = useAuth(); // Get Supabase user
  const [isInitialized, setIsInitialized] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering[] | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize RevenueCat
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        // Skip initialization in Expo Go
        if (isExpoGo || !Purchases) {
          logger.info('Skipping RevenueCat initialization in Expo Go', null, 'RevenueCat');
          setLoading(false);
          return;
        }

        logger.info(
          'Starting RevenueCat initialization',
          {
            userId: user?.id,
            platform: Platform.OS,
            enabled: revenueCatConfig.enabled,
          },
          'RevenueCat'
        );

        // Validate configuration
        if (!validateRevenueCatConfig()) {
          logger.warn(
            'RevenueCat configuration validation failed',
            {
              enabled: revenueCatConfig.enabled,
              hasApiKey: !!revenueCatConfig.apiKey,
            },
            'RevenueCat'
          );
          setLoading(false);
          return;
        }

        // Set log level
        Purchases.setLogLevel(revenueCatConfig.logLevel);
        logger.debug(
          'RevenueCat log level set',
          { logLevel: revenueCatConfig.logLevel },
          'RevenueCat'
        );

        // Configure based on platform with Supabase user ID
        const configOptions = {
          apiKey:
            revenueCatConfig.useAmazon && Platform.OS === 'android'
              ? revenueCatConfig.amazonApiKey
              : revenueCatConfig.apiKey,
          appUserID: user?.id, // Use Supabase user ID if available
          useAmazon: revenueCatConfig.useAmazon && Platform.OS === 'android',
        };

        logger.debug('Configuring RevenueCat', configOptions, 'RevenueCat');
        await Purchases.configure(configOptions);
        logger.info('RevenueCat configured successfully', null, 'RevenueCat');

        // If user changes, update RevenueCat
        if (user?.id) {
          logger.debug('Logging in user to RevenueCat', { userId: user.id }, 'RevenueCat');
          await Purchases.logIn(user.id);
        }

        // Get initial customer info
        logger.debug('Fetching customer info', null, 'RevenueCat');
        const info: CustomerInfo = await Purchases.getCustomerInfo();
        setCustomerInfo(info);
        logger.info(
          'Customer info fetched',
          {
            userId: info.originalAppUserId,
            activeEntitlements: Object.keys(info.entitlements.active),
          },
          'RevenueCat'
        );

        // Get offerings
        logger.debug('Fetching offerings', null, 'RevenueCat');
        const offerings: PurchasesOfferings = await Purchases.getOfferings();
        if (offerings.all) {
          const allOfferings = Object.values(offerings.all) as PurchasesOffering[];
          setOfferings(allOfferings);
          setCurrentOffering(offerings.current || null);
          logger.info(
            'Offerings fetched',
            {
              offeringsCount: allOfferings.length,
              currentOffering: offerings.current?.identifier,
            },
            'RevenueCat'
          );
        } else {
          logger.warn('No offerings available', null, 'RevenueCat');
        }

        setIsInitialized(true);
        logger.info('RevenueCat initialization complete', null, 'RevenueCat');
      } catch (err) {
        logger.error('Error initializing RevenueCat', err, 'RevenueCat');
        console.error('Error initializing RevenueCat:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (revenueCatConfig.enabled) {
      logger.debug('RevenueCat enabled, starting initialization', null, 'RevenueCat');
      initializeRevenueCat();
    } else {
      logger.warn('RevenueCat is disabled in config', null, 'RevenueCat');
      setLoading(false);
    }

    // Cleanup
    return () => {
      // RevenueCat doesn't have a cleanup method, but you can add any cleanup logic here
    };
  }, [user?.id]);

  // Listen for customer info updates
  useEffect(() => {
    if (!isInitialized || !Purchases) return;

    const customerInfoUpdateListener = (info: CustomerInfo) => {
      setCustomerInfo(info);
    };

    Purchases.addCustomerInfoUpdateListener(customerInfoUpdateListener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(customerInfoUpdateListener);
    };
  }, [isInitialized]);

  // Purchase a package
  const purchasePackage = async (pack: PurchasesPackage): Promise<void> => {
    if (!isInitialized || !Purchases || !PURCHASES_ERROR_CODE) {
      throw new Error('RevenueCat is not initialized or not available');
    }

    try {
      setLoading(true);
      const result: MakePurchaseResult = await Purchases.purchasePackage(pack);
      setCustomerInfo(result.customerInfo);
    } catch (err: unknown) {
      const purchaseError = err as PurchasesError;
      // Check if the user cancelled the purchase using error code
      if (purchaseError.code !== PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  // Restore purchases
  const restorePurchases = async (): Promise<CustomerInfo> => {
    if (!isInitialized || !Purchases) {
      throw new Error('RevenueCat is not initialized or not available');
    }

    try {
      setLoading(true);
      const info: CustomerInfo = await Purchases.restorePurchases();
      setCustomerInfo(info);
      return info;
    } finally {
      setLoading(false);
    }
  };

  // Get latest customer info
  const getCustomerInfo = async (): Promise<CustomerInfo> => {
    if (!isInitialized || !Purchases) {
      throw new Error('RevenueCat is not initialized or not available');
    }

    const info: CustomerInfo = await Purchases.getCustomerInfo();
    setCustomerInfo(info);
    return info;
  };

  // Check if user has specific entitlement
  const checkSubscription = (entitlementId: string): boolean => {
    if (!customerInfo) return false;

    const entitlement = customerInfo.entitlements.active[entitlementId];
    return entitlement?.isActive === true;
  };

  // Logout
  const logout = async (): Promise<void> => {
    if (!isInitialized || !Purchases) return;

    try {
      await Purchases.logOut();
      const info: CustomerInfo = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err) {
      console.error('Error logging out:', err);
      throw err;
    }
  };

  const value: RevenueCatContextType = {
    isInitialized,
    customerInfo,
    offerings,
    currentOffering,
    loading,
    error,
    purchasePackage,
    restorePurchases,
    getCustomerInfo,
    checkSubscription,
    logout,
  };

  return <RevenueCatContext.Provider value={value}>{children}</RevenueCatContext.Provider>;
};

// Hook to use RevenueCat context
export const useRevenueCat = (): RevenueCatContextType => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
};
