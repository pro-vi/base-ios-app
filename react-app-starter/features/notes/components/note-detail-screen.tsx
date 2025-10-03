import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../types/notes-types';
import { notesStorage } from '../utils/notes-storage';

export function NoteDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [note, setNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNote = useCallback(async () => {
    const loadedNotes = await notesStorage.load();
    setNotes(loadedNotes);
    const foundNote = loadedNotes.find((n) => n.id === params.id);
    if (foundNote) {
      setNote(foundNote);
      setEditedTitle(foundNote.title);
      setEditedContent(foundNote.content);
    }
  }, [params.id]);

  useEffect(() => {
    loadNote();
  }, [loadNote]);

  const handleSave = async () => {
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      title: editedTitle.trim() || 'Untitled Note',
      content: editedContent.trim(),
      updatedAt: new Date(),
    };

    const updatedNotes = notes.map((n) => (n.id === note.id ? updatedNote : n));
    setNotes(updatedNotes);
    await notesStorage.save(updatedNotes);
    setNote(updatedNote);
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!note) return;
          const updatedNotes = notes.filter((n) => n.id !== note.id);
          await notesStorage.save(updatedNotes);
          router.back();
        },
      },
    ]);
  };

  const togglePin = async () => {
    if (!note) return;

    const updatedNote = { ...note, isPinned: !note.isPinned, updatedAt: new Date() };
    const updatedNotes = notes.map((n) => (n.id === note.id ? updatedNote : n));
    setNotes(updatedNotes);
    await notesStorage.save(updatedNotes);
    setNote(updatedNote);
  };

  if (!note) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>Note not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity onPress={togglePin} style={styles.actionButton}>
            <Ionicons
              name={note.isPinned ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={note.isPinned ? colors.tint : colors.text}
            />
          </TouchableOpacity>

          {isEditing ? (
            <>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.actionButton}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
                <Ionicons name="checkmark" size={24} color={colors.tint} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
                <Ionicons name="create-outline" size={22} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
                <Ionicons name="trash-outline" size={22} color="#FF453A" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isEditing ? (
          <>
            <TextInput
              style={[
                styles.titleInput,
                { color: colors.text, borderColor: colors.tabIconDefault + '30' },
              ]}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Note title"
              placeholderTextColor={colors.tabIconDefault}
            />
            <TextInput
              style={[
                styles.contentInput,
                { color: colors.text, borderColor: colors.tabIconDefault + '30' },
              ]}
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="Note content"
              placeholderTextColor={colors.tabIconDefault}
              multiline
              textAlignVertical="top"
            />
          </>
        ) : (
          <>
            <Text style={[styles.title, { color: colors.text }]}>{note.title}</Text>
            <Text style={[styles.date, { color: colors.tabIconDefault }]}>
              {new Date(note.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text style={[styles.noteContent, { color: colors.text }]}>{note.content}</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 20,
  },
  noteContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  titleInput: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 300,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
