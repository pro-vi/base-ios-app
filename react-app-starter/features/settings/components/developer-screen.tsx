import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMiniApp } from '@/lib/apps/app-provider';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebugSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { activeApp, switchApp } = useMiniApp();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Debug Settings</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Mode Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Mode</Text>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={[
                styles.row,
                { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              ]}
              onPress={() => switchApp('foundation')}
            >
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Foundation</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  Essential tools only
                </Text>
              </View>
              {activeApp?.id === 'foundation' && (
                <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.row} onPress={() => switchApp('creative')}>
              <View style={styles.rowContent}>
                <Text style={[styles.rowTitle, { color: colors.text }]}>Creative Suite</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  All features enabled
                </Text>
              </View>
              {activeApp?.id === 'creative' && (
                <Ionicons name="checkmark-circle" size={24} color={colors.tint} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.6,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  rowSubtitle: {
    fontSize: 13,
  },
});
