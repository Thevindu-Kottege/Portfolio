/**
 * ============================================================
 * SITE CONFIGURATION — js/config.js
 * ============================================================
 * Edit this file to update Thevindu Kottege, links, and meta info.
 * This is the single source of truth for all personal details.
 * ============================================================
 */

const CONFIG = {
  // --- Personal Info ---
  name: "Thevindu Kottege",
  nameShort: "TK",
  title: "Graphic Designer & Video Editor",
  tagline: "Creating visual content for brands, creators and digital media.",
  location: "Nugegoda, Sri Lanka",

  // --- Contact ---
  email: "thevindukottege@gmail.com",

  // --- Social Links (set to null to hide) ---
  social: {
    behance:   "https://www.behance.net/thevindukottege",
    linkedin:  "https://www.linkedin.com/in/thevindu-kottege/",
    instagram: "https://www.instagram.com/thevindu_kottege/",
    youtube:   "https://www.youtube.com/@thevindukottege8799",
    twitter:   "https://x.com/Thevindu_k",
  },

  // --- Resume / CV ---
  // Replace with your actual PDF link when ready
  resumeUrl: "#", // e.g. "assets/resume.pdf"

  // --- SEO ---
  siteUrl: "https://thevindukottege.vercel.app",
  metaDescription: "Portfolio of Thevindu Kottege — Graphic Designer and Video Editor creating visual content for brands, creators and digital media.",
  ogImage: "assets/images/og-image.jpg",

  // --- Hero Background Atmosphere (Homepage) ---
  // Place your image path (e.g. "assets/images/hero-atmosphere.jpg")
  // or your Google Drive share URL / File ID here!
  // Recommended opacity: 0.12 - 0.25 (keeps text readable and mood cinematic)
  heroBackgroundImage: "assets/images/proj5_product_photo.jpg", // REPLACE_HERE: Put your hero image or Google Drive link
  heroBackgroundOpacity: 0.18, // Configurable opacity (0.0 = invisible, 1.0 = full strength)

  // --- Photography Section Metadata ---
  photography: {
    title: "Through My Lens",
    subtitle: "Moments, places and perspectives.",
    description: "A collection of landscapes, places, moments and visual experiments.",
    seoTitle: "Thevindu Kottege — Photography",
    seoDescription: "Photography portfolio of Thevindu Kottege featuring landscapes, places, people and visual stories.",
    heroImage: "assets/images/proj5_product_photo.jpg", // REPLACE_HERE: Primary editorial hero image (or Google Drive link)
  },

  // --- Copyright ---
  copyrightYear: "2026",
};

// Freeze to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.social);
if (CONFIG.photography) Object.freeze(CONFIG.photography);
