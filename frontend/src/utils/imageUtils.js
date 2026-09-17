/**
 * Normalizes Google Drive, Dropbox, and external image URLs to direct high-speed image sources.
 */
export function getDirectImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive URLs
  if (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('docs.google.com') ||
    trimmed.includes('googleusercontent.com')
  ) {
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    const fileId = (fileDMatch && fileDMatch[1]) || (idMatch && idMatch[1]) || (dMatch && dMatch[1]);
    if (fileId) {
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }
  }

  // Dropbox URLs
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('dl=0', 'raw=1').replace('?dl=1', '?raw=1');
  }

  return trimmed;
}

/**
 * Checks if a string is a recognized Google Drive URL
 */
export function isGoogleDriveUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return (
    url.includes('drive.google.com') ||
    url.includes('docs.google.com') ||
    url.includes('googleusercontent.com')
  );
}

/**
 * Generates initials for avatar fallback (e.g. "Shahanur Alom Zibon" -> "SZ")
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
