import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GeminiApiKeyManager } from '@/lib/gemini-api-key';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ApiKeyPromptProps {
  visible: boolean;
  onClose: () => void;
  onApiKeySet: () => void;
}

export default function ApiKeyPrompt({ visible, onClose, onApiKeySet }: ApiKeyPromptProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    try {
      await GeminiApiKeyManager.setApiKey(apiKey.trim());
      Alert.alert('Success', 'API key saved successfully');
      setApiKey('');
      onApiKeySet();
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to save API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>

          <IconSymbol name="key.fill" size={48} color={colors.tint} />

          <Text style={[styles.title, { color: colors.text }]}>Gemini API Key Required</Text>

          <Text style={[styles.description, { color: colors.tabIconDefault }]}>
            To use AI image generation, please enter your Gemini API key. You can get one from
            Google AI Studio.
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.tabIconDefault,
              },
            ]}
            placeholder="Enter your Gemini API key"
            placeholderTextColor={colors.tabIconDefault}
            value={apiKey}
            onChangeText={setApiKey}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { backgroundColor: colors.background }]}
              onPress={onClose}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.saveButton, { backgroundColor: colors.tint }]}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Get API Key',
                'Visit Google AI Studio to get your free API key:\nhttps://makersuite.google.com/app/apikey',
                [{ text: 'OK' }]
              );
            }}
          >
            <Text style={[styles.helpText, { color: colors.tint }]}>How to get an API key?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {},
  saveButton: {},
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    fontSize: 14,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});
