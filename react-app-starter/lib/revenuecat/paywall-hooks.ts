import { useState, useCallback } from 'react';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { PurchasesOffering } from 'react-native-purchases';
import { useRevenueCat } from './RevenueCatProvider';

// Hook for presenting paywall modally
export const usePresentPaywall = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCustomerInfo } = useRevenueCat();

  const presentPaywall = useCallback(
    async (offering?: PurchasesOffering): Promise<boolean> => {
      try {
        setIsPresenting(true);
        setError(null);

        const paywallResult: PAYWALL_RESULT = offering
          ? await RevenueCatUI.presentPaywall({ offering })
          : await RevenueCatUI.presentPaywall();

        // Refresh customer info after paywall interaction
        if (
          paywallResult === PAYWALL_RESULT.PURCHASED ||
          paywallResult === PAYWALL_RESULT.RESTORED
        ) {
          await getCustomerInfo();
        }

        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
          case PAYWALL_RESULT.RESTORED:
            return true;
          case PAYWALL_RESULT.NOT_PRESENTED:
          case PAYWALL_RESULT.ERROR:
          case PAYWALL_RESULT.CANCELLED:
          default:
            return false;
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error presenting paywall:', err);
        return false;
      } finally {
        setIsPresenting(false);
      }
    },
    [getCustomerInfo]
  );

  return {
    presentPaywall,
    isPresenting,
    error,
  };
};

// Hook for presenting paywall only if needed (user doesn't have entitlement)
export const usePresentPaywallIfNeeded = () => {
  const [isPresenting, setIsPresenting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { getCustomerInfo } = useRevenueCat();

  const presentPaywallIfNeeded = useCallback(
    async (
      requiredEntitlementIdentifier: string,
      offering?: PurchasesOffering
    ): Promise<boolean> => {
      try {
        setIsPresenting(true);
        setError(null);

        const paywallResult: PAYWALL_RESULT = offering
          ? await RevenueCatUI.presentPaywallIfNeeded({
              offering,
              requiredEntitlementIdentifier,
            })
          : await RevenueCatUI.presentPaywallIfNeeded({
              requiredEntitlementIdentifier,
            });

        // Refresh customer info after paywall interaction
        if (
          paywallResult === PAYWALL_RESULT.PURCHASED ||
          paywallResult === PAYWALL_RESULT.RESTORED
        ) {
          await getCustomerInfo();
        }

        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
          case PAYWALL_RESULT.RESTORED:
            return true;
          case PAYWALL_RESULT.NOT_PRESENTED: // User already has entitlement
            return true;
          case PAYWALL_RESULT.ERROR:
          case PAYWALL_RESULT.CANCELLED:
          default:
            return false;
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error presenting paywall if needed:', err);
        return false;
      } finally {
        setIsPresenting(false);
      }
    },
    [getCustomerInfo]
  );

  return {
    presentPaywallIfNeeded,
    isPresenting,
    error,
  };
};

// Hook for managing paywall footer (for custom paywall implementations)
export const usePaywallFooter = () => {
  const [footerVisible, setFooterVisible] = useState(true);

  const showFooter = useCallback(() => {
    setFooterVisible(true);
  }, []);

  const hideFooter = useCallback(() => {
    setFooterVisible(false);
  }, []);

  return {
    footerVisible,
    showFooter,
    hideFooter,
  };
};
