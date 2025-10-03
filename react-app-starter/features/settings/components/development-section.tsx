import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';

export const DevelopmentSection: React.FC = () => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <ThemedText style={styles.sectionTitle}>DEVELOPMENT</ThemedText>

      <TouchableOpacity
        style={styles.row}
        onPress={() => router.push('/feature-flags')}
        activeOpacity={0.7}
      >
        <View style={styles.left}>
          <IconSymbol name="hammer.fill" size={20} color={Colors.warning} style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Debug Settings</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Feature flags & experimental options
            </Text>
          </View>
        </View>
        <IconSymbol name="chevron.right" size={16} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );
};

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 1,
  },
  subtitle: {
    fontSize: 12,
  },
});
