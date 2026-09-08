/**
 * ============================================================================
 * PHOTOGRAPHY DATA STORE & GOOGLE DRIVE GUIDE — js/photography-data.js
 * ============================================================================
 *
 * HOW TO ADD & MANAGE IMAGES USING GOOGLE DRIVE:
 * ----------------------------------------------------------------------------
 * 1. UPLOAD TO GOOGLE DRIVE:
 *    Upload your high-resolution photograph to your Google Drive folder
 *    (e.g., Portfolio > Photography > Landscape).
 *
 * 2. MAKE FILE ACCESSIBLE:
 *    Right-click the image in Google Drive > Click "Share" (or "Get link").
 *    Under "General access", change from "Restricted" to:
 *    👉 "Anyone with the link" (Role: Viewer).
 *    Click "Copy link".
 *
 * 3. COPY THE LINK OR FILE ID:
 *    The link looks like:
 *    https://drive.google.com/file/d/1A2B3C4D_example56789/view?usp=sharing
 *    You can either paste the ENTIRE URL or just the file ID (e.g. "1A2B3C4D_example56789").
 *
 * 4. PASTE INTO THIS DATA FILE:
 *    In either PHOTOGRAPHY_PHOTOS or PHOTOGRAPHY_SERIES below, set:
 *    image: "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
 *    - or -
 *    googleDriveId: "YOUR_FILE_ID"
 *    - or -
 *    image: "assets/images/my_local_image.jpg"
 *
 * 5. HOW TO ADD MULTIPLE IMAGES:
 *    Simply copy any object block in the PHOTOGRAPHY_PHOTOS array, paste it at
 *    the end of the list, give it an incremented `id`, and fill in its details.
 *
 * 6. HOW TO REPLACE AN IMAGE LATER:
 *    To swap a photo, just replace the `image` string or `googleDriveId` with
 *    the new link. You do NOT need to modify any HTML or CSS files!
 * ============================================================================
 */

/**
 * Page level editorial settings
 */
const PHOTOGRAPHY_CONFIG = {
  hero: {
    label: "PHOTOGRAPHY",
    title: "Through My Lens",
    subtitle: "Moments, places and perspectives.",
    description: "A visual journal exploring landscapes, architecture, light, and quiet human moments.",
    // Featured hero image (can be Google Drive URL, file ID, or local path)
    featuredImage: "assets/images/proj5_product_photo.jpg",
    featuredImageAlt: "Atmospheric landscape photograph",
    featuredCaption: "Southern Coastline — Light Study 01",
  },
  // Default categories to show in filter bar
  categories: [
    "All",
    "Landscape",
    "Architecture",
    "Nature",
    "Street",
    "Portrait",
    "Experimental",
  ],
};

/**
 * Curated Photography Series / Projects
 * A series groups thematic photos together (e.g., a trip, editorial shoot, or photo essay).
 */
const PHOTOGRAPHY_SERIES = [
  {
    id: "colombo-after-rain",
    title: "Colombo After Rain",
    category: "Street",
    date: "2025 – 2026",
    location: "Colombo, Sri Lanka",
    description: "A photographic series observing the stillness, glistening asphalt, and deep reflections across the capital city right after heavy monsoon downpours.",
    coverImage: "assets/images/proj1_sports_campaign.jpg", // REPLACE_HERE with Google Drive link or local image
    imageCount: 4,
    camera: "Sony A7 IV · 35mm f/1.4 GM",
    featured: true,
  },
  {
    id: "southern-coast",
    title: "Southern Coast",
    category: "Landscape",
    date: "2025",
    location: "Galle & Mirissa, Sri Lanka",
    description: "Studies in coastal light, ocean tides, golden hour horizons, and the natural textures of the southern shoreline.",
    coverImage: "assets/images/proj5_product_photo.jpg", // REPLACE_HERE with Google Drive link or local image
    imageCount: 4,
    camera: "Sony A7 IV · 24-70mm f/2.8 GM II",
    featured: true,
  },
  {
    id: "urban-geometry",
    title: "Urban Geometry",
    category: "Architecture",
    date: "2024 – 2025",
    location: "Colombo & Singapore",
    description: "Minimalist architectural perspectives isolating patterns, shadows, brutalist concrete, and glass facades.",
    coverImage: "assets/images/proj2_youtube_branding.jpg", // REPLACE_HERE with Google Drive link or local image
    imageCount: 3,
    camera: "Sony A7 IV · 16-35mm f/2.8 GM",
    featured: true,
  },
  {
    id: "quiet-places",
    title: "Quiet Places",
    category: "Nature",
    date: "2024",
    location: "Central Highlands, Sri Lanka",
    description: "Mist-covered tea valleys, mountain mornings, and solitary moments in nature far away from the buzz of the city.",
    coverImage: "assets/images/proj4_podcast_identity.jpg", // REPLACE_HERE with Google Drive link or local image
    imageCount: 3,
    camera: "Fujifilm X-T5 · 23mm f/1.4",
    featured: false,
  },
];

/**
 * Editorial Photography Gallery
 *
 * aspectRatio options:
 * - 'portrait'  : 3:4 tall editorial framing
 * - 'landscape' : 3:2 or 16:10 wide framing
 * - 'wide'      : spans 2 columns in desktop editorial grid
 * - 'tall'      : spans 2 rows in desktop editorial grid
 * - 'square'    : 1:1 balanced crop
 */
const PHOTOGRAPHY_PHOTOS = [
  {
    id: 1,
    title: "Golden grasses along the road",
    category: "Nature",
    seriesId: "quiet-places",
    date: "March 2026",
    location: "Nugegoda, Colombo",
    // You can use a Google Drive share URL, ID, or local file:
    image: "https://drive.google.com/file/d/1tgTOnod-mBTrsRwFJqSQLx6Y1cQ8qT1E/view?usp=drive_link",
    aspectRatio: "portrait",
    description: "Warm sun shining through grasses.",
    exif: {
      camera: "Apple iPhone 11",
      lens: "FE 26mm f/1.8 GM",
      settings: "1/8197s · f/1.8 · ISO 32",
    },
    featured: true,
  },
  {
    id: 2,
    title: "Brutalist Monochrome construction",
    category: "Architecture",
    seriesId: "urban-geometry",
    date: "January 2026",
    location: "Nugegoda, Colombo",
    image: "https://drive.google.com/file/d/1CpSzE6WQFvBbPIKDhJI69y5ILeMK6Q0J/view?usp=drive_link",
    aspectRatio: "portrait",
    description: "Strong dark details on unfinished concrete at mid-day.",
    exif: {
      camera: "Apple iPhone 11",
      lens: "FE 26mm f/1.8 GM II",
      settings: "1/5236s · f/1.8 · ISO 32",
    },
    featured: true,
  },
  {
    id: 3,
    title: "Golden Hour at Mirissa Bay",
    category: "Landscape",
    seriesId: "southern-coast",
    date: "December 2025",
    location: "Southern Province",
    image: "assets/images/proj5_product_photo.jpg",
    aspectRatio: "landscape",
    description: "Low winter sun skimming across the Indian Ocean crests with golden coastal mist.",
    exif: {
      camera: "Sony A7 IV",
      lens: "FE 24-70mm f/2.8 GM II",
      settings: "1/800s · f/4.0 · ISO 160",
    },
    featured: true,
  },
  {
    id: 4,
    title: "Morning Mist Over Nuwara Eliya",
    category: "Nature",
    seriesId: "quiet-places",
    date: "November 2024",
    location: "Central Highlands",
    image: "assets/images/proj4_podcast_identity.jpg",
    aspectRatio: "portrait",
    description: "Dense mountain fog rolling silently through high-altitude tea plantations at dawn.",
    exif: {
      camera: "Fujifilm X-T5",
      lens: "XF 23mm f/1.4 R LM WR",
      settings: "1/250s · f/5.6 · ISO 200",
    },
    featured: false,
  },
  {
    id: 5,
    title: "Neon Stalls in City Center",
    category: "Street",
    seriesId: "colombo-after-rain",
    date: "June 2025",
    location: "Colombo City Center, Colombo",
    image: "https://drive.google.com/file/d/1N7IgoIBYdwaF7ym1E9ho5K4LR9aYHZ2W/view?usp=drive_link",
    aspectRatio: "Landscape",
    description: "Vibrant ambient light and Japaneese food in the food court of Colombo City Center.",
    exif: {
      camera: "Apple iPhone 11",
      lens: "FE 26mm f/1.8",
      settings: "1/100s · f/1.8 · ISO 64",
    },
    featured: true,
  },
  {
    id: 6,
    title: "Monolithic Glass Curvature",
    category: "Architecture",
    seriesId: "urban-geometry",
    date: "January 2025",
    location: "Marina Bay, Singapore",
    image: "assets/images/proj6_motion_graphics.jpg",
    aspectRatio: "landscape",
    description: "Skyward abstract perspective capturing light refraction on modern curved architectural glass.",
    exif: {
      camera: "Sony A7 IV",
      lens: "FE 16-35mm f/2.8 GM",
      settings: "1/640s · f/7.1 · ISO 125",
    },
    featured: true,
  },
  {
    id: 7,
    title: "Solitary Palm at Twilight",
    category: "Landscape",
    seriesId: "southern-coast",
    date: "December 2025",
    location: "Talpe Beach",
    image: "assets/images/proj5_product_photo.jpg",
    aspectRatio: "portrait",
    description: "Clean silhouette of a lone coconut palm against an indigo and peach twilight gradient.",
    exif: {
      camera: "Sony A7 IV",
      lens: "FE 24-70mm f/2.8 GM II",
      settings: "1/80s · f/2.8 · ISO 400",
    },
    featured: false,
  },
  {
    id: 8,
    title: "Prismatic Light Experiment",
    category: "Experimental",
    seriesId: null,
    date: "February 2026",
    location: "Studio",
    image: "assets/images/proj6_motion_graphics.jpg",
    aspectRatio: "wide",
    description: "Macro refraction study shooting direct sunlight through hand-cut optical crystal prisms.",
    exif: {
      camera: "Sony A7 IV",
      lens: "FE 90mm f/2.8 Macro G OSS",
      settings: "1/1000s · f/3.2 · ISO 100",
    },
    featured: true,
  },
];

// Helper to retrieve photos by category
function getPhotographyPhotos(category = 'All') {
  if (!category || category === 'All') {
    return [...PHOTOGRAPHY_PHOTOS];
  }
  return PHOTOGRAPHY_PHOTOS.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
}

// Helper to retrieve photos belonging to a specific series
function getSeriesPhotos(seriesId) {
  if (!seriesId) return [];
  return PHOTOGRAPHY_PHOTOS.filter((item) => item.seriesId === seriesId);
}

// Export data stores
if (typeof window !== 'undefined') {
  window.PHOTOGRAPHY_CONFIG = PHOTOGRAPHY_CONFIG;
  window.PHOTOGRAPHY_SERIES = PHOTOGRAPHY_SERIES;
  window.PHOTOGRAPHY_PHOTOS = PHOTOGRAPHY_PHOTOS;
  window.getPhotographyPhotos = getPhotographyPhotos;
  window.getSeriesPhotos = getSeriesPhotos;
}
