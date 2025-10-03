import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
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
import { Note } from '../types/notes-types';
import { formatDate } from '../utils/notes-utils';

interface NoteDetailModalProps {
  visible: boolean;
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onClose: () => void;
}

export function NoteDetailModal({
  visible,
  note,
  onUpdate,
  onDelete,
  onClose,
}: NoteDetailModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    const updatedNote: Note = {
      ...note,
      title: editTitle.trim() || 'Untitled Note',
      content: editContent.trim(),
      updatedAt: new Date(),
    };
    onUpdate(updatedNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

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
          <TouchableOpacity onPress={isEditing ? handleCancel : onClose}>
            <Text style={[styles.button, { color: colors.tint }]}>
              {isEditing ? 'Cancel' : 'Done'}
            </Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            {!isEditing && (
              <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
                {formatDate(note.updatedAt)}
              </Text>
            )}
          </View>

          <View style={styles.headerRight}>
            {isEditing ? (
              <TouchableOpacity onPress={handleSave}>
                <Text style={[styles.button, { color: colors.tint }]}>Save</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Ionicons name="pencil" size={22} color={colors.tint} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(note.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={22} color={colors.tint} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <ScrollView style={styles.content}>
          {isEditing ? (
            <>
              <TextInput
                style={[
                  styles.titleInput,
                  { color: colors.text, borderColor: colors.tabIconDefault },
                ]}
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder="Title"
                placeholderTextColor={colors.tabIconDefault}
              />
              <TextInput
                style={[styles.contentInput, { color: colors.text }]}
                value={editContent}
                onChangeText={setEditContent}
                placeholder="Note content..."
                placeholderTextColor={colors.tabIconDefault}
                multiline
                textAlignVertical="top"
              />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>
              <Text style={[styles.noteContent, { color: colors.text }]}>{note.content}</Text>
            </>
          )}
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  button: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  deleteButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  titleInput: {
    fontSize: 28,
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
