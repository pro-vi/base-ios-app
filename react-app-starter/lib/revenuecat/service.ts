import {} from 'react-native';
import Constants from 'expo-constants';
import { logger } from '@/lib/logger';
import { revenueCatConfig, validateRevenueCatConfig } from './config';

let Purchases: any = null;
let isInitialized = false;

/**
 * Check if running in Expo Go
 */
const isExpoGo = (): boolean => {
  // Check if we're in Expo Go by looking at the execution environment
  return Constants.executionEnvironment === 'storeClient';
};

/**
 * Initialize RevenueCat SDK
 * This should be called once at app startup
 */
export const initializeRevenueCat = async (): Promise<boolean> => {
  if (isInitialized) {
    logger.info('RevenueCat already initialized', null, 'RevenueCat');
    return true;
  }

  try {
    // Skip RevenueCat initialization in Expo Go
    if (isExpoGo()) {
      logger.info('Running in Expo Go, skipping RevenueCat initialization', null, 'RevenueCat');
      return false;
    }

    // Validate configuration
    if (!validateRevenueCatConfig()) {
      logger.warn('RevenueCat configuration validation failed', null, 'RevenueCat');
      return false;
    }

    // Try to dynamically import RevenueCat
    let PurchasesModule;
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      PurchasesModule = require('react-native-purchases');
    } catch {
      logger.warn(
        'RevenueCat module not available - development build required',
        null,
        'RevenueCat'
      );
      return false;
    }

    Purchases = PurchasesModule.default;
    const { LOG_LEVEL } = PurchasesModule;

    // Enable debug logs before calling `configure`
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.INFO);

    // Initialize RevenueCat with configuration
    await Purchases.configure({
      apiKey: revenueCatConfig.apiKey,
      appUserID: null, // Let RevenueCat generate anonymous ID
      useAmazon: revenueCatConfig.useAmazon,
    });

    isInitialized = true;
    logger.info('RevenueCat configured successfully', null, 'RevenueCat');
    return true;
  } catch (error) {
    logger.error('Failed to configure RevenueCat', error, 'RevenueCat');
    return false;
  }
};

/**
 * Get the RevenueCat Purchases instance
 * Returns null if not initialized or in Expo Go
 */
export const getPurchases = () => {
  if (!isInitialized || !Purchases) {
    logger.warn('RevenueCat not initialized', null, 'RevenueCat');
    return null;
  }
  return Purchases;
};

/**
 * Check if RevenueCat is available and initialized
 */
export const isRevenueCatAvailable = (): boolean => {
  return isInitialized && !!Purchases;
};

/**
 * Login or identify user with RevenueCat
 */
export const loginWithRevenueCat = async (userId: string): Promise<void> => {
  const purchases = getPurchases();
  if (!purchases) {
    logger.warn('Cannot login - RevenueCat not available', null, 'RevenueCat');
    return;
  }

  try {
    await purchases.logIn(userId);
    logger.info('User logged in to RevenueCat', { userId }, 'RevenueCat');
  } catch (error) {
    logger.error('Failed to login to RevenueCat', error, 'RevenueCat');
  }
};

/**
 * Logout from RevenueCat (creates anonymous user)
 */
export const logoutFromRevenueCat = async (): Promise<void> => {
  const purchases = getPurchases();
  if (!purchases) {
    logger.warn('Cannot logout - RevenueCat not available', null, 'RevenueCat');
    return;
  }

  try {
    await purchases.logOut();
    logger.info('User logged out from RevenueCat', null, 'RevenueCat');
  } catch (error) {
    logger.error('Failed to logout from RevenueCat', error, 'RevenueCat');
  }
};

/**
 * Restore purchases for the current user
 */
export const restorePurchases = async (): Promise<void> => {
  const purchases = getPurchases();
  if (!purchases) {
    logger.warn('Cannot restore purchases - RevenueCat not available', null, 'RevenueCat');
    return;
  }

  try {
    const customerInfo = await purchases.restorePurchases();
    logger.info('Purchases restored successfully', { customerInfo }, 'RevenueCat');
  } catch (error) {
    logger.error('Failed to restore purchases', error, 'RevenueCat');
    throw error;
  }
};
