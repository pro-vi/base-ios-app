import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, NOTES_STORAGE_KEY } from '../types/notes-types';

export const notesStorage = {
  async save(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes:', error);
      throw error;
    }
  },

  async load(): Promise<Note[]> {
    try {
      const storedNotes = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes = JSON.parse(storedNotes);
        // Convert date strings back to Date objects
        return parsedNotes.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Failed to load notes:', error);
      return [];
    }
  },

  getDefaultNotes(): Note[] {
    return [
      {
        id: '1',
        title: 'Welcome to Notes',
        content:
          'This is your personal notes space. You can create, edit, and organize your thoughts here.',
        createdAt: new Date(),
        updatedAt: new Date(),
        isPinned: true,
      },
      {
        id: '2',
        title: 'Shopping List',
        content: '• Milk\n• Bread\n• Eggs\n• Coffee\n• Fruits',
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        isPinned: false,
      },
      {
        id: '3',
        title: 'Meeting Notes',
        content:
          'Project kickoff meeting:\n- Timeline: 3 months\n- Budget approved\n- Team assignments done\n- Next meeting: Friday',
        createdAt: new Date(Date.now() - 172800000),
        updatedAt: new Date(Date.now() - 172800000),
        isPinned: false,
      },
    ];
  },
};
