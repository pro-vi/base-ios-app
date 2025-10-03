import { GeminiApiKeyManager } from './gemini-api-key';

// Configuration - can be moved to env variables
const GEMINI_MODEL = 'gemini-2.5-flash-image-preview';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }[];
    };
  }[];
}

class GeminiService {
  private model: string;

  constructor() {
    this.model = GEMINI_MODEL;
  }

  private async getApiKey(): Promise<string | null> {
    // First check if user has set their own API key
    const userApiKey = await GeminiApiKeyManager.getApiKey();
    if (userApiKey) {
      return userApiKey;
    }

    // Fall back to environment variable if available
    const envApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    return envApiKey || null;
  }

  /**
   * Generate image from text prompt
   */
  async generateImage(prompt: string): Promise<string> {
    const apiKey = await this.getApiKey();

    if (!apiKey) {
      // Use mock generation when API key not configured
      console.warn('No API key configured. Please enter your Gemini API key.');
      throw new Error('API key required. Please configure your Gemini API key in settings.');
    }

    // Add nano banana theme to prompts automatically
    const enhancedPrompt = this.enhancePrompt(prompt);

    try {
      const response = await fetch(
        `${GEMINI_API_URL}/${this.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 32,
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      const data: GeminiResponse = await response.json();
      return this.extractImageFromResponse(data);
    } catch (error: any) {
      console.error('Gemini generateImage error:', error);
      throw new Error(error.message || 'Failed to generate image');
    }
  }

  /**
   * Edit existing image with text prompt
   */
  async editImage(prompt: string, imageBase64: string): Promise<string> {
    const apiKey = await this.getApiKey();

    if (!apiKey) {
      // Use mock generation when API key not configured
      console.warn('No API key configured. Please enter your Gemini API key.');
      throw new Error('API key required. Please configure your Gemini API key in settings.');
    }

    const enhancedPrompt = this.enhancePrompt(prompt, true);

    try {
      const response = await fetch(
        `${GEMINI_API_URL}/${this.model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: enhancedPrompt,
                  },
                  {
                    inlineData: {
                      mimeType: 'image/jpeg',
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.8,
              topK: 32,
              topP: 0.95,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      const data: GeminiResponse = await response.json();
      return this.extractImageFromResponse(data);
    } catch (error: any) {
      console.error('Gemini editImage error:', error);
      throw new Error(error.message || 'Failed to edit image');
    }
  }

  /**
   * Enhance prompt with nano banana theme
   */
  private enhancePrompt(prompt: string, isEdit: boolean = false): string {
    // Only add nano banana context if not already present
    const hasNanoContext =
      prompt.toLowerCase().includes('nano') || prompt.toLowerCase().includes('banana');

    if (isEdit) {
      return hasNanoContext
        ? prompt
        : `${prompt}. Add subtle nano or banana themed elements while maintaining the main subject.`;
    }

    return hasNanoContext
      ? prompt
      : `${prompt}. Style: High-quality, creative, with subtle nano/microscopic banana theme elements.`;
  }

  /**
   * Extract image data from Gemini response
   */
  private extractImageFromResponse(response: GeminiResponse): string {
    const candidate = response.candidates?.[0];
    if (!candidate) {
      throw new Error('No response from Gemini');
    }

    const parts = candidate.content.parts;
    for (const part of parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image data in response');
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Mock generation for testing without API key
   */
  async mockGenerate(prompt: string): Promise<string> {
    // Return a placeholder base64 image for testing
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

    // 1x1 transparent PNG as base64
    return 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  }
}

// Export singleton instance
export const geminiService = new GeminiService();

// Export type for the service
export type { GeminiService };
