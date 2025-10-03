import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NanoHeaderProps {
  mode: 'text-to-image' | 'edit-image';
  onModeToggle: () => void;
  onApiKeyPress?: () => void;
}

export default function NanoHeader({ mode, onModeToggle, onApiKeyPress }: NanoHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: colors.text }]}>Nano Banana</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          AI Image Generation with Gemini
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        {onApiKeyPress && (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.card }]}
            onPress={onApiKeyPress}
          >
            <IconSymbol name="key.fill" size={20} color={colors.tint} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.card }]}
          onPress={onModeToggle}
        >
          <IconSymbol
            name={mode === 'text-to-image' ? 'sparkles' : 'photo'}
            size={20}
            color={colors.tint}
          />
        </TouchableOpacity>
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
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 10,
    borderRadius: 20,
  },
});
