import { Post } from '../types/posts-types';

// Helper functions for Post model
export const getDisplayTitle = (post: Post): string => {
  if (post.content.title && post.content.title.length > 0) {
    return post.content.title;
  }
  if (post.content.text) {
    return post.content.text.substring(0, 50).trim();
  }
  return 'Untitled';
};

export const getDisplayText = (post: Post): string | undefined => {
  return post.content.text;
};

export const isPublic = (post: Post): boolean => {
  return post.visibility === 1;
};

export const isNewsPost = (post: Post): boolean => {
  return post.content.type === 'news';
};

// Sort posts by creation date (newest first)
export const sortPostsByDate = (posts: Post[]): Post[] => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
};

// Filter posts by search text
export const filterPostsBySearch = (posts: Post[], searchText: string): Post[] => {
  if (!searchText || searchText.trim() === '') {
    return posts;
  }

  const searchLower = searchText.toLowerCase();
  return posts.filter((post) => {
    const titleMatch = post.content.title?.toLowerCase().includes(searchLower) || false;
    const textMatch = post.content.text?.toLowerCase().includes(searchLower) || false;
    const tagMatch =
      post.content.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) || false;
    return titleMatch || textMatch || tagMatch;
  });
};

// Get posts by type
export const getPublicPosts = (posts: Post[]): Post[] => {
  return posts.filter((post) => isPublic(post));
};

export const getNewsPosts = (posts: Post[]): Post[] => {
  return posts.filter((post) => isNewsPost(post));
};

// Get comments for a post
export const getComments = (posts: Post[], postId: string): Post[] => {
  return posts
    .filter((post) => post.parentId === postId)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB; // Comments sorted oldest first
    });
};
