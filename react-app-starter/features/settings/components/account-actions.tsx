import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AccountActionsProps {
  onSignOut: () => void;
  onDeleteAccount: () => void;
  loading: boolean;
}

export function AccountActions({ onSignOut, onDeleteAccount, loading }: AccountActionsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: onSignOut,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  return (
    <>
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.actionRow} onPress={handleSignOut} disabled={loading}>
          <View style={styles.actionContent}>
            <IconSymbol name="arrow.right.square" size={20} color={colors.text} />
            <ThemedText style={styles.actionText}>Sign Out</ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.text + '50'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={styles.actionRow} onPress={handleDeleteAccount} disabled={loading}>
          <View style={styles.actionContent}>
            <IconSymbol name="trash" size={20} color="#FF3B30" />
            <ThemedText style={[styles.actionText, { color: '#FF3B30' }]}>
              Delete Account
            </ThemedText>
          </View>
          <IconSymbol name="chevron.right" size={16} color={colors.text + '50'} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
