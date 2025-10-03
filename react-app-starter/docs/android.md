# Android

## Hard reset

```bash
cd android && ./gradlew clean
```

## Troubleshooting

Issue:

```bash
Error: Error: Activity not started, unable to resolve Intent { act=android.intent.action.VIEW dat=exp+cue://expo-development-client/... flg=0x10000000 xflg=0x4 }
```

Solution: Run

```sh
npm run dev:android
```

Issue:

```bash
react-app/android/gradlew app:assembleDebug -x lint -x test --configure-on-demand --build-cache -PreactNativeDevServerPort=8081 -PreactNativeArchitectures=arm64-v8a exited with non-zero code: 1
```

Solution: Disable cache

```bash
# Disable configuration cache due to React Native compatibility issues
org.gradle.configuration-cache=false
```

```bash
Existing package ai.yourcompany.app.dev signatures do not match newer version; ignoring!]
```

```bash
adb uninstall ai.yourcompany.app.dev
```
