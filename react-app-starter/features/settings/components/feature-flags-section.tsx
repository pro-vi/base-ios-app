import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useFeatureFlags } from '../contexts/feature-flags-context';

export const FeatureFlagsSection: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { flags, toggleFlag, resetFlags } = useFeatureFlags();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    Alert.alert(
      'Reset Feature Flags',
      'This will reset all feature flags to their default values. App will need to be restarted for tab changes to take effect.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetFlags();
            Alert.alert('Success', 'Feature flags have been reset. Please restart the app.');
          },
        },
      ]
    );
  };

  const flagEntries = Object.entries(flags) as [keyof typeof flags, boolean][];
  const tabFlags = flagEntries.filter(([key]) => key.startsWith('SHOW_') && key.endsWith('_TAB'));
  const otherFlags = flagEntries.filter(
    ([key]) => !key.startsWith('SHOW_') || !key.endsWith('_TAB')
  );

  const formatFlagName = (key: string): string => {
    return key
      .replace('SHOW_', '')
      .replace(/_TAB$/, '')
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          <IconSymbol name="hammer.fill" size={20} color={Colors.warning} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>Development</Text>
        </View>
        <IconSymbol
          name={isExpanded ? 'chevron.up' : 'chevron.down'}
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {isExpanded && (
        <>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              Tab Visibility
            </Text>
            {tabFlags.map(([key, value]) => (
              <View key={key} style={styles.flagRow}>
                <Text style={[styles.flagLabel, { color: colors.text }]}>
                  {formatFlagName(key)} Tab
                </Text>
                <Switch
                  value={value}
                  onValueChange={() => toggleFlag(key)}
                  trackColor={{ false: colors.border, true: Colors.primary + '60' }}
                  thumbColor={value ? Colors.primary : colors.textTertiary}
                />
              </View>
            ))}
          </View>

          {otherFlags.length > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                  Other Features
                </Text>
                {otherFlags.map(([key, value]) => (
                  <View key={key} style={styles.flagRow}>
                    <Text style={[styles.flagLabel, { color: colors.text }]}>
                      {formatFlagName(key)}
                    </Text>
                    <Switch
                      value={value}
                      onValueChange={() => toggleFlag(key)}
                      trackColor={{ false: colors.border, true: Colors.primary + '60' }}
                      thumbColor={value ? Colors.primary : colors.textTertiary}
                    />
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <TouchableOpacity
            style={[styles.resetButton, { borderColor: Colors.error }]}
            onPress={handleReset}
          >
            <Text style={[styles.resetButtonText, { color: Colors.error }]}>Reset All Flags</Text>
          </TouchableOpacity>

          <Text style={[styles.note, { color: colors.textTertiary }]}>
            Note: Changes to tab visibility require app restart
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  flagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  flagLabel: {
    fontSize: 15,
    flex: 1,
  },
  resetButton: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
