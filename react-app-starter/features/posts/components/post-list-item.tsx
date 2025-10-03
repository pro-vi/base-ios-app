import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Post } from '../types/posts-types';
import { formatSmartDate } from '../utils/posts-utils';
import { getDisplayTitle, getDisplayText, isNewsPost } from '../utils/post-helpers';

interface PostListItemProps {
  post: Post;
  onPress: () => void;
}

export function PostListItem({ post, onPress }: PostListItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const displayTitle = getDisplayTitle(post);
  const displayText = getDisplayText(post);
  const contentPreview = displayText?.replace(/\n/g, ' ').trim() || '';
  const isNews = isNewsPost(post);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.titleRow}>
        {isNews && (
          <Ionicons
            name="newspaper-outline"
            size={16}
            color={colors.tint}
            style={styles.newsIcon}
          />
        )}
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {displayTitle}
        </Text>
      </View>

      <View style={styles.subtitle}>
        <Text style={[styles.date, { color: colors.tabIconDefault }]}>
          {formatSmartDate(post.createdAt)}
        </Text>
        {contentPreview && (
          <>
            <Text style={[styles.dot, { color: colors.tabIconDefault }]}> • </Text>
            <Text style={[styles.preview, { color: colors.tabIconDefault }]} numberOfLines={1}>
              {contentPreview}
            </Text>
          </>
        )}
      </View>

      {post.content.tags && post.content.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.content.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.tint + '20' }]}>
              <Text style={[styles.tagText, { color: colors.tint }]}>{tag}</Text>
            </View>
          ))}
          {post.content.tags.length > 3 && (
            <Text style={[styles.moreText, { color: colors.tabIconDefault }]}>
              +{post.content.tags.length - 3}
            </Text>
          )}
        </View>
      )}

      {post.metadata && (
        <View style={styles.metadataContainer}>
          {post.metadata.sourceScore !== undefined && (
            <View style={styles.metadataItem}>
              <Ionicons name="arrow-up" size={12} color={colors.tabIconDefault} />
              <Text style={[styles.metadataText, { color: colors.tabIconDefault }]}>
                {post.metadata.sourceScore}
              </Text>
            </View>
          )}
          {post.metadata.sourceComments !== undefined && (
            <View style={styles.metadataItem}>
              <Ionicons name="chatbubble-outline" size={12} color={colors.tabIconDefault} />
              <Text style={[styles.metadataText, { color: colors.tabIconDefault }]}>
                {post.metadata.sourceComments}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  newsIcon: {
    marginRight: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  subtitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
  },
  dot: {
    fontSize: 13,
  },
  preview: {
    fontSize: 13,
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 11,
    marginLeft: 4,
  },
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  metadataText: {
    fontSize: 11,
    marginLeft: 3,
  },
});
