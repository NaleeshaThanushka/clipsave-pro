#!/usr/bin/env bash
set -e

echo "Installing yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /opt/render/project/src/backend/yt-dlp
chmod +x /opt/render/project/src/backend/yt-dlp

echo "Installing ffmpeg (static build)..."
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
tar -xf ffmpeg.tar.xz
mv ffmpeg-*-amd64-static/ffmpeg /opt/render/project/src/backend/ffmpeg
chmod +x /opt/render/project/src/backend/ffmpeg
rm -rf ffmpeg.tar.xz ffmpeg-*-amd64-static

echo "Installing npm dependencies..."
npm install --omit=dev