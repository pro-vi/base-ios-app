export type GenerationMode = 'text-to-image' | 'edit-image';

export interface HistoryItem {
  prompt: string;
  image: string;
}
