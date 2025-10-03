import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_KEY_STORAGE = 'gemini_api_key';

export const GeminiApiKeyManager = {
  async getApiKey(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(GEMINI_API_KEY_STORAGE);
    } catch (error) {
      console.error('Error getting Gemini API key:', error);
      return null;
    }
  },

  async setApiKey(apiKey: string): Promise<void> {
    try {
      await AsyncStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey);
    } catch (error) {
      console.error('Error saving Gemini API key:', error);
      throw error;
    }
  },

  async removeApiKey(): Promise<void> {
    try {
      await AsyncStorage.removeItem(GEMINI_API_KEY_STORAGE);
    } catch (error) {
      console.error('Error removing Gemini API key:', error);
    }
  },

  async hasApiKey(): Promise<boolean> {
    const key = await this.getApiKey();
    return !!key && key.length > 0;
  },
};
