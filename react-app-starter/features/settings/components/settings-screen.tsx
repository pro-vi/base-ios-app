import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthState, useAppState } from '@/lib/AppStateManager';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionRow } from './subscription-row';
import { ThemePickerModal } from './theme-picker-modal';

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (!title) return null;

  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionHeaderText, { color: colors.text }]}>{title.toUpperCase()}</Text>
    </View>
  );
}

interface SettingRowProps {
  icon: string;
  iconColor?: string;
  title: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  customRight?: React.ReactNode;
}

function SettingRow({
  icon,
  iconColor,
  title,
  value,
  onPress,
  showChevron = false,
  customRight,
}: SettingRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const content = (
    <>
      <View style={styles.rowLeft}>
        <View style={styles.rowIconContainer}>
          <Ionicons name={icon as any} size={16} color={iconColor || colors.text} />
        </View>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.rowRight}>
        {customRight ? (
          customRight
        ) : (
          <>
            {value && (
              <Text style={[styles.rowValue, { color: colors.tabIconDefault }]}>{value}</Text>
            )}
            {showChevron && (
              <Ionicons name="chevron-forward" size={12} color={colors.tabIconDefault + '80'} />
            )}
          </>
        )}
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.card }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.row, { backgroundColor: colors.card }]}>{content}</View>;
}

export function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { themeMode, setThemeMode } = useTheme();
  const { user, signOut, deleteAccount } = useAuth();
  const { authState, exitGuestMode } = useAppState();
  const [loading, setLoading] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            const { error } = await deleteAccount();
            setLoading(false);

            if (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            } else {
              router.replace('/(auth)/welcome');
            }
          },
        },
      ]
    );
  };

  const handleThemeChange = () => {
    setShowThemePicker(true);
  };

  const handleHelp = () => {
    Alert.alert('Help Center', 'Help documentation coming soon');
  };

  const handleTerms = () => {
    Alert.alert('Terms of Use', 'Terms of Use will be available soon');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'Privacy Policy will be available soon');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getThemeDisplayName = () => {
    switch (themeMode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
      default:
        return 'System';
    }
  };

  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const buildNumber =
    Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || '1';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Account Section */}
        <SectionHeader title="Account" />
        <View style={styles.section}>
          {authState === AuthState.guest ? (
            <SettingRow
              icon="person-circle-outline"
              title="Guest Mode"
              customRight={
                <TouchableOpacity
                  style={[styles.signInButton, { backgroundColor: colors.tint }]}
                  onPress={() => {
                    exitGuestMode();
                    router.replace('/(auth)/welcome');
                  }}
                >
                  <Text style={[styles.signInButtonText, { color: colors.background }]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <>
              <SettingRow
                icon="mail-outline"
                title="Email"
                value={user?.email || 'Not available'}
              />
              <SettingRow
                icon="calendar-outline"
                title="Member Since"
                value={formatDate(user?.created_at)}
              />
            </>
          )}
          {/* Subscription Row - Comment out or remove this line to disable subscriptions */}
          <SubscriptionRow SettingRow={SettingRow} />
        </View>

        {/* App Section */}
        <SectionHeader title="App" />
        <View style={styles.section}>
          <SettingRow
            icon="sunny-outline"
            title="Theme"
            value={getThemeDisplayName()}
            onPress={handleThemeChange}
            showChevron
          />
        </View>

        {/* Development Section (Debug only) */}
        {__DEV__ && (
          <>
            <SectionHeader title="Development" />
            <View style={styles.section}>
              <SettingRow
                icon="hammer-outline"
                title="Developer"
                onPress={() => router.push('/debug-settings')}
                showChevron
              />
              <SettingRow
                icon="document-text-outline"
                title="App Templates"
                onPress={() => Alert.alert('App Templates', 'Templates coming soon')}
                showChevron
              />
            </View>
          </>
        )}

        {/* About Section */}
        <SectionHeader title="About" />
        <View style={styles.section}>
          <SettingRow
            icon="help-circle-outline"
            title="Help Center"
            onPress={handleHelp}
            showChevron
          />
          <SettingRow
            icon="document-text-outline"
            title="Terms of Use"
            onPress={handleTerms}
            showChevron
          />
          <SettingRow
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={handlePrivacy}
            showChevron
          />
          <SettingRow
            icon="information-circle-outline"
            title="Version"
            value={`${appVersion} (${buildNumber})`}
          />
        </View>

        {/* Actions Section - No header, just at the bottom */}
        {authState !== AuthState.guest && (
          <View style={[styles.section, styles.actionsSection]}>
            <SettingRow
              icon="log-out-outline"
              iconColor={colors.tabIconDefault}
              title="Sign Out"
              onPress={handleSignOut}
            />
            <SettingRow
              icon="trash-outline"
              iconColor={colors.tabIconDefault}
              title="Delete Account"
              onPress={handleDeleteAccount}
            />
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: colors.background + 'CC' }]}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      )}

      <ThemePickerModal
        visible={showThemePicker}
        currentTheme={themeMode}
        onSelectTheme={setThemeMode}
        onClose={() => setShowThemePicker(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionsSection: {
    marginTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 16,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    marginRight: 4,
  },
  bottomPadding: {
    height: 40,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  signInButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
