import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface ResultSectionProps {
  generatedImage: string;
}

export default function ResultSection({ generatedImage }: ResultSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>Generated Image</Text>
      <Image source={{ uri: generatedImage }} style={styles.image} />
      <Text style={[styles.watermark, { color: colors.tabIconDefault }]}>
        Images include SynthID watermark
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  watermark: {
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
});
