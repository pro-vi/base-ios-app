import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

interface AccountSectionProps {
  email?: string;
  createdAt?: string;
  isDemo: boolean;
}

export function AccountSection({ email, createdAt, isDemo }: AccountSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <ThemedText style={styles.sectionTitle}>Account</ThemedText>

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Email</ThemedText>
        <ThemedText style={styles.value}>
          {email || 'Not available'}
          {isDemo && ' (Demo)'}
        </ThemedText>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <ThemedText style={styles.label}>Member Since</ThemedText>
        <ThemedText style={styles.value}>
          {createdAt ? new Date(createdAt).toLocaleDateString() : 'Not available'}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 15,
    opacity: 0.7,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#00000010',
    marginHorizontal: -16,
  },
});
