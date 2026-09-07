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

  // --- Copyright ---
  copyrightYear: "2026",
};

// Freeze to prevent accidental mutation
Object.freeze(CONFIG);
Object.freeze(CONFIG.social);
