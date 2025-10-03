import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Message } from './chat-types';
import { formatTime } from './chat-data';

interface MessageBubbleProps {
  message: Message;
  onImagePress?: (imageUrl: string) => void;
}

export default function MessageBubble({ message, onImagePress }: MessageBubbleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isUser = message.sender === 'user';

  const handleImagePress = () => {
    if (message.imageUrl && onImagePress) {
      onImagePress(message.imageUrl);
    }
  };

  return (
    <View style={[styles.container, isUser ? styles.userMessage : styles.otherMessage]}>
      {!isUser && message.senderName && (
        <Text style={[styles.senderName, { color: colors.text }]}>{message.senderName}</Text>
      )}

      {/* Image displayed outside bubble if present */}
      {message.imageUrl && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleImagePress}
          style={[
            styles.imageContainer,
            isUser ? styles.userImageContainer : styles.otherImageContainer,
          ]}
        >
          <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
        </TouchableOpacity>
      )}

      {/* Text bubble only if there's text */}
      {message.text ? (
        <View
          style={[
            styles.bubble,
            isUser
              ? {
                  backgroundColor: colorScheme === 'dark' ? '#1E90FF' : '#0A84FF',
                }
              : {
                  backgroundColor: colorScheme === 'dark' ? '#2A2D30' : '#F0F0F0',
                },
          ]}
        >
          <Text style={[styles.messageText, { color: isUser ? '#fff' : colors.text }]}>
            {message.text}
          </Text>
        </View>
      ) : null}

      <Text style={[styles.timestamp, { color: colors.tabIconDefault }]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 8,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 8,
  },
  imageContainer: {
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    maxWidth: '80%',
  },
  userImageContainer: {
    alignSelf: 'flex-end',
  },
  otherImageContainer: {
    alignSelf: 'flex-start',
  },
  messageImage: {
    width: 250,
    height: 250,
    resizeMode: 'cover',
  },
});
