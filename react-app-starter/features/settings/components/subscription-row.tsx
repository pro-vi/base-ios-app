import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomerInfo } from 'react-native-purchases';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logger } from '@/lib/logger';
import { isRevenueCatAvailable, getPurchases } from '@/lib/revenuecat/service';
import { usePresentPaywall } from '@/lib/revenuecat/paywall-hooks';

interface SubscriptionRowProps {
  SettingRow: React.ComponentType<any>;
}

export function SubscriptionRow({ SettingRow }: SubscriptionRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const { presentPaywall, isPresenting } = usePresentPaywall();

  // Fetch customer info on mount
  useEffect(() => {
    const fetchCustomerInfo = async () => {
      if (!isRevenueCatAvailable()) {
        logger.info(
          'RevenueCat not available - skipping customer info fetch',
          null,
          'SubscriptionRow'
        );
        setSubscriptionLoading(false);
        return;
      }

      const purchases = getPurchases();
      if (!purchases) {
        setSubscriptionLoading(false);
        return;
      }

      try {
        setSubscriptionLoading(true);
        const info = await purchases.getCustomerInfo();
        setCustomerInfo(info);
        logger.debug(
          'Customer info fetched',
          {
            userId: info.originalAppUserId,
            activeEntitlements: Object.keys(info.entitlements.active),
          },
          'SubscriptionRow'
        );
      } catch (error) {
        logger.error('Failed to fetch customer info', error, 'SubscriptionRow');
      } finally {
        setSubscriptionLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  const hasActiveSubscription = () => {
    if (!customerInfo) return false;
    const activeSubscriptions = Object.keys(customerInfo.entitlements.active);
    return activeSubscriptions.length > 0;
  };

  const getSubscriptionStatus = () => {
    if (subscriptionLoading) return 'Loading...';
    if (!customerInfo) return 'Free';

    const activeSubscriptions = Object.keys(customerInfo.entitlements.active);
    if (activeSubscriptions.length > 0) {
      return 'Premium';
    }
    return 'Free';
  };

  const handleSubscription = async () => {
    if (hasActiveSubscription()) {
      // Show manage subscription alert for existing subscribers
      Alert.alert(
        'Manage Subscription',
        'You can manage your subscription through your device settings.',
        [{ text: 'OK', style: 'default' }]
      );
    } else {
      // Show paywall for non-subscribers
      const purchased = await presentPaywall();
      if (purchased) {
        // Refresh customer info after successful purchase
        try {
          const purchases = getPurchases();
          if (purchases) {
            const info = await purchases.getCustomerInfo();
            setCustomerInfo(info);
            logger.info('Subscription activated', null, 'SubscriptionRow');
          }
        } catch (error) {
          logger.error('Failed to refresh customer info after purchase', error, 'SubscriptionRow');
        }
      }
    }
  };

  return (
    <SettingRow
      icon="card-outline"
      title="Subscription"
      value={!subscriptionLoading && !hasActiveSubscription() ? undefined : getSubscriptionStatus()}
      customRight={
        !subscriptionLoading && !hasActiveSubscription() ? (
          <TouchableOpacity
            style={[styles.subscribeButton, { backgroundColor: colors.tint }]}
            onPress={handleSubscription}
            disabled={isPresenting}
          >
            <Text style={[styles.subscribeButtonText, { color: colors.background }]}>
              {isPresenting ? 'Loading...' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
        ) : subscriptionLoading ? (
          <Text style={[styles.rowValue, { color: colors.tabIconDefault }]}>Loading...</Text>
        ) : (
          <>
            <Text style={[styles.rowValue, { color: colors.tabIconDefault }]}>Premium</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.tabIconDefault + '80'} />
          </>
        )
      }
      onPress={hasActiveSubscription() ? handleSubscription : undefined}
    />
  );
}

const styles = StyleSheet.create({
  subscribeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  subscribeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: 14,
    marginRight: 4,
  },
});
