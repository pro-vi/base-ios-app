import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
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

interface AddNoteModalProps {
  visible: boolean;
  title: string;
  content: string;
  onTitleChange: (text: string) => void;
  onContentChange: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function AddNoteModal({
  visible,
  title,
  content,
  onTitleChange,
  onContentChange,
  onSave,
  onClose,
}: AddNoteModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.button, { color: colors.tint }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>New Note</Text>
          <TouchableOpacity onPress={onSave}>
            <Text
              style={[
                styles.button,
                { color: content.trim() ? colors.tint : colors.tabIconDefault },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TextInput
            style={[styles.titleInput, { color: colors.text, borderColor: colors.tabIconDefault }]}
            placeholder="Title"
            placeholderTextColor={colors.tabIconDefault}
            value={title}
            onChangeText={onTitleChange}
          />
          <TextInput
            style={[
              styles.contentInput,
              { color: colors.text, borderColor: colors.tabIconDefault },
            ]}
            placeholder="Start typing..."
            placeholderTextColor={colors.tabIconDefault}
            value={content}
            onChangeText={onContentChange}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#00000020',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
  },
});
