# Expo

- [Expo Go vs Development Builds: Which should you choose?](https://expo.dev/go)
- [Create a production build locally](https://docs.expo.dev/guides/local-app-production/)

## Expo Go Pros

- Prototype simple features (ui) fast and preview on real device

## Expo Go Limitations

- Only use libraries bundled in Expo Go (meaning if )
- Does not use your app spcific package name or bundle identifier
- Might experience different behavior compared to a production build

Expo Go doesn't support:

- **OAuth authentication**: Google Sign-In
- **Native modules** - RevenueCat, custom native code
- **In-app purchases** - Requires native IAP configuration
- **Push notifications** - Needs native setup and certificates
- **Custom app configurations** - Bundle IDs, deep linking schemes

### Native build Solution

Create a development build:

```bash
npx expo prebuild  # generate native code
npx expo run:ios    # or npx expo run:android
```

After this, you can run,

```bash
npx expo start
```

## Common features guide

- [Using Google authentication](https://docs.expo.dev/guides/google-authentication/)
  - https://react-native-google-signin.github.io/docs/install

## Config EAS

- [EAS](https://docs.expo.dev/build/eas-json/)
  - https://docs.expo.dev/tutorial/eas/configure-development-build/

## Troubleshooting

### General

- Make sure close all expo server first

### Issues

Issue:

```bash
No script URL provided. Make sure the packager is running or you have embedded a JS bundle in your application bundle.
```

Solution: kill all expo server, then `npx expo start`
