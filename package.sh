#!/bin/bash

# Exit on error
set -e

# Parse arguments
PROFILE=""
ZIP_NAME=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --name)
      ZIP_NAME="$2"
      shift 2
      ;;
    *)
      # If no flag, treat as zip name for backward compatibility
      if [ -z "$ZIP_NAME" ]; then
        ZIP_NAME="$1"
      fi
      shift
      ;;
  esac
done

if [ "$PROFILE" != "test" ] && [ "$PROFILE" != "cn" ] && [ "$PROFILE" != "us" ]; then
  echo "❌ Error: Invalid profile '$PROFILE'. Must be 'cn' or 'us'"
  exit 1
fi

echo "🌍 Building for profile: ${PROFILE}"

# Set environment variables based on profile
if [ "$PROFILE" = "cn" ]; then
  export NEXT_PUBLIC_BASE_PATH="/user/invite"
  export NEXT_PUBLIC_APP_DEEPLINK_URL="ideashellcn://user/invite"
  export NEXT_PUBLIC_APP_IOS_STORE_URL="https://ideashell.ai/download"
  export NEXT_PUBLIC_APP_ANDROID_STORE_URL="https://ideashell.ai/download"
elif [ "$PROFILE" = "us" ]; then
  export NEXT_PUBLIC_BASE_PATH="/user/invite"
  export NEXT_PUBLIC_APP_DEEPLINK_URL="ideashell://user/invite"
  export NEXT_PUBLIC_APP_IOS_STORE_URL="https://apps.apple.com/app/apple-store/id6478199476?pt=126892645&ct=TikTokAds&mt=8"
  export NEXT_PUBLIC_APP_ANDROID_STORE_URL="https://play.google.com/store/apps/details?id=com.rrd.ideaShell&referrer=utm_source%3DSpark%2BAD%26utm_medium%3DTikTok%26utm_campaign%3Dkol"
else
  export NEXT_PUBLIC_BASE_PATH="/user/invite"
  export NEXT_PUBLIC_APP_DEEPLINK_URL="ideashellcn://user/invite"
  export NEXT_PUBLIC_APP_IOS_STORE_URL="https://ideashell.ai/download"
  export NEXT_PUBLIC_APP_ANDROID_STORE_URL="https://ideashell.ai/download"
fi

echo "🔗 DEEPLINK_URL: ${NEXT_PUBLIC_APP_DEEPLINK_URL}"
echo "🍎 IOS_STORE_URL: ${NEXT_PUBLIC_APP_IOS_STORE_URL}"
echo "🤖 ANDROID_STORE_URL: ${NEXT_PUBLIC_APP_ANDROID_STORE_URL}"

# Set NEXT_PUBLIC_BASE_PATH from environment variable or use default
if [ -z "$NEXT_PUBLIC_BASE_PATH" ]; then
  NEXT_PUBLIC_BASE_PATH="/user/invite"
fi

echo "🔧 Using NEXT_PUBLIC_BASE_PATH: ${NEXT_PUBLIC_BASE_PATH}"

# Get zip name from argument or use project directory name with profile suffix as default
if [ -z "$ZIP_NAME" ]; then
  # Get current directory name as default and append profile
  ZIP_NAME="$(basename "$(pwd)")-${PROFILE}"
fi

# Ensure .zip extension
if [[ ! "$ZIP_NAME" =~ \.zip$ ]]; then
  ZIP_NAME="${ZIP_NAME}.zip"
fi

# Check if node_modules exists, if not install dependencies
pnpm install

echo "🚀 Starting build process..."

# Build the project with all environment variables
NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH}" \
NEXT_PUBLIC_APP_DEEPLINK_URL="${NEXT_PUBLIC_APP_DEEPLINK_URL}" \
NEXT_PUBLIC_APP_IOS_STORE_URL="${NEXT_PUBLIC_APP_IOS_STORE_URL}" \
NEXT_PUBLIC_APP_ANDROID_STORE_URL="${NEXT_PUBLIC_APP_ANDROID_STORE_URL}" \
pnpm run build

echo "📦 Creating zip archive..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Get folder name (zip name without .zip extension)
FOLDER_NAME="${ZIP_NAME%.zip}"

# Create temporary folder with the same name as zip
TMP_FOLDER=".tmp_${FOLDER_NAME}"
mkdir -p "${TMP_FOLDER}/${FOLDER_NAME}"

# Copy out directory contents to the temporary folder
cp -r out/* "${TMP_FOLDER}/${FOLDER_NAME}/"

# Create zip archive from temporary folder
cd "${TMP_FOLDER}"
zip -r "../dist/${ZIP_NAME}" "${FOLDER_NAME}"
cd ..

# Clean up temporary folder
rm -rf "${TMP_FOLDER}"

echo "✅ Package created successfully: ${ZIP_NAME}"
echo "📍 Location: $(pwd)/dist/${ZIP_NAME}"
