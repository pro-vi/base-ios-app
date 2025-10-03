import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RevenueCatUI from 'react-native-purchases-ui';
import { PurchasesOffering, CustomerInfo, PurchasesError } from 'react-native-purchases';
import { useRevenueCat } from './RevenueCatProvider';

// Props for the Paywall component
interface PaywallProps {
  offering?: PurchasesOffering;
  onDismiss: () => void;
  onRestoreCompleted?: (customerInfo: CustomerInfo) => void;
  onPurchaseCompleted?: (customerInfo: CustomerInfo) => void;
  onPurchaseError?: (error: PurchasesError) => void;
  style?: any;
}

// Inline Paywall Component (embedded in your screen)
export const Paywall: React.FC<PaywallProps> = ({
  offering,
  onDismiss,
  onRestoreCompleted,
  onPurchaseCompleted,
  onPurchaseError,
  style,
}) => {
  const handleRestore = useCallback(
    (data: { customerInfo: CustomerInfo }) => {
      onRestoreCompleted?.(data.customerInfo);
    },
    [onRestoreCompleted]
  );

  const handlePurchase = useCallback(
    (data: { customerInfo: CustomerInfo }) => {
      onPurchaseCompleted?.(data.customerInfo);
      onDismiss(); // Auto dismiss on successful purchase
    },
    [onPurchaseCompleted, onDismiss]
  );

  const handleError = useCallback(
    (data: { error: PurchasesError }) => {
      onPurchaseError?.(data.error);
    },
    [onPurchaseError]
  );

  return (
    <View style={[styles.container, style]}>
      <RevenueCatUI.Paywall
        options={offering ? { offering } : undefined}
        onRestoreCompleted={handleRestore}
        onPurchaseCompleted={handlePurchase}
        onPurchaseError={handleError}
        onDismiss={onDismiss}
      />
    </View>
  );
};

// Modal Paywall Component
interface ModalPaywallProps extends PaywallProps {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade';
}

export const ModalPaywall: React.FC<ModalPaywallProps> = ({
  visible,
  animationType = 'slide',
  ...paywallProps
}) => {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      presentationStyle="fullScreen"
      onRequestClose={paywallProps.onDismiss}
    >
      <SafeAreaView style={styles.modalContainer}>
        <Paywall {...paywallProps} style={styles.modalPaywall} />
      </SafeAreaView>
    </Modal>
  );
};

// Note: PaywallFooter component is removed as it's not available in react-native-purchases-ui
// You can use the regular Paywall component with custom styling instead

// Conditional Paywall Wrapper (shows content or paywall based on entitlement)
interface ConditionalPaywallProps {
  requiredEntitlement: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  offering?: PurchasesOffering;
  onUnlock?: () => void;
}

export const ConditionalPaywall: React.FC<ConditionalPaywallProps> = ({
  requiredEntitlement,
  children,
  fallback,
  offering,
  onUnlock,
}) => {
  const [showPaywall, setShowPaywall] = useState(false);
  const { checkSubscription } = useRevenueCat();

  const hasAccess = checkSubscription(requiredEntitlement);

  const handleDismiss = useCallback(() => {
    setShowPaywall(false);
  }, []);

  const handlePurchaseCompleted = useCallback(
    (customerInfo: CustomerInfo) => {
      if (customerInfo.entitlements.active[requiredEntitlement]?.isActive) {
        setShowPaywall(false);
        onUnlock?.();
      }
    },
    [requiredEntitlement, onUnlock]
  );

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showPaywall) {
    return (
      <ModalPaywall
        visible={showPaywall}
        offering={offering}
        onDismiss={handleDismiss}
        onPurchaseCompleted={handlePurchaseCompleted}
      />
    );
  }

  return <>{fallback || null}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalPaywall: {
    flex: 1,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
