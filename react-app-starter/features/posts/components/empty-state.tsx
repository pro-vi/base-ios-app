import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmptyStateProps {
  onCreatePost: () => void;
}

export function EmptyState({ onCreatePost }: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={80} color={colors.tabIconDefault} />
      <Text style={[styles.title, { color: colors.text }]}>No Posts Yet</Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Tap the + button to create your first post
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={onCreatePost}
      >
        <Ionicons name="add-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>Create Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
