import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HistoryItem {
  prompt: string;
  image: string;
}

interface HistorySectionProps {
  history: HistoryItem[];
  onHistorySelect: (item: HistoryItem) => void;
}

export default function HistorySection({ history, onHistorySelect }: HistorySectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (history.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Recent Creations</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {history.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.item, { backgroundColor: colors.card }]}
            onPress={() => onHistorySelect(item)}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
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
    marginBottom: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  item: {
    width: 120,
    marginRight: 12,
    borderRadius: 12,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  prompt: {
    fontSize: 11,
    lineHeight: 14,
  },
});
