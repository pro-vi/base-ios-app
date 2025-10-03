# iOS

## Hard reset

```bash
rm -rf build Pods Podfile.lock && rm -rf ~/Library/Developer/Xcode/DerivedData/*
cd ios & pod install
```

```bash
rm -rf node_modules && npm install
npx expo prebuild
npx expo run:ios
npx expo start
```

## Features

### [Expo AppleAuthentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)

**Prerequisite**:

- configurate the bundle id with Sign in with Apple in Apple developer account
- select a Team (you apple developer account): Project -> Target -> your app target -> `Signing & Capabilities` -> Team -> your Apple developer account

**Testing**:

- under ios/, open \*.xcworkspace by using xcode
- in Xcode, target, click `Signing & Capabilities` -> click "All", then click `+Capability`, search `Sign on with Apple`, click add
- run `npx expo run:ios`
- run `npx expo start` -> make user `Using development build` highlighted, otherwise, type `s` to switch to it
- you should be able able to test sign in with apple in simulator

**Note**: Expo / EAS might overwrite whole folder `ios/`

## Release

### Prerequisites

- ensure `.env` are configured properly, it will be used by `app.config.js` such as `bundleIdentifier: process.env.IOS_BUNDLE_ID,`
- `app.config.js`: make sure the app name and bundle id are unique
- create a provisioning profile
- [Create and run a cloud build for iOS device](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/)

### Build locally

- [create an iOS production build locally for Apple App Store](https://docs.expo.dev/guides/local-app-production/#ios)

#### Prepare JavaScript Bundle for Device

Before building for a physical device, you need to create a JavaScript bundle:

```bash
# Generate the JavaScript bundle
npx expo export:embed --platform ios --bundle-output ./ios/main.jsbundle --dev false

# Verify the bundle was created
ls -la ios/main.jsbundle
```

Then in Xcode:

1. Open your project in Xcode
2. In the project navigator, right-click on your project name
3. Select "Add Files to [YourProject]"
4. Navigate to the `ios` folder and select `main.jsbundle`
5. Make sure "Copy items if needed" is unchecked (the file is already in the ios folder)
6. Make sure your app target is selected under "Add to targets"
7. Click "Add"

8. open `ios/your-project.xcworkspace`

- 1.1 From the sidebar on the left, select your app's workspace.
- 1.2 Go to Signing & Capabilities and select All or Release.
- 1.3 Under Signing > Team, ensure your Apple Developer team is selected. Xcode will generate an automatically managed Provisioning Profile and Signing Certificate.

2. Configure a release scheme
   To configure your app's release scheme:

- 2.1 From the menu bar, open Product > Scheme > Edit Scheme.
- 2.2 Select Run from the sidebar, then set the Build configuration to Release using the dropdown.

**IMPORTANT**: make sure it builds and runs on your real iphone device instead of using Simulator, in simulator/device list, select your iphone ensure it can run successfully.

3. Build app for release

- 3.1 To build your app for release, From the menu bar, open Product > Build. This step will build your app binary for release.

4. App submission using App Store Connect

Once the build is complete, you can distribute your app to TestFlight or submit it to the App Store using App Store Connect:

- 4.1 From the menu bar, open Product > Archive.
- 4.2 Under Archives, click Distribute App from the right sidebar.
- 4.3 Click App Store Connect and follow the prompts shown in the window. This step will create an app store record and upload your app to the App Store.

Now you can go to your App Store Connect account, select your app under Apps, and submit it for testing using TestFlight or prepare it for final release by following the steps in the App Store Connect dashboard.

### Checklist - Build and run on physical device using Xcode

```sh
  rm -rf ios
  rm -rf node_modules && npm install
  npx expo prebuild
  # default debug and will start expo server
  npx expo run:ios
  # run on real device without expo server, auto find team id if it's configured before
  npx expo run:ios --device --configuration Release
```

1. Open ios/Cue.xcworkspace in Xcode
2. Select your device from the device list
3. For Release: Product → Scheme → Edit Scheme → Run → Build Configuration → Release
4. Build and run: Product → Run

Notes:
Only delete ios folder when:

- Native dependencies change
- Xcode project configuration is broken
- You need to regenerate native code from scratch

## Development - On physical device

- in Debug scheme, run and build using xcode in real device
- start expo server
