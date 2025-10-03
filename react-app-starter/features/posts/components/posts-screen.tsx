import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Post, PostContent, PostsViewMode } from '../types/posts-types';
import { postsStorage } from '../utils/posts-storage';
import { postsRepository } from '../services/posts-repository';
import { filterPosts, sortPosts } from '../utils/posts-utils';
import { supabaseConfig } from '@/lib/supabase';
import { AddPostModal } from './add-post-modal';
import { EmptyState } from './empty-state';
import { PostFeedCard } from './post-feed-card';
import { PostGridItem } from './post-grid-item';
import { PostListItem } from './post-list-item';
import { SearchBar } from './search-bar';

// const screenWidth = Dimensions.get('window').width;
const spacing = 12;

export function PostsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<PostsViewMode>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newTags, setNewTags] = useState<string>(''); // Tags as comma-separated string
  // const [showViewMenu, setShowViewMenu] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadPosts();
    }, [])
  );

  const loadPosts = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Try to load from Supabase if configured
      if (supabaseConfig.isConfigured) {
        const fetchedPosts = await postsRepository.fetchPosts();
        setPosts(fetchedPosts);

        // Get current user ID
        const userId = await postsRepository.getCurrentUserId();
        setCurrentUserId(userId);
      } else {
        // Fallback to local storage
        const loadedPosts = await postsStorage.load();
        if (loadedPosts.length === 0) {
          const defaultPosts = postsStorage.getDefaultPosts();
          setPosts(defaultPosts);
          await postsStorage.save(defaultPosts);
        } else {
          setPosts(loadedPosts);
        }
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
      setErrorMessage('Failed to load posts');

      // Fallback to local storage on error
      const loadedPosts = await postsStorage.load();
      if (loadedPosts.length === 0) {
        const defaultPosts = postsStorage.getDefaultPosts();
        setPosts(defaultPosts);
      } else {
        setPosts(loadedPosts);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredPosts = () => {
    const filtered = filterPosts(posts, searchText);
    return sortPosts(filtered);
  };

  const addPost = async () => {
    if (!newContent.trim()) {
      Alert.alert('Error', 'Please enter some content for the post');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const tags = newTags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      if (supabaseConfig.isConfigured && currentUserId) {
        // Use Supabase if configured and user is logged in
        await postsRepository.createPost(
          newContent.trim(),
          newTitle.trim() || undefined,
          currentUserId,
          tags.length > 0 ? tags : undefined
        );
        // Reload posts after creating
        await loadPosts();
      } else {
        // Fallback to local storage
        const newPost: Post = {
          id: Date.now().toString(),
          content: {
            type: 'text',
            title: newTitle.trim() || undefined,
            text: newContent.trim(),
            tags: tags.length > 0 ? tags : undefined,
          } as PostContent,
          visibility: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Backward compatibility
          title: newTitle.trim() || undefined,
          contentText: newContent.trim(),
          content_old: newContent.trim(),
          created_at: new Date().toISOString(),
        };

        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        await postsStorage.save(updatedPosts);
      }

      setNewTitle('');
      setNewContent('');
      setNewTags('');
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add post:', error);
      Alert.alert('Error', 'Failed to add post');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostPress = (post: Post) => {
    router.push({
      pathname: '/post-detail',
      params: { id: post.id.toString() },
    });
  };

  const handleViewModePress = () => {
    Alert.alert(
      'View Mode',
      '',
      [
        { text: 'List', onPress: () => setViewMode('list') },
        { text: 'Grid', onPress: () => setViewMode('grid') },
        { text: 'Feed', onPress: () => setViewMode('feed') },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'list':
        return 'list';
      case 'grid':
        return 'grid';
      case 'feed':
        return 'layers-outline';
    }
  };

  const filteredPosts = getFilteredPosts();

  const renderGridPosts = () => {
    const columns: Post[][] = [[], []];
    filteredPosts.forEach((post, index) => {
      columns[index % 2].push(post);
    });

    return (
      <View style={styles.gridContainer}>
        {columns.map((column, columnIndex) => (
          <View key={columnIndex} style={styles.gridColumn}>
            {column.map((post) => (
              <PostGridItem key={post.id} post={post} onPress={() => handlePostPress(post)} />
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Posts</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={28} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleViewModePress}>
            <Ionicons name={getViewModeIcon()} size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />

      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#FF3B30' }]}>{errorMessage}</Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.tint }]}
            onPress={loadPosts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading && posts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.tabIconDefault }]}>
            Loading posts...
          </Text>
        </View>
      ) : filteredPosts.length === 0 && searchText === '' ? (
        <EmptyState onCreatePost={() => setShowAddModal(true)} />
      ) : filteredPosts.length === 0 ? (
        <View style={styles.noResults}>
          <Text style={[styles.noResultsText, { color: colors.tabIconDefault }]}>
            No posts found
          </Text>
        </View>
      ) : viewMode === 'list' ? (
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => (
            <PostListItem post={item} onPress={() => handlePostPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      ) : viewMode === 'grid' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {renderGridPosts()}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={({ item }) => (
            <PostFeedCard post={item} onPress={() => handlePostPress(item)} />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
      )}

      {isLoading && posts.length > 0 && (
        <View style={styles.refreshingIndicator}>
          <ActivityIndicator size="small" color={colors.tint} />
        </View>
      )}

      <AddPostModal
        visible={showAddModal}
        title={newTitle}
        content={newContent}
        onTitleChange={setNewTitle}
        onContentChange={setNewContent}
        onSave={addPost}
        onClose={() => {
          setShowAddModal(false);
          setNewTitle('');
          setNewContent('');
        }}
      />
    </SafeAreaView>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 8,
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing,
    gap: spacing,
  },
  gridColumn: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  refreshingIndicator: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
