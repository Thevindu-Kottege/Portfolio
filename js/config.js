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
  nameShort: "YN",
  title: "Graphic Designer & Video Editor",
  tagline: "Creating visual content for brands, creators and digital media.",
  location: "Your City, Country",

  // --- Contact ---
  email: "hello@yourname.com",

  // --- Social Links (set to null to hide) ---
  social: {
    behance:   "https://www.behance.net/yourname",
    linkedin:  "https://www.linkedin.com/in/yourname",
    instagram: "https://www.instagram.com/yourname",
    youtube:   null,
    twitter:   null,
  },

  // --- Resume / CV ---
  // Replace with your actual PDF link when ready
  resumeUrl: "#", // e.g. "assets/resume.pdf"

  // --- SEO ---
  siteUrl: "https://yourname.com",
  metaDescription: "Portfolio of Thevindu Kottege — Graphic Designer and Video Editor creating visual content for brands, creators and digital media.",
  ogImage: "assets/images/og-image.jpg",

  // --- Copyright ---
  copyrightYear: "2026",
};

// Freeze to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.social);
