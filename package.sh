#!/usr/bin/env bash

# Use this script to create a zip file for uploading to GNOME Extensions.

NAME="rounded-screen-corners@nopan"
ZIP_FILE="build/${NAME}.zip"

echo "Scaling up for packaging..."

# Create build directory
mkdir -p build/package

# Copy necessary files
cp -r extension.js prefs.js metadata.json corners LICENSE README.md build/package/
mkdir -p build/package/schemas
cp schemas/*.xml schemas/gschemas.compiled build/package/schemas/

# Create the zip
cd build/package
python3 -m zipfile -c "../${NAME}.zip" .
cd ../..

# Cleanup
rm -rf build/package

echo "Done! extension bundle created at: ${ZIP_FILE}"
echo "You can upload this file to https://extensions.gnome.org/upload/"
