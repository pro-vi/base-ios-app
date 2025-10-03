// Main exports for RevenueCat integration
export { RevenueCatProvider, useRevenueCat } from './RevenueCatProvider';
export { revenueCatConfig, validateRevenueCatConfig } from './config';
export {
  useSubscriptionStatus,
  usePackages,
  usePurchase,
  useUserAttributes,
  usePromotionalOffer,
} from './hooks';

// Service layer exports
export {
  initializeRevenueCat,
  getPurchases,
  isRevenueCatAvailable,
  loginWithRevenueCat,
  logoutFromRevenueCat,
  restorePurchases,
} from './service';

// Initialization hooks
export { useRevenueCatInit, useRevenueCatAvailability } from './useRevenueCat';

// Paywall exports
export { usePresentPaywall, usePresentPaywallIfNeeded, usePaywallFooter } from './paywall-hooks';

export { Paywall, ModalPaywall, ConditionalPaywall } from './PaywallComponents';

// Entitlement utilities
export {
  hasEntitlement,
  hasAnyEntitlement,
  getActiveEntitlements,
  hasAnyOfEntitlements,
  hasAllEntitlements,
  getEntitlementExpirationDate,
  willEntitlementRenew,
  getEntitlementInfo,
} from './entitlements';

// Re-export types from react-native-purchases for convenience
export type {
  CustomerInfo,
  PurchasesPackage,
  PurchasesOffering,
  PurchasesEntitlementInfo,
  PurchasesEntitlementInfos,
  PurchasesError,
} from 'react-native-purchases';
