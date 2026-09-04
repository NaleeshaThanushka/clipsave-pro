# 🎬 ClipSave Pro

A modern, full-stack video downloader web app supporting YouTube, TikTok, Facebook, Instagram, and any [yt-dlp](https://github.com/yt-dlp/yt-dlp)-supported site. Preview metadata before downloading, trim exact clips, download as MP4/MP3, track everything in a live queue with real-time progress, and browse your session's download history — all wrapped in a Netflix-level glassmorphism UI.

![Node](https://img.shields.io/badge/Node.js-20-green)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## ✨ Features

- 🔗 Paste any supported video URL and preview title, thumbnail, duration, uploader, and view count before downloading
- 🎞️ Download as **MP4** (video) or **MP3** (audio-only)
- ✂️ Trim a specific time range (`HH:MM:SS` start/end) using `yt-dlp --download-sections`
- 📋 Paste multiple URLs (one per line) — auto-queued and processed sequentially
- 📡 Real-time progress via Socket.IO: percentage, download speed, ETA
- 🗂️ In-memory download queue with Pending / Downloading / Completed / Failed states
- 🕘 In-memory download history (resets on server restart)
- 🧹 Auto-delete: files are removed ~5s after being served, plus a periodic sweep deletes anything older than 30 minutes
- 🎨 Dark/light glassmorphism UI with purple accents and Framer Motion animations
- 📱 Fully responsive (desktop, tablet, mobile)
- 🛡️ Rate limiting, input validation, and safe filename sanitization

---

## 🛠️ Tech Stack

**Frontend:** React 19, Vite, Axios, Socket.IO Client, Framer Motion, React Icons
**Backend:** Node.js, Express, Socket.IO, yt-dlp, ffmpeg, CORS, dotenv

---

## 📁 Project Structure