import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppState } from '@/lib/AppStateManager';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { continueAsGuest } = useAppState();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showTermsAlert, setShowTermsAlert] = useState(false);
  const [showPrivacyAlert, setShowPrivacyAlert] = useState(false);

  const handleSkip = async () => {
    await continueAsGuest();
    router.replace('/(tabs)');
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        Alert.alert('Sign In Failed', error.message || 'Unable to sign in with Google');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert('Sign In Failed', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithApple();
      if (error) {
        Alert.alert('Sign In Failed', error.message || 'Unable to sign in with Apple');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      Alert.alert('Sign In Failed', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
      ]}
    >
      <ThemedView
        style={[
          styles.content,
          { backgroundColor: colorScheme === 'dark' ? '#000000' : '#FFFFFF' },
        ]}
      >
        {/* Skip button in top right */}
        <View style={styles.skipContainer}>
          <TouchableOpacity
            style={[
              styles.skipButton,
              {
                backgroundColor: colors.buttonPrimary,
                borderColor: colors.buttonPrimaryBorder,
              },
            ]}
            onPress={handleSkip}
          >
            <Text style={[styles.skipText, { color: colors.buttonPrimaryText }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerSection}>
          <ThemedText type="title" style={styles.title}>
            Cue
          </ThemedText>
          <ThemedText style={styles.subtitle}>Your space to connect and explore</ThemedText>
        </View>

        <View style={styles.buttonSection}>
          {/* Google Sign In */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.buttonPrimary,
                borderColor: colors.buttonPrimaryBorder,
              },
            ]}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Image source={require('@/assets/images/google.png')} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: colors.buttonPrimaryText }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Apple Sign In */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.buttonPrimary,
                borderColor: colors.buttonPrimaryBorder,
              },
            ]}
            onPress={handleAppleSignIn}
            disabled={isLoading}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="logo-apple" size={20} color={colors.buttonPrimaryText} />
            </View>
            <Text style={[styles.socialButtonText, { color: colors.buttonPrimaryText }]}>
              Continue with Apple
            </Text>
          </TouchableOpacity>

          {/* Email Sign Up */}
          <TouchableOpacity
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.buttonPrimary,
                borderColor: colors.buttonPrimaryBorder,
              },
            ]}
            onPress={() => router.push('/(auth)/login')}
            disabled={isLoading}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="mail" size={20} color={colors.buttonPrimaryText} />
            </View>
            <Text style={[styles.socialButtonText, { color: colors.buttonPrimaryText }]}>
              Continue with Email
            </Text>
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.tabIconDefault }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
              <Text style={[styles.signInLink, { color: colors.tint }]}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: colors.tabIconDefault }]}>
              By continuing you agree to the{' '}
            </Text>
            <TouchableOpacity onPress={() => setShowTermsAlert(true)}>
              <Text style={[styles.termsLink, { color: colors.tint }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.termsText, { color: colors.tabIconDefault }]}> and</Text>
          </View>
          <TouchableOpacity onPress={() => setShowPrivacyAlert(true)}>
            <Text style={[styles.termsLink, { color: colors.tint }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Loading overlay */}
      {isLoading && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: (colorScheme === 'dark' ? '#000000' : '#FFFFFF') + 'CC' },
          ]}
        >
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      )}

      {/* Terms Alert */}
      {showTermsAlert &&
        Alert.alert('Terms of Service', 'This would open the Terms of Service webpage', [
          { text: 'OK', onPress: () => setShowTermsAlert(false) },
        ])}

      {/* Privacy Alert */}
      {showPrivacyAlert &&
        Alert.alert('Privacy Policy', 'This would open the Privacy Policy webpage', [
          { text: 'OK', onPress: () => setShowPrivacyAlert(false) },
        ])}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 40,
  },
  buttonSection: {
    gap: 16,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  socialButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  iconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 11,
  },
  termsLink: {
    fontSize: 11,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
