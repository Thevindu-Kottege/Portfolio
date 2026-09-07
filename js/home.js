/**
 * ============================================================
 * HOME PAGE — js/home.js
 * Renders featured projects grid and animates skill bars.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroBackground();
  renderFeaturedGrid();
  initSkillBars();
});

/**
 * Configure hero background image, opacity, and subtle parallax
 */
function initHeroBackground() {
  const bgImg = document.getElementById('hero-bg-image');
  const bgMedia = document.querySelector('.hero__bg-media');
  if (!bgImg) return;

  if (typeof CONFIG !== 'undefined') {
    // Configurable hero opacity
    if (typeof CONFIG.heroBackgroundOpacity === 'number') {
      document.documentElement.style.setProperty(
        '--hero-bg-opacity',
        String(CONFIG.heroBackgroundOpacity)
      );
    }

    // Configurable hero background image (supports local path or Google Drive link/ID)
    if (CONFIG.heroBackgroundImage) {
      const resolvedSrc = typeof ImageUtils !== 'undefined'
        ? ImageUtils.resolveImageUrl(CONFIG.heroBackgroundImage, 'full')
        : CONFIG.heroBackgroundImage;

      bgImg.src = resolvedSrc;

      bgImg.onerror = () => {
        if (typeof ImageUtils !== 'undefined') {
          ImageUtils.handleImageError(bgImg, 'Atmosphere', 'Hero');
        }
      };
    }
  }

  // Subtle parallax effect on hero background (disabled if user prefers reduced motion)
  if (bgMedia && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
              // Very gentle 0.12x parallax factor
              bgMedia.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }
}

function renderFeaturedGrid() {
  const grid = document.getElementById('featured-grid');
  if (!grid || typeof getFeaturedProjects !== 'function') return;

  const projects = getFeaturedProjects(6);

  // Editorial grid — vary the card shapes
  const variants = ['', '', '', '', '', 'wide'];

  grid.innerHTML = projects
    .map((p, i) => buildProjectCard(p, variants[i] || ''))
    .join('');

  // Re-run scroll reveal for newly added cards
  if (typeof initScrollReveal === 'function') initScrollReveal();
}

function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.width || '80%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}
