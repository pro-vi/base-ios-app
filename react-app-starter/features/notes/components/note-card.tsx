import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Note } from '../types/notes-types';
import { formatSmartDate } from '../utils/notes-utils';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const contentPreview = note.content.replace(/\n/g, ' ').trim();
  const dateStr = formatSmartDate(note.updatedAt);

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={() => onPress(note)}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
        {note.title}
      </Text>

      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]} numberOfLines={1}>
        {dateStr} • {contentPreview}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
  },
});
