import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DiscoverTab = 'Trending' | 'Art' | 'Photography' | 'Design' | 'Original';

interface DiscoverItem {
  id: string;
  title: string;
  author: string;
  color: string;
  height: number;
}

const mutedColors = [
  '#FF6B6B', // Soft red
  '#FF9F70', // Soft orange
  '#FFD93D', // Soft yellow
  '#6BCF7F', // Soft green
  '#4ECDC4', // Soft teal
  '#5FA8D3', // Soft blue
  '#7B68EE', // Soft purple
  '#FF79CD', // Soft pink
  '#FFA07A', // Light salmon
  '#87CEEB', // Sky blue
  '#98D8C8', // Mint green
  '#F7B733', // Golden orange
];

const generateItems = (tab: DiscoverTab): DiscoverItem[] => {
  const getTitles = () => {
    switch (tab) {
      case 'Trending':
        return [
          'Morning light through windows',
          'Urban exploration stories',
          'Coffee shop chronicles',
          'Mountain peak sunrise',
          'City streets at night',
          'Abstract minimalism',
          "Nature's patterns",
          'Architectural details',
        ];
      case 'Art':
        return [
          'Abstract expressions',
          'Digital art evolution',
          'Contemporary sculptures',
          'Mixed media explorations',
          'Color theory in practice',
          'Texture and form',
          'Visual storytelling',
          'Modern interpretations',
        ];
      case 'Photography':
        return [
          'Golden hour portraits',
          'Street photography tips',
          'Landscape compositions',
          'Black and white moments',
          'Wildlife encounters',
          'Macro discoveries',
          'Night sky wonders',
          'Documentary series',
        ];
      case 'Design':
        return [
          'Minimalist interfaces',
          'Typography experiments',
          'Brand identity systems',
          'User experience patterns',
          'Color palette inspiration',
          'Layout principles',
          'Motion design trends',
          'Sustainable design',
        ];
      default:
        return [];
    }
  };

  const getAuthors = () => {
    switch (tab) {
      case 'Trending':
        return ['Creative Studio', 'Daily Digest', 'Trend Watch', 'Popular Now'];
      case 'Art':
        return ['Art Gallery', 'Studio Collective', 'Artist Network', 'Creative Hub'];
      case 'Photography':
        return ['Photo Journal', 'Lens Magazine', 'Visual Stories', 'Photo Daily'];
      case 'Design':
        return ['Design Weekly', 'UX Studio', 'Design Lab', 'Creative Brief'];
      default:
        return [];
    }
  };

  const titles = getTitles();
  const authors = getAuthors();

  if (tab === 'Original') {
    return [];
  }

  return Array.from({ length: 20 }, (_, index) => ({
    id: `${tab}-${index}`,
    title: titles[index % titles.length],
    author: authors[index % authors.length],
    color: mutedColors[Math.floor(Math.random() * mutedColors.length)],
    height: 150 + Math.random() * 150,
  }));
};

const { width: screenWidth } = Dimensions.get('window');

export default function DiscoverScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<DiscoverTab>('Trending');
  const [refreshing, setRefreshing] = useState(false);
  const horizontalScrollRef = useRef<ScrollView>(null);
  const tabScrollRef = useRef<ScrollView>(null);

  const tabs: DiscoverTab[] = ['Trending', 'Art', 'Photography', 'Design', 'Original'];

  useMemo(() => generateItems(selectedTab), [selectedTab]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleTabPress = (index: number) => {
    setSelectedTab(tabs[index]);
    horizontalScrollRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);
    if (index >= 0 && index < tabs.length) {
      setSelectedTab(tabs[index]);

      // Scroll tab indicator into view
      if (tabScrollRef.current) {
        const tabWidth = 80; // Approximate width of each tab
        const scrollPosition = index * tabWidth - screenWidth / 2 + tabWidth / 2;
        tabScrollRef.current.scrollTo({ x: Math.max(0, scrollPosition), animated: true });
      }
    }
  };

  const handleItemPress = (item: DiscoverItem) => {
    router.push({
      pathname: '/discover-detail',
      params: {
        id: item.id,
        title: item.title,
        author: item.author,
        color: item.color,
      },
    });
  };

  // Split items into two columns for masonry layout
  const splitIntoColumns = (items: DiscoverItem[]) => {
    const leftColumn: DiscoverItem[] = [];
    const rightColumn: DiscoverItem[] = [];

    items.forEach((item, index) => {
      if (index % 2 === 0) {
        leftColumn.push(item);
      } else {
        rightColumn.push(item);
      }
    });

    return { leftColumn, rightColumn };
  };

  const renderItem = (item: DiscoverItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.gridItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.imageContainer,
          {
            backgroundColor: item.color + '66', // 40% opacity
            height: item.height,
          },
        ]}
      />
      <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={[styles.itemAuthor, { color: colors.tabIconDefault }]} numberOfLines={1}>
        {item.author}
      </Text>
    </TouchableOpacity>
  );

  const renderMasonryContent = (tabItems: DiscoverItem[]) => {
    const { leftColumn, rightColumn } = splitIntoColumns(tabItems);

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.masonryContainer}>
          <View style={styles.column}>{leftColumn.map(renderItem)}</View>
          <View style={styles.column}>{rightColumn.map(renderItem)}</View>
        </View>
      </ScrollView>
    );
  };

  const renderTabContent = (tab: DiscoverTab) => {
    if (tab === 'Original') {
      return renderOriginalContent();
    }
    const tabItems = generateItems(tab);
    return renderMasonryContent(tabItems);
  };

  const renderOriginalContent = () => (
    <View style={styles.originalContainer}>
      <IconSymbol name="sparkles" size={80} color={colors.tabIconDefault} />
      <ThemedText type="title" style={styles.originalTitle}>
        Original Content
      </ThemedText>
      <ThemedText style={styles.originalSubtitle}>
        Discover unique and original content created by our community
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <View style={styles.tabContainer}>
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => handleTabPress(index)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: selectedTab === tab ? colors.text : colors.tabIconDefault,
                    fontWeight: selectedTab === tab ? '600' : '400',
                  },
                ]}
              >
                {tab}
              </Text>
              {selectedTab === tab && (
                <View style={[styles.tabIndicator, { backgroundColor: colors.text }]} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />

      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.contentContainer}
      >
        {tabs.map((tab) => (
          <View key={tab} style={{ width: screenWidth }}>
            {renderTabContent(tab)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  tabContainer: {
    height: 48,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  tabButton: {
    marginRight: 24,
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 14,
  },
  tabIndicator: {
    height: 3,
    marginTop: 4,
    borderRadius: 1.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#00000015',
  },
  masonryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  column: {
    flex: 1,
    paddingHorizontal: 6,
  },
  gridItem: {
    marginBottom: 12,
  },
  imageContainer: {
    borderRadius: 12,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 4,
  },
  itemAuthor: {
    fontSize: 12,
    marginBottom: 8,
  },
  originalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  originalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  originalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 22,
  },
});
