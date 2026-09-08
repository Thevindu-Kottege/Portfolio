/**
 * ============================================================================
 * PERSISTENT VIEWPORT-LEVEL THEME MORPH ENGINE — js/theme-morph.js
 * ============================================================================
 * Architecture:
 * APP ROOT
 * │
 * ├── Current page (stays mounted & interactive underneath)
 * ├── Persistent transition layer (#theme-morph-overlay at z-index 9999999)
 * └── New page (pre-fetched, mounted & styled at midpoint before reveal)
 *
 * Color spectrum:
 * Dark → Light:
 * Near Black (#0e0e0f) → Charcoal (#1c1b1a) → Soft Charcoal (#38342f) →
 * Warm Grey (#6d6558) → Taupe (#b0a696) → Cream (#dfd8cb) → Warm Ivory (#f8f6f0)
 *
 * Light → Dark:
 * Warm Ivory (#f8f6f0) → Cream (#dfd8cb) → Taupe (#b0a696) →
 * Warm Grey (#6d6558) → Soft Charcoal (#38342f) → Charcoal (#1c1b1a) → Near Black (#0e0e0f)
 * ============================================================================
 */

(function (global) {
  'use strict';

  const MORPH_DURATION = 950;  // total animation time (ms)
  const SWAP_DELAY = 475;      // exact midpoint when overlay is 100% opaque (ms)

  let overlayEl = null;
  let isTransitioning = false;

  // Helper: check if a URL belongs to Photography mode
  function isPhotographyPath(url) {
    if (!url) return false;
    const clean = url.split('?')[0].split('#')[0].toLowerCase();
    return clean.includes('photography');
  }

  // Helper: check if current document is in Photography mode
  function isCurrentPageLight() {
    return document.body.classList.contains('theme-light') || isPhotographyPath(window.location.pathname);
  }

  /**
   * Initialize or retrieve the persistent transition overlay element
   */
  function ensureOverlay() {
    if (overlayEl && document.body.contains(overlayEl)) return overlayEl;
    overlayEl = document.getElementById('theme-morph-overlay');
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.id = 'theme-morph-overlay';
      overlayEl.className = 'theme-morph-overlay';
      overlayEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlayEl);
    }
    return overlayEl;
  }

  /**
   * Bind link clicks for seamless morph transitions
   */
  function bindNavigationLinks(context = document) {
    const links = context.querySelectorAll('a[href]');

    links.forEach((link) => {
      if (link.dataset.morphBound) return;
      link.dataset.morphBound = 'true';

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore hash links, mailto, tel, target="_blank", or external URLs
      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        (href.startsWith('http') && !href.startsWith(window.location.origin))
      ) {
        return;
      }

      link.addEventListener('click', (e) => {
        // Allow standard browser shortcuts (ctrl/cmd click, etc.)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
          return;
        }

        const currentIsLight = isCurrentPageLight();
        const targetIsLight = isPhotographyPath(href);

        // Only morph when crossing the boundary between Design and Photography
        const isCrossingBoundary = currentIsLight !== targetIsLight;

        if (!isCrossingBoundary) {
          return;
        }

        // Reduced motion: fall back to normal navigation
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }

        e.preventDefault();
        const direction = targetIsLight ? 'to-light' : 'to-dark';
        navigateWithMorph(href, direction);
      });
    });
  }

  /**
   * Execute the continuous color-space morph and DOM swap
   */
  function navigateWithMorph(targetUrl, direction) {
    if (isTransitioning) return;
    isTransitioning = true;

    const overlay = ensureOverlay();
    const animClass = direction === 'to-light' ? 'morphing-to-light' : 'morphing-to-dark';

    // Reset overlay classes
    overlay.className = 'theme-morph-overlay is-active ' + animClass;

    // Begin fetching target document in parallel with animation start
    const fetchPromise = fetch(targetUrl, { credentials: 'same-origin' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .catch((err) => {
        console.warn('[Theme Morph] Pre-fetch failed, falling back to direct navigation:', err);
        return null;
      });

    // Schedule the DOM swap at the exact midpoint when overlay is opaque
    setTimeout(async () => {
      let htmlText = await fetchPromise;

      if (!htmlText) {
        window.location.href = targetUrl;
        return;
      }

      try {
        const parser = new DOMParser();
        const newDoc = parser.parseFromString(htmlText, 'text/html');

        // 1. Update document title
        if (newDoc.title) {
          document.title = newDoc.title;
        }

        // 2. Synchronize stylesheets (ensure photography.css exists when entering, or removed when leaving)
        syncStylesheets(newDoc);

        // 3. Update Body class & theme state
        document.body.className = newDoc.body.className;

        // 4. Swap Main & Header/Nav & Footer
        swapElement('nav', newDoc);
        swapElement('main', newDoc);
        swapElement('footer', newDoc);

        // Also check for lightbox modal
        const oldLightbox = document.getElementById('photo-lightbox');
        const newLightbox = newDoc.getElementById('photo-lightbox');
        if (newLightbox) {
          if (oldLightbox) {
            oldLightbox.replaceWith(newLightbox);
          } else {
            document.body.appendChild(newLightbox);
          }
        } else if (oldLightbox) {
          oldLightbox.remove();
        }

        // 5. Scroll to top
        window.scrollTo(0, 0);

        // 6. Update browser history
        if (window.location.href !== targetUrl) {
          window.history.pushState({ url: targetUrl, isLight: direction === 'to-light' }, '', targetUrl);
        }

        // 7. Synchronize scripts & re-initialize page scripts
        syncScripts(newDoc, () => {
          reinitializePageScripts(direction === 'to-light');
          bindNavigationLinks();
        });

      } catch (swapErr) {
        console.error('[Theme Morph] DOM Swap Error:', swapErr);
        window.location.href = targetUrl;
        return;
      }
    }, SWAP_DELAY);

    // Transition completion
    setTimeout(() => {
      overlay.className = 'theme-morph-overlay';
      isTransitioning = false;
    }, MORPH_DURATION + 50);
  }

  /**
   * Swap an element in the current DOM with its counterpart from the parsed document
   */
  function swapElement(selector, newDoc) {
    const currentEl = document.querySelector(selector);
    const newEl = newDoc.querySelector(selector);
    if (currentEl && newEl) {
      currentEl.replaceWith(newEl);
    }
  }

  /**
   * Synchronize page-specific CSS files between Design and Photography modes
   */
  function syncStylesheets(newDoc) {
    const head = document.head;
    const newLinks = Array.from(newDoc.querySelectorAll('link[rel="stylesheet"]'));
    const currentLinks = Array.from(head.querySelectorAll('link[rel="stylesheet"]'));

    newLinks.forEach((nLink) => {
      const href = nLink.getAttribute('href');
      const alreadyPresent = currentLinks.some((cLink) => cLink.getAttribute('href') === href);
      if (!alreadyPresent) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        head.appendChild(link);
      }
    });
  }

  /**
   * Synchronize scripts that the new page requires if not already loaded
   */
  function syncScripts(newDoc, callback) {
    const newScripts = Array.from(newDoc.querySelectorAll('script[src]'));
    const currentScripts = Array.from(document.querySelectorAll('script[src]'));
    const currentSrcs = currentScripts.map((s) => s.getAttribute('src'));

    const scriptsToLoad = newScripts.filter((ns) => {
      const src = ns.getAttribute('src');
      return src && !currentSrcs.includes(src) && !src.includes('theme-morph.js');
    });

    if (scriptsToLoad.length === 0) {
      if (callback) callback();
      return;
    }

    let loadedCount = 0;
    scriptsToLoad.forEach((s) => {
      const script = document.createElement('script');
      script.src = s.getAttribute('src');
      script.onload = script.onerror = () => {
        loadedCount++;
        if (loadedCount === scriptsToLoad.length && callback) {
          callback();
        }
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Re-initialize scripts, event listeners, and animations for the newly swapped page
   */
  function reinitializePageScripts(isLightMode) {
    if (typeof initMobileMenu === 'function') initMobileMenu();
    if (typeof initBackToTop === 'function') initBackToTop();
    if (typeof initNavScroll === 'function') initNavScroll();
    if (typeof updateActiveNavLinks === 'function') updateActiveNavLinks();
    if (typeof renderFooter === 'function') renderFooter();
    if (typeof initScrollReveal === 'function') initScrollReveal();

    if (isLightMode) {
      if (typeof window.initPhotographyPage === 'function') {
        window.initPhotographyPage();
      } else {
        const evt = new CustomEvent('photography:init');
        document.dispatchEvent(evt);
      }
    } else {
      if (typeof window.initHomePage === 'function') window.initHomePage();
      if (typeof initHeroBackground === 'function') initHeroBackground();
      if (typeof renderFeaturedGrid === 'function') renderFeaturedGrid();
      if (typeof renderAllProjects === 'function') renderAllProjects();
      if (typeof renderWorkGrid === 'function') renderWorkGrid('all');
      if (typeof renderProjectDetail === 'function') renderProjectDetail();
      if (typeof initContactForm === 'function') initContactForm();
    }
  }

  /**
   * Handle browser back / forward buttons (popstate)
   */
  window.addEventListener('popstate', () => {
    const targetUrl = window.location.href;
    const currentIsLight = isCurrentPageLight();
    const targetIsLight = isPhotographyPath(targetUrl);

    if (currentIsLight !== targetIsLight) {
      const direction = targetIsLight ? 'to-light' : 'to-dark';
      navigateWithMorph(targetUrl, direction);
    } else {
      window.location.reload();
    }
  });

  // Early initialization
  document.addEventListener('DOMContentLoaded', () => {
    ensureOverlay();
    bindNavigationLinks();
  });

  // Expose API globally
  global.ThemeMorph = {
    navigateWithMorph,
    bindNavigationLinks,
    isPhotographyPath,
  };

})(typeof window !== 'undefined' ? window : this);

