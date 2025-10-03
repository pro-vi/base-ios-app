import { useEffect, useState } from 'react';
import { useRevenueCat } from './RevenueCatProvider';
import { PurchasesPackage } from 'react-native-purchases';
import { logger } from '@/lib/logger';

import { REVENUECAT_ENTITLEMENT_ID } from './config';

// Hook to check if user has premium/pro subscription
export const useSubscriptionStatus = (entitlementId: string = REVENUECAT_ENTITLEMENT_ID) => {
  const { customerInfo, loading } = useRevenueCat();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasAnyEntitlement, setHasAnyEntitlement] = useState(false);

  useEffect(() => {
    if (customerInfo) {
      // Check specific entitlement
      const hasEntitlement =
        typeof customerInfo.entitlements.active[entitlementId] !== 'undefined' &&
        customerInfo.entitlements.active[entitlementId]?.isActive === true;
      setIsSubscribed(hasEntitlement);

      // Check if user has any active entitlements
      const hasAny = Object.entries(customerInfo.entitlements.active).length > 0;
      setHasAnyEntitlement(hasAny);

      logger.debug(
        'Subscription status updated',
        {
          entitlementId,
          isSubscribed: hasEntitlement,
          hasAnyEntitlement: hasAny,
          activeEntitlements: Object.keys(customerInfo.entitlements.active),
        },
        'RevenueCat-Hooks'
      );
    } else {
      logger.debug('No customer info available', { entitlementId }, 'RevenueCat-Hooks');
    }
  }, [customerInfo, entitlementId]);

  return {
    isSubscribed,
    hasAnyEntitlement,
    loading,
    customerInfo,
  };
};

// Hook to get available packages
export const usePackages = () => {
  const { offerings, currentOffering, loading } = useRevenueCat();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  useEffect(() => {
    if (currentOffering?.availablePackages) {
      setPackages(currentOffering.availablePackages);
    }
  }, [currentOffering]);

  return {
    packages,
    offerings,
    currentOffering,
    loading,
  };
};

// Hook for purchase flow
export const usePurchase = () => {
  const { purchasePackage, restorePurchases, loading: contextLoading } = useRevenueCat();
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const purchase = async (pack: PurchasesPackage) => {
    try {
      setPurchasing(true);
      setError(null);
      await purchasePackage(pack);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setPurchasing(false);
    }
  };

  const restore = async () => {
    try {
      setRestoring(true);
      setError(null);
      const info = await restorePurchases();
      return info;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setRestoring(false);
    }
  };

  return {
    purchase,
    restore,
    purchasing,
    restoring,
    loading: contextLoading || purchasing || restoring,
    error,
  };
};

// Hook to manage user attributes
export const useUserAttributes = () => {
  const { customerInfo } = useRevenueCat();

  const setUserAttribute = async (key: string, value: string) => {
    try {
      const Purchases = (await import('react-native-purchases')).default;
      await Purchases.setAttributes({ [key]: value });
    } catch (err) {
      console.error('Error setting user attribute:', err);
      throw err;
    }
  };

  const setEmail = async (email: string) => {
    try {
      const Purchases = (await import('react-native-purchases')).default;
      await Purchases.setEmail(email);
    } catch (err) {
      console.error('Error setting email:', err);
      throw err;
    }
  };

  const setPhoneNumber = async (phoneNumber: string) => {
    try {
      const Purchases = (await import('react-native-purchases')).default;
      await Purchases.setPhoneNumber(phoneNumber);
    } catch (err) {
      console.error('Error setting phone number:', err);
      throw err;
    }
  };

  const setDisplayName = async (displayName: string) => {
    try {
      const Purchases = (await import('react-native-purchases')).default;
      await Purchases.setDisplayName(displayName);
    } catch (err) {
      console.error('Error setting display name:', err);
      throw err;
    }
  };

  return {
    setUserAttribute,
    setEmail,
    setPhoneNumber,
    setDisplayName,
    customerInfo,
  };
};

// Hook for promotional offers (iOS only)
export const usePromotionalOffer = () => {
  const [canMakePayments, setCanMakePayments] = useState(true);

  useEffect(() => {
    const checkPayments = async () => {
      try {
        const Purchases = (await import('react-native-purchases')).default;
        const canPay = await Purchases.canMakePayments();
        setCanMakePayments(canPay);
      } catch (err) {
        console.error('Error checking payment availability:', err);
      }
    };

    checkPayments();
  }, []);

  return {
    canMakePayments,
  };
};
