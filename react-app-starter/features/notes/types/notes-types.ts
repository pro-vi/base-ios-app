export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

export const NOTES_STORAGE_KEY = '@notes_storage';
