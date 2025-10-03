import { Colors, MutedColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Conversation } from './chat-types';
import { formatTimeAgo } from './chat-data';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ConversationItemProps {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
}

export default function ConversationItem({ conversation, onPress }: ConversationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Generate a consistent color for each user based on their name
  const avatarColorIndex = conversation.name.charCodeAt(0) % MutedColors.length;
  const avatarColor = MutedColors[avatarColorIndex];

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(conversation)}>
      <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
        {conversation.avatar === 'sparkles' ? (
          <IconSymbol name="sparkles" size={28} color="#FFFFFF" />
        ) : (
          <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
            {conversation.avatar || conversation.name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, { color: colors.text }]}>{conversation.name}</Text>
          <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
            {formatTimeAgo(conversation.timestamp)}
          </Text>
        </View>

        <Text
          style={[styles.lastMessage, { color: colors.textSecondary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 2,
  },
});
