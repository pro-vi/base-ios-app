import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default {
  expo: {
    name: process.env.APP_NAME || 'Cue Dev',
    slug: process.env.APP_SLUG || 'cue dev',
    version: process.env.APP_VERSION || '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: process.env.APP_SCHEME || 'cue',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      buildNumber: process.env.APP_BUILD_NUMBER || '1',
      usesAppleSignIn: true,
      supportsTablet: true,
      bundleIdentifier: process.env.IOS_BUNDLE_ID,
      appleTeamId: process.env.APPLE_TEAM_ID,
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: [
              process.env.IOS_URL_SCHEME || 'com.googleusercontent.apps.default',
            ],
          },
        ],
      },
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      package: process.env.ANDROID_PACKAGE,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: process.env.ADAPTIVE_ICON_BG_COLOR || '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: process.env.SPLASH_BG_COLOR || '#ffffff',
        },
      ],
      'expo-apple-authentication',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      environment: process.env.ENVIRONMENT || 'production',
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};
