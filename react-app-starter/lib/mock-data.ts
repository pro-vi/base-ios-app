export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
  liked: boolean;
  comments: number;
  image?: string;
}

export interface Activity {
  id: string;
  type: 'login' | 'post' | 'like' | 'comment' | 'follow';
  description: string;
  timestamp: Date;
  icon: string;
}

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    lastMessage: 'Hey! How are you doing today?',
    timestamp: new Date(2024, 0, 15, 14, 30),
    unread: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Nice! I love how easy Expo makes mobile development.',
    timestamp: new Date(2024, 0, 15, 12, 45),
    unread: 0,
  },
  {
    id: '3',
    name: 'Team Chat',
    lastMessage: 'Meeting at 3 PM today',
    timestamp: new Date(2024, 0, 15, 10, 15),
    unread: 5,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    lastMessage: 'Thanks for your help!',
    timestamp: new Date(2024, 0, 14, 18, 20),
    unread: 0,
  },
  {
    id: '5',
    name: 'Development Group',
    lastMessage: 'New React Native update is out',
    timestamp: new Date(2024, 0, 14, 16, 0),
    unread: 12,
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: 'John Developer',
    content:
      'Just shipped a new feature using React Native and Expo! The development experience is amazing.',
    timestamp: new Date(2024, 0, 15, 15, 0),
    likes: 42,
    liked: false,
    comments: 8,
  },
  {
    id: '2',
    author: 'Sarah Designer',
    content: 'Working on a new UI kit for mobile apps. What features would you like to see?',
    timestamp: new Date(2024, 0, 15, 13, 30),
    likes: 28,
    liked: true,
    comments: 15,
  },
  {
    id: '3',
    author: 'Mike Product',
    content: 'User feedback has been incredible! We crossed 10k downloads this week.',
    timestamp: new Date(2024, 0, 15, 11, 0),
    likes: 156,
    liked: false,
    comments: 23,
  },
  {
    id: '4',
    author: 'Emma Tech',
    content:
      'Pro tip: Use expo-router for file-based navigation in your React Native apps. Game changer!',
    timestamp: new Date(2024, 0, 14, 16, 45),
    likes: 89,
    liked: true,
    comments: 12,
  },
  {
    id: '5',
    author: 'Alex Mobile',
    content: 'Just discovered the power of Reanimated 3. Animations have never been smoother!',
    timestamp: new Date(2024, 0, 14, 14, 20),
    likes: 67,
    liked: false,
    comments: 19,
  },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    description: 'You signed in from a new device',
    timestamp: new Date(2024, 0, 15, 9, 0),
    icon: 'phone.portrait',
  },
  {
    id: '2',
    type: 'post',
    description: 'Sarah liked your post',
    timestamp: new Date(2024, 0, 15, 8, 30),
    icon: 'heart',
  },
  {
    id: '3',
    type: 'comment',
    description: 'John commented on your post',
    timestamp: new Date(2024, 0, 14, 17, 15),
    icon: 'bubble.left',
  },
  {
    id: '4',
    type: 'follow',
    description: 'Emma started following you',
    timestamp: new Date(2024, 0, 14, 15, 45),
    icon: 'person.badge.plus',
  },
  {
    id: '5',
    type: 'like',
    description: 'Your post reached 100 likes!',
    timestamp: new Date(2024, 0, 14, 12, 0),
    icon: 'star',
  },
];

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
