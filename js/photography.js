/**
 * ============================================================================
 * PHOTOGRAPHY PAGE CONTROLLER & ADAPTIVE LIGHTBOX — js/photography.js
 * ============================================================================
 * Handles:
 * - Photography Home landing page (featured highlights & series)
 * - Progressive Photo Wall with configurable "See More" pagination
 * - Automatic aspect-ratio detection for the Lightbox:
 *     • Portrait / Square  → Side-by-side layout (Desktop Right Panel)
 *     • Landscape / Wide   → Full-width stage (Bottom Metadata Bar)
 *     • Mobile (<768px)    → Vertical stacked fullscreen composition
 * - Smooth directional slide & crossfade photo transitions
 * - Mobile touch swipe gestures
 * - Photography Contact form and Resume link synchronization
 * ============================================================================
 */

(function (global) {
  'use strict';

  // State
  let currentCategory = 'All';
  let filteredPhotos = [];
  let currentLightboxIndex = 0;
  let visiblePhotoCount = 12; // Configurable via CONFIG.photography.gallery
  let photosPerLoad = 8;
  let activeDirection = 'right'; // 'right' or 'left' for slide transitions

  // DOM Elements
  let galleryEl;
  let featuredGalleryEl;
  let filtersContainerEl;
  let seriesContainerEl;
  let seeMoreAreaEl;
  let seeMoreBtnEl;
  let seeMoreCounterEl;
  let allPhotosLoadedEl;
  let lightboxEl;
  let lightboxImgEl;
  let lightboxTitleEl;
  let lightboxLocationEl;
  let lightboxDescEl;
  let lightboxExifEl;
  let lightboxCounterEl;

  // Initialize on DOM load and when called by ThemeMorph
  document.addEventListener('DOMContentLoaded', initPhotographyPage);
  document.addEventListener('photography:init', initPhotographyPage);

  function initPhotographyPage() {
    readConfig();
    cacheElements();
    renderHero();
    initHeroBg();
    renderFeaturedPhotos();
    renderSeries();
    renderFilters();
    renderGalleryWall('All');
    initLightbox();
    initPhotographyContact();
    syncPhotographyResume();
  }

  function readConfig() {
    const cfg = (typeof CONFIG !== 'undefined' && CONFIG.photography) ? CONFIG.photography : {};
    if (cfg.gallery) {
      if (cfg.gallery.initialPhotoCount) visiblePhotoCount = cfg.gallery.initialPhotoCount;
      if (cfg.gallery.photosPerLoad) photosPerLoad = cfg.gallery.photosPerLoad;
    }
  }

  function cacheElements() {
    galleryEl = document.getElementById('photo-gallery');
    featuredGalleryEl = document.getElementById('featured-photo-gallery');
    filtersContainerEl = document.getElementById('photo-filters');
    seriesContainerEl = document.getElementById('series-grid');
    seeMoreAreaEl = document.getElementById('see-more-area');
    seeMoreBtnEl = document.getElementById('see-more-btn');
    seeMoreCounterEl = document.getElementById('see-more-counter');
    allPhotosLoadedEl = document.getElementById('all-photos-loaded');

    lightboxEl = document.getElementById('photo-lightbox');
    lightboxImgEl = document.getElementById('lightbox-img');
    lightboxTitleEl = document.getElementById('lightbox-title');
    lightboxLocationEl = document.getElementById('lightbox-location');
    lightboxDescEl = document.getElementById('lightbox-desc');
    lightboxExifEl = document.getElementById('lightbox-exif');
    lightboxCounterEl = document.getElementById('lightbox-counter');
  }

  /**
   * Render Editorial Hero with image resolution
   */
  function renderHero() {
    const heroCfg = (typeof PHOTOGRAPHY_CONFIG !== 'undefined' && PHOTOGRAPHY_CONFIG.hero)
      ? PHOTOGRAPHY_CONFIG.hero
      : {};

    const heroImgEl = document.getElementById('editorial-hero-img');
    const heroCaptionEl = document.getElementById('editorial-hero-caption');

    if (heroImgEl && heroCfg.featuredImage) {
      const src = typeof ImageUtils !== 'undefined'
        ? ImageUtils.resolveImageUrl(heroCfg.featuredImage, 'full')
        : heroCfg.featuredImage;

      heroImgEl.src = src;
      heroImgEl.alt = heroCfg.featuredImageAlt || 'Featured editorial photograph';

      heroImgEl.onerror = () => {
        if (typeof ImageUtils !== 'undefined') {
          ImageUtils.handleImageError(heroImgEl, heroCfg.featuredCaption || 'Hero Feature', 'Editorial');
        }
      };
    }

    if (heroCaptionEl && heroCfg.featuredCaption) {
      heroCaptionEl.textContent = heroCfg.featuredCaption;
    }
  }

  /**
   * Atmospheric background for the editorial hero with subtle parallax
   */
  function initHeroBg() {
    const bgImgEl = document.getElementById('editorial-hero-bg-img');
    const bgMediaEl = document.querySelector('.editorial-hero__bg-media');
    if (!bgImgEl) return;

    const cfg = (typeof CONFIG !== 'undefined' && CONFIG.photography) ? CONFIG.photography : {};
    const bgSrc = cfg.heroBackgroundImage || '';
    const bgOpacity = cfg.heroBackgroundOpacity != null ? cfg.heroBackgroundOpacity : 0.12;

    document.documentElement.style.setProperty('--photo-hero-bg-opacity', bgOpacity);

    if (bgSrc) {
      const src = typeof ImageUtils !== 'undefined'
        ? ImageUtils.resolveImageUrl(bgSrc, 'full')
        : bgSrc;
      bgImgEl.src = src;
      bgImgEl.alt = '';
      bgImgEl.onerror = () => { bgImgEl.style.display = 'none'; };
    }

    if (bgMediaEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const heroEl = document.querySelector('.editorial-hero');
      const onScroll = () => {
        if (!heroEl) return;
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = -rect.top / (heroEl.offsetHeight || 1);
        const shift = progress * 25;
        bgMediaEl.style.transform = `translate3d(0, ${shift}px, 0)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  /**
   * Render Featured Photos Grid on Photography Home (photography.html)
   */
  function renderFeaturedPhotos() {
    if (!featuredGalleryEl || typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    const featured = PHOTOGRAPHY_PHOTOS.filter((p) => p.featured);
    const photosToShow = featured.length ? featured : PHOTOGRAPHY_PHOTOS.slice(0, 6);

    featuredGalleryEl.innerHTML = photosToShow
      .map((photo, index) => createPhotoCardMarkup(photo, index))
      .join('');

    bindPhotoCards(featuredGalleryEl, photosToShow);

    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }

  /**
   * Render Photography Series / Collections
   */
  function renderSeries() {
    if (!seriesContainerEl || typeof PHOTOGRAPHY_SERIES === 'undefined') return;

    seriesContainerEl.innerHTML = PHOTOGRAPHY_SERIES.map((series) => {
      const coverSrc = typeof ImageUtils !== 'undefined'
        ? ImageUtils.resolveImageUrl(series.coverImage, 'medium')
        : series.coverImage;

      return `
        <article class="series-card reveal" data-series-id="${series.id}" tabindex="0" role="button" aria-label="Explore series: ${series.title}">
          <div class="series-card__media">
            <img
              src="${coverSrc}"
              alt="${series.title}"
              class="series-card__img"
              loading="lazy"
              decoding="async"
              onerror="if (typeof ImageUtils !== 'undefined') ImageUtils.handleImageError(this, '${series.title.replace(/'/g, "\\'")}', '${series.category}');"
            >
            <span class="series-card__count">${series.imageCount} Photographs</span>
          </div>
          <div class="series-card__body">
            <div class="series-card__meta">
              <span>${series.category}</span>
              <span>${series.date}</span>
            </div>
            <h3 class="series-card__title">${series.title}</h3>
            <p class="series-card__desc">${series.description}</p>
            <div class="series-card__footer">
              <span>📍 ${series.location}</span>
              <span style="font-weight: 500; color: var(--accent);">View Series →</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    seriesContainerEl.querySelectorAll('.series-card').forEach((card) => {
      const handleSeriesClick = () => {
        const seriesId = card.dataset.seriesId;
        // If on gallery page, filter directly; if on home, navigate to gallery page with query
        if (galleryEl) {
          filterBySeries(seriesId);
        } else {
          window.location.href = `photography-gallery.html?series=${seriesId}`;
        }
      };
      card.addEventListener('click', handleSeriesClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSeriesClick();
        }
      });
    });
  }

  /**
   * Render Category Filter Buttons
   */
  function renderFilters() {
    if (!filtersContainerEl || typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    const presentCategories = new Set(['All']);
    PHOTOGRAPHY_PHOTOS.forEach((p) => {
      if (p.category) presentCategories.add(p.category);
    });

    const categories = Array.from(presentCategories);

    filtersContainerEl.innerHTML = categories
      .map((cat) => `
        <button
          type="button"
          class="photo-filter-btn ${cat === currentCategory ? 'active' : ''}"
          data-filter="${cat}"
          role="tab"
          aria-selected="${cat === currentCategory}"
        >
          ${cat}
        </button>
      `)
      .join('');

    filtersContainerEl.querySelectorAll('.photo-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.filter;
        setActiveCategory(cat);
      });
    });
  }

  function setActiveCategory(category) {
    currentCategory = category;

    if (filtersContainerEl) {
      filtersContainerEl.querySelectorAll('.photo-filter-btn').forEach((btn) => {
        const isSelected = btn.dataset.filter === category;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', String(isSelected));
      });
    }

    // Reset pagination to initial count when changing category
    readConfig();
    renderGalleryWall(category);
  }

  function filterBySeries(seriesId) {
    if (typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    filteredPhotos = PHOTOGRAPHY_PHOTOS.filter((p) => p.seriesId === seriesId);
    if (!filteredPhotos.length) {
      filteredPhotos = [...PHOTOGRAPHY_PHOTOS];
    }

    if (filtersContainerEl) {
      filtersContainerEl.querySelectorAll('.photo-filter-btn').forEach((btn) => {
        btn.classList.remove('active');
      });
    }

    renderPhotoWallItems(true);
  }

  /**
   * Render Progressive Photo Wall on photography-gallery.html
   */
  function renderGalleryWall(category = 'All') {
    if (!galleryEl || typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    if (category === 'All') {
      filteredPhotos = [...PHOTOGRAPHY_PHOTOS];
    } else {
      filteredPhotos = PHOTOGRAPHY_PHOTOS.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Check for query param ?series=
    const params = new URLSearchParams(window.location.search);
    const seriesParam = params.get('series');
    if (seriesParam) {
      const seriesMatch = PHOTOGRAPHY_PHOTOS.filter((p) => p.seriesId === seriesParam);
      if (seriesMatch.length) {
        filteredPhotos = seriesMatch;
      }
    }

    renderPhotoWallItems(false);
  }

  function renderPhotoWallItems(isAppending = false) {
    if (!galleryEl) return;

    if (!filteredPhotos.length) {
      galleryEl.innerHTML = `
        <div style="grid-column: span 12; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">No photographs found.</p>
          <button class="btn btn--ghost btn--sm" onclick="window.resetPhotoFilter()">Show All Photographs</button>
        </div>
      `;
      if (seeMoreAreaEl) seeMoreAreaEl.style.display = 'none';
      return;
    }

    const currentSubset = filteredPhotos.slice(0, visiblePhotoCount);

    if (!isAppending) {
      galleryEl.innerHTML = currentSubset
        .map((photo, index) => createPhotoCardMarkup(photo, index))
        .join('');
    } else {
      // Append newly loaded items with animation
      const existingCount = galleryEl.querySelectorAll('.photo-card').length;
      const newlyAdded = currentSubset.slice(existingCount);

      const html = newlyAdded
        .map((photo, idx) => createPhotoCardMarkup(photo, existingCount + idx, true))
        .join('');

      galleryEl.insertAdjacentHTML('beforeend', html);
    }

    bindPhotoCards(galleryEl, filteredPhotos);
    updateSeeMorePagination();

    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }

  function createPhotoCardMarkup(photo, index, isNewlyLoaded = false) {
    const thumbSrc = typeof ImageUtils !== 'undefined'
      ? ImageUtils.resolveImageUrl(photo.image, 'medium')
      : photo.image;

    const ratio = photo.aspectRatio ? photo.aspectRatio.toLowerCase() : 'portrait';
    const ratioClass = `photo-card--${ratio}`;
    const animClass = isNewlyLoaded ? 'is-newly-loaded' : 'reveal';

    return `
      <div
        class="photo-card ${ratioClass} ${animClass}"
        data-index="${index}"
        role="button"
        tabindex="0"
        aria-label="View photograph: ${photo.title}"
      >
        <div class="photo-card__media">
          <img
            src="${thumbSrc}"
            alt="${photo.title}"
            class="photo-card__img"
            loading="lazy"
            decoding="async"
            onerror="if (typeof ImageUtils !== 'undefined') ImageUtils.handleImageError(this, '${photo.title.replace(/'/g, "\\'")}', '${photo.category}');"
          >
          <div class="photo-card__overlay">
            <span class="photo-card__overlay-meta">${photo.category} · ${photo.date || ''}</span>
            <h3 class="photo-card__overlay-title">${photo.title}</h3>
            ${photo.location ? `<span class="photo-card__overlay-location">📍 ${photo.location}</span>` : ''}
          </div>
        </div>
        <div class="photo-card__caption">
          <span class="photo-card__title-static">${photo.title}</span>
          <span class="photo-card__category-static">${photo.category}</span>
        </div>
      </div>
    `;
  }

  function bindPhotoCards(container, photosArray) {
    container.querySelectorAll('.photo-card').forEach((card) => {
      const open = () => {
        const idx = parseInt(card.dataset.index, 10);
        // Ensure filteredPhotos points to the active array
        filteredPhotos = photosArray;
        openLightbox(idx);
      };
      card.onclick = open;
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      };
    });
  }

  /**
   * Progressive "See More" Pagination Handler
   */
  function updateSeeMorePagination() {
    if (!seeMoreAreaEl) return;

    const total = filteredPhotos.length;
    const currentlyShown = Math.min(visiblePhotoCount, total);

    if (total <= visiblePhotoCount) {
      if (seeMoreBtnEl) seeMoreBtnEl.style.display = 'none';
      if (allPhotosLoadedEl && total > 4) {
        allPhotosLoadedEl.style.display = 'block';
      }
    } else {
      if (seeMoreBtnEl) {
        seeMoreBtnEl.style.display = 'inline-flex';
        if (seeMoreCounterEl) {
          seeMoreCounterEl.textContent = `(${currentlyShown} of ${total})`;
        }
        seeMoreBtnEl.onclick = () => {
          visiblePhotoCount += photosPerLoad;
          renderPhotoWallItems(true);
        };
      }
      if (allPhotosLoadedEl) allPhotosLoadedEl.style.display = 'none';
    }
  }

  // Global helper for resetting filters
  window.resetPhotoFilter = function () {
    setActiveCategory('All');
  };

  /**
   * ── ADAPTIVE LIGHTBOX LOGIC ────────────────────────────────
   */
  function initLightbox() {
    if (!lightboxEl) return;

    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const backdropEl = document.getElementById('lightbox-backdrop');

    if (closeBtn) closeBtn.onclick = closeLightbox;
    if (prevBtn) prevBtn.onclick = () => { activeDirection = 'left'; prevPhoto(); };
    if (nextBtn) nextBtn.onclick = () => { activeDirection = 'right'; nextPhoto(); };
    if (backdropEl) backdropEl.onclick = closeLightbox;

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        activeDirection = 'right';
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        activeDirection = 'left';
        prevPhoto();
      }
    });

    initSwipeGestures();
  }

  function openLightbox(index) {
    if (!filteredPhotos.length) return;
    currentLightboxIndex = (index + filteredPhotos.length) % filteredPhotos.length;

    updateLightboxContent();

    // Prevent scroll layout shift
    const sbWidth = window.innerWidth - document.documentElement.clientWidth;
    if (sbWidth > 0) {
      document.body.style.paddingRight = sbWidth + 'px';
    }
    document.body.style.overflow = 'hidden';

    lightboxEl.classList.add('is-open');
    lightboxEl.setAttribute('aria-hidden', 'false');

    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 60);
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('is-open');
    lightboxEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  function nextPhoto() {
    if (!filteredPhotos.length) return;
    activeDirection = 'right';
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    if (!filteredPhotos.length) return;
    activeDirection = 'left';
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
  }

  /**
   * Automatically detect aspect ratio & adapt Lightbox layout
   */
  function applyAdaptiveLayout(photo) {
    if (!lightboxEl) return;

    let isPortraitOrSquare = false;

    // 1. Natural image dimensions if loaded
    if (lightboxImgEl && lightboxImgEl.naturalWidth && lightboxImgEl.naturalHeight) {
      const ratio = lightboxImgEl.naturalWidth / lightboxImgEl.naturalHeight;
      isPortraitOrSquare = ratio <= 1.15; // portrait or square
    } else if (photo && photo.aspectRatio) {
      // 2. Specified aspect ratio metadata
      const ar = photo.aspectRatio.toLowerCase();
      isPortraitOrSquare = (ar === 'portrait' || ar === 'tall' || ar === 'square');
    }

    if (isPortraitOrSquare) {
      lightboxEl.classList.remove('photo-lightbox--landscape');
      lightboxEl.classList.add('photo-lightbox--portrait');
    } else {
      lightboxEl.classList.remove('photo-lightbox--portrait');
      lightboxEl.classList.add('photo-lightbox--landscape');
    }
  }

  function updateLightboxContent() {
    const photo = filteredPhotos[currentLightboxIndex];
    if (!photo) return;

    // Apply layout based on photo metadata immediately
    applyAdaptiveLayout(photo);

    const fullSrc = typeof ImageUtils !== 'undefined'
      ? ImageUtils.resolveImageUrl(photo.image, 'full')
      : photo.image;

    if (lightboxImgEl) {
      const spinnerEl = document.getElementById('lightbox-spinner');

      // Clean old animation classes
      lightboxImgEl.classList.remove('slide-from-right', 'slide-from-left');
      lightboxImgEl.style.opacity = '0.35';
      lightboxImgEl.style.transform = 'scale(0.98)';
      if (spinnerEl) spinnerEl.style.display = 'flex';

      lightboxImgEl.onload = () => {
        // Re-evaluate with exact natural dimensions
        applyAdaptiveLayout(photo);

        const animClass = activeDirection === 'right' ? 'slide-from-right' : 'slide-from-left';
        lightboxImgEl.classList.add(animClass);
        lightboxImgEl.style.opacity = '1';
        lightboxImgEl.style.transform = 'scale(1)';
        if (spinnerEl) spinnerEl.style.display = 'none';
      };

      lightboxImgEl.onerror = () => {
        if (typeof ImageUtils !== 'undefined') {
          ImageUtils.handleImageError(lightboxImgEl, photo.title, photo.category);
        }
        lightboxImgEl.style.opacity = '1';
        lightboxImgEl.style.transform = 'scale(1)';
        if (spinnerEl) spinnerEl.style.display = 'none';
      };

      lightboxImgEl.src = fullSrc;
      lightboxImgEl.alt = photo.title;
    }

    if (lightboxTitleEl) {
      lightboxTitleEl.textContent = photo.title;
    }

    if (lightboxLocationEl) {
      const locText = [photo.location, photo.date].filter(Boolean).join(' · ');
      lightboxLocationEl.textContent = locText;
    }

    if (lightboxDescEl) {
      lightboxDescEl.textContent = photo.description || '';
      lightboxDescEl.style.display = photo.description ? 'block' : 'none';
    }

    if (lightboxCounterEl) {
      lightboxCounterEl.textContent = `${currentLightboxIndex + 1} / ${filteredPhotos.length}`;
    }

    if (lightboxExifEl) {
      if (photo.exif) {
        const items = [];
        if (photo.exif.camera) items.push(`<span class="photo-lightbox__exif-item">📷 ${photo.exif.camera}</span>`);
        if (photo.exif.lens) items.push(`<span class="photo-lightbox__exif-item">🔍 ${photo.exif.lens}</span>`);
        if (photo.exif.settings) items.push(`<span class="photo-lightbox__exif-item">⚙️ ${photo.exif.settings}</span>`);
        lightboxExifEl.innerHTML = items.join('');
        lightboxExifEl.style.display = 'flex';
      } else {
        lightboxExifEl.style.display = 'none';
      }
    }
  }

  /**
   * Mobile Swipe Detection for Lightbox
   */
  function initSwipeGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const minSwipeDistance = 45;

    lightboxEl.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      },
      { passive: true }
    );

    lightboxEl.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          activeDirection = 'right';
          nextPhoto();
        } else {
          activeDirection = 'left';
          prevPhoto();
        }
      }
    }
  }

  /**
   * Photography Contact Form Handler
   */
  function initPhotographyContact() {
    const form = document.getElementById('photography-contact-form');
    if (!form) return;

    const statusEl = document.getElementById('photo-form-status');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const msg = form.querySelector('[name="message"]')?.value.trim();

      if (!name || !email || !msg) {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.style.background = 'rgba(215, 60, 60, 0.1)';
          statusEl.style.color = '#c93b2b';
          statusEl.textContent = 'Please complete all required fields.';
        }
        return;
      }

      // Success feedback
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.style.background = 'rgba(76, 175, 80, 0.12)';
        statusEl.style.color = '#2e7d32';
        statusEl.textContent = 'Thank you! Your inquiry has been sent. I will be in touch shortly.';
      }
      form.reset();
    });
  }

  /**
   * Sync Photography Resume URL from CONFIG
   */
  function syncPhotographyResume() {
    const resumeLinks = document.querySelectorAll('[data-photography-resume]');
    const resumeUrl = (typeof CONFIG !== 'undefined' && CONFIG.photography && CONFIG.photography.resumeUrl)
      ? CONFIG.photography.resumeUrl
      : '#';

    resumeLinks.forEach((link) => {
      link.href = resumeUrl;
      if (resumeUrl === '#') {
        link.setAttribute('title', 'Photography CV coming soon');
      } else {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    });
  }

  // Expose globally
  global.initPhotographyPage = initPhotographyPage;

})(typeof window !== 'undefined' ? window : this);

