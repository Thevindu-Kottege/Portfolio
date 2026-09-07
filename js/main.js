/**
 * ============================================================
 * MAIN — js/main.js
 * Shared logic: navigation, scroll effects, reveal animations,
 * footer rendering, back-to-top, active nav state.
 * Runs on every page.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollReveal();
  initBackToTop();
  initActiveNavLink();
  renderNavLinks();
  renderFooter();
});

/* ── Navigation ──────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');

  if (!nav) return;

  // Scroll compact state
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile link click
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('is-open')) {
        hamburger.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── Populate nav name from config ──────────────────────── */
function renderNavLinks() {
  if (typeof CONFIG === 'undefined') return;

  document.querySelectorAll('[data-site-name]').forEach(el => {
    el.textContent = CONFIG.name;
  });
  document.querySelectorAll('[data-site-title]').forEach(el => {
    el.textContent = CONFIG.title;
  });
}

/* ── Active nav link ─────────────────────────────────────── */
function initActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile-link, .footer__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkPage = href.split('/').pop();
    if (
      (path === '' || path === 'index.html') && (linkPage === '' || linkPage === 'index.html') ||
      linkPage === path
    ) {
      link.classList.add('active');
    }
  });
}

/* ── IntersectionObserver scroll reveal ──────────────────── */
function initScrollReveal() {
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Back to top ─────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Render footer from CONFIG ───────────────────────────── */
function renderFooter() {
  if (typeof CONFIG === 'undefined') return;

  // Name + title
  document.querySelectorAll('[data-footer-name]').forEach(el => {
    el.textContent = CONFIG.name;
  });
  document.querySelectorAll('[data-footer-title]').forEach(el => {
    el.textContent = CONFIG.title;
  });
  document.querySelectorAll('[data-footer-year]').forEach(el => {
    el.textContent = `© ${CONFIG.copyrightYear} ${CONFIG.name}`;
  });

  // Social links in footer
  const socialContainer = document.querySelector('[data-footer-social]');
  if (socialContainer && CONFIG.social) {
    const links = buildSocialLinks(CONFIG.social);
    socialContainer.innerHTML = links;
  }

  // Social links in contact page
  const contactSocial = document.querySelector('[data-contact-social]');
  if (contactSocial && CONFIG.social) {
    const links = buildSocialLinks(CONFIG.social, true);
    contactSocial.innerHTML = links;
  }

  // Email links
  document.querySelectorAll('[data-email]').forEach(el => {
    el.href = `mailto:${CONFIG.email}`;
    if (el.dataset.emailText) el.textContent = CONFIG.email;
  });

  // Resume link
  document.querySelectorAll('[data-resume]').forEach(el => {
    el.href = CONFIG.resumeUrl;
    if (CONFIG.resumeUrl === '#') {
      el.setAttribute('title', 'CV coming soon');
    }
  });

  // Behance link
  document.querySelectorAll('[data-behance]').forEach(el => {
    if (CONFIG.social.behance) {
      el.href = CONFIG.social.behance;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });
}

/**
 * Build social links HTML
 */
function buildSocialLinks(social, extended = false) {
  const icons = {
    behance: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.5 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm0 1a4 4 0 110-8 4 4 0 010 8z"/><path d="M7.5 13a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm9-7h-4V5h4v1zm0 8H12v-1h4v1zm-2-5.5a2.5 2.5 0 00-2.5 2.5h5a2.5 2.5 0 00-2.5-2.5z"/><text>Be</text></svg>`,
    linkedin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>`,
    instagram: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>`,
    twitter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.265 5.633L18.244 2.25zm-1.16 17.52h1.833L7.084 4.126H5.117L17.084 19.77z"/></svg>`,
  };

  const labels = {
    behance: 'Behance',
    linkedin: 'LinkedIn',
    instagram: 'Instagram',
    youtube: 'YouTube',
    twitter: 'X / Twitter',
  };

  return Object.entries(social)
    .filter(([, url]) => url)
    .map(([platform, url]) => {
      const icon = icons[platform] || '';
      const label = labels[platform] || platform;
      if (extended) {
        return `<a href="${url}" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="${label}">
          ${icon} ${label}
        </a>`;
      }
      return `<a href="${url}" class="footer__link" target="_blank" rel="noopener noreferrer" aria-label="${label}">${label}</a>`;
    })
    .join('');
}

/**
 * Utility: build a project card HTML
 */
function buildProjectCard(project, variant = '') {
  const thumbSrc = (typeof ImageUtils !== 'undefined' && project.thumbnail)
    ? ImageUtils.resolveImageUrl(project.thumbnail, 'medium')
    : project.thumbnail;

  const imgHtml = thumbSrc
    ? `<img
        src="${thumbSrc}"
        alt="${project.title}"
        class="project-card__img"
        loading="lazy"
        decoding="async"
        width="800"
        height="534"
        onerror="if (typeof ImageUtils !== 'undefined') ImageUtils.handleImageError(this, '${project.title.replace(/'/g, "\\'")}', '${project.categoryLabel}');"
      >`
    : `<div class="project-card__placeholder project-card__placeholder--${(project.id % 4) + 1}">
        <span class="label" style="opacity:0.4">${project.categoryLabel}</span>
      </div>`;

  return `
    <a
      href="project.html?slug=${project.slug}"
      class="project-card reveal${variant ? ' project-card--' + variant : ''}"
      aria-label="View project: ${project.title}"
    >
      <div class="project-card__media">
        ${imgHtml}
        <div class="project-card__overlay">
          <span class="project-card__view-indicator">
            View Project
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </div>
      <div class="project-card__body">
        <div class="project-card__meta">
          <span class="project-card__category">${project.categoryLabel}</span>
          <span class="project-card__year">${project.year}</span>
        </div>
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__desc">${project.description}</p>
      </div>
    </a>
  `;
}
