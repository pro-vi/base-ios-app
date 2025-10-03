import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoHeaderProps {
  onApiKeyPress?: () => void;
}

export default function VideoHeader({ onApiKeyPress }: VideoHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>AI Videos</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Powered by Google Veo 3
        </Text>
      </View>
      <View style={styles.rightContainer}>
        {onApiKeyPress && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onApiKeyPress}
          >
            <IconSymbol name="key.fill" size={20} color={colors.tint} />
          </TouchableOpacity>
        )}
        <View style={styles.headerBadge}>
          <Text
            style={[
              styles.badgeText,
              { color: colors.tabIconDefault, backgroundColor: colors.card },
            ]}
          >
            8 sec
          </Text>
          <Text
            style={[
              styles.badgeText,
              { color: colors.tabIconDefault, backgroundColor: colors.card },
            ]}
          >
            1080p
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
  },
  headerBadge: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
