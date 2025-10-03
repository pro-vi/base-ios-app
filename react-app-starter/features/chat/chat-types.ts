export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  senderName?: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  avatar?: string;
}
