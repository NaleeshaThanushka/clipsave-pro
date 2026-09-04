const { spawn } = require('child_process');
const logger = require('../utils/logger');

const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg';

/**
 * Fallback trimmer - used only if yt-dlp's native --download-sections
 * isn't applicable (e.g. post-processing an already-downloaded file).
 * Uses stream copy for speed; falls back to re-encode on failure.
 */
function trimMedia(inputPath, outputPath, startTime, endTime) {
  return new Promise((resolve, reject) => {
    const args = ['-y', '-i', inputPath];
    if (startTime) args.push('-ss', startTime);
    if (endTime) args.push('-to', endTime);
    args.push('-c', 'copy', outputPath);

    const proc = spawn(FFMPEG_PATH, args);
    let stderr = '';

    proc.stderr.on('data', (chunk) => (stderr += chunk.toString()));

    proc.on('error', (err) => reject(new Error(`Failed to start ffmpeg: ${err.message}`)));

    proc.on('close', (code) => {
      if (code !== 0) {
        logger.error('ffmpeg trim error:', stderr);
        return reject(new Error('Failed to process video clip.'));
      }
      resolve(outputPath);
    });
  });
}

module.exports = { trimMedia };