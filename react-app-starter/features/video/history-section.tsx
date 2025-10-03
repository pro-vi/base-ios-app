import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface VideoGeneration {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnail?: string;
  createdAt: Date;
}

interface HistorySectionProps {
  history: VideoGeneration[];
  onHistorySelect: (item: VideoGeneration) => void;
}

export default function HistorySection({ history, onHistorySelect }: HistorySectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Videos</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {history.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => onHistorySelect(item)}
          >
            <View style={styles.thumbnail}>
              {item.thumbnail ? (
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
              ) : (
                <IconSymbol name="play.rectangle.fill" size={40} color={colors.tabIconDefault} />
              )}
            </View>
            <Text style={[styles.prompt, { color: colors.tabIconDefault }]} numberOfLines={2}>
              {item.prompt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    width: 150,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
  },
  thumbnail: {
    width: '100%',
    height: 84,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  prompt: {
    fontSize: 11,
    lineHeight: 14,
  },
});
