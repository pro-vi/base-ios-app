import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type GenerationMode = 'text-to-video' | 'image-to-video';

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
          { backgroundColor: mode === 'text-to-video' ? colors.tint : colors.card },
        ]}
        onPress={() => onModeChange('text-to-video')}
      >
        <IconSymbol
          name="text.alignleft"
          size={18}
          color={mode === 'text-to-video' ? colors.background : colors.text}
        />
        <Text
          style={[
            styles.text,
            { color: mode === 'text-to-video' ? colors.background : colors.text },
          ]}
        >
          Text to Video
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: mode === 'image-to-video' ? colors.tint : colors.card },
        ]}
        onPress={() => onModeChange('image-to-video')}
      >
        <IconSymbol
          name="photo"
          size={18}
          color={mode === 'image-to-video' ? colors.background : colors.text}
        />
        <Text
          style={[
            styles.text,
            { color: mode === 'image-to-video' ? colors.background : colors.text },
          ]}
        >
          Image to Video
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
