# React native app starter

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

```bash
cp .env.example .env
```

See [docs/configuration.md](docs/configuration.md) for detailed configuration guide.

### 3. Run the app

#### First Time Setup (Required for Google Sign-In)

```bash
# Build and install development build
npm install
npx expo prebuild --clean  # generate native code
npx expo run:ios    # run native code on ios simulator
npx expo run:android
```

#### Testing without Native Features

```bash
npx expo start
```

## Important Notes

- **Google Sign-In** requires a development build (`npm run dev:ios/android`)
- **Expo Go** can't run this app due to native dependencies
- Environment defaults to **production** - no need to set APP_ENV

## Development Build vs Expo Go

**This app requires a Development Build** because it uses:

- Native modules (`@react-native-google-signin/google-signin`, `react-native-purchases`)
- Custom bundle identifiers and URL schemes
- Features not available in the Expo SDK

**Expo Go apps** only work with:

- Expo SDK packages
- No custom native code
- Standard `exp://` QR codes readable by phone cameras

**QR Code differences:**

- Development Build: `exp+cue://` (requires dev build installed)
- Expo Go: `exp://` (works with Expo Go app from store)
