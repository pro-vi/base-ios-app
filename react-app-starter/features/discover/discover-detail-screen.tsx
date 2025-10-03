import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscoverDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { title, author, color } = params as {
    title: string;
    author: string;
    color: string;
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background with gradient */}
      <LinearGradient
        colors={[color + 'B3', color + '66']} // 70% to 40% opacity
        style={StyleSheet.absoluteFillObject}
      />

      {/* Image placeholder */}
      <View style={styles.imageContainer}>
        <IconSymbol name="photo" size={100} color={color + 'CC'} />
      </View>

      {/* Top navigation */}
      <SafeAreaView style={styles.topNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleBack} activeOpacity={0.7}>
          <IconSymbol name="arrow.left" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.rightNav}>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <IconSymbol name="square.and.arrow.up" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <IconSymbol name="bookmark" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom content */}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.bottomGradient}>
        <View style={styles.bottomContent}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.authorRow}>
            <View style={styles.avatarContainer}>
              <Text style={[styles.avatarText, { color: color }]}>
                {author.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{author}</Text>
              <Text style={styles.timestamp}>2 hours ago</Text>
            </View>

            <TouchableOpacity style={styles.followButton} activeOpacity={0.7}>
              <Text style={styles.followText}>Follow</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol name="heart" size={18} color="white" />
              <Text style={styles.statText}>1.2k</Text>
            </View>

            <View style={styles.statItem}>
              <IconSymbol name="bubble.left" size={18} color="white" />
              <Text style={styles.statText}>234</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  rightNav: {
    flexDirection: 'row',
    gap: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
  },
  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  timestamp: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  followText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'black',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
});
