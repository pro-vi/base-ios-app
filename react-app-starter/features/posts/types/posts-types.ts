// MARK: - Post Content Model
export interface PostContent {
  type: string;
  text?: string;
  title?: string;
  sourceUrl?: string;
  tags?: string[];
}

// MARK: - Post Metadata Model
export interface PostMetadata {
  source?: string;
  sourceId?: string;
  sourceScore?: number;
  sourceComments?: number;
  sourceAuthor?: string;
  discussionUrl?: string;
}

// MARK: - Post Model
export interface Post {
  id: string; // UUID as string for compatibility
  content: PostContent;
  authorId?: string;
  parentId?: string;
  visibility?: number;
  metadata?: PostMetadata;
  createdAt: string;
  updatedAt: string;

  // Backward compatibility properties
  title?: string;
  contentText?: string;
  content_old?: string;
  created_at: string;
}

// MARK: - Insert Model
export interface PostInsert {
  content: PostContent;
  author_id?: string;
  parent_id?: string;
  visibility: number;
  metadata?: PostMetadata;
}

// MARK: - Update Model
export interface PostUpdate {
  content: PostContent;
  updated_at: string;
}

export const POSTS_STORAGE_KEY = '@posts_storage';

export type PostsViewMode = 'list' | 'grid' | 'feed';

export const COLOR_PALETTE = [
  '#F44336', // tomato
  '#E67C26', // orange
  '#94730B', // olive
  '#F09300', // darkGoldenrod
  '#4CAF50', // limeGreen
  '#43A047', // green
  '#26A69A', // teal
  '#00BCD4', // deepSkyBlue
  '#7986CB', // cornflowerBlue
  '#03A9F4', // blue
  '#303F9F', // royalBlue
  '#673AB7', // blueViolet
  '#9575CD', // mediumPurple
  '#E91E63', // hotPink
];
