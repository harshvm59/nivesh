#!/bin/bash
# Nivesh iOS App Setup
# by HVM
#
# This script sets up the Xcode project.
# Prerequisites: Install XcodeGen (brew install xcodegen) and Xcode.

echo "╔══════════════════════════════════════════════╗"
echo "║   Nivesh iOS App Setup                       ║"
echo "║   by HVM                                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")/Nivesh"

# Check if XcodeGen is installed
if command -v xcodegen &> /dev/null; then
    echo "✓ XcodeGen found"
    echo "📦 Generating Xcode project..."
    xcodegen generate
    echo "✅ Project generated!"
    echo ""
    echo "Next steps:"
    echo "  1. Open Nivesh.xcodeproj in Xcode"
    echo "  2. Select your Apple Developer Team in Signing & Capabilities"
    echo "  3. Connect your iPhone and hit Run (⌘R)"
    echo ""
    echo "Opening Xcode..."
    open Nivesh.xcodeproj
else
    echo "❌ XcodeGen not found."
    echo ""
    echo "Option 1: Install XcodeGen and re-run this script:"
    echo "  brew install xcodegen"
    echo "  ./setup-ios.sh"
    echo ""
    echo "Option 2: Create project manually in Xcode:"
    echo "  1. Open Xcode → New Project → iOS → App"
    echo "  2. Name: Nivesh, Bundle ID: com.hvm.nivesh"
    echo "  3. Interface: SwiftUI, Language: Swift"
    echo "  4. Delete the default ContentView.swift"
    echo "  5. Drag these files into the project:"
    echo "     - Nivesh/NiveshApp.swift"
    echo "     - Nivesh/ContentView.swift"
    echo "  6. Run on your iPhone"
fi
