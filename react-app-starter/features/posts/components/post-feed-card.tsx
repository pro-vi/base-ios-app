import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Post, COLOR_PALETTE } from '../types/posts-types';
import {
  formatSmartDate,
  getColorForPost,
  getCommentsForPost,
  getLikesForPost,
  getPhotoCountForPost,
  getUsernameForPost,
} from '../utils/posts-utils';
import { getDisplayTitle, getDisplayText, isNewsPost } from '../utils/post-helpers';
import { PhotoFullScreen } from './photo-full-screen';

interface PostFeedCardProps {
  post: Post;
  onPress: () => void;
}

const screenWidth = Dimensions.get('window').width;

export function PostFeedCard({ post, onPress }: PostFeedCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  // const [showMenu, setShowMenu] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const username = getUsernameForPost(post.id);
  const avatarColor = getColorForPost(post.id);
  const avatarInitial = username.charAt(0).toUpperCase();
  const likeCount = getLikesForPost(post.id);
  const commentCount = getCommentsForPost(post.id);
  const photoCount = getPhotoCountForPost(post.id);

  const getPhotoColors = () => {
    const colors: string[] = [];
    for (let i = 0; i < photoCount; i++) {
      // Create hash from post ID string and index
      let hash = i;
      for (let j = 0; j < post.id.length; j++) {
        hash = post.id.charCodeAt(j) + ((hash << 5) - hash);
      }
      const colorIndex = Math.abs(hash) % COLOR_PALETTE.length;
      colors.push(COLOR_PALETTE[colorIndex]);
    }
    return colors;
  };

  const handleMenuPress = () => {
    Alert.alert(
      'Post Options',
      '',
      [
        {
          text: 'Report post',
          onPress: () =>
            Alert.alert('Post Reported', "Thank you for your report. We'll review this post."),
        },
        {
          text: 'Report user',
          onPress: () =>
            Alert.alert(
              'User Reported',
              "Thank you for your report. We'll review this user's account."
            ),
        },
        {
          text: 'Block user',
          onPress: () =>
            Alert.alert('User Blocked', `You won't see posts from @${username} anymore.`),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const photoColors = getPhotoColors();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: avatarColor + 'CC' }]}>
            <Text style={styles.avatarText}>{avatarInitial}</Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
            <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
              {formatSmartDate(post.createdAt)}
            </Text>
          </View>

          <TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {isNewsPost(post) && (
            <View style={styles.newsIndicator}>
              <Ionicons name="newspaper-outline" size={14} color={colors.tint} />
              <Text style={[styles.newsLabel, { color: colors.tint }]}>News</Text>
            </View>
          )}
          <Text style={[styles.title, { color: colors.text }]}>{getDisplayTitle(post)}</Text>
          {getDisplayText(post) && (
            <Text style={[styles.body, { color: colors.text }]} numberOfLines={3}>
              {getDisplayText(post)}
            </Text>
          )}
          {post.content.tags && post.content.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {post.content.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: colors.tint + '20' }]}>
                  <Text style={[styles.tagText, { color: colors.tint }]}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {photoCount > 0 && (
          <View style={styles.photoGrid}>
            {photoCount === 1 ? (
              <TouchableOpacity onPress={() => setSelectedPhotoIndex(0)} activeOpacity={0.9}>
                <View style={[styles.singlePhoto, { backgroundColor: photoColors[0] + '30' }]} />
              </TouchableOpacity>
            ) : (
              <View style={styles.multiPhotoGrid}>
                {photoColors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPhotoIndex(index)}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.gridPhoto, { backgroundColor: color + '30' }]} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.actions}>
          <View style={styles.actionGroup}>
            <Ionicons name="heart-outline" size={20} color={colors.tabIconDefault} />
            <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>{likeCount}</Text>
          </View>

          <View style={styles.actionGroup}>
            <Ionicons name="chatbubble-outline" size={18} color={colors.tabIconDefault} />
            <Text style={[styles.actionText, { color: colors.tabIconDefault }]}>
              {commentCount}
            </Text>
          </View>

          <View style={styles.spacer} />

          <TouchableOpacity>
            <Ionicons name="share-outline" size={20} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {selectedPhotoIndex !== null && (
        <PhotoFullScreen
          visible={true}
          color={photoColors[selectedPhotoIndex]}
          onClose={() => setSelectedPhotoIndex(null)}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    marginBottom: 12,
    gap: 8,
  },
  newsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  newsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  photoGrid: {
    marginBottom: 12,
  },
  singlePhoto: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  multiPhotoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridPhoto: {
    width: (screenWidth - 36) / 3,
    height: (screenWidth - 36) / 3,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
});
