import React, { useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getActiveEntitlements } from '../entitlements';
import { usePackages, usePurchase, useRevenueCat, useSubscriptionStatus } from '../index';
import { usePresentPaywall, usePresentPaywallIfNeeded } from '../paywall-hooks';
import { ModalPaywall, Paywall } from '../PaywallComponents';

/**
 * Example 1: Basic subscription check
 */
export const BasicSubscriptionCheck: React.FC = () => {
  const { isSubscribed, hasAnyEntitlement, loading } = useSubscriptionStatus('pro');

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscription Status</Text>
      <Text>Pro Subscription: {isSubscribed ? 'Active' : 'Inactive'}</Text>
      <Text>Has Any Subscription: {hasAnyEntitlement ? 'Yes' : 'No'}</Text>
    </View>
  );
};

/**
 * Example 2: Present paywall modally
 */
export const ModalPaywallExample: React.FC = () => {
  const { presentPaywall, isPresenting } = usePresentPaywall();
  const { isSubscribed } = useSubscriptionStatus('pro');

  const handleShowPaywall = async () => {
    const purchased = await presentPaywall();
    if (purchased) {
      console.log('User purchased successfully!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal Paywall Example</Text>
      <Text>Subscription Status: {isSubscribed ? 'Active' : 'Inactive'}</Text>
      <Button title="Show Paywall" onPress={handleShowPaywall} disabled={isPresenting} />
    </View>
  );
};

/**
 * Example 3: Present paywall only if needed
 */
export const ConditionalPaywallExample: React.FC = () => {
  const { presentPaywallIfNeeded, isPresenting } = usePresentPaywallIfNeeded();

  const handleAccessPremiumFeature = async () => {
    const hasAccess = await presentPaywallIfNeeded('pro');
    if (hasAccess) {
      console.log('User has access to pro features!');
      // Navigate to premium feature
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conditional Paywall</Text>
      <Button
        title="Access Premium Feature"
        onPress={handleAccessPremiumFeature}
        disabled={isPresenting}
      />
    </View>
  );
};

/**
 * Example 4: Inline paywall component
 */
export const InlinePaywallExample: React.FC = () => {
  const [showPaywall, setShowPaywall] = useState(false);
  const { isSubscribed } = useSubscriptionStatus('pro');

  if (isSubscribed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You have Pro access!</Text>
      </View>
    );
  }

  if (showPaywall) {
    return (
      <Paywall
        onDismiss={() => setShowPaywall(false)}
        onPurchaseCompleted={(customerInfo) => {
          console.log('Purchase completed:', customerInfo);
          setShowPaywall(false);
        }}
        onRestoreCompleted={(customerInfo) => {
          console.log('Restore completed:', customerInfo);
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upgrade to Pro</Text>
      <Button title="View Plans" onPress={() => setShowPaywall(true)} />
    </View>
  );
};

/**
 * Example 5: Manual purchase flow
 */
export const ManualPurchaseExample: React.FC = () => {
  const { packages, loading: packagesLoading } = usePackages();
  const { purchase, purchasing, restore, restoring } = usePurchase();
  const { customerInfo } = useRevenueCat();

  const handlePurchasePackage = async (packageIndex: number) => {
    if (packages && packages[packageIndex]) {
      try {
        await purchase(packages[packageIndex]);
        console.log('Purchase successful!');
      } catch (error) {
        console.error('Purchase failed:', error);
      }
    }
  };

  const handleRestore = async () => {
    try {
      const info = await restore();
      console.log('Restore successful:', info);
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  if (packagesLoading) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Available Packages</Text>

      {packages?.map((pkg, index) => (
        <View key={pkg.identifier} style={styles.packageItem}>
          <Text>{pkg.product.title}</Text>
          <Text>{pkg.product.priceString}</Text>
          <Button
            title="Purchase"
            onPress={() => handlePurchasePackage(index)}
            disabled={purchasing}
          />
        </View>
      ))}

      <Button title="Restore Purchases" onPress={handleRestore} disabled={restoring} />

      {customerInfo && (
        <View style={styles.infoSection}>
          <Text style={styles.subtitle}>Active Entitlements:</Text>
          {getActiveEntitlements(customerInfo).map((entitlement) => (
            <Text key={entitlement}>- {entitlement}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

/**
 * Example 6: Full featured subscription screen
 */
export const FullSubscriptionScreen: React.FC = () => {
  const [showModalPaywall, setShowModalPaywall] = useState(false);
  const { customerInfo, loading, logout } = useRevenueCat();
  const { isSubscribed, hasAnyEntitlement } = useSubscriptionStatus('pro');
  const { restore, restoring } = usePurchase();

  const handleLogout = async () => {
    await logout();
    console.log('Logged out from RevenueCat');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Subscription Management</Text>

      {/* Status Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Current Status</Text>
        <Text>Pro Access: {isSubscribed ? '✓' : '✗'}</Text>
        <Text>Any Active Subscription: {hasAnyEntitlement ? '✓' : '✗'}</Text>
        {customerInfo && <Text>User ID: {customerInfo.originalAppUserId}</Text>}
      </View>

      {/* Actions Section */}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Actions</Text>

        {!isSubscribed && (
          <Button title="Upgrade to Pro" onPress={() => setShowModalPaywall(true)} />
        )}

        <Button title="Restore Purchases" onPress={restore} disabled={restoring} />

        <Button title="Logout" onPress={handleLogout} />
      </View>

      {/* Active Entitlements */}
      {customerInfo && hasAnyEntitlement && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Active Entitlements</Text>
          {getActiveEntitlements(customerInfo).map((id) => {
            const entitlement = customerInfo.entitlements.active[id];
            return (
              <View key={id} style={styles.entitlementItem}>
                <Text>• {id}</Text>
                {entitlement.expirationDate && (
                  <Text style={styles.smallText}>
                    Expires: {new Date(entitlement.expirationDate).toLocaleDateString()}
                  </Text>
                )}
                <Text style={styles.smallText}>
                  Will Renew: {entitlement.willRenew ? 'Yes' : 'No'}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Modal Paywall */}
      <ModalPaywall
        visible={showModalPaywall}
        onDismiss={() => setShowModalPaywall(false)}
        onPurchaseCompleted={(info) => {
          console.log('Purchase completed!', info);
          setShowModalPaywall(false);
        }}
        onRestoreCompleted={(info) => {
          console.log('Restore completed!', info);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  packageItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  entitlementItem: {
    marginBottom: 10,
  },
  smallText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 15,
  },
  infoSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
  },
});
