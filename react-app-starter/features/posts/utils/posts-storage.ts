import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, PostContent, POSTS_STORAGE_KEY } from '../types/posts-types';

export const postsStorage = {
  async save(posts: Post[]): Promise<void> {
    try {
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
      console.error('Failed to save posts:', error);
      throw error;
    }
  },

  async load(): Promise<Post[]> {
    try {
      const storedPosts = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
      if (storedPosts) {
        return JSON.parse(storedPosts);
      }
      return [];
    } catch (error) {
      console.error('Failed to load posts:', error);
      return [];
    }
  },

  getDefaultPosts(): Post[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 86400000);
    const twoDaysAgo = new Date(now.getTime() - 172800000);

    return [
      {
        id: '1',
        content: {
          type: 'text',
          title: 'Welcome to Posts',
          text: 'This is where you can share your thoughts, ideas, and experiences with the community.',
          tags: ['welcome', 'community'],
        } as PostContent,
        visibility: 1,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        // Backward compatibility
        title: 'Welcome to Posts',
        contentText:
          'This is where you can share your thoughts, ideas, and experiences with the community.',
        content_old:
          'This is where you can share your thoughts, ideas, and experiences with the community.',
        created_at: now.toISOString(),
      },
      {
        id: '2',
        content: {
          type: 'text',
          title: 'Building a React Native App',
          text: 'Just started working on a new React Native app. Excited to see where this project goes! The setup process has been much smoother than I expected.',
          tags: ['react-native', 'development'],
        } as PostContent,
        visibility: 1,
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString(),
        // Backward compatibility
        title: 'Building a React Native App',
        contentText:
          'Just started working on a new React Native app. Excited to see where this project goes! The setup process has been much smoother than I expected.',
        content_old:
          'Just started working on a new React Native app. Excited to see where this project goes! The setup process has been much smoother than I expected.',
        created_at: yesterday.toISOString(),
      },
      {
        id: '3',
        content: {
          type: 'text',
          title: 'Coffee Break Thoughts',
          text: 'Sometimes the best ideas come during a coffee break. What do you think about when you step away from the screen?',
        } as PostContent,
        visibility: 1,
        createdAt: twoDaysAgo.toISOString(),
        updatedAt: twoDaysAgo.toISOString(),
        // Backward compatibility
        title: 'Coffee Break Thoughts',
        contentText:
          'Sometimes the best ideas come during a coffee break. What do you think about when you step away from the screen?',
        content_old:
          'Sometimes the best ideas come during a coffee break. What do you think about when you step away from the screen?',
        created_at: twoDaysAgo.toISOString(),
      },
      {
        id: '4',
        content: {
          type: 'text',
          text: 'Quick tip: Use TypeScript for better code quality and developer experience.',
          tags: ['tips', 'typescript'],
        } as PostContent,
        visibility: 1,
        createdAt: new Date(now.getTime() - 259200000).toISOString(),
        updatedAt: new Date(now.getTime() - 259200000).toISOString(),
        // Backward compatibility
        title: undefined,
        contentText: 'Quick tip: Use TypeScript for better code quality and developer experience.',
        content_old: 'Quick tip: Use TypeScript for better code quality and developer experience.',
        created_at: new Date(now.getTime() - 259200000).toISOString(),
      },
      {
        id: '5',
        content: {
          type: 'news',
          title: 'Weekend Project',
          text: 'Working on a side project this weekend. Building a task management app with drag and drop functionality.',
          sourceUrl: 'https://example.com/article',
          tags: ['news', 'project'],
        } as PostContent,
        visibility: 1,
        metadata: {
          source: 'hackernews',
          sourceScore: 125,
          sourceComments: 42,
        },
        createdAt: new Date(now.getTime() - 345600000).toISOString(),
        updatedAt: new Date(now.getTime() - 345600000).toISOString(),
        // Backward compatibility
        title: 'Weekend Project',
        contentText:
          'Working on a side project this weekend. Building a task management app with drag and drop functionality.',
        content_old:
          'Working on a side project this weekend. Building a task management app with drag and drop functionality.',
        created_at: new Date(now.getTime() - 345600000).toISOString(),
      },
    ];
  },
};
