#!/bin/bash

# Example: ./scripts/validate-ipa.sh build/ipa/Cue.ipa

set -e

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <ipa_path>"
  echo "Example: $0 build/ipa/Cue.ipa"
  exit 1
fi

IPA_PATH=$1

if [ ! -f "$IPA_PATH" ]; then
  echo "❌ Error: IPA file not found at $IPA_PATH"
  exit 1
fi

echo "🔍 Validating IPA: $IPA_PATH"
echo ""

echo "📦 Testing archive integrity..."
if unzip -t "$IPA_PATH" > /dev/null 2>&1; then
  echo "✅ Archive integrity OK"
else
  echo "❌ Archive corrupted"
  exit 1
fi

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

unzip -q "$IPA_PATH" -d "$TEMP_DIR"

APP_PATH=$(find "$TEMP_DIR/Payload" -name "*.app" -type d | head -1)
INFO_PLIST="$APP_PATH/Info.plist"

if [ ! -f "$INFO_PLIST" ]; then
  echo "❌ Error: Info.plist not found"
  exit 1
fi

echo ""
echo "📱 App Information:"
BUNDLE_ID=$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "$INFO_PLIST")
VERSION=$(/usr/libexec/PlistBuddy -c "Print :CFBundleShortVersionString" "$INFO_PLIST")
BUILD=$(/usr/libexec/PlistBuddy -c "Print :CFBundleVersion" "$INFO_PLIST")
MIN_OS=$(/usr/libexec/PlistBuddy -c "Print :MinimumOSVersion" "$INFO_PLIST" 2>/dev/null || echo "Not specified")
EXECUTABLE=$(/usr/libexec/PlistBuddy -c "Print :CFBundleExecutable" "$INFO_PLIST")

echo "  Bundle ID: $BUNDLE_ID"
echo "  Version: $VERSION"
echo "  Build: $BUILD"
echo "  Min iOS: $MIN_OS"
echo "  Executable: $EXECUTABLE"

echo ""
echo "🔐 Code Signing:"
codesign -dvvv "$APP_PATH" 2>&1 | grep -E "Identifier=|TeamIdentifier=|Authority=" | sed 's/^/  /'

echo ""
echo "📄 Provisioning Profile:"
security cms -D -i "$APP_PATH/embedded.mobileprovision" 2>/dev/null | grep -E "<key>(Name|TeamName|ExpirationDate|application-identifier)</key>" -A1 | grep -v "<key>" | sed 's/<[^>]*>//g' | sed 's/^[[:space:]]*/  /'

echo ""
echo "📊 Size Information:"
IPA_SIZE=$(ls -lh "$IPA_PATH" | awk '{print $5}')
APP_SIZE=$(du -sh "$APP_PATH" | awk '{print $1}')
echo "  IPA Size: $IPA_SIZE"
echo "  App Size: $APP_SIZE"

if [ -f "$APP_PATH/main.jsbundle" ]; then
  BUNDLE_SIZE=$(ls -lh "$APP_PATH/main.jsbundle" | awk '{print $5}')
  echo "  JS Bundle: $BUNDLE_SIZE"
fi

echo ""
echo "🎯 Architectures:"
lipo -info "$APP_PATH/$EXECUTABLE" 2>/dev/null | sed 's/^/  /' || echo "  Unable to determine architectures"

echo ""
echo "✅ IPA validation complete!"