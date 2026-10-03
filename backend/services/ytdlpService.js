const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const { buildOutputFilename } = require('../utils/filename');

const YTDLP_PATH = process.env.YTDLP_PATH || 'yt-dlp';
const DOWNLOADS_DIR = path.join(__dirname, '..', process.env.DOWNLOADS_DIR || 'downloads');
const COOKIES_PATH = path.join(__dirname, '..', 'cookies.txt');

function buildBaseArgs() {
  const args = [];
  if (fs.existsSync(COOKIES_PATH)) {
    args.push('--cookies', COOKIES_PATH);
  }
  return args;
}

function getInfo(url) {
  return new Promise((resolve, reject) => {
    const args = [...buildBaseArgs(), '-j', '--no-playlist', '--no-warnings', url];
    const proc = spawn(YTDLP_PATH, args);

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (chunk) => (stdout += chunk.toString()));
    proc.stderr.on('data', (chunk) => (stderr += chunk.toString()));

    proc.on('error', (err) => {
      reject(new Error(`Failed to start yt-dlp: ${err.message}`));
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        logger.error('yt-dlp info error:', stderr);
        return reject(new Error(parseYtdlpError(stderr)));
      }
      try {
        const data = JSON.parse(stdout);
        resolve({
          title: data.title || 'Untitled',
          thumbnail: data.thumbnail || null,
          duration: data.duration || 0,
          uploader: data.uploader || data.channel || 'Unknown',
          viewCount: data.view_count ?? null,
          extractor: data.extractor || null,
          webpageUrl: data.webpage_url || url
        });
      } catch (e) {
        reject(new Error('Failed to parse video metadata'));
      }
    });
  });
}

/**
 * Parses common yt-dlp stderr messages into user-friendly errors.
 */
function parseYtdlpError(stderr) {
  const msg = stderr.toLowerCase();
  if (msg.includes('unsupported url')) return 'This website is not supported.';
  if (msg.includes('video unavailable')) return 'This video is unavailable or has been removed.';
  if (msg.includes('private video')) return 'This video is private.';
  if (msg.includes('sign in')) return 'This video requires sign-in and cannot be accessed.';
  if (msg.includes('404')) return 'Video not found (404).';
  return 'Failed to fetch video. It may be unavailable or the URL is invalid.';
}

/**
 * Progress line from yt-dlp with --newline looks like:
 * [download]  65.4% of 10.00MiB at 2.40MiB/s ETA 00:20
 */
function parseProgressLine(line) {
  const match = line.match(
    /\[download\]\s+([\d.]+)%\s+of\s+~?([\d.]+\w+)\s+at\s+([\d.]+\w+\/s|Unknown speed)\s+ETA\s+([\d:]+|Unknown)/
  );
  if (!match) return null;
  return {
    progress: parseFloat(match[1]),
    totalSize: match[2],
    speed: match[3],
    eta: match[4]
  };
}

/**
 * Download video/audio, optionally trimmed to a section.
 * onProgress(progressObj) is called for every parsed progress line.
 */
function downloadMedia({ url, format, startTime, endTime, id, title }, onProgress) {
  return new Promise((resolve, reject) => {
    const ext = format === 'mp3' ? 'mp3' : 'mp4';
    const outputFilename = buildOutputFilename(id, title, ext);
    const outputPath = path.join(DOWNLOADS_DIR, outputFilename);

    const args = ['--no-warnings', '--newline', '-o', outputPath];

    if (format === 'mp3') {
      args.push('-x', '--audio-format', 'mp3', '--audio-quality', '0');
    } else {
      args.push('-f', 'bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b', '--merge-output-format', 'mp4');
    }

    if (startTime || endTime) {
      const start = startTime || '00:00:00';
      const end = endTime || '*';
      args.push('--download-sections', `*${start}-${end}`, '--force-keyframes-at-cuts');
    }

    args.push(url);

    logger.info('Spawning yt-dlp:', args.join(' '));
    const proc = spawn(YTDLP_PATH, args);

    let stderr = '';

    proc.stdout.on('data', (chunk) => {
      const text = chunk.toString();
      text.split('\n').forEach((line) => {
        const parsed = parseProgressLine(line);
        if (parsed && onProgress) onProgress(parsed);
      });
    });

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to start yt-dlp: ${err.message}`));
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        logger.error('yt-dlp download error:', stderr);
        return reject(new Error(parseYtdlpError(stderr)));
      }
      resolve({ filePath: outputPath, filename: outputFilename });
    });
  });
}

module.exports = { getInfo, downloadMedia, parseProgressLine };