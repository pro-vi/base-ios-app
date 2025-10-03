import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logger } from '@/lib/logger';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { CustomerInfo } from 'react-native-purchases';
import { getPurchases, isRevenueCatAvailable } from '@/lib/revenuecat/service';

interface SubscriptionSectionProps {
  customerInfo: CustomerInfo | null;
  subscriptionLoading: boolean;
  onCustomerInfoUpdate: (info: CustomerInfo) => void;
}

export function SubscriptionSection({
  customerInfo,
  subscriptionLoading,
  onCustomerInfoUpdate,
}: SubscriptionSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isPresenting, setIsPresenting] = useState(false);

  // Check subscription status
  const isSubscribed = React.useMemo(() => {
    if (!customerInfo) return false;
    const entitlementId = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID;
    return entitlementId
      ? customerInfo.entitlements.active[entitlementId]?.isActive === true
      : false;
  }, [customerInfo]);

  const handleUpgrade = async () => {
    logger.info('Upgrade button pressed', null, 'Settings');

    // Check if RevenueCat is available
    if (!isRevenueCatAvailable()) {
      Alert.alert(
        'Not Available',
        'Subscriptions are not available in Expo Go. Please build a development version to test subscriptions.',
        [{ text: 'OK' }]
      );
      return;
    }

    const purchases = getPurchases();
    if (!purchases) {
      Alert.alert('Error', 'Subscription service is not available.');
      return;
    }

    setIsPresenting(true);

    try {
      // Dynamically import RevenueCatUI only when needed
      let RevenueCatUI: any;
      let PAYWALL_RESULT: any;

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const module = require('react-native-purchases-ui');
        RevenueCatUI = module.default;
        PAYWALL_RESULT = module.PAYWALL_RESULT;
      } catch {
        Alert.alert('Error', 'Subscription UI is not available.');
        return;
      }

      // First check if we have offerings
      const offerings = await purchases.getOfferings();
      if (!offerings.current) {
        logger.warn('No current offering available', null, 'Settings');
        Alert.alert(
          'Configuration Issue',
          'No subscription offerings available. This usually means:\n\n' +
            '• Products need to be approved in App Store Connect\n' +
            '• RevenueCat offerings need to be configured\n\n' +
            'Check the logs for more details.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Present the paywall
      const result = await RevenueCatUI.presentPaywall();
      logger.info('Paywall result', { result }, 'Settings');

      if (result === PAYWALL_RESULT.PURCHASED || result === PAYWALL_RESULT.RESTORED) {
        // Refresh customer info
        const newInfo = await purchases.getCustomerInfo();
        onCustomerInfoUpdate(newInfo);
        Alert.alert('Success', 'Thank you for your purchase!');
      }
    } catch (error: any) {
      logger.error('Error with paywall', error, 'Settings');
      Alert.alert(
        'Error',
        error.message || 'Unable to show upgrade options. Please try again later.'
      );
    } finally {
      setIsPresenting(false);
    }
  };

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <ThemedText style={styles.sectionTitle}>Subscription</ThemedText>

      {subscriptionLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Status</ThemedText>
            <View style={styles.statusContainer}>
              {isSubscribed ? (
                <>
                  <View style={[styles.proBadge, { backgroundColor: colors.tint }]}>
                    <ThemedText style={styles.proBadgeText}>PRO</ThemedText>
                  </View>
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.tint} />
                </>
              ) : (
                <ThemedText style={[styles.value, { color: colors.text + '80' }]}>
                  Free Plan
                </ThemedText>
              )}
            </View>
          </View>

          {!isSubscribed && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: colors.tint }]}
                onPress={handleUpgrade}
                disabled={isPresenting}
              >
                {isPresenting ? (
                  <ActivityIndicator color={colors.background} />
                ) : (
                  <>
                    <IconSymbol name="crown.fill" size={20} color={colors.background} />
                    <ThemedText style={[styles.upgradeButtonText, { color: colors.background }]}>
                      Upgrade to Pro
                    </ThemedText>
                  </>
                )}
              </TouchableOpacity>
              <ThemedText style={styles.upgradeDescription}>
                Unlock premium features and support development
              </ThemedText>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    opacity: 0.7,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#00000010',
    marginHorizontal: -16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  upgradeDescription: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.6,
  },
});
