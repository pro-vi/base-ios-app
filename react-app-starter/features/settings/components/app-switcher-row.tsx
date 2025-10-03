import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMiniApp } from '@/lib/apps/app-provider';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SettingRowProps {
  icon: string;
  title: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  customRight?: React.ReactNode;
}

interface AppSwitcherRowProps {
  SettingRow: React.ComponentType<SettingRowProps>;
}

export function AppSwitcherRow({ SettingRow }: AppSwitcherRowProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { activeApp, switchApp } = useMiniApp();

  return (
    <>
      {/* App Mode Header - shows current active app */}
      <SettingRow
        icon="apps"
        title="App Mode"
        value={activeApp?.name}
        customRight={
          <View style={styles.appBadge}>
            <Text style={[styles.activeAppText, { color: colors.tint }]}>{activeApp?.name}</Text>
          </View>
        }
      />

      {/* Foundation App Option */}
      <SettingRow
        icon="home"
        title="Foundation"
        value={activeApp?.id === 'foundation' ? 'Active' : ''}
        onPress={() => switchApp('foundation')}
        customRight={
          activeApp?.id === 'foundation' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
          )
        }
      />

      {/* Creative Suite Option */}
      <SettingRow
        icon="color-palette"
        title="Creative Suite"
        value={activeApp?.id === 'creative' ? 'Active' : ''}
        onPress={() => switchApp('creative')}
        customRight={
          activeApp?.id === 'creative' && (
            <Ionicons name="checkmark-circle" size={20} color={colors.tint} />
          )
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  appBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeAppText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
