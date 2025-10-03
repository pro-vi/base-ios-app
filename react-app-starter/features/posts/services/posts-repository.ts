import { supabase, supabaseConfig } from '@/lib/supabase';
import { Post, PostContent, PostInsert, PostMetadata, PostUpdate } from '../types/posts-types';

// MARK: - PostsRepository
// Single responsibility: Handle all data operations for posts
class PostsRepository {
  private static instance: PostsRepository;

  private constructor() {}

  static getInstance(): PostsRepository {
    if (!PostsRepository.instance) {
      PostsRepository.instance = new PostsRepository();
    }
    return PostsRepository.instance;
  }

  // MARK: - Fetch Operations

  async fetchPosts(): Promise<Post[]> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Debug: Log raw data for first post
    if (data && data.length > 0) {
      console.log('=== Raw post data from Supabase (first post) ===');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('=================================================');
    }

    // Transform snake_case from DB to camelCase for TypeScript
    const posts = (data || []).map(this.transformPostFromDB);

    // Debug: Log transformed first post
    if (posts.length > 0) {
      console.log('=== Transformed post (first post) ===');
      console.log('ID:', posts[0].id);
      console.log('Title:', posts[0].content.title || 'nil');
      console.log('Source URL:', posts[0].content.sourceUrl || 'nil');
      console.log('Discussion URL:', posts[0].metadata?.discussionUrl || 'nil');
      console.log('Metadata:', posts[0].metadata);
      console.log('=====================================');
    }

    return posts;
  }

  // MARK: - Create Operations

  async createPost(
    text: string,
    title?: string,
    authorId?: string,
    tags?: string[]
  ): Promise<void> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const content: PostContent = {
      type: 'text',
      text,
      title: title && title.length > 0 ? title : undefined,
      tags,
    };

    const postData: PostInsert = {
      content,
      author_id: authorId,
      visibility: 1,
    };

    const { error } = await supabase.from('posts').insert(postData);

    if (error) {
      throw error;
    }
  }

  async createNewsPost(
    title: string,
    sourceUrl: string,
    authorId: string,
    score?: number,
    comments?: number
  ): Promise<void> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const content: PostContent = {
      type: 'news',
      text: score ? `Score: ${score} | ${comments || 0} comments` : undefined,
      title,
      sourceUrl,
      tags: ['news'],
    };

    const metadata: PostMetadata | undefined = score
      ? {
          source: 'hackernews',
          sourceScore: score,
          sourceComments: comments,
        }
      : undefined;

    const postData: PostInsert = {
      content,
      author_id: authorId,
      visibility: 1,
      metadata,
    };

    const { error } = await supabase.from('posts').insert(postData);

    if (error) {
      throw error;
    }
  }

  async createComment(postId: string, text: string, authorId: string): Promise<void> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const content: PostContent = {
      type: 'text',
      text,
    };

    const commentData: PostInsert = {
      content,
      author_id: authorId,
      parent_id: postId,
      visibility: 1,
    };

    const { error } = await supabase.from('posts').insert(commentData);

    if (error) {
      throw error;
    }
  }

  // MARK: - Update Operations

  async updatePost(id: string, text: string, title?: string): Promise<void> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const content: PostContent = {
      type: 'text',
      text,
      title: title && title.length > 0 ? title : undefined,
    };

    const updateData: PostUpdate = {
      content,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('posts').update(updateData).eq('id', id);

    if (error) {
      throw error;
    }
  }

  // MARK: - Delete Operations

  async deletePost(id: string): Promise<void> {
    if (!supabaseConfig.isConfigured) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  // MARK: - User Operations

  async getCurrentUserId(): Promise<string | null> {
    if (!supabaseConfig.isConfigured) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id || null;
  }

  // MARK: - Helper Methods

  private transformPostFromDB(dbPost: any): Post {
    // Transform content object from snake_case to camelCase
    const content = dbPost.content
      ? {
          type: dbPost.content.type,
          text: dbPost.content.text,
          title: dbPost.content.title,
          sourceUrl: dbPost.content.source_url,
          tags: dbPost.content.tags,
        }
      : {
          type: 'text',
        };

    // Transform metadata object from snake_case to camelCase
    const metadata = dbPost.metadata
      ? {
          source: dbPost.metadata.source,
          sourceId: dbPost.metadata.source_id,
          sourceScore: dbPost.metadata.source_score,
          sourceComments: dbPost.metadata.source_comments,
          sourceAuthor: dbPost.metadata.source_author,
          discussionUrl: dbPost.metadata.discussion_url,
        }
      : undefined;

    return {
      id: dbPost.id,
      content,
      authorId: dbPost.author_id,
      parentId: dbPost.parent_id,
      visibility: dbPost.visibility,
      metadata,
      createdAt: dbPost.created_at,
      updatedAt: dbPost.updated_at,

      // Backward compatibility properties
      title: content.title,
      contentText: content.text,
      content_old: content.text,
      created_at: dbPost.created_at,
    };
  }
}

export const postsRepository = PostsRepository.getInstance();
