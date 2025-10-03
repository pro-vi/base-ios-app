#!/usr/bin/env bash

# Reference:
# - https://docs.expo.dev/guides/local-app-production/#ios

set -euo pipefail

cd "$(dirname "$0")/.."

# # Clear Xcode DerivedData
# echo "remove ~/Library/Developer/Xcode/DerivedData/*"
# rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clear iOS build folder
echo "remove ios/build"
rm -rf ios/build

# Clear Node modules and reinstall
echo "remove node_modules and then run npm install"
rm -rf node_modules
npm install

# cd ios
# rm -rf Pods Podfile.lock
# pod cache clean --all
# pod install
# cd ..

echo "run: npx expo prebuild --clean"
npx expo prebuild --clean # --clean will remove and re-create ios folder

echo "run: npx expo run:ios"
# npx expo run:ios
npx expo run:ios --device --configuration Release
