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

# Set environment file based on profile
ENV_SOURCE=".env.${PROFILE}"
ENV_TARGET=".env"

# Check if profile-specific env file exists
if [ ! -f "${ENV_SOURCE}" ]; then
  echo "❌ Error: Environment file '${ENV_SOURCE}' not found"
  exit 1
fi

echo "📝 Using environment file: ${ENV_SOURCE}"
echo "📋 Environment variables:"
cat "${ENV_SOURCE}"
echo ""

# Copy profile-specific env file to .env for Next.js to read
cp "${ENV_SOURCE}" "${ENV_TARGET}"

echo "✅ Environment file activated: ${ENV_TARGET}"
echo ""

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

# Build the project (environment variables are read from .env file)
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
