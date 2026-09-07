/**
 * ============================================================
 * IMAGE UTILITIES & GOOGLE DRIVE HANDLER — js/image-utils.js
 * ============================================================
 * Provides robust resolution for Google Drive file IDs and share
 * links, local asset paths, and external image URLs.
 *
 * Supported formats:
 * - Google Drive Share Links: https://drive.google.com/file/d/{ID}/view?usp=sharing
 * - Google Drive Open Links:  https://drive.google.com/open?id={ID}
 * - Google Drive UC Links:    https://drive.google.com/uc?id={ID}&export=view
 * - Raw Google Drive File ID: {ID} (e.g. 1A2b3c4D_5e6F7g8H9)
 * - Local image paths:        assets/images/sample.jpg
 * - Standard web URLs:        https://images.unsplash.com/...
 * ============================================================
 */

(function (global) {
  'use strict';

  /**
   * Extract Google Drive File ID from various link structures.
   * Returns the file ID string if matched, or null otherwise.
   *
   * @param {string} input - URL, ID, or file path
   * @returns {string|null} Google Drive File ID or null
   */
  function extractGoogleDriveId(input) {
    if (!input || typeof input !== 'string') return null;

    const trimmed = input.trim();

    // 1. /file/d/{id} pattern
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) return fileDMatch[1];

    // 2. id={id} query param pattern (open?id=, uc?id=)
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

    // 3. lh3.googleusercontent.com/d/{id} pattern
    const lh3Match = trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    if (lh3Match && lh3Match[1]) return lh3Match[1];

    // 4. Raw file ID (Alphanumeric, underscores, dashes; typically 25 to 50 chars long with no slashes or dots)
    const isLikelyRawId = /^[a-zA-Z0-9_-]{25,50}$/.test(trimmed);
    if (isLikelyRawId) return trimmed;

    return null;
  }

  /**
   * Resolve an image source to a high-speed, direct-embed URL.
   *
   * For Google Drive images, this uses Google's direct CDN endpoint
   * which handles public images reliably without quota or cookie issues.
   *
   * @param {string|object} source - Image URL, Google Drive ID, or item object
   * @param {string} size - 'thumb' (800px width), 'medium' (1400px), or 'full' (2400px)
   * @returns {string} Direct image URL
   */
  function resolveImageUrl(source, size = 'full') {
    if (!source) return '';

    // If source is an object with image or googleDriveId property
    if (typeof source === 'object') {
      source = source.googleDriveId || source.image || source.src || source.thumbnail || '';
    }

    if (typeof source !== 'string' || !source.trim()) return '';

    const trimmed = source.trim();

    // Check if it is a Google Drive link or ID
    const driveId = extractGoogleDriveId(trimmed);
    if (driveId) {
      // Sizing parameter for Google CDN:
      // w800 for thumbnails, w1600 for cards, w2560 for full lightbox
      let widthParam = 'w2560';
      if (size === 'thumb') widthParam = 'w800';
      else if (size === 'medium') widthParam = 'w1400';

      // Primary: Google Drive lh3 direct preview endpoint
      return `https://lh3.googleusercontent.com/d/${driveId}=${widthParam}`;
    }

    // Return regular URL or local path
    return trimmed;
  }

  /**
   * Fallback image SVG markup (warm editorial placeholder)
   */
  function getFallbackPlaceholder(title = 'Photograph', category = 'Gallery') {
    const safeTitle = (title || 'Photograph').replace(/["'<>]/g, '');
    const safeCat = (category || 'Visual').toUpperCase().replace(/["'<>]/g, '');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
        <rect width="1200" height="800" fill="#201f1e"/>
        <radialGradient id="g" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stop-color="#322f2b" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#181716" stop-opacity="1"/>
        </radialGradient>
        <rect width="1200" height="800" fill="url(#g)"/>
        <circle cx="600" cy="360" r="44" fill="none" stroke="#8b6f4e" stroke-width="2" stroke-opacity="0.5"/>
        <circle cx="600" cy="360" r="18" fill="#8b6f4e" fill-opacity="0.3"/>
        <text x="600" y="450" font-family="'Inter', sans-serif" font-size="14" font-weight="600" letter-spacing="4" fill="#8b6f4e" text-anchor="middle">${safeCat}</text>
        <text x="600" y="490" font-family="'Playfair Display', serif" font-size="28" fill="#f0ede6" text-anchor="middle" font-style="italic">${safeTitle}</text>
        <text x="600" y="530" font-family="'Inter', sans-serif" font-size="12" fill="#7a746c" text-anchor="middle">Image is loading or file permission needs check</text>
      </svg>
    `.trim();

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /**
   * Gracefully handle image load failure without breaking the layout.
   * Swaps in placeholder and logs a helpful diagnostic message for the creator.
   *
   * @param {HTMLImageElement} imgEl - The failed <img> element
   * @param {string} title - Photograph or project title
   * @param {string} category - Category label
   */
  function handleImageError(imgEl, title = '', category = '') {
    if (!imgEl || imgEl.dataset.hasFailed) return;

    imgEl.dataset.hasFailed = 'true';
    const failedSrc = imgEl.getAttribute('src') || '';

    console.warn(
      `[Portfolio Image Handler] Failed to load image: "${failedSrc}".\n` +
      `Tip for Google Drive: Ensure the file permission is set to "Anyone with the link can view" ` +
      `in Google Drive (Share > General Access > Anyone with the link).`
    );

    // Apply elegant editorial fallback
    imgEl.src = getFallbackPlaceholder(title, category);
    imgEl.classList.add('is-fallback-image');

    const card = imgEl.closest('.photo-card, .project-card, .editorial-hero__media');
    if (card) {
      card.classList.add('has-image-fallback');
    }
  }

  // Export globally
  global.ImageUtils = {
    extractGoogleDriveId,
    resolveImageUrl,
    getFallbackPlaceholder,
    handleImageError,
  };

})(typeof window !== 'undefined' ? window : this);

