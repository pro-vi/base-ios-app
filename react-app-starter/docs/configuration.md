# Configuration Guide

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

## Required Configuration

### App Settings

- `APP_NAME` - Your app display name (e.g., "My App")
- `APP_SLUG` - URL-safe app identifier (e.g., "my-app")
- `APP_VERSION` - App version (e.g., "1.0.0")
- `APP_SCHEME` - Deep linking scheme (e.g., "myapp")
- `ENVIRONMENT` - Environment setting (defaults to "production")

### Platform Identifiers

- `IOS_BUNDLE_ID` - iOS bundle identifier (e.g., "com.company.app")
- `ANDROID_PACKAGE` - Android package name (e.g., "com.company.app")

### Google Sign-In

- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` - OAuth 2.0 Web client ID from Google Console
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` - iOS client ID from Google Console
- `IOS_URL_SCHEME` - iOS URL scheme for Google Sign-In (format: `com.googleusercontent.apps.YOUR_CLIENT_ID`)

### Supabase (Optional)

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### RevenueCat (Optional)

- `EXPO_PUBLIC_REVENUECAT_IOS_KEY` - RevenueCat iOS API key
- `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` - RevenueCat Android API key
- `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` - RevenueCat entitlement identifier

### UI Customization (Optional)

- `SPLASH_BG_COLOR` - Splash screen background color (default: "#ffffff")
- `ADAPTIVE_ICON_BG_COLOR` - Android adaptive icon background (default: "#ffffff")

## Notes

- Variables prefixed with `EXPO_PUBLIC_` are accessible in the app code
- Variables without prefix are only used during build configuration
- Default environment is "production" for simplicity
- All API keys should be kept secure and never committed to version control
