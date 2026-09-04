const { v4: uuidv4 } = require('uuid');

/**
 * Strip anything that isn't safe for a filesystem path.
 * Prevents path traversal and weird unicode/control chars.
 */
function sanitizeFilename(name, maxLength = 100) {
  if (!name) return 'download';
  const cleaned = name
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\.\./g, '')
    .trim();
  return cleaned.slice(0, maxLength) || 'download';
}

function generateId() {
  return uuidv4();
}

function buildOutputFilename(id, title, ext) {
  const safeTitle = sanitizeFilename(title || 'video');
  return `${safeTitle}-${id}.${ext}`;
}

module.exports = { sanitizeFilename, generateId, buildOutputFilename };