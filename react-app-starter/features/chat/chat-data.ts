import { Message, Conversation } from './chat-types';

export const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey! How are you doing today?',
    sender: 'other',
    senderName: 'Alice',
    timestamp: new Date(2025, 0, 10, 9, 30),
  },
  {
    id: '2',
    text: "I'm doing great! Just working on some React Native stuff.",
    sender: 'user',
    timestamp: new Date(2025, 0, 10, 9, 32),
  },
  {
    id: '3',
    text: 'That sounds awesome! What are you building?',
    sender: 'other',
    senderName: 'Alice',
    timestamp: new Date(2025, 0, 10, 9, 33),
  },
  {
    id: '4',
    text: "A chat app with Expo Router! It's pretty cool so far.",
    sender: 'user',
    timestamp: new Date(2025, 0, 10, 9, 35),
  },
  {
    id: '5',
    text: 'Nice! I love how easy Expo makes mobile development.',
    sender: 'other',
    senderName: 'Bob',
    timestamp: new Date(2025, 0, 10, 9, 40),
  },
  {
    id: '6',
    text: 'Totally agree! The hot reload feature is a game changer.',
    sender: 'user',
    timestamp: new Date(2025, 0, 10, 9, 42),
  },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    lastMessage: 'Hey! How are you doing today?',
    timestamp: new Date(2025, 0, 13, 14, 30),
    unread: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    lastMessage: 'Can we meet tomorrow at 3pm?',
    timestamp: new Date(2025, 0, 13, 12, 15),
    unread: 0,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    lastMessage: 'Thanks for the help!',
    timestamp: new Date(2025, 0, 13, 9, 45),
    unread: 0,
  },
  {
    id: '4',
    name: 'Diana Prince',
    lastMessage: 'See you at the meeting',
    timestamp: new Date(2025, 0, 12, 16, 20),
    unread: 1,
  },
  {
    id: '5',
    name: 'Edward Norton',
    lastMessage: 'Great presentation today!',
    timestamp: new Date(2025, 0, 12, 11, 30),
    unread: 0,
  },
];

export const mockResponses = [
  "That's interesting! Tell me more about it.",
  'I see what you mean. Have you considered the alternatives?',
  'Great point! I totally agree with you.',
  'Hmm, let me think about that for a moment...',
  "That's a fascinating perspective!",
  'Could you elaborate on that a bit more?',
  'I understand. How does that make you feel?',
  'Absolutely! That makes perfect sense.',
  'Interesting thought! What led you to that conclusion?',
];

export const mockResponseImages = [
  'https://picsum.photos/300/300?random=10',
  'https://picsum.photos/300/300?random=11',
  'https://picsum.photos/300/300?random=12',
  'https://picsum.photos/300/300?random=13',
  'https://picsum.photos/300/300?random=14',
];

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;

  return date.toLocaleDateString();
}

export function formatTime(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
