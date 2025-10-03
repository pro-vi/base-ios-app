import { GeminiApiKeyManager } from './gemini-api-key';

const VEO_MODEL = 'veo-3.0-generate-001';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta';

interface VeoOperation {
  name: string;
  done?: boolean;
  metadata?: any;
  response?: {
    generateVideoResponse?: {
      generatedSamples?: {
        video?: {
          uri: string;
          mimeType?: string;
        };
      }[];
    };
  };
  error?: {
    code: number;
    message: string;
  };
}

class VeoService {
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
   * Generate video from text prompt
   */
  async generateVideo(prompt: string, onProgress?: (status: string) => void): Promise<string> {
    const apiKey = await this.getApiKey();

    if (!apiKey) {
      console.warn('No API key configured. Please enter your Gemini API key.');
      throw new Error('API key required. Please configure your Gemini API key in settings.');
    }

    try {
      onProgress?.('Starting video generation...');

      const requestUrl = `${GEMINI_API_URL}/models/${VEO_MODEL}:predictLongRunning`;
      const requestBody = {
        instances: [
          {
            prompt: this.enhanceVideoPrompt(prompt),
          },
        ],
        parameters: {
          aspectRatio: '16:9',
          negativePrompt: 'low quality, blurry',
        },
      };

      console.log('[VEO] Request URL:', requestUrl);
      console.log('[VEO] Request body:', JSON.stringify(requestBody, null, 2));
      console.log('[VEO] Using API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'none');

      // Start video generation using the predictLongRunning endpoint
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[VEO] Response status:', response.status);
      console.log('[VEO] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const error = await response.text();
        console.error('[VEO] Error response:', error);
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      const operation: VeoOperation = await response.json();
      console.log('[VEO] Operation response:', JSON.stringify(operation, null, 2));

      // Poll for completion
      const videoUrl = await this.pollOperation(operation.name, onProgress, apiKey);
      return videoUrl;
    } catch (error: any) {
      console.error('Veo generateVideo error:', error);
      throw new Error(error.message || 'Failed to generate video');
    }
  }

  /**
   * Generate video from image and text prompt
   */
  async generateVideoFromImage(
    prompt: string,
    imageBase64: string,
    onProgress?: (status: string) => void
  ): Promise<string> {
    const apiKey = await this.getApiKey();

    if (!apiKey) {
      console.warn('No API key configured. Please enter your Gemini API key.');
      throw new Error('API key required. Please configure your Gemini API key in settings.');
    }

    try {
      onProgress?.('Processing image...');

      // First, optionally enhance the image with Imagen (commented out for simplicity)
      // For now, we'll use the image directly

      onProgress?.('Starting video generation from image...');

      // Generate video with image input using predictLongRunning endpoint
      const response = await fetch(`${GEMINI_API_URL}/models/${VEO_MODEL}:predictLongRunning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: this.enhanceVideoPrompt(prompt, true),
              image: {
                imageBytes: imageBase64,
                mimeType: 'image/jpeg',
              },
            },
          ],
          parameters: {
            aspectRatio: '16:9',
            negativePrompt: 'low quality, blurry',
          },
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`API Error: ${response.status} - ${error}`);
      }

      const operation: VeoOperation = await response.json();

      // Poll for completion
      const videoUrl = await this.pollOperation(operation.name, onProgress, apiKey);
      return videoUrl;
    } catch (error: any) {
      console.error('Veo generateVideoFromImage error:', error);
      throw new Error(error.message || 'Failed to generate video from image');
    }
  }

  /**
   * Poll operation status until video is ready
   */
  private async pollOperation(
    operationName: string,
    onProgress?: (status: string) => void,
    apiKey?: string
  ): Promise<string> {
    if (!apiKey) {
      const key = await this.getApiKey();
      if (!key) {
        throw new Error('API key required');
      }
      apiKey = key;
    }

    let attempts = 0;
    const maxAttempts = 60; // 10 minutes max (10 seconds * 60)

    console.log('[VEO] Starting to poll operation:', operationName);

    while (attempts < maxAttempts) {
      attempts++;
      onProgress?.(`Processing video... (${Math.min(attempts * 10, 90)}% complete)`);

      // Wait before polling
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 seconds

      try {
        const pollUrl = `${GEMINI_API_URL}/${operationName}`;
        console.log(`[VEO] Polling attempt ${attempts}:`, pollUrl);

        const response = await fetch(pollUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
        });

        console.log(`[VEO] Poll response status:`, response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`[VEO] Polling attempt ${attempts} failed:`, response.status, errorText);
          continue;
        }

        const operation: VeoOperation = await response.json();
        console.log(`[VEO] Poll response:`, JSON.stringify(operation, null, 2));

        if (operation.done === true) {
          if (operation.error) {
            console.error('[VEO] Operation failed:', operation.error);
            throw new Error(operation.error.message);
          }

          // Check for the video URI in the response structure
          const videoUri =
            operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;
          if (videoUri) {
            console.log('[VEO] Video ready! URL:', videoUri);

            // Try to append API key as query parameter for authentication
            const videoUrlWithAuth = `${videoUri}${videoUri.includes('?') ? '&' : '?'}key=${apiKey}`;
            console.log('[VEO] Video URL with auth:', videoUrlWithAuth.substring(0, 100) + '...');

            onProgress?.('Video ready! Downloading...');
            return videoUrlWithAuth;
          }

          console.error('[VEO] No video URL in response:', operation);
          throw new Error('No video URL in response');
        }
      } catch (error) {
        console.warn(`[VEO] Polling error at attempt ${attempts}:`, error);
      }
    }

    throw new Error('Video generation timed out');
  }

  /**
   * Enhance prompt for better video generation
   */
  private enhanceVideoPrompt(prompt: string, isImageBased: boolean = false): string {
    if (isImageBased) {
      // For image-based videos, focus on motion and animation
      return `${prompt}. Create smooth, natural motion with cinematic camera movement and appropriate ambient sounds.`;
    }

    // For text-to-video, add quality modifiers if not present
    const hasQualityTerms = /cinematic|realistic|high.?quality|professional/i.test(prompt);

    if (!hasQualityTerms) {
      return `${prompt}. Style: Cinematic, high-quality, realistic lighting and smooth motion.`;
    }

    return prompt;
  }

  /**
   * Download video from URL to local storage
   */
  async downloadVideo(videoUrl: string, filename: string): Promise<string> {
    // In a real implementation, this would download the video to local storage
    // For React Native, you'd use expo-file-system or react-native-fs
    console.log(`Would download video from ${videoUrl} to ${filename}`);

    // For now, return the URL directly
    return videoUrl;
  }

  /**
   * Check if service is configured
   */
  async isConfigured(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return !!apiKey;
  }
}

// Export singleton instance
export const veoService = new VeoService();

// Export type for the service
export type { VeoService };
