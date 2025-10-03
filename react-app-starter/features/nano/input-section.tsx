import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface InputSectionProps {
  mode: 'text-to-image' | 'edit-image';
  prompt: string;
  selectedImage: string | null;
  isGenerating: boolean;
  onPromptChange: (text: string) => void;
  onImageSelect: (image: string) => void;
  onGenerate: () => void;
  onClear: () => void;
}

const samplePrompts = [
  'A nano banana floating in space with stars',
  'Tiny banana on a microchip circuit board',
  'Microscopic banana under electron microscope',
  'Nano banana in a futuristic laboratory',
  'Golden nano banana with Gemini constellation',
];

export default function InputSection({
  mode,
  prompt,
  selectedImage,
  isGenerating,
  onPromptChange,
  onImageSelect,
  onGenerate,
  onClear,
}: InputSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      onImageSelect(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const canGenerate = prompt.trim() && (mode === 'text-to-image' || selectedImage);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {mode === 'edit-image' && (
        <TouchableOpacity
          style={[styles.imagePickerButton, { borderColor: colors.tabIconDefault }]}
          onPress={pickImage}
        >
          {selectedImage ? (
            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          ) : (
            <>
              <IconSymbol name="photo" size={40} color={colors.tabIconDefault} />
              <Text style={[styles.imagePickerText, { color: colors.tabIconDefault }]}>
                Select an image to edit
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      <TextInput
        style={[
          styles.promptInput,
          {
            backgroundColor: colors.background,
            color: colors.text,
            borderColor: colors.tabIconDefault,
          },
        ]}
        placeholder={
          mode === 'text-to-image'
            ? 'Describe your nano banana creation...'
            : 'Describe how to modify the image...'
        }
        placeholderTextColor={colors.tabIconDefault}
        value={prompt}
        onChangeText={onPromptChange}
        multiline
        maxLength={500}
      />

      {mode === 'text-to-image' && (
        <View style={styles.samplesContainer}>
          <Text style={[styles.samplesTitle, { color: colors.tabIconDefault }]}>Try these:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {samplePrompts.map((sample, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.sampleChip, { backgroundColor: colors.background }]}
                onPress={() => onPromptChange(sample)}
              >
                <Text style={[styles.sampleText, { color: colors.text }]}>{sample}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.generateButton,
            { backgroundColor: colors.tint },
            !canGenerate && styles.disabledButton,
          ]}
          onPress={onGenerate}
          disabled={isGenerating || !canGenerate}
        >
          {isGenerating ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <>
              <IconSymbol name="sparkles" size={20} color={colors.background} />
              <Text style={[styles.generateButtonText, { color: colors.background }]}>
                Generate
              </Text>
            </>
          )}
        </TouchableOpacity>

        {(prompt || selectedImage) && (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: colors.background }]}
            onPress={onClear}
          >
            <IconSymbol name="xmark" size={20} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  imagePickerButton: {
    height: 150,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
  },
  promptInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  samplesContainer: {
    marginTop: 12,
  },
  samplesTitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  sampleChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  sampleText: {
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  generateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
