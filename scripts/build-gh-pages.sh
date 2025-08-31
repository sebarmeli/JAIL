#!/bin/bash

# Build script for GitHub Pages deployment
echo "Building GitHub Pages..."

# Create a temporary build directory
BUILD_DIR="./gh-pages-build"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR

# Copy demo files (these are the main files for the site)
echo "Copying demo files..."
cp -r demo/* $BUILD_DIR/

# Copy built library files
echo "Copying built library files..."
mkdir -p $BUILD_DIR/js
cp dist/jail.min.js $BUILD_DIR/js/

# Copy README and other documentation
echo "Copying documentation..."
cp README.md $BUILD_DIR/
cp MIT-LICENSE.txt $BUILD_DIR/

# Create a simple index.html if it doesn't exist
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo "Creating index.html..."
    cat > $BUILD_DIR/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JAIL - jQuery Asynchronous Image Loader</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container">
        <h1>JAIL - jQuery Asynchronous Image Loader</h1>
        <p>A jQuery plugin for lazy loading images with various triggers and effects.</p>
        
        <h2>Examples</h2>
        <ul>
            <li><a href="example1_basicCall.html">Basic Call</a></li>
            <li><a href="example2_clickOnLink.html">Click on Link</a></li>
            <li><a href="example3_clickOnPlaceholder.html">Click on Placeholder</a></li>
            <li><a href="example4_mouseoverOnPlaceholder.html">Mouseover on Placeholder</a></li>
            <li><a href="example5_imagesDelayed.html">Images Delayed</a></li>
            <li><a href="example6_focusOnImage.html">Focus on Image</a></li>
            <li><a href="example7_basicCallWithOffset.html">Basic Call with Offset</a></li>
            <li><a href="example8_callback.html">Callback</a></li>
            <li><a href="example9_scrollingHorizontally.html">Scrolling Horizontally</a></li>
            <li><a href="example10_scrollingInContainer.html">Scrolling in Container</a></li>
            <li><a href="example11_imagesInIframe.html">Images in Iframe</a></li>
            <li><a href="example12_loadHiddenImages.html">Load Hidden Images</a></li>
            <li><a href="example13_overflows.html">Overflows</a></li>
            <li><a href="example14_AMD_basicCall.html">AMD Basic Call</a></li>
            <li><a href="example15_AMD_clickOnLInk.html">AMD Click on Link</a></li>
        </ul>
        
        <h2>Documentation</h2>
        <p>See <a href="README.md">README.md</a> for full documentation.</p>
    </div>
</body>
</html>
EOF
fi

echo "Build complete! Files are ready in $BUILD_DIR/"
echo "To deploy:"
echo "1. git checkout gh-pages"
echo "2. rm -rf *"
echo "3. cp -r $BUILD_DIR/* ."
echo "4. git add . && git commit -m 'Update GitHub Pages' && git push origin gh-pages"
