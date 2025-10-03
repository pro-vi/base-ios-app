import { Stack } from 'expo-router';
import { NoteDetailScreen } from '@/features/notes';

export default function NoteDetail() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <NoteDetailScreen />
    </>
  );
}
