import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PhotoSelectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress?: () => void;
  onPhotoSelect?: (photoUri: string) => void;
}

// Mock recent photos data
const mockRecentPhotos = [
  { id: '1', uri: 'https://picsum.photos/200/200?random=1' },
  { id: '2', uri: 'https://picsum.photos/200/200?random=2' },
  { id: '3', uri: 'https://picsum.photos/200/200?random=3' },
  { id: '4', uri: 'https://picsum.photos/200/200?random=4' },
  { id: '5', uri: 'https://picsum.photos/200/200?random=5' },
  { id: '6', uri: 'https://picsum.photos/200/200?random=6' },
  { id: '7', uri: 'https://picsum.photos/200/200?random=7' },
  { id: '8', uri: 'https://picsum.photos/200/200?random=8' },
  { id: '9', uri: 'https://picsum.photos/200/200?random=9' },
];

const { width: screenWidth } = Dimensions.get('window');
const numColumns = 3;
const spacing = 2;
const itemSize = (screenWidth - spacing * (numColumns + 1)) / numColumns;

export default function PhotoSelectionSheet({
  visible,
  onClose,
  onCameraPress,
  onPhotoSelect,
}: PhotoSelectionSheetProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const handleCameraPress = () => {
    console.log('Camera button pressed!');
    if (onCameraPress) {
      onCameraPress();
    }
  };

  const handlePhotoPress = (photoUri: string) => {
    console.log('Selected photo:', photoUri);
    if (onPhotoSelect) {
      onPhotoSelect(photoUri);
    }
    onClose();
  };

  const handleShowAll = () => {
    // TODO: Navigate to full photo library
    console.log('Show all photos');
  };

  const renderPhoto = ({ item, index }: { item: { id: string; uri: string }; index: number }) => {
    // First item is the camera placeholder
    if (index === 0) {
      return (
        <TouchableOpacity
          style={[styles.photoItem, { backgroundColor: colors.tabIconDefault + '20' }]}
          onPress={handleCameraPress}
        >
          <Ionicons name="camera" size={40} color={colors.tabIconDefault} />
        </TouchableOpacity>
      );
    }

    // Rest are recent photos
    const photo = mockRecentPhotos[index - 1];
    if (!photo) return null;

    return (
      <TouchableOpacity style={styles.photoItem} onPress={() => handlePhotoPress(photo.uri)}>
        <Image source={{ uri: photo.uri }} style={styles.photoImage} />
      </TouchableOpacity>
    );
  };

  // Add camera placeholder as first item
  const data = [{ id: 'camera', uri: '' }, ...mockRecentPhotos];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom || 20,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: colors.tint }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Select Photo</Text>
            <View style={styles.closeButton}>
              <Text style={styles.closeText}></Text>
            </View>
          </View>

          {/* Photos Grid */}
          <FlatList
            data={data}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Show All Button */}
          <TouchableOpacity
            style={[styles.showAllButton, { borderTopColor: colors.tabIconDefault + '20' }]}
            onPress={handleShowAll}
          >
            <Text style={[styles.showAllText, { color: colors.tint }]}>Show All</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.tint} />
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: 60,
  },
  closeText: {
    fontSize: 17,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  gridContent: {
    padding: spacing,
  },
  row: {
    justifyContent: 'space-between',
  },
  photoItem: {
    width: itemSize,
    height: itemSize,
    margin: spacing / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  showAllText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
