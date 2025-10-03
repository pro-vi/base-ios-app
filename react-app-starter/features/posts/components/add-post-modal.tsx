import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
// import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface AddPostModalProps {
  visible: boolean;
  title: string;
  content: string;
  tags?: string;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onTagsChange?: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export function AddPostModal({
  visible,
  title,
  content,
  tags = '',
  onTitleChange,
  onContentChange,
  onTagsChange,
  onSave,
  onClose,
  isLoading = false,
}: AddPostModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={[styles.cancelText, { color: colors.tint }]}>Cancel</Text>
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>New Post</Text>

          <TouchableOpacity onPress={onSave} style={styles.headerButton} disabled={isLoading}>
            <Text
              style={[styles.saveText, { color: isLoading ? colors.tabIconDefault : colors.tint }]}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.content}
          keyboardVerticalOffset={0}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
              placeholder="Title (optional)"
              placeholderTextColor={colors.tabIconDefault}
              value={title}
              onChangeText={onTitleChange}
              multiline
              maxLength={100}
            />

            <TextInput
              style={[styles.contentInput, { color: colors.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.tabIconDefault}
              value={content}
              onChangeText={onContentChange}
              multiline
              textAlignVertical="top"
              scrollEnabled={false}
            />

            {onTagsChange && (
              <TextInput
                style={[styles.tagsInput, { color: colors.text, borderTopColor: colors.border }]}
                placeholder="Tags (comma-separated, optional)"
                placeholderTextColor={colors.tabIconDefault}
                value={tags}
                onChangeText={onTagsChange}
                maxLength={100}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cancelText: {
    fontSize: 17,
  },
  saveText: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    lineHeight: 24,
    minHeight: 200,
  },
  tagsInput: {
    fontSize: 14,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
