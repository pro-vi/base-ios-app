import { Platform } from 'react-native';
import { LOG_LEVEL } from 'react-native-purchases';

// RevenueCat API Keys - Replace with your actual keys
const REVENUECAT_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '',
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '',
  amazon: process.env.EXPO_PUBLIC_REVENUECAT_AMAZON_KEY || '',
};

// RevenueCat Entitlement ID
export const REVENUECAT_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID;

// Check if RevenueCat should be enabled based on configuration
const currentPlatformKey = Platform.select({
  ios: REVENUECAT_KEYS.ios,
  android: REVENUECAT_KEYS.android,
  default: '',
});

const hasRequiredConfig = !!(currentPlatformKey && REVENUECAT_ENTITLEMENT_ID);

if (!hasRequiredConfig) {
  console.log('🔧 RevenueCat disabled - missing configuration:', {
    hasApiKey: !!currentPlatformKey,
    hasEntitlementId: !!REVENUECAT_ENTITLEMENT_ID,
    platform: Platform.OS,
  });
}

// RevenueCat Configuration
export const revenueCatConfig = {
  // API Keys per platform
  apiKey: currentPlatformKey,

  // Amazon specific config
  amazonApiKey: REVENUECAT_KEYS.amazon,
  useAmazon: false, // Set to true if building for Amazon

  // Log level for debugging
  logLevel: __DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.INFO,

  // Optional: User attributes
  defaultUserAttributes: {},

  // Feature flags - only enable if we have required configuration
  enabled: hasRequiredConfig,
};

// Validate configuration
export const validateRevenueCatConfig = (): boolean => {
  console.log('[RevenueCat Config] Validating...', {
    enabled: revenueCatConfig.enabled,
    platform: Platform.OS,
    hasApiKey: !!revenueCatConfig.apiKey,
    apiKeyLength: revenueCatConfig.apiKey?.length,
    entitlementId: REVENUECAT_ENTITLEMENT_ID,
  });

  if (!revenueCatConfig.enabled) {
    console.log('[RevenueCat Config] RevenueCat is disabled - skipping validation');
    return false;
  }

  // Only validate if RevenueCat is enabled
  if (!revenueCatConfig.apiKey) {
    const errorMsg = `[RevenueCat Config] FATAL: API key is missing for platform: ${Platform.OS}`;
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  if (!REVENUECAT_ENTITLEMENT_ID) {
    const errorMsg = '[RevenueCat Config] FATAL: Entitlement ID is missing';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  console.log('[RevenueCat Config] ✅ Validation passed');
  return true;
};
