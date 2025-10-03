import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface PhotoFullScreenProps {
  visible: boolean;
  color: string;
  onClose: () => void;
}

const { height: screenHeight } = Dimensions.get('window');

export function PhotoFullScreen({ visible, color, onClose }: PhotoFullScreenProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(translateY._value);
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);

        const progress = Math.abs(gestureState.dy) / 200;
        const newScale = Math.max(0.5, 1 - progress * 0.3);
        scale.setValue(newScale);

        const newOpacity = Math.max(0.3, 1 - progress * 0.5);
        opacity.setValue(newOpacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();

        if (Math.abs(gestureState.dy) > 100) {
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: gestureState.dy > 0 ? screenHeight : -screenHeight,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onClose();
            translateY.setValue(0);
            scale.setValue(1);
            opacity.setValue(1);
          });
        } else {
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.container, { opacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.photoContainer,
            {
              transform: [{ translateY }, { scale }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={[styles.photo, { backgroundColor: color + '80' }]} />
        </Animated.View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <View style={styles.closeButtonBackground}>
            <Ionicons name="close" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: '90%',
    aspectRatio: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  closeButtonBackground: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
