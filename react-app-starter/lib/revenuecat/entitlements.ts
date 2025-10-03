import { CustomerInfo } from 'react-native-purchases';

// Utility functions for checking entitlements

/**
 * Check if a specific entitlement is active
 */
export const hasEntitlement = (
  customerInfo: CustomerInfo | null,
  entitlementId: string
): boolean => {
  if (!customerInfo) return false;

  return (
    typeof customerInfo.entitlements.active[entitlementId] !== 'undefined' &&
    customerInfo.entitlements.active[entitlementId]?.isActive === true
  );
};

/**
 * Check if user has any active entitlements
 */
export const hasAnyEntitlement = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;

  return Object.entries(customerInfo.entitlements.active).length > 0;
};

/**
 * Get list of all active entitlement IDs
 */
export const getActiveEntitlements = (customerInfo: CustomerInfo | null): string[] => {
  if (!customerInfo) return [];

  return Object.keys(customerInfo.entitlements.active).filter(
    (key) => customerInfo.entitlements.active[key]?.isActive === true
  );
};

/**
 * Check if user has any of the specified entitlements
 */
export const hasAnyOfEntitlements = (
  customerInfo: CustomerInfo | null,
  entitlementIds: string[]
): boolean => {
  if (!customerInfo) return false;

  return entitlementIds.some((id) => hasEntitlement(customerInfo, id));
};

/**
 * Check if user has all of the specified entitlements
 */
export const hasAllEntitlements = (
  customerInfo: CustomerInfo | null,
  entitlementIds: string[]
): boolean => {
  if (!customerInfo) return false;

  return entitlementIds.every((id) => hasEntitlement(customerInfo, id));
};

/**
 * Get expiration date for an entitlement
 */
export const getEntitlementExpirationDate = (
  customerInfo: CustomerInfo | null,
  entitlementId: string
): Date | null => {
  if (!customerInfo) return null;

  const entitlement = customerInfo.entitlements.active[entitlementId];
  if (!entitlement?.expirationDate) return null;

  return new Date(entitlement.expirationDate);
};

/**
 * Check if an entitlement will renew
 */
export const willEntitlementRenew = (
  customerInfo: CustomerInfo | null,
  entitlementId: string
): boolean => {
  if (!customerInfo) return false;

  const entitlement = customerInfo.entitlements.active[entitlementId];
  return entitlement?.willRenew === true;
};

/**
 * Get entitlement info with formatted data
 */
export const getEntitlementInfo = (customerInfo: CustomerInfo | null, entitlementId: string) => {
  if (!customerInfo) return null;

  const entitlement = customerInfo.entitlements.active[entitlementId];
  if (!entitlement) return null;

  return {
    isActive: entitlement.isActive,
    willRenew: entitlement.willRenew,
    expirationDate: entitlement.expirationDate ? new Date(entitlement.expirationDate) : null,
    productIdentifier: entitlement.productIdentifier,
    isSandbox: entitlement.isSandbox,
    periodType: entitlement.periodType,
    store: entitlement.store,
  };
};
