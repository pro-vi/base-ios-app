import { geminiService } from '@/lib/gemini-service';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GeminiApiKeyManager } from '@/lib/gemini-api-key';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NanoHeader from './nano-header';
import ModeSelector from './mode-selector';
import InputSection from './input-section';
import ResultSection from './result-section';
import HistorySection from './history-section';
import ApiKeyPrompt from './api-key-prompt';
import { GenerationMode, HistoryItem } from './nano-types';

const MAX_PROMPT_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 10;
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

export default function NanoScreen() {
  const colorScheme = useColorScheme();
  const colors = useMemo(() => Colors[colorScheme ?? 'light'], [colorScheme]);
  const [mode, setMode] = useState<GenerationMode>('text-to-image');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showApiKeyPrompt, setShowApiKeyPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeScreen = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await checkApiKey();
    } catch {
      setError('Failed to initialize. Please refresh the app.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeScreen();
  }, [initializeScreen]);

  const checkApiKey = async () => {
    try {
      const hasKey = await GeminiApiKeyManager.hasApiKey();
      if (!hasKey) {
        setShowApiKeyPrompt(true);
      }
    } catch (err) {
      console.error('Error checking API key:', err);
      throw err;
    }
  };

  const validateInput = useCallback((): boolean => {
    if (!prompt.trim()) {
      Alert.alert('Enter a prompt', 'Please describe what you want to generate');
      return false;
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      Alert.alert(
        'Prompt too long',
        `Please keep your prompt under ${MAX_PROMPT_LENGTH} characters`
      );
      return false;
    }

    if (mode === 'edit-image' && !selectedImage) {
      Alert.alert('Select an image', 'Please select an image for edit-image mode');
      return false;
    }

    return true;
  }, [prompt, mode, selectedImage]);

  const handleGenerate = useCallback(async () => {
    if (!validateInput()) {
      return;
    }

    try {
      const hasKey = await GeminiApiKeyManager.hasApiKey();
      if (!hasKey) {
        setShowApiKeyPrompt(true);
        return;
      }
    } catch {
      Alert.alert('Error', 'Failed to verify API key. Please try again.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let imageData: string;

      if (mode === 'edit-image' && selectedImage) {
        const base64 = selectedImage.split(',')[1];
        imageData = await geminiService.editImage(prompt, base64);
      } else {
        imageData = await geminiService.generateImage(prompt);
      }

      const generatedImageUrl = `data:image/png;base64,${imageData}`;
      setGeneratedImage(generatedImageUrl);

      setHistory((prev) => {
        const newItem = { prompt: prompt.trim(), image: generatedImageUrl };
        const updated = [newItem, ...prev];
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (error: any) {
      const errorMessage = error.message || DEFAULT_ERROR_MESSAGE;
      setError(errorMessage);
      Alert.alert('Generation Failed', errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, mode, selectedImage, validateInput]);

  const clearAll = useCallback(() => {
    setPrompt('');
    setSelectedImage(null);
    setGeneratedImage(null);
    setMode('text-to-image');
    setError(null);
  }, []);

  const handleModeChange = useCallback((newMode: GenerationMode) => {
    setMode(newMode);
    if (newMode === 'text-to-image') {
      setSelectedImage(null);
    }
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setGeneratedImage(item.image);
    setError(null);
  }, []);

  const handleImageSelect = useCallback((image: string) => {
    setSelectedImage(image);
    setMode('edit-image');
    setError(null);
  }, []);

  const handlePromptChange = useCallback((text: string) => {
    if (text.length <= MAX_PROMPT_LENGTH) {
      setPrompt(text);
    }
  }, []);

  const handleApiKeySet = useCallback(() => {
    setShowApiKeyPrompt(false);
    initializeScreen();
  }, [initializeScreen]);

  const handleModeToggle = useCallback(() => {
    handleModeChange(mode === 'text-to-image' ? 'edit-image' : 'text-to-image');
  }, [mode, handleModeChange]);

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.textSecondary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading Nano...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <NanoHeader
            mode={mode}
            onModeToggle={handleModeToggle}
            onApiKeyPress={() => setShowApiKeyPrompt(true)}
          />

          <ModeSelector mode={mode} onModeChange={handleModeChange} />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: '#FF6B6B' }]}>{error}</Text>
            </View>
          )}

          <InputSection
            mode={mode}
            prompt={prompt}
            selectedImage={selectedImage}
            isGenerating={isGenerating}
            onPromptChange={handlePromptChange}
            onImageSelect={handleImageSelect}
            onGenerate={handleGenerate}
            onClear={clearAll}
          />

          {generatedImage && <ResultSection generatedImage={generatedImage} />}

          {history.length > 0 && (
            <HistorySection history={history} onHistorySelect={handleHistorySelect} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <ApiKeyPrompt
        visible={showApiKeyPrompt}
        onClose={() => setShowApiKeyPrompt(false)}
        onApiKeySet={handleApiKeySet}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
