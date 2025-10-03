import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ActionSheetIOS,
  Platform,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isDownloading, setIsDownloading] = useState(false);
  const player = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.play();
  });

  useEffect(() => {
    const loadVideo = async () => {
      if (player && videoUrl) {
        try {
          console.log('[VideoPlayer] Loading video URL:', videoUrl);
          await player.replaceAsync(videoUrl);
          player.play();
          console.log('[VideoPlayer] Video loaded and playing');
        } catch (error: any) {
          console.error('[VideoPlayer] Error loading video:', error);
        }
      }
    };
    loadVideo();
  }, [videoUrl, player]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to save videos to your gallery');
        setIsDownloading(false);
        return;
      }

      // Generate filename
      const filename = `veo_video_${Date.now()}.mp4`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      console.log('[VideoPlayer] Downloading video from:', videoUrl);
      console.log('[VideoPlayer] Saving to:', fileUri);

      // Download the video
      const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);

      console.log('[VideoPlayer] Download complete:', downloadResult.uri);
      console.log('[VideoPlayer] Download status:', downloadResult.status);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      await MediaLibrary.createAlbumAsync('Veo Videos', asset, false);

      Alert.alert('Success', 'Video saved to your gallery!');
    } catch (error: any) {
      console.error('[VideoPlayer] Download error:', error);
      Alert.alert('Download failed', error.message || 'Failed to save video');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsDownloading(true);

      // Download to temp location first
      const filename = `veo_video_${Date.now()}.mp4`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      console.log('[VideoPlayer] Downloading for sharing from:', videoUrl);
      console.log('[VideoPlayer] Downloading for sharing to:', fileUri);

      const downloadResult = await FileSystem.downloadAsync(videoUrl, fileUri);

      console.log('[VideoPlayer] Share download complete:', downloadResult.uri);
      console.log('[VideoPlayer] Share download status:', downloadResult.status);

      if (downloadResult.status !== 200) {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error: any) {
      console.error('[VideoPlayer] Share error:', error);
      Alert.alert('Share failed', error.message || 'Failed to share video');
    } finally {
      setIsDownloading(false);
    }
  };

  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Save to Gallery', 'Share'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleDownload();
          } else if (buttonIndex === 2) {
            handleShare();
          }
        }
      );
    } else {
      // For Android, use Alert
      Alert.alert(
        'Video Options',
        '',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Save to Gallery', onPress: handleDownload },
          { text: 'Share', onPress: handleShare },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Generated Video</Text>
        <TouchableOpacity
          onPress={showActionSheet}
          style={styles.menuButton}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <IconSymbol name="ellipsis" size={24} color={colors.text} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          allowsPictureInPicture
          contentFit="contain"
          nativeControls
        />
      </View>
      <Text style={[styles.info, { color: colors.tabIconDefault }]}>
        8 seconds • 1080p • Audio included
      </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  info: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
  },
});
