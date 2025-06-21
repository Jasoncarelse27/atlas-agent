#!/bin/bash

# Build the React app
echo "Building the app..."
npm run build

# The built files will be in the 'dist' directory
echo "Build complete! Files are in the 'dist' directory"
echo "You can now deploy the contents of 'dist' to any static hosting service:"
echo "- Netlify"
echo "- Vercel" 
echo "- GitHub Pages"
echo "- AWS S3"
echo "- Firebase Hosting" 