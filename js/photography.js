/**
 * ============================================================
 * PHOTOGRAPHY PAGE LOGIC & LIGHTBOX — js/photography.js
 * ============================================================
 * Handles editorial gallery rendering, category filtering,
 * series exploration, and accessible full-screen lightbox.
 * ============================================================
 */

(function () {
  'use strict';

  // State
  let currentCategory = 'All';
  let filteredPhotos = [];
  let currentLightboxIndex = 0;

  // DOM Elements
  let galleryEl;
  let filtersContainerEl;
  let seriesContainerEl;
  let lightboxEl;
  let lightboxImgEl;
  let lightboxTitleEl;
  let lightboxLocationEl;
  let lightboxDescEl;
  let lightboxExifEl;
  let lightboxCounterEl;

  document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    renderHero();
    initHeroBg();
    renderSeries();
    renderFilters();
    renderGallery('All');
    initLightbox();
  });

  function cacheElements() {
    galleryEl = document.getElementById('photo-gallery');
    filtersContainerEl = document.getElementById('photo-filters');
    seriesContainerEl = document.getElementById('series-grid');
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
   * Initialise the atmospheric background for the editorial hero.
   * Loads the configurable background image and applies subtle parallax.
   */
  function initHeroBg() {
    const bgImgEl = document.getElementById('editorial-hero-bg-img');
    const bgMediaEl = document.querySelector('.editorial-hero__bg-media');
    if (!bgImgEl) return;

    // Read config
    const cfg = (typeof CONFIG !== 'undefined' && CONFIG.photography) ? CONFIG.photography : {};
    const bgSrc = cfg.heroBackgroundImage || '';
    const bgOpacity = cfg.heroBackgroundOpacity != null ? cfg.heroBackgroundOpacity : 0.12;

    // Apply opacity via CSS custom property
    document.documentElement.style.setProperty('--photo-hero-bg-opacity', bgOpacity);

    // Load background image
    if (bgSrc) {
      const src = typeof ImageUtils !== 'undefined'
        ? ImageUtils.resolveImageUrl(bgSrc, 'full')
        : bgSrc;
      bgImgEl.src = src;
      bgImgEl.alt = '';
      bgImgEl.onerror = () => { bgImgEl.style.display = 'none'; };
    }

    // Subtle parallax on scroll (reduced motion respected)
    if (bgMediaEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const heroEl = document.querySelector('.editorial-hero');
      const onScroll = () => {
        if (!heroEl) return;
        const rect = heroEl.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const progress = -rect.top / (heroEl.offsetHeight || 1);
        const shift = progress * 30; // max 30px translate
        bgMediaEl.style.transform = `translate3d(0, ${shift}px, 0)`;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
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

    // Clicking a series filters gallery to that series
    seriesContainerEl.querySelectorAll('.series-card').forEach((card) => {
      const handleSeriesClick = () => {
        const seriesId = card.dataset.seriesId;
        filterBySeries(seriesId);
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

    // Get list of active categories present in the photos
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

    // Update active button state
    filtersContainerEl.querySelectorAll('.photo-filter-btn').forEach((btn) => {
      const isSelected = btn.dataset.filter === category;
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    renderGallery(category);
  }

  function filterBySeries(seriesId) {
    if (typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    filteredPhotos = PHOTOGRAPHY_PHOTOS.filter((p) => p.seriesId === seriesId);
    if (!filteredPhotos.length) {
      filteredPhotos = PHOTOGRAPHY_PHOTOS;
    }

    // Scroll smoothly to gallery section
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }

    // Unselect filter pills since we are in series mode
    filtersContainerEl.querySelectorAll('.photo-filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    renderFilteredPhotos();
  }

  /**
   * Render Gallery based on Category
   */
  function renderGallery(category = 'All') {
    if (typeof PHOTOGRAPHY_PHOTOS === 'undefined') return;

    if (category === 'All') {
      filteredPhotos = [...PHOTOGRAPHY_PHOTOS];
    } else {
      filteredPhotos = PHOTOGRAPHY_PHOTOS.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    renderFilteredPhotos();
  }

  function renderFilteredPhotos() {
    if (!galleryEl) return;

    if (!filteredPhotos.length) {
      galleryEl.innerHTML = `
        <div style="grid-column: span 12; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">No photographs found in this category.</p>
          <button class="btn btn--ghost btn--sm" onclick="window.resetPhotoFilter()">Show All Photographs</button>
        </div>
      `;
      return;
    }

    galleryEl.innerHTML = filteredPhotos
      .map((photo, index) => {
        const thumbSrc = typeof ImageUtils !== 'undefined'
          ? ImageUtils.resolveImageUrl(photo.image, 'medium')
          : photo.image;

        const ratioClass = photo.aspectRatio ? `photo-card--${photo.aspectRatio}` : 'photo-card--portrait';

        return `
          <div
            class="photo-card ${ratioClass} reveal"
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
                <span class="photo-card__overlay-meta">${photo.category} · ${photo.date}</span>
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
      })
      .join('');

    // Bind click events to open Lightbox
    galleryEl.querySelectorAll('.photo-card').forEach((card) => {
      const open = () => {
        const idx = parseInt(card.dataset.index, 10);
        openLightbox(idx);
      };
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      });
    });

    // Re-trigger scroll reveal for newly injected cards
    if (typeof initScrollReveal === 'function') {
      initScrollReveal();
    }
  }

  // Global helper for resetting filters
  window.resetPhotoFilter = function () {
    setActiveCategory('All');
  };

  /**
   * ── LIGHTBOX LOGIC ─────────────────────────────────────────
   */
  function initLightbox() {
    if (!lightboxEl) return;

    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', nextPhoto);

    // Close on backdrop click
    const backdropEl = document.getElementById('lightbox-backdrop');
    if (backdropEl) backdropEl.addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      }
    });

    // Mobile touch swipe handling
    initSwipeGestures();
  }

  function openLightbox(index) {
    if (!filteredPhotos.length) return;
    currentLightboxIndex = (index + filteredPhotos.length) % filteredPhotos.length;

    updateLightboxContent();

    // Compensate for scrollbar width to prevent layout shift
    const sbWidth = window.innerWidth - document.documentElement.clientWidth;
    if (sbWidth > 0) {
      document.body.style.paddingRight = sbWidth + 'px';
    }
    document.body.style.overflow = 'hidden';

    lightboxEl.classList.add('is-open');
    lightboxEl.setAttribute('aria-hidden', 'false');

    // Move focus into the lightbox for accessibility
    const closeBtn = document.getElementById('lightbox-close');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
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
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredPhotos.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    if (!filteredPhotos.length) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const photo = filteredPhotos[currentLightboxIndex];
    if (!photo) return;

    // Full high-resolution image URL (using Google Drive CDN or direct)
    const fullSrc = typeof ImageUtils !== 'undefined'
      ? ImageUtils.resolveImageUrl(photo.image, 'full')
      : photo.image;

    // Fade effect during switch + spinner
    if (lightboxImgEl) {
      const spinnerEl = document.getElementById('lightbox-spinner');

      lightboxImgEl.style.opacity = '0.4';
      lightboxImgEl.style.transform = 'scale(0.98)';
      if (spinnerEl) spinnerEl.style.display = 'flex';

      lightboxImgEl.onload = () => {
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

    // EXIF details
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

    const minSwipeDistance = 50;

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

      // Only trigger horizontal swipe if movement is predominantly horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          nextPhoto(); // swiped left -> next
        } else {
          prevPhoto(); // swiped right -> prev
        }
      }
    }
  }

})();

