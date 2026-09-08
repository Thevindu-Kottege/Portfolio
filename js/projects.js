/**
 * ============================================================
 * PROJECT DATA STORE — js/projects.js
 * ============================================================
 * Add new projects by appending an object to the PROJECTS array.
 * Update image paths once you have real project assets.
 * Set featured: true to show on the home page (max 6 shown).
 * ============================================================
 */

const PROJECTS = [
  {
    id: 1,
    slug: "sports-social-media-campaign",
    title: "Sports Social Media Campaign",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    year: "2026",
    description: "A bold social media content campaign designed for a sports brand, featuring dynamic post layouts, athlete visuals, and cohesive story templates.",
    role: "Graphic Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Canva"],
    thumbnail: "assets/images/proj1_sports_campaign.jpg",
    heroImage: "assets/images/proj1_sports_campaign.jpg",
    gallery: [
      { src: "assets/images/proj1_sports_campaign.jpg", alt: "Sports campaign hero post" },
    ],
    brief: "A sports brand needed a comprehensive social media visual system for their upcoming season launch — covering Instagram posts, stories, and reels covers that felt energetic, premium, and on-brand.",
    goal: "Create a visually consistent content series that increases engagement and communicates the brand's competitive, high-performance identity across all major platforms.",
    myRole: "Designed all post layouts, created the visual system, sourced and retouched athlete photography, and produced final export files ready for scheduling.",
    process: [
      { title: "Research & Moodboard", desc: "Analysed competitor sports brands and top-performing sports content to identify visual patterns that resonate with an athletic audience." },
      { title: "Colour & Type System", desc: "Established a bold typographic hierarchy using display fonts, paired with a restricted dark palette and single accent tone." },
      { title: "Layout Development", desc: "Produced 12+ post templates covering single images, carousels, story frames, and highlight covers." },
    ],
    results: null, // Set to an array of { label, value } objects if you have real data
    featured: true,
    placeholderNote: "PLACEHOLDER — Replace with your real sports campaign project.",
  },

  {
    id: 2,
    slug: "youtube-channel-branding",
    title: "YouTube Channel Branding",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    year: "2025",
    description: "Complete visual identity for a YouTube creator — channel art, logo, thumbnail templates, lower thirds, and end screens.",
    role: "Graphic Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Canva"],
    thumbnail: "assets/images/proj2_youtube_branding.jpg",
    heroImage: "assets/images/proj2_youtube_branding.jpg",
    gallery: [
      { src: "assets/images/proj2_youtube_branding.jpg", alt: "YouTube channel branding mockup" },
    ],
    brief: "A content creator launching a new YouTube channel needed a full visual identity package to build a recognisable brand from day one.",
    goal: "Design a scalable branding system that works across the YouTube platform and social media — including channel art, a logo mark, and thumbnail templates optimised for click-through.",
    myRole: "Designed the complete branding system from logo concepts through to final deliverables, including editable Photoshop template files.",
    process: [
      { title: "Creator Brief", desc: "Understood the creator's niche, target audience, tone of voice, and competitor channels to inform the visual direction." },
      { title: "Logo Exploration", desc: "Created multiple logo concepts, refined based on feedback, and developed a final responsive logo system." },
      { title: "Template Production", desc: "Built a set of Photoshop thumbnail templates and Canva story templates for easy ongoing use." },
    ],
    results: null,
    featured: true,
    placeholderNote: "PLACEHOLDER — Replace with your real YouTube branding project.",
  },

  {
    id: 3,
    slug: "short-form-video-reel",
    title: "Short-Form Video Editing Reel",
    category: "video-editing",
    categoryLabel: "Video Editing",
    year: "2026",
    description: "A compiled editing reel showcasing dynamic short-form video work — Reels, TikToks, and YouTube Shorts — featuring pacing, transitions, colour grading, and motion text.",
    role: "Video Editor",
    tools: ["Adobe Premiere Pro", "DaVinci Resolve", "CapCut"],
    thumbnail: "assets/images/proj3_video_reel.jpg",
    heroImage: "assets/images/proj3_video_reel.jpg",
    gallery: [
      { src: "assets/images/proj3_video_reel.jpg", alt: "Video editing reel" },
    ],
    brief: "Compile and edit a professional showreel demonstrating range across different short-form formats, editing styles, and visual aesthetics.",
    goal: "Present video editing capability across fast-paced social content, including sync-to-beat cutting, colour grading, text overlays, and dynamic transitions.",
    myRole: "Edited all footage, applied colour grades, designed motion text treatments, and assembled the final reel with custom audio mix.",
    process: [
      { title: "Footage Selection", desc: "Curated the strongest raw clips from multiple projects to represent range in pace, style, and content type." },
      { title: "Edit Structure", desc: "Built the reel structure to open with high-energy content, demonstrate variety, and close with impact." },
      { title: "Colour & Polish", desc: "Applied consistent colour grading across all clips and added motion captions and graphic overlays." },
    ],
    results: null,
    featured: true,
    placeholderNote: "PLACEHOLDER — Replace with your real video editing reel.",
  },

  {
    id: 4,
    slug: "podcast-visual-identity",
    title: "Podcast Visual Identity",
    category: "graphic-design",
    categoryLabel: "Graphic Design",
    year: "2025",
    description: "Complete visual identity for an independent podcast — cover art, episode artwork templates, audiogram templates, and social media assets.",
    role: "Graphic Designer",
    tools: ["Adobe Photoshop", "Adobe Illustrator", "Canva"],
    thumbnail: "assets/images/proj4_podcast_identity.jpg",
    heroImage: "assets/images/proj4_podcast_identity.jpg",
    gallery: [
      { src: "assets/images/proj4_podcast_identity.jpg", alt: "Podcast visual identity" },
    ],
    brief: "An independent podcast needed a professional visual identity to stand out on Spotify, Apple Podcasts, and social media.",
    goal: "Design a premium cover art and supporting asset system that communicates credibility and attracts the right audience from the feed.",
    myRole: "Designed the podcast cover art, episode artwork templates, and accompanying social media graphic templates.",
    process: [
      { title: "Brand Direction", desc: "Explored typographic styles and layouts suited to the podcast topic and tone — sophisticated, editorial, and clear." },
      { title: "Cover Art Design", desc: "Developed multiple cover directions and refined the chosen concept for optimal readability at small sizes." },
      { title: "Template System", desc: "Created a reusable episode artwork template and matching audiogram layouts." },
    ],
    results: null,
    featured: true,
    placeholderNote: "PLACEHOLDER — Replace with your real podcast identity project.",
  },

  {
    id: 5,
    slug: "product-photography-editing",
    title: "Product Photography Editing",
    category: "photography",
    categoryLabel: "Photography",
    year: "2025",
    description: "Professional product photo editing and retouching for a luxury goods brand — colour grading, background removal, and studio lighting enhancement.",
    role: "Photo Editor",
    tools: ["Adobe Photoshop", "Adobe Lightroom"],
    thumbnail: "assets/images/proj5_product_photo.jpg",
    heroImage: "assets/images/proj5_product_photo.jpg",
    gallery: [
      { src: "assets/images/proj5_product_photo.jpg", alt: "Luxury product photography edit" },
    ],
    brief: "A luxury product brand needed their raw studio photography refined for e-commerce and print — with consistent lighting, clean backgrounds, and premium colour treatment.",
    goal: "Deliver post-processed images that meet e-commerce technical requirements while maintaining a high-end editorial aesthetic.",
    myRole: "Performed all retouching, background cleanup, colour correction, and final export for web and print.",
    process: [
      { title: "Raw Processing", desc: "Processed RAW files in Lightroom, applying consistent exposure and white balance across all product SKUs." },
      { title: "Retouching", desc: "Cleaned backgrounds, removed imperfections, enhanced texture detail, and balanced reflections." },
      { title: "Colour Grading", desc: "Applied a warm, premium colour grade consistent with the brand's visual language." },
    ],
    results: null,
    featured: false,
    placeholderNote: "PLACEHOLDER — Replace with your real product photography project.",
  },

  {
    id: 6,
    slug: "motion-graphics-opener",
    title: "Motion Graphics Intro Opener",
    category: "motion",
    categoryLabel: "Motion Graphics",
    year: "2026",
    description: "Animated intro sequence for a digital media brand — kinetic typography, logo reveal, and branded transition templates.",
    role: "Motion Designer",
    tools: ["Adobe Premiere Pro", "Adobe After Effects"],
    thumbnail: "assets/images/proj6_motion_graphics.jpg",
    heroImage: "assets/images/proj6_motion_graphics.jpg",
    gallery: [
      { src: "assets/images/proj6_motion_graphics.jpg", alt: "Motion graphics opener" },
    ],
    brief: "A digital content brand needed a professional intro animation and transition pack to use across all their video content.",
    goal: "Create a 5-10 second animated opener that communicates brand identity instantly, paired with a set of branded lower third and transition templates.",
    myRole: "Designed and animated the full intro sequence, lower thirds, and transition pack using After Effects.",
    process: [
      { title: "Storyboard", desc: "Sketched the animation sequence, mapping timing, motion paths, and element reveals." },
      { title: "Design", desc: "Created all static assets in Illustrator, then imported into After Effects for animation." },
      { title: "Animation & Export", desc: "Animated all elements with smooth easing, exported as PNG sequence and ProRes for use in any NLE." },
    ],
    results: null,
    featured: false,
    placeholderNote: "PLACEHOLDER — Replace with your real motion graphics project.",
  },

  {
    id: 7,
    slug: "3d-product-visualization",
    title: "3D Product Visualisation",
    category: "3d-motion",
    categoryLabel: "3D Design",
    year: "2025",
    description: "Photorealistic 3D product renders created in Blender — modelling, texturing, lighting, and final compositing for marketing use.",
    role: "3D Designer",
    tools: ["Blender", "Adobe Photoshop"],
    thumbnail: null, // No image — will use placeholder gradient
    heroImage: null,
    gallery: [],
    brief: "A product brand needed photorealistic 3D renders of their product for marketing materials before physical samples were available.",
    goal: "Produce high-quality 3D visualisations that can be used across digital advertising, social media, and press materials.",
    myRole: "Modelled the product geometry, created and applied all materials and textures, set up studio lighting, and rendered final images.",
    process: [
      { title: "Reference & Modelling", desc: "Built accurate geometry from technical drawings and reference photography." },
      { title: "Materials & Texturing", desc: "Created PBR materials replicating real-world surface properties — metal, glass, and fabric." },
      { title: "Lighting & Render", desc: "Set up HDRI studio lighting, rendered in Cycles, and composited final images in Photoshop." },
    ],
    results: null,
    featured: false,
    placeholderNote: "PLACEHOLDER — Replace with your real 3D visualisation project.",
  },

  {
    id: 8,
    slug: "brand-identity-system",
    title: "Brand Identity System",
    category: "graphic-design",
    categoryLabel: "Graphic Design / Branding",
    year: "2025",
    description: "Full brand identity system for a creative studio — logo family, colour palette, typography, brand guidelines, and stationery design.",
    role: "Brand Designer",
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Canva"],
    thumbnail: null, // No image — will use placeholder gradient
    heroImage: null,
    gallery: [],
    brief: "A small creative studio needed a complete brand identity to establish their professional presence and differentiate them in a competitive market.",
    goal: "Develop a distinctive, flexible brand identity that communicates creativity and professionalism, and can scale from business cards to digital applications.",
    myRole: "Led the full identity process from discovery and moodboarding through logo design, brand guidelines, and stationery application.",
    process: [
      { title: "Discovery", desc: "Ran a brand workshop to understand the studio's values, target clients, and competitive positioning." },
      { title: "Logo Design", desc: "Developed three concept directions, refined the selected concept across multiple rounds." },
      { title: "Brand System", desc: "Expanded the approved logo into a complete brand system with guidelines, stationery, and digital applications." },
    ],
    results: null,
    featured: true,
    placeholderNote: "PLACEHOLDER — Replace with your real brand identity project.",
  },
];

/**
 * Get all projects
 */
function getAllProjects() {
  return PROJECTS;
}

/**
 * Get featured projects (shown on home page)
 */
function getFeaturedProjects(limit = 6) {
  const featured = PROJECTS.filter(p => p.featured);
  if (featured.length > 0) return featured.slice(0, limit);
  return PROJECTS.slice(0, limit);
}

/**
 * Get projects by category slug
 */
function getProjectsByCategory(category) {
  if (category === 'all') return PROJECTS;
  return PROJECTS.filter(p => p.category === category);
}

/**
 * Get a single project by slug
 */
function getProjectBySlug(slug) {
  return PROJECTS.find(p => p.slug === slug) || null;
}

/**
 * Get prev/next project
 */
function getAdjacentProjects(slug) {
  const idx = PROJECTS.findIndex(p => p.slug === slug);
  return {
    prev: idx > 0 ? PROJECTS[idx - 1] : PROJECTS[PROJECTS.length - 1],
    next: idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : PROJECTS[0],
  };
}
