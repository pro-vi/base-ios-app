import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function FeaturesInfo() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Features</Text>
      <View style={styles.row}>
        <IconSymbol name="mic.fill" size={16} color={colors.tint} />
        <Text style={[styles.text, { color: colors.tabIconDefault }]}>Native audio generation</Text>
      </View>
      <View style={styles.row}>
        <IconSymbol name="sparkles" size={16} color={colors.tint} />
        <Text style={[styles.text, { color: colors.tabIconDefault }]}>
          Cinematic quality & realism
        </Text>
      </View>
      <View style={styles.row}>
        <IconSymbol name="clock.fill" size={16} color={colors.tint} />
        <Text style={[styles.text, { color: colors.tabIconDefault }]}>
          8-second high-fidelity videos
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
  },
});
