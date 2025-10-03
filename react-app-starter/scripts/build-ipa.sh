#!/bin/bash

# Simple IPA build script for React Native Expo project
# Usage: ./scripts/build-ipa.sh <version> <build_number>

set -e

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📱 Building IPA for React Native Expo project"

# Check arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <version> <build_number>"
  echo "Example: $0 1.0.0 5"
  exit 1
fi

VERSION=$1
BUILD_NUMBER=$2

# Load environment variables
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required env vars
if [ -z "$APPLE_TEAM_ID" ] || [ -z "$IOS_BUNDLE_ID" ]; then
  echo "❌ Error: APPLE_TEAM_ID and IOS_BUNDLE_ID must be set in .env"
  exit 1
fi

npx expo prebuild

# The Xcode scheme is always "Cue" regardless of APP_NAME
SCHEME="CueDev"
WORKSPACE="ios/${SCHEME}.xcworkspace"
ARCHIVE_PATH="build/${SCHEME}.xcarchive"
IPA_PATH="build/ipa"

# Display build configuration
echo "📋 Build Configuration:"
echo "  APP_NAME: $APP_NAME"
echo "  Bundle ID: $IOS_BUNDLE_ID"
echo "  Team ID: $APPLE_TEAM_ID"
echo "  Version: $VERSION (Build $BUILD_NUMBER)"

# Check if iOS workspace exists
if [ ! -d "$WORKSPACE" ]; then
  echo "❌ Error: iOS workspace not found at $WORKSPACE"
  echo "Run 'npx expo prebuild' first to generate iOS project"
  exit 1
fi

# Create build directory
mkdir -p build

# Build archive
echo "🏗️ Building archive..."
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration Release \
  -sdk iphoneos \
  -destination "generic/platform=iOS" \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  PRODUCT_BUNDLE_IDENTIFIER="$IOS_BUNDLE_ID" \
  MARKETING_VERSION="$VERSION" \
  CURRENT_PROJECT_VERSION="$BUILD_NUMBER"

# Export IPA
echo "📲 Exporting IPA..."
cat > build/exportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>$APPLE_TEAM_ID</string>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportOptionsPlist build/exportOptions.plist \
  -exportPath "$IPA_PATH"

IPA_FILE=$(find "$IPA_PATH" -name "*.ipa" | head -1)
echo "✅ IPA created: $IPA_FILE"
echo ""
echo "Upload to TestFlight with Transporter app or:"
echo "xcrun altool --upload-app -f \"$IPA_FILE\" -u APPLE_ID -p APP_SPECIFIC_PASSWORD"


# upload ipa to test flight
if [ -z "$APPLE_ID" ] || [ -z "$APP_SPECIFIC_PASSWORD" ]; then
    echo "Error: APPLE_ID and APP_SPECIFIC_PASSWORD environment variables must be set"
    exit 1
fi
