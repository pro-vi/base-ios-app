import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageBubble from './message-bubble';
import MessageInput from './message-input';
import PhotoViewerModal from './photo-viewer-modal';
import { Message } from './chat-types';
import { mockMessages, mockResponses, mockResponseImages } from './chat-data';
import AIService from './ai-service';

export default function ChatDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const { name, isAI } = params as { id: string; name: string; isAI?: string };
  const isAIChat = isAI === 'true';

  const [messages, setMessages] = useState<Message[]>(isAIChat ? [] : mockMessages);
  const [inputText, setInputText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewerPhoto, setViewerPhoto] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<'gpt-5' | 'gpt-5-mini'>('gpt-5-mini');
  const flatListRef = useRef<FlatList>(null);

  const handleBack = () => {
    router.back();
  };

  const handleImagePress = (imageUrl: string) => {
    setViewerPhoto(imageUrl);
  };

  const handleApiKeySetup = () => {
    Alert.alert('OpenAI API Key', 'Please enter your OpenAI API key', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Enter Key',
        onPress: () => {
          Alert.prompt(
            'API Key',
            'Enter your OpenAI API key:',
            async (text) => {
              if (text) {
                await AIService.setApiKey(text);
                Alert.alert('Success', 'API key saved successfully');
              }
            },
            'secure-text'
          );
        },
      },
    ]);
  };

  const sendMessage = async () => {
    if (inputText.trim() || selectedPhoto) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'user',
        timestamp: new Date(),
        imageUrl: selectedPhoto || undefined,
      };

      // Add user message
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputText('');
      setSelectedPhoto(null);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      if (isAIChat) {
        // Handle AI response
        setLoading(true);
        const tempLoadingId = 'loading-' + Date.now();
        setLoadingMessageId(tempLoadingId);

        // Add loading message bubble
        const loadingMessage: Message = {
          id: tempLoadingId,
          text: '',
          sender: 'other',
          senderName: 'AI Assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, loadingMessage]);

        // Debug logging
        console.log('[AI Chat Debug]', {
          model: selectedModel,
          messageCount: updatedMessages.length,
          userMessage: userMessage.text,
          timestamp: new Date().toISOString(),
        });

        // Scroll to loading message
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        try {
          const aiResponse = await AIService.sendMessage(userMessage.text, messages, selectedModel);

          // Remove loading message and add real response
          setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.id !== tempLoadingId);
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              text: aiResponse,
              sender: 'other',
              senderName: 'AI Assistant',
              timestamp: new Date(),
            };
            return [...filtered, aiMessage];
          });

          // Debug log response
          console.log('[AI Chat Response]', {
            model: selectedModel,
            responseLength: aiResponse.length,
            totalMessages: messages.length + 2,
          });

          // Scroll to bottom for AI message
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        } catch (error: any) {
          // Remove loading message on error
          setMessages((prev) => prev.filter((msg) => msg.id !== tempLoadingId));

          if (error.message.includes('API key not set')) {
            handleApiKeySetup();
          } else {
            Alert.alert('Error', error.message || 'Failed to get AI response');
          }
        } finally {
          setLoading(false);
          setLoadingMessageId(null);
        }
      } else {
        // Simulate mock response for regular chat
        setTimeout(() => {
          const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
          const includeImage = Math.random() < 0.3;
          const randomImage = includeImage
            ? mockResponseImages[Math.floor(Math.random() * mockResponseImages.length)]
            : undefined;

          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: randomResponse,
            sender: 'other',
            senderName: name || 'Assistant',
            timestamp: new Date(),
            imageUrl: randomImage,
          };

          setMessages((prev) => [...prev, botMessage]);

          // Scroll to bottom for bot message
          setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }, 1000);
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header with back button */}
        <View style={[styles.header, { borderBottomColor: colors.tabIconDefault + '20' }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>{name || 'Chat'}</Text>

          {isAIChat ? (
            <TouchableOpacity
              style={styles.rightSpacer}
              onPress={() => {
                Alert.alert('Options', `Current Model: ${selectedModel}`, [
                  {
                    text: 'Change Model',
                    onPress: () => {
                      Alert.alert('Select Model', 'Choose an AI model', [
                        {
                          text: 'GPT-5',
                          onPress: () => setSelectedModel('gpt-5'),
                        },
                        {
                          text: 'GPT-5 Mini',
                          onPress: () => setSelectedModel('gpt-5-mini'),
                        },
                        { text: 'Cancel', style: 'cancel' },
                      ]);
                    },
                  },
                  {
                    text: 'Set API Key',
                    onPress: handleApiKeySetup,
                  },
                  {
                    text: 'Clear Chat',
                    onPress: () => {
                      Alert.alert('Clear Chat', 'Are you sure you want to clear all messages?', [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Clear', style: 'destructive', onPress: () => setMessages([]) },
                      ]);
                    },
                  },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={styles.rightSpacer} />
          )}
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => {
              const isLoadingMessage = item.id === loadingMessageId;
              if (isLoadingMessage) {
                return (
                  <View style={styles.loadingMessage}>
                    <View style={[styles.loadingBubble, { backgroundColor: colors.card }]}>
                      <ActivityIndicator size="small" color={colors.tint} />
                      <Text style={[styles.loadingText, { color: colors.text }]}>Thinking...</Text>
                    </View>
                  </View>
                );
              }
              return <MessageBubble message={item} onImagePress={handleImagePress} />;
            }}
            keyExtractor={(item) => item.id}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={null}
          />
        </TouchableWithoutFeedback>

        <MessageInput
          value={inputText}
          onChangeText={setInputText}
          onSend={sendMessage}
          selectedPhoto={selectedPhoto}
          onPhotoSelect={setSelectedPhoto}
          onRemovePhoto={() => setSelectedPhoto(null)}
        />
      </KeyboardAvoidingView>

      <PhotoViewerModal
        visible={!!viewerPhoto}
        imageUrl={viewerPhoto || ''}
        onClose={() => setViewerPhoto(null)}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  rightSpacer: {
    width: 24,
    position: 'absolute',
    right: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingBottom: 20,
  },
  loadingMessage: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: '80%',
    gap: 8,
  },
  loadingText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
