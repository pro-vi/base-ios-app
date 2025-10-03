import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConversationItem from './conversation-item';
import { Conversation } from './chat-types';
import { mockConversations } from './chat-data';

export default function ChatsListScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // AI Bot conversation
  const aiBot: Conversation = {
    id: 'ai-bot',
    name: 'AI Assistant',
    lastMessage: 'How can I help you today?',
    timestamp: new Date(),
    unreadCount: 0,
    avatar: 'sparkles',
  };

  // Combine AI bot with other conversations
  const allConversations = [aiBot, ...mockConversations];

  const handleConversationPress = (conversation: Conversation) => {
    router.push({
      pathname: '/chat-detail',
      params: {
        id: conversation.id,
        name: conversation.name,
        isAI: conversation.id === 'ai-bot' ? 'true' : 'false',
      },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Chats
        </ThemedText>
      </ThemedView>

      <FlatList
        data={allConversations}
        renderItem={({ item }) => (
          <ConversationItem conversation={item} onPress={handleConversationPress} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  separator: {
    height: 1,
    marginLeft: 78,
    opacity: 0.2,
  },
});
