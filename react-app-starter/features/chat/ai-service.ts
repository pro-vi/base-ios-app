import AsyncStorage from '@react-native-async-storage/async-storage';
import OpenAI from 'openai';
import { Message } from './chat-types';

const API_KEY_STORAGE = '@openai_api_key';

class AIService {
  private static openaiClient: OpenAI | null = null;

  static async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_KEY_STORAGE);
    } catch (error) {
      console.error('Failed to load API key:', error);
      return null;
    }
  }

  static async setApiKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(API_KEY_STORAGE, key);
      // Reset the client to use the new key
      this.openaiClient = null;
    } catch (error) {
      console.error('Failed to save API key:', error);
      throw error;
    }
  }

  static async getClient(): Promise<OpenAI> {
    if (!this.openaiClient) {
      const apiKey = await this.getApiKey();

      if (!apiKey) {
        throw new Error('API key not set. Please set your OpenAI API key in settings.');
      }

      this.openaiClient = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Required for client-side usage in React Native
      });
    }

    return this.openaiClient;
  }

  static async sendMessage(
    message: string,
    conversationHistory: Message[],
    model: 'gpt-5' | 'gpt-5-mini' = 'gpt-5-mini'
  ): Promise<string> {
    try {
      const client = await this.getClient();

      // Create conversation history for context
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = conversationHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      const completion = await client.chat.completions.create({
        model: model,
        messages: messages,
      });

      return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error: any) {
      console.error('Error calling OpenAI:', error);

      if (error.message?.includes('401') || error.message?.includes('Incorrect API key')) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      }

      if (error.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      if (error.message?.includes('insufficient_quota')) {
        throw new Error('OpenAI quota exceeded. Please check your billing.');
      }

      throw new Error(error.message || 'Failed to get AI response');
    }
  }

  static async streamMessage(
    message: string,
    conversationHistory: Message[],
    onChunk: (chunk: string) => void,
    model: 'gpt-5' | 'gpt-5-mini' = 'gpt-5-mini'
  ): Promise<void> {
    try {
      const client = await this.getClient();

      // Create conversation history for context
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = conversationHistory.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Add current message
      messages.push({
        role: 'user',
        content: message,
      });

      const stream = await client.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          onChunk(content);
        }
      }
    } catch (error: any) {
      console.error('Error streaming from OpenAI:', error);
      throw error;
    }
  }
}
export default AIService;
