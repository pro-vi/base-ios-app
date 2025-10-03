import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CameraScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function CameraScreen({ visible, onClose }: CameraScreenProps) {
  const insets = useSafeAreaInsets();

  const handleCapture = () => {
    // TODO: Implement camera capture
    console.log('Capture photo');
    onClose();
  };

  const handleFlash = () => {
    // TODO: Toggle flash
    console.log('Toggle flash');
  };

  const handleFlip = () => {
    // TODO: Flip camera front/back
    console.log('Flip camera');
  };

  const handleClose = () => {
    console.log('Close button pressed');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, { backgroundColor: '#000', paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleClose}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleFlash}
            style={styles.headerButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="flash-off" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Camera Preview Area */}
        <View style={styles.cameraPreview}>
          <Text style={styles.placeholderText}>Camera Preview</Text>
          <Text style={styles.placeholderSubtext}>
            Camera functionality will be implemented here
          </Text>
        </View>

        {/* Bottom Controls */}
        <View style={[styles.bottomControls, { paddingBottom: insets.bottom + 30 }]}>
          <TouchableOpacity style={styles.galleryButton}>
            <View style={styles.galleryPlaceholder} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCapture} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleFlip} style={styles.flipButton}>
            <Ionicons name="camera-reverse" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    padding: 5,
  },
  headerButton: {
    padding: 5,
  },
  cameraPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholderSubtext: {
    color: '#999',
    fontSize: 14,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 40,
  },
  galleryButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '#333',
    borderWidth: 2,
    borderColor: '#fff',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
  flipButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
