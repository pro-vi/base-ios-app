import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';
import { logger } from './logger';
import Constants from 'expo-constants';

// Google Client IDs from environment variables
const GOOGLE_WEB_CLIENT_ID =
  Constants.expoConfig?.extra?.googleWebClientId ||
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  '';

// iOS Client ID from environment variables or config
const GOOGLE_IOS_CLIENT_ID =
  Constants.expoConfig?.extra?.googleIosClientId ||
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  '';

// Conditionally import Google Sign-In only if available
let GoogleSignin: any = null;
let statusCodes: any = null;
let isGoogleSignInAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  statusCodes = googleSignInModule.statusCodes;
  isGoogleSignInAvailable = true;
  logger.info('Google Sign-In module loaded successfully', null, 'SocialAuth');
} catch {
  logger.warn('Google Sign-In not available. Running in Expo Go or web?', null, 'SocialAuth');
}

// Configure Google Sign-In
export const configureGoogleSignIn = () => {
  if (!isGoogleSignInAvailable) {
    logger.info('Google Sign-In not available in this environment', null, 'SocialAuth');
    return;
  }

  try {
    if (!GOOGLE_WEB_CLIENT_ID) {
      logger.warn(
        'Google Web Client ID not configured. Check your environment variables.',
        null,
        'SocialAuth'
      );
      return;
    }

    const config: any = {
      webClientId: GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
      scopes: ['profile', 'email'],
    };

    // Add iOS client ID if available and on iOS platform
    if (Platform.OS === 'ios') {
      if (GOOGLE_IOS_CLIENT_ID) {
        config.iosClientId = GOOGLE_IOS_CLIENT_ID;
        logger.info(
          'Using iOS Client ID for Google Sign-In',
          { iosClientId: GOOGLE_IOS_CLIENT_ID.substring(0, 20) + '...' },
          'SocialAuth'
        );
      } else {
        logger.warn(
          'iOS Client ID not found. Google Sign-In may not work properly on iOS.',
          {
            webClientId: GOOGLE_WEB_CLIENT_ID.substring(0, 20) + '...',
            platform: Platform.OS,
          },
          'SocialAuth'
        );
      }
    }

    GoogleSignin.configure(config);
    logger.info(
      'Google Sign-In configured successfully',
      {
        webClientId: GOOGLE_WEB_CLIENT_ID,
        hasIosClientId: !!config.iosClientId,
      },
      'SocialAuth'
    );
  } catch (error) {
    logger.error('Failed to configure Google Sign-In', error, 'SocialAuth');
  }
};

// Check if Google Sign-In is available
export const isGoogleSignInSupported = () => {
  return isGoogleSignInAvailable && Platform.OS !== 'web';
};

// Google Sign-In
export const signInWithGoogle = async () => {
  if (!isGoogleSignInAvailable) {
    logger.warn(
      'Google Sign-In not available',
      {
        isGoogleSignInAvailable,
        platform: Platform.OS,
      },
      'SocialAuth'
    );
    return {
      user: null,
      error: {
        message: 'Google Sign-In requires a development build. Run: expo prebuild && expo run:ios',
      },
    };
  }

  // Log current configuration
  logger.debug(
    'Google Sign-In configuration',
    {
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      platform: Platform.OS,
    },
    'SocialAuth'
  );

  try {
    logger.info('Starting Google Sign-In', null, 'SocialAuth');

    // Check if Google Play Services are available (Android)
    await GoogleSignin.hasPlayServices();

    // Sign in with Google
    const userInfo = await GoogleSignin.signIn();
    logger.info(
      'Google Sign-In successful',
      { user: userInfo.data?.user?.email || 'User signed in' },
      'SocialAuth'
    );

    if (userInfo.data?.idToken) {
      // Sign in with Supabase using the ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      });

      if (error) {
        logger.error('Supabase Google sign-in failed', error, 'SocialAuth');
        throw error;
      }

      logger.info('Supabase Google sign-in successful', { userId: data.user?.id }, 'SocialAuth');
      return { user: data.user, error: null };
    } else {
      throw new Error('No ID token received from Google');
    }
  } catch (error: any) {
    logger.error('Google Sign-In error', error, 'SocialAuth');

    if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
      return { user: null, error: { message: 'Sign-in cancelled by user' } };
    } else if (error.code === statusCodes?.IN_PROGRESS) {
      return { user: null, error: { message: 'Sign-in already in progress' } };
    } else if (error.code === statusCodes?.PLAY_SERVICES_NOT_AVAILABLE) {
      return { user: null, error: { message: 'Google Play Services not available' } };
    } else {
      return { user: null, error: { message: error.message || 'Google sign-in failed' } };
    }
  }
};

// Check if Apple Sign-In is available
export const isAppleSignInSupported = async () => {
  if (Platform.OS !== 'ios') {
    return false;
  }

  // Check if running in Expo Go - Apple Sign-In won't work properly
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  if (isExpoGo) {
    return false; // Hide the button in Expo Go
  }

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
};

// Apple Sign-In
export const signInWithApple = async () => {
  try {
    if (Platform.OS !== 'ios') {
      return { user: null, error: { message: 'Apple Sign-In is only available on iOS' } };
    }

    // Check if running in Expo Go
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      return {
        user: null,
        error: {
          message:
            'Apple Sign-In requires a development build. It cannot work in Expo Go due to bundle ID restrictions.',
        },
      };
    }

    logger.info('Starting Apple Sign-In', null, 'SocialAuth');

    // Check if Apple Authentication is available
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      // Check if running in simulator
      const isSimulator = !Constants.isDevice;
      if (isSimulator) {
        return {
          user: null,
          error: {
            message:
              'Apple Sign-In is not available in the iOS Simulator. Please test on a real device.',
          },
        };
      }
      return { user: null, error: { message: 'Apple Sign-In is not available on this device' } };
    }

    // Request Apple sign-in
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    logger.info('Apple Sign-In successful', { user: credential.email }, 'SocialAuth');

    // Sign in with Supabase using the identity token
    if (credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        logger.error('Supabase Apple sign-in failed', error, 'SocialAuth');
        throw error;
      }

      logger.info('Supabase Apple sign-in successful', { userId: data.user?.id }, 'SocialAuth');
      return { user: data.user, error: null };
    } else {
      throw new Error('No identity token received from Apple');
    }
  } catch (error: any) {
    logger.error('Apple Sign-In error', error, 'SocialAuth');

    if (error.code === 'ERR_REQUEST_CANCELED') {
      return { user: null, error: { message: 'Sign-in cancelled by user' } };
    } else {
      return { user: null, error: { message: error.message || 'Apple sign-in failed' } };
    }
  }
};

// Sign out from social providers
export const signOutFromSocialProvider = async () => {
  try {
    // Sign out from Google if signed in
    if (isGoogleSignInAvailable && GoogleSignin) {
      try {
        // Use getCurrentUser to check if signed in
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          await GoogleSignin.signOut();
          logger.info('Signed out from Google', null, 'SocialAuth');
        }
      } catch (googleError) {
        // User might not be signed in with Google, which is fine
        logger.debug('No Google user to sign out', googleError, 'SocialAuth');
      }
    }

    // Apple doesn't require explicit sign-out
    // The session is managed by Supabase
  } catch (error) {
    logger.error('Error signing out from social provider', error, 'SocialAuth');
  }
};
