const URL_REGEX = /^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i;

const TIME_REGEX = /^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/;

/**
 * Loose blocklist for obviously unsupported / dangerous inputs.
 * yt-dlp itself will do the real extractor validation - this is a first line filter.
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.length > 2048) return false;
  return URL_REGEX.test(url.trim());
}

function isValidTimeFormat(time) {
  if (!time) return true; // optional field
  return TIME_REGEX.test(time.trim());
}

function timeToSeconds(time) {
  if (!time) return null;
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

function isValidTimeRange(startTime, endTime) {
  if (!startTime && !endTime) return true;
  if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) return false;
  if (startTime && endTime) {
    return timeToSeconds(endTime) > timeToSeconds(startTime);
  }
  return true;
}

function isValidFormat(format) {
  return ['mp4', 'mp3'].includes(format);
}

function parseMultipleUrls(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];
  return rawText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => isValidUrl(line));
}

module.exports = {
  isValidUrl,
  isValidTimeFormat,
  isValidTimeRange,
  isValidFormat,
  timeToSeconds,
  parseMultipleUrls
};