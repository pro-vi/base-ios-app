#!/bin/bash

# Example: ./scripts/upload-ipa.sh build/ipa/Cue.ipa

set -e

cd "$(dirname "$0")/.."

echo "📤 Uploading IPA to TestFlight"

if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

if [ -z "$APPLE_ID" ] || [ -z "$APP_SPECIFIC_PASSWORD" ]; then
  echo "❌ Error: APPLE_ID and APP_SPECIFIC_PASSWORD must be set in .env"
  exit 1
fi

if [ "$#" -eq 1 ]; then
  IPA_PATH=$1
else
  IPA_PATH=$(find build/ipa -name "*.ipa" 2>/dev/null | head -1)
fi

if [ -z "$IPA_PATH" ] || [ ! -f "$IPA_PATH" ]; then
  echo "❌ Error: IPA file not found"
  echo "Usage: $0 [ipa_path]"
  echo "Or run without arguments to use build/ipa/*.ipa"
  exit 1
fi

echo "📱 IPA: $IPA_PATH"
echo "👤 Apple ID: $APPLE_ID"
echo ""

echo "🚀 Uploading to App Store Connect..."
xcrun altool --upload-app \
    --type ios \
    -f "$IPA_PATH" \
    -u "$APPLE_ID" \
    -p "$APP_SPECIFIC_PASSWORD"

echo ""
echo "✅ Upload complete! Check App Store Connect for processing status."
