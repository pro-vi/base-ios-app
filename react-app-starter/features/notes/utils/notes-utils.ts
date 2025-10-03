import { Note } from '../types/notes-types';

export function formatDate(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes === 1) return '1 minute ago';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  if (diffInHours === 1) return '1 hour ago';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatSmartDate(date: Date): string {
  const now = new Date();
  const dateObj = new Date(date);

  // Reset time parts for date comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const diffInMs = today.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / 86400000);

  // Get time in format like "2:30 PM"
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (targetDate.getTime() === today.getTime()) {
    return timeStr; // Today: just show time
  }

  if (targetDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  if (diffInDays > 0 && diffInDays < 7) {
    // Within a week: show weekday
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    return weekday;
  }

  // Older than a week: show date like "9/8/25"
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear().toString().slice(-2);
  return `${month}/${day}/${year}`;
}

export function filterNotes(notes: Note[], searchText: string): Note[] {
  if (!searchText) return notes;

  const lowerSearch = searchText.toLowerCase();
  return notes.filter(
    (note) =>
      note.title.toLowerCase().includes(lowerSearch) ||
      note.content.toLowerCase().includes(lowerSearch)
  );
}

export function sortNotes(notes: Note[]): Note[] {
  return notes.sort((a, b) => {
    // Pinned notes first
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // Then by updated date
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });
}
