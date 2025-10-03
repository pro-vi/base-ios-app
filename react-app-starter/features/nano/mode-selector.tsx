import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type GenerationMode = 'text-to-image' | 'edit-image';

interface ModeSelectorProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: mode === 'text-to-image' ? colors.tint : colors.card },
        ]}
        onPress={() => onModeChange('text-to-image')}
      >
        <Text
          style={[
            styles.text,
            { color: mode === 'text-to-image' ? colors.background : colors.text },
          ]}
        >
          Text to Image
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: mode === 'edit-image' ? colors.tint : colors.card },
        ]}
        onPress={() => onModeChange('edit-image')}
      >
        <Text
          style={[styles.text, { color: mode === 'edit-image' ? colors.background : colors.text }]}
        >
          Edit Image
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
