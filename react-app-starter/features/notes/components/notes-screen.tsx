import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../types/notes-types';
import { notesStorage } from '../utils/notes-storage';
import { filterNotes, sortNotes } from '../utils/notes-utils';
import { NoteCard } from './note-card';
import { SearchBar } from './search-bar';
import { EmptyState } from './empty-state';
import { AddNoteModal } from './add-note-modal';

export function NotesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  // Load notes on screen focus
  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const loadedNotes = await notesStorage.load();
    if (loadedNotes.length === 0) {
      const defaultNotes = notesStorage.getDefaultNotes();
      setNotes(defaultNotes);
      await notesStorage.save(defaultNotes);
    } else {
      setNotes(loadedNotes);
    }
  };

  const getFilteredNotes = () => {
    const filtered = filterNotes(notes, searchText);
    return sortNotes(filtered);
  };

  const addNote = async () => {
    const finalTitle = newTitle.trim() || 'Untitled Note';
    if (!newContent.trim()) {
      Alert.alert('Error', 'Please enter some content for the note');
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: finalTitle,
      content: newContent.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await notesStorage.save(updatedNotes);
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleNotePress = (note: Note) => {
    router.push({
      pathname: '/note-detail',
      params: { id: note.id },
    });
  };

  const filteredNotes = getFilteredNotes();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <SearchBar value={searchText} onChangeText={setSearchText} />

      {filteredNotes.length === 0 ? (
        <EmptyState onCreateNote={() => setShowAddModal(true)} />
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={({ item }) => <NoteCard note={item} onPress={handleNotePress} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <AddNoteModal
        visible={showAddModal}
        title={newTitle}
        content={newContent}
        onTitleChange={setNewTitle}
        onContentChange={setNewContent}
        onSave={addNote}
        onClose={() => setShowAddModal(false)}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
});
