import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post } from '../types/posts-types';
import { formatSmartDate, getColorForPost, getHeightForPost } from '../utils/posts-utils';
import { getDisplayTitle } from '../utils/post-helpers';

interface PostGridItemProps {
  post: Post;
  onPress: () => void;
}

const screenWidth = Dimensions.get('window').width;
const spacing = 12;
const itemWidth = (screenWidth - spacing * 3) / 2;

export function PostGridItem({ post, onPress }: PostGridItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cardColor = getColorForPost(post.id);
  const cardHeight = getHeightForPost(post.id);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.container, { width: itemWidth }]}>
        <View
          style={[
            styles.colorCard,
            {
              backgroundColor: cardColor + '30',
              height: cardHeight,
            },
          ]}
        />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {getDisplayTitle(post)}
          </Text>
          <Text style={[styles.date, { color: colors.tabIconDefault }]}>
            {formatSmartDate(post.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing,
  },
  colorCard: {
    borderRadius: 12,
    marginBottom: 8,
  },
  content: {
    paddingHorizontal: 4,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
  },
});
