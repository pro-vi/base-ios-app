import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
// import { useAppState } from '@/lib/AppStateManager';
import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signUp } = useAuth();
  // Removed unused appState variable

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordsMatch = password === confirmPassword;
  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length > 0 &&
    passwordsMatch;

  const handleSignUp = async () => {
    if (!isFormValid) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await signUp(email.trim().toLowerCase(), password, name.trim());

      if (error) {
        let message = 'Unable to create account. ';
        if (error.message.includes('already registered')) {
          message = 'This email is already registered.';
        } else if (error.message.includes('weak password')) {
          message = 'Password is too weak.';
        } else {
          message = error.message;
        }
        setErrorMessage(message);
      } else {
        Alert.alert('Success', 'Account created! Check your email to verify.', [
          { text: 'OK', onPress: () => router.push('/(auth)/login') },
        ]);
      }
    } catch {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Ionicons name="chevron-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: colors.text }]}>Sign Up</Text>
        <View style={styles.backButton} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <View style={styles.form}>
              {/* Name Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.text + '50'}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  textContentType="name"
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text + '50'}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                <View
                  style={[
                    styles.passwordContainer,
                    { backgroundColor: colors.card, borderColor: colors.border },
                  ]}
                >
                  <TextInput
                    style={[styles.passwordInput, { color: colors.text }]}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.text + '50'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    textContentType="newPassword"
                    editable={!loading}
                    returnKeyType="next"
                  />
                  <TouchableOpacity
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      size={20}
                      color={colors.tabIconDefault}
                    />
                  </TouchableOpacity>
                </View>
                {password.length > 0 && password.length < 6 && (
                  <Text style={[styles.warningText, { color: colors.notification }]}>
                    Password must be at least 6 characters
                  </Text>
                )}
              </View>

              {/* Confirm Password Field */}
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Confirm Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.text + '50'}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  textContentType="newPassword"
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={handleSignUp}
                />
                {confirmPassword.length > 0 && (
                  <View style={styles.matchContainer}>
                    <Ionicons
                      name={passwordsMatch ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={passwordsMatch ? colors.icon : colors.notification}
                    />
                    <Text
                      style={[
                        styles.matchText,
                        { color: passwordsMatch ? colors.icon : colors.notification },
                      ]}
                    >
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Error Message */}
              {errorMessage && (
                <View
                  style={[styles.errorContainer, { backgroundColor: colors.notification + '10' }]}
                >
                  <Text style={[styles.errorText, { color: colors.notification }]}>
                    {errorMessage}
                  </Text>
                </View>
              )}

              {/* Create Account Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: isFormValid ? colors.tint : colors.buttonDisabled },
                  (!isFormValid || loading) && styles.disabledButton,
                ]}
                onPress={handleSignUp}
                disabled={!isFormValid || loading}
              >
                {loading ? (
                  <ActivityIndicator
                    color={isFormValid ? colors.background : colors.buttonDisabledText}
                  />
                ) : (
                  <Text
                    style={[
                      styles.buttonText,
                      { color: isFormValid ? colors.background : colors.buttonDisabledText },
                    ]}
                  >
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={loading}>
                <Text style={[styles.linkText, { color: colors.tint }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    textAlign: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  warningText: {
    fontSize: 12,
    marginTop: 4,
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  matchText: {
    fontSize: 12,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
