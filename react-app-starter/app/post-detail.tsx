import { Colors } from '@/constants/theme';
import { Post } from '@/features/posts';
import { postsStorage } from '@/features/posts/utils/posts-storage';
import { postsRepository } from '@/features/posts/services/posts-repository';
import { formatSmartDate } from '@/features/posts/utils/posts-utils';
import { getDisplayTitle, getDisplayText, isNewsPost } from '@/features/posts/utils/post-helpers';
import { supabaseConfig } from '@/lib/supabase';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebViewSheet } from '@/components/WebViewSheet';

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [webViewTitle, setWebViewTitle] = useState<string>('');

  useEffect(() => {
    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadPost = async () => {
    try {
      let posts: Post[];

      if (supabaseConfig.isConfigured) {
        posts = await postsRepository.fetchPosts();
      } else {
        posts = await postsStorage.load();
      }

      const foundPost = posts.find((p) => p.id.toString() === id);
      if (foundPost) {
        // Debug logging
        console.log('=== PostDetailView Debug ===');
        console.log('Post ID:', foundPost.id);
        console.log('Title:', foundPost.content.title || 'nil');
        console.log('Source URL:', foundPost.content.sourceUrl || 'nil');
        console.log('Discussion URL:', foundPost.metadata?.discussionUrl || 'nil');
        console.log('Source Comments:', foundPost.metadata?.sourceComments || 0);
        console.log('Source Score:', foundPost.metadata?.sourceScore || 0);
        console.log('Metadata exists:', foundPost.metadata !== undefined);
        console.log('Content type:', foundPost.content.type);
        console.log('Tags:', foundPost.content.tags?.join(', ') || 'none');
        console.log('===========================');

        setPost(foundPost);
        setEditedTitle(foundPost.content.title || '');
        setEditedContent(foundPost.content.text || '');
      } else {
        setPost(null);
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      // Fallback to local storage
      const posts = await postsStorage.load();
      const foundPost = posts.find((p) => p.id.toString() === id);
      setPost(foundPost || null);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            if (supabaseConfig.isConfigured && post) {
              await postsRepository.deletePost(post.id);
            } else {
              const posts = await postsStorage.load();
              const updatedPosts = posts.filter((p) => p.id.toString() !== id);
              await postsStorage.save(updatedPosts);
            }
            router.back();
          } catch (error) {
            console.error('Failed to delete post:', error);
            Alert.alert('Error', 'Failed to delete post');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const handleSave = async () => {
    if (!post) return;

    setIsSaving(true);
    try {
      if (supabaseConfig.isConfigured) {
        await postsRepository.updatePost(post.id, editedContent, editedTitle || undefined);
      } else {
        // Update in local storage
        const posts = await postsStorage.load();
        const updatedPosts = posts.map((p) => {
          if (p.id.toString() === id) {
            return {
              ...p,
              content: {
                ...p.content,
                title: editedTitle || undefined,
                text: editedContent,
              },
              updatedAt: new Date().toISOString(),
              // Backward compatibility
              title: editedTitle || undefined,
              contentText: editedContent,
              content_old: editedContent,
            };
          }
          return p;
        });
        await postsStorage.save(updatedPosts);
      }

      setIsEditing(false);
      await loadPost(); // Reload to get updated data
    } catch (error) {
      console.error('Failed to update post:', error);
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (post) {
      setEditedTitle(post.content.title || '');
      setEditedContent(post.content.text || '');
    }
    setIsEditing(false);
  };

  const openWebView = (url: string, title: string) => {
    setWebViewUrl(url);
    setWebViewTitle(title);
  };

  const closeWebView = () => {
    setWebViewUrl(null);
    setWebViewTitle('');
  };

  if (!post) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.errorText, { color: colors.text }]}>Post not found</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.tint} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>

          {isEditing ? (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
                <Text style={[styles.headerButtonText, { color: colors.tint }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                style={styles.headerButton}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.tint} />
                ) : (
                  <Text
                    style={[styles.headerButtonText, { color: colors.tint, fontWeight: '600' }]}
                  >
                    Save
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerButton}>
                <Ionicons name="pencil" size={20} color={colors.tint} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.headerButton}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isEditing ? (
            <View>
              <TextInput
                style={[styles.titleInput, { color: colors.text, borderColor: colors.border }]}
                placeholder="Title (optional)"
                placeholderTextColor={colors.tabIconDefault}
                value={editedTitle}
                onChangeText={setEditedTitle}
                multiline
              />
              <TextInput
                style={[styles.contentInput, { color: colors.text, borderColor: colors.border }]}
                placeholder="Content"
                placeholderTextColor={colors.tabIconDefault}
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View>
              <Text style={[styles.title, { color: colors.text }]}>{getDisplayTitle(post)}</Text>

              <Text style={[styles.date, { color: colors.tabIconDefault }]}>
                {formatSmartDate(post.createdAt)}
              </Text>

              {getDisplayText(post) && (
                <Text style={[styles.body, { color: colors.text }]}>{getDisplayText(post)}</Text>
              )}

              {isNewsPost(post) && (
                <View style={styles.newsLinksContainer}>
                  {post.content.sourceUrl && (
                    <TouchableOpacity
                      style={[styles.linkButton, { backgroundColor: colors.tint + '10' }]}
                      onPress={() => openWebView(post.content.sourceUrl!, 'Article')}
                    >
                      <Ionicons name="newspaper-outline" size={16} color={colors.tint} />
                      <Text style={[styles.linkText, { color: colors.tint }]}>View Article</Text>
                      <Ionicons name="open-outline" size={16} color={colors.tint} />
                    </TouchableOpacity>
                  )}

                  {post.metadata?.discussionUrl && (
                    <TouchableOpacity
                      style={[styles.linkButton, { backgroundColor: '#FF6600' + '10' }]}
                      onPress={() => openWebView(post.metadata.discussionUrl!, 'Discussion')}
                    >
                      <Ionicons name="chatbubbles-outline" size={16} color="#FF6600" />
                      <Text style={[styles.linkText, { color: '#FF6600' }]}>View Discussion</Text>
                      {post.metadata.sourceComments && (
                        <Text style={[styles.linkCount, { color: '#FF6600' }]}>
                          ({post.metadata.sourceComments})
                        </Text>
                      )}
                      <Ionicons name="open-outline" size={16} color="#FF6600" />
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {post.content.tags && post.content.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {post.content.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.tint + '20' }]}>
                      <Text style={[styles.tagText, { color: colors.tint }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {post.metadata && (
                <View style={styles.metadataContainer}>
                  {post.metadata.sourceScore !== undefined && (
                    <View style={styles.metadataItem}>
                      <Ionicons name="arrow-up" size={14} color={colors.tabIconDefault} />
                      <Text style={[styles.metadataText, { color: colors.tabIconDefault }]}>
                        {post.metadata.sourceScore} points
                      </Text>
                    </View>
                  )}
                  {post.metadata.sourceAuthor && (
                    <View style={styles.metadataItem}>
                      <Ionicons name="person-outline" size={14} color={colors.tabIconDefault} />
                      <Text style={[styles.metadataText, { color: colors.tabIconDefault }]}>
                        {post.metadata.sourceAuthor}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {webViewUrl && (
          <WebViewSheet
            visible={true}
            url={webViewUrl}
            title={webViewTitle}
            onClose={closeWebView}
          />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    fontSize: 17,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    lineHeight: 36,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 200,
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  newsLinksContainer: {
    marginTop: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    gap: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  linkCount: {
    fontSize: 14,
    marginRight: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  metadataContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
