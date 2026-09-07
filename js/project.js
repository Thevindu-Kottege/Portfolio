/**
 * ============================================================
 * PROJECT CASE STUDY — js/project.js
 * Renders a full project page from URL slug parameter.
 * Usage: project.html?slug=sports-social-media-campaign
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  let slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'project') {
      slug = parts[1];
    }
  }

  if (!slug) {
    renderNotFound();
    return;
  }

  const project = getProjectBySlug(slug);

  if (!project) {
    renderNotFound();
    return;
  }

  renderProjectPage(project);
  renderAdjacentNav(slug);
  updatePageMeta(project);
});

/* ── Full project page renderer ─────────────────────────── */
function renderProjectPage(project) {
  // ── Page title
  document.title = `${project.title} — ${CONFIG.name}`;

  // ── Hero section
  const heroEl = document.getElementById('project-hero');
  if (heroEl) {
    heroEl.innerHTML = `
      <div class="container">
        <div class="project-hero__category">
          <span class="label">${project.categoryLabel}</span>
        </div>
        <h1 class="project-hero__title hero-animate-2">${project.title}</h1>
        <div class="project-hero__meta hero-animate-3">
          <div class="project-hero__meta-item">
            <span class="project-hero__meta-label">Year</span>
            <span class="project-hero__meta-value">${project.year}</span>
          </div>
          <div class="project-hero__meta-item">
            <span class="project-hero__meta-label">Category</span>
            <span class="project-hero__meta-value">${project.categoryLabel}</span>
          </div>
          <div class="project-hero__meta-item">
            <span class="project-hero__meta-label">Role</span>
            <span class="project-hero__meta-value">${project.role}</span>
          </div>
        </div>
        ${renderHeroImage(project)}
      </div>
    `;
  }

  // ── Overview
  const overviewEl = document.getElementById('project-overview');
  if (overviewEl) {
    overviewEl.innerHTML = `
      <div class="project-overview__card reveal">
        <div class="project-overview__card-label">The Brief</div>
        <p class="project-overview__card-text">${project.brief}</p>
      </div>
      <div class="project-overview__card reveal reveal--delay-1">
        <div class="project-overview__card-label">The Goal</div>
        <p class="project-overview__card-text">${project.goal}</p>
      </div>
      <div class="project-overview__card reveal reveal--delay-2">
        <div class="project-overview__card-label">My Role</div>
        <p class="project-overview__card-text">${project.myRole}</p>
        <div style="margin-top: 1rem;">
          <div class="project-tools">
            ${project.tools.map(t => `<span class="project-tool-tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ── Process
  const processEl = document.getElementById('project-process');
  if (processEl && project.process && project.process.length > 0) {
    const processSection = document.getElementById('process-section');
    if (processSection) processSection.style.display = '';

    processEl.innerHTML = project.process.map((step, i) => `
      <div class="project-overview__card reveal reveal--delay-${i}">
        <div class="project-overview__card-label">0${i + 1}</div>
        <h4 style="font-family: var(--font-display); font-size: var(--text-xl); color: var(--text-primary); margin-bottom: 0.75rem;">${step.title}</h4>
        <p class="project-overview__card-text">${step.desc}</p>
      </div>
    `).join('');
  } else {
    const processSection = document.getElementById('process-section');
    if (processSection) processSection.style.display = 'none';
  }

  // ── Gallery
  const galleryEl = document.getElementById('project-gallery');
  if (galleryEl) {
    if (project.gallery && project.gallery.length > 0) {
      galleryEl.className = `project-gallery ${project.gallery.length === 1 ? 'project-gallery--full' : ''}`;
      galleryEl.innerHTML = project.gallery.map(img => {
        const resolvedSrc = typeof ImageUtils !== 'undefined'
          ? ImageUtils.resolveImageUrl(img.src, 'full')
          : img.src;

        return `
          <div class="project-gallery__item reveal">
            <img
              src="${resolvedSrc}"
              alt="${img.alt}"
              loading="lazy"
              decoding="async"
              onerror="if (typeof ImageUtils !== 'undefined') ImageUtils.handleImageError(this, '${img.alt.replace(/'/g, "\\'")}', '${project.categoryLabel}');"
            >
          </div>
        `;
      }).join('');
    } else {
      // Placeholder gallery
      galleryEl.className = 'project-gallery project-gallery--full';
      galleryEl.innerHTML = `
        <div class="project-gallery__item reveal">
          <div class="project-card__placeholder project-card__placeholder--${(project.id % 4) + 1}" style="height:400px; display:flex; align-items:center; justify-content:center; border-radius: var(--radius-lg);">
            <div style="text-align:center;">
              <span class="label" style="display:block; margin-bottom:1rem; opacity:0.5;">Gallery Images</span>
              <p style="color: var(--text-tertiary); font-size: var(--text-sm); max-width: 30ch;">${project.placeholderNote}</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ── Results (only if data provided)
  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    if (project.results && project.results.length > 0) {
      resultsSection.style.display = '';
      const grid = document.getElementById('results-grid');
      if (grid) {
        grid.innerHTML = project.results.map(r => `
          <div class="result-stat reveal">
            <div class="result-stat__value">${r.value}</div>
            <div class="result-stat__label">${r.label}</div>
          </div>
        `).join('');
      }
    } else {
      resultsSection.style.display = 'none';
    }
  }

  // Run scroll reveal for dynamically added elements
  if (typeof initScrollReveal === 'function') initScrollReveal();
}

/* ── Hero image helper ───────────────────────────────────── */
function renderHeroImage(project) {
  if (project.heroImage) {
    const resolvedHeroSrc = typeof ImageUtils !== 'undefined'
      ? ImageUtils.resolveImageUrl(project.heroImage, 'full')
      : project.heroImage;

    return `
      <div class="project-hero__image hero-animate-4">
        <img
          src="${resolvedHeroSrc}"
          alt="${project.title}"
          loading="eager"
          decoding="async"
          onerror="if (typeof ImageUtils !== 'undefined') ImageUtils.handleImageError(this, '${project.title.replace(/'/g, "\\'")}', '${project.categoryLabel}');"
        >
      </div>
    `;
  }
  return `
    <div class="project-hero__image hero-animate-4">
      <div class="project-card__placeholder project-card__placeholder--${(project.id % 4) + 1}" style="height:100%">
      </div>
    </div>
  `;
}

/* ── Prev/Next navigation ────────────────────────────────── */
function renderAdjacentNav(slug) {
  const navEl = document.getElementById('project-adjacent-nav');
  if (!navEl || typeof getAdjacentProjects !== 'function') return;

  const { prev, next } = getAdjacentProjects(slug);

  navEl.innerHTML = `
    <div class="project-nav">
      <a href="project.html?slug=${prev.slug}" class="project-nav__link project-nav__link--prev">
        <span class="project-nav__direction">← Previous</span>
        <span class="project-nav__title">${prev.title}</span>
      </a>
      <a href="project.html?slug=${next.slug}" class="project-nav__link project-nav__link--next">
        <span class="project-nav__direction">Next →</span>
        <span class="project-nav__title">${next.title}</span>
      </a>
    </div>
    <div style="text-align:center; margin-top: 2rem;">
      <a href="work.html" class="btn btn--ghost">
        View All Work <span class="btn__arrow">→</span>
      </a>
    </div>
  `;
}

/* ── Update page meta tags ───────────────────────────────── */
function updatePageMeta(project) {
  const desc = `${project.title} — ${project.categoryLabel}, ${project.year}. ${project.description}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', desc);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `${project.title} — ${CONFIG.name}`);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', desc);

  if (project.heroImage || project.thumbnail) {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', project.heroImage || project.thumbnail);
  }
}

/* ── Not found state ─────────────────────────────────────── */
function renderNotFound() {
  document.title = `Project Not Found — ${typeof CONFIG !== 'undefined' ? CONFIG.name : 'Portfolio'}`;
  const main = document.querySelector('main') || document.body;
  main.innerHTML = `
    <div style="
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 2rem;
      padding-top: calc(var(--nav-height) + 4rem);
    ">
      <span class="label" style="margin-bottom: 1rem;">404</span>
      <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 5vw, 4rem); margin-bottom: 1rem; letter-spacing:-0.025em;">Project not found.</h1>
      <p style="color: var(--text-secondary); max-width: 40ch; margin-bottom: 2rem;">The project you're looking for doesn't exist or has been removed.</p>
      <a href="work.html" class="btn btn--ghost">← Back to Work</a>
    </div>
  `;
}
