import { veoService } from '@/lib/veo-service';
import { GeminiApiKeyManager } from '@/lib/gemini-api-key';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import VideoHeader from './video-header';
import ModeSelector from './mode-selector';
import InputSection from './input-section';
import VideoPlayer from './video-player';
import HistorySection, { type VideoGeneration } from './history-section';
import FeaturesInfo from './features-info';
import ApiKeyPrompt from '../nano/api-key-prompt';

type GenerationMode = 'text-to-video' | 'image-to-video';

const MAX_PROMPT_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 10;
const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

export default function VideoScreen() {
  const colorScheme = useColorScheme();
  const colors = useMemo(() => Colors[colorScheme ?? 'light'], [colorScheme]);
  const [mode, setMode] = useState<GenerationMode>('text-to-video');
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [history, setHistory] = useState<VideoGeneration[]>([]);
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
      Alert.alert('Enter a prompt', 'Please describe the video you want to generate');
      return false;
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      Alert.alert(
        'Prompt too long',
        `Please keep your prompt under ${MAX_PROMPT_LENGTH} characters`
      );
      return false;
    }

    if (mode === 'image-to-video' && !selectedImage) {
      Alert.alert('Select an image', 'Please select an image for image-to-video mode');
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
    setGenerationProgress('Initializing video generation...');
    setError(null);

    try {
      let videoUrl: string;
      const onProgress = (status: string) => {
        setGenerationProgress(status);
      };

      if (mode === 'image-to-video' && selectedImage) {
        const base64 = selectedImage.split(',')[1];
        videoUrl = await veoService.generateVideoFromImage(prompt, base64, onProgress);
      } else {
        videoUrl = await veoService.generateVideo(prompt, onProgress);
      }

      setCurrentVideo(videoUrl);

      const newGeneration: VideoGeneration = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        videoUrl,
        thumbnail: selectedImage || undefined,
        createdAt: new Date(),
      };

      setHistory((prev) => {
        const updated = [newGeneration, ...prev];
        return updated.slice(0, MAX_HISTORY_ITEMS);
      });
    } catch (error: any) {
      const errorMessage = error.message || DEFAULT_ERROR_MESSAGE;
      setError(errorMessage);
      Alert.alert('Generation Failed', errorMessage);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  }, [prompt, mode, selectedImage, validateInput]);

  const clearAll = useCallback(() => {
    setPrompt('');
    setSelectedImage(null);
    setCurrentVideo(null);
    setMode('text-to-video');
    setError(null);
  }, []);

  const handleModeChange = useCallback((newMode: GenerationMode) => {
    setMode(newMode);
    if (newMode === 'text-to-video') {
      setSelectedImage(null);
    }
    setError(null);
  }, []);

  const handleHistorySelect = useCallback((item: VideoGeneration) => {
    setPrompt(item.prompt);
    setCurrentVideo(item.videoUrl);
    if (item.thumbnail) {
      setSelectedImage(item.thumbnail);
      setMode('image-to-video');
    } else {
      setMode('text-to-video');
      setSelectedImage(null);
    }
    setError(null);
  }, []);

  const handleImageSelect = useCallback((image: string) => {
    setSelectedImage(image);
    setMode('image-to-video');
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

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
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
          <VideoHeader onApiKeyPress={() => setShowApiKeyPrompt(true)} />

          <ModeSelector mode={mode} onModeChange={handleModeChange} />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: Colors.error }]}>{error}</Text>
            </View>
          )}

          <InputSection
            mode={mode}
            prompt={prompt}
            selectedImage={selectedImage}
            isGenerating={isGenerating}
            generationProgress={generationProgress}
            onPromptChange={handlePromptChange}
            onImageSelect={handleImageSelect}
            onGenerate={handleGenerate}
            onClear={clearAll}
          />

          {currentVideo && <VideoPlayer videoUrl={currentVideo} />}

          {history.length > 0 && (
            <HistorySection history={history} onHistorySelect={handleHistorySelect} />
          )}

          <FeaturesInfo />
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
