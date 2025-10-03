import { Post, COLOR_PALETTE } from '../types/posts-types';
import { getDisplayTitle, getDisplayText } from './post-helpers';

export function filterPosts(posts: Post[], searchText: string): Post[] {
  if (!searchText.trim()) {
    return posts;
  }

  const lowerSearch = searchText.toLowerCase();
  return posts.filter((post) => {
    const titleMatch = getDisplayTitle(post).toLowerCase().includes(lowerSearch);
    const textMatch = getDisplayText(post)?.toLowerCase().includes(lowerSearch) || false;
    const tagMatch =
      post.content.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch)) || false;
    return titleMatch || textMatch || tagMatch;
  });
}

export function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function formatSmartDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    return `${diffInMinutes}m`;
  }

  if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours}h`;
  }

  if (diffInDays < 1 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  if (diffInDays < 2 && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }

  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
  });
}

export function getColorForPost(postId: string): string {
  // Use the string's hash code for consistent color assignment
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTE.length;
  return COLOR_PALETTE[index];
}

export function getHeightForPost(postId: string): number {
  const heights = [150, 180, 200, 220, 250];
  // Use the string's hash code
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % heights.length;
  return heights[index];
}

export function getUsernameForPost(postId: string): string {
  const names = ['john_doe', 'sarah_smith', 'mike_wilson', 'emma_davis', 'alex_chen', 'lisa_jones'];
  // Use the string's hash code
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % names.length;
  return names[index];
}

export function getLikesForPost(postId: string): number {
  // Use the string's hash code
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 500) + 10;
}

export function getCommentsForPost(postId: string): number {
  // Use the string's hash code
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 50) + 1;
}

export function getPhotoCountForPost(postId: string): number {
  // Use the string's hash code
  let hash = 0;
  for (let i = 0; i < postId.length; i++) {
    hash = postId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 6);
}
