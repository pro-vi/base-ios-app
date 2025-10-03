import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, TouchableOpacity, View, Image } from 'react-native';
import PhotoSelectionSheet from './photo-selection-sheet';
import CameraScreen from './camera-screen';
import PhotoViewerModal from './photo-viewer-modal';
import { Ionicons } from '@expo/vector-icons';

interface MessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  selectedPhoto?: string | null;
  onPhotoSelect?: (photo: string) => void;
  onRemovePhoto?: () => void;
}

export default function MessageInput({
  value,
  onChangeText,
  onSend,
  selectedPhoto,
  onPhotoSelect,
  onRemovePhoto,
}: MessageInputProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);

  return (
    <View style={styles.outerContainer}>
      {/* Photo Preview */}
      {selectedPhoto && (
        <View style={styles.photoPreviewWrapper}>
          <TouchableOpacity
            style={styles.photoPreviewContainer}
            activeOpacity={0.9}
            onPress={() => setShowPhotoViewer(true)}
          >
            <Image source={{ uri: selectedPhoto }} style={styles.photoPreview} />
            <TouchableOpacity
              style={[styles.removePhotoButton, { backgroundColor: colors.background }]}
              onPress={onRemovePhoto}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={18} color={colors.text} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.plusButton,
            {
              backgroundColor: colors.tabIconDefault + '20',
            },
          ]}
          activeOpacity={0.7}
          onPress={() => setShowPhotoSheet(true)}
        >
          <IconSymbol name="plus" size={20} color={colors.text} />
        </TouchableOpacity>

        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: colorScheme === 'dark' ? '#3A3D40' : '#E0E0E0',
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder="Message"
            placeholderTextColor={colors.tabIconDefault}
            maxLength={1000}
            onSubmitEditing={onSend}
            returnKeyType="send"
            enablesReturnKeyAutomatically={true}
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: value.trim()
                  ? colorScheme === 'dark'
                    ? colors.text
                    : colors.text
                  : colors.tabIconDefault,
                opacity: value.trim() ? 1 : 0.5,
              },
            ]}
            onPress={onSend}
            disabled={!value.trim()}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="arrow.up"
              size={20}
              color={colorScheme === 'dark' ? colors.background : colors.background}
            />
          </TouchableOpacity>
        </View>
      </View>

      <PhotoSelectionSheet
        visible={showPhotoSheet}
        onClose={() => setShowPhotoSheet(false)}
        onCameraPress={() => {
          setShowPhotoSheet(false);
          setTimeout(() => setShowCamera(true), 300);
        }}
        onPhotoSelect={(photoUri) => {
          if (onPhotoSelect) {
            onPhotoSelect(photoUri);
          }
        }}
      />

      <CameraScreen visible={showCamera} onClose={() => setShowCamera(false)} />

      {selectedPhoto && (
        <PhotoViewerModal
          visible={showPhotoViewer}
          imageUrl={selectedPhoto}
          onClose={() => setShowPhotoViewer(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    // Container for both photo preview and input
  },
  photoPreviewWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  container: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    alignItems: 'flex-end',
    gap: 8,
  },
  plusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 22,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 4,
    paddingVertical: 4,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingRight: 8,
    maxHeight: 120,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreviewContainer: {
    position: 'relative',
    alignSelf: 'flex-start',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
