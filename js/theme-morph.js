/**
 * ============================================================
 * THEME MORPH TRANSITION COORDINATOR — js/theme-morph.js
 * ============================================================
 * Handles the continuous color-space dissolution between the
 * dark studio portfolio and the light photography journal.
 *
 * Color Morph Steps (Dark → Light):
 * #0e0e0f (charcoal)
 *   ↓
 * #1e1d1c (soft charcoal)
 *   ↓
 * #3e3a35 (warm charcoal/slate)
 *   ↓
 * #756f66 (warm medium grey)
 *   ↓
 * #b8b0a2 (warm stone)
 *   ↓
 * #ece6dc (soft cream)
 *   ↓
 * #f8f6f0 (warm ivory)
 * ============================================================
 */

(function () {
  'use strict';

  const MORPH_OUT_DURATION = 380; // ms before navigation occurs

  // Check incoming transition immediately before paint
  initIncomingMorph();

  document.addEventListener('DOMContentLoaded', () => {
    initOutgoingMorph();
  });

  /**
   * Handle incoming morph on page load
   */
  function initIncomingMorph() {
    try {
      const incoming = sessionStorage.getItem('portfolio_morph');
      if (!incoming) return;

      sessionStorage.removeItem('portfolio_morph');

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const root = document.documentElement;

      if (incoming === 'to-light' && document.body) {
        document.body.classList.add('is-morphing-enter-light');
        setTimeout(() => {
          document.body.classList.remove('is-morphing-enter-light');
        }, 500);
      } else if (incoming === 'to-dark' && document.body) {
        document.body.classList.add('is-morphing-enter-dark');
        setTimeout(() => {
          document.body.classList.remove('is-morphing-enter-dark');
        }, 500);
      } else {
        // Body may not be parsed yet if script is in head
        window.addEventListener('DOMContentLoaded', () => {
          if (incoming === 'to-light') {
            document.body.classList.add('is-morphing-enter-light');
            setTimeout(() => {
              document.body.classList.remove('is-morphing-enter-light');
            }, 500);
          } else if (incoming === 'to-dark') {
            document.body.classList.add('is-morphing-enter-dark');
            setTimeout(() => {
              document.body.classList.remove('is-morphing-enter-dark');
            }, 500);
          }
        });
      }
    } catch (e) {
      // Storage unavailable or disabled
    }
  }

  /**
   * Intercept clicks between dark and light sections to execute the morph
   */
  function initOutgoingMorph() {
    // Determine current page theme
    const isCurrentlyLight = document.body.classList.contains('theme-light') ||
      window.location.pathname.includes('photography.html');

    const links = document.querySelectorAll('a[href]');

    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') {
        return;
      }

      // Check if target is crossing the theme boundary
      const isTargetLight = href.includes('photography.html');
      const isTargetDark = !isTargetLight && (
        href.includes('index.html') ||
        href.includes('work.html') ||
        href.includes('about.html') ||
        href.includes('contact.html') ||
        href.includes('project.html') ||
        href === '/' ||
        href === './'
      );

      const isCrossingToLight = !isCurrentlyLight && isTargetLight;
      const isCrossingToDark = isCurrentlyLight && isTargetDark;

      if (!isCrossingToLight && !isCrossingToDark) {
        return;
      }

      link.addEventListener('click', (e) => {
        // If reduced motion is requested or special key pressed, do standard navigation
        if (
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
          return;
        }

        e.preventDefault();

        if (isCrossingToLight) {
          executeMorph('to-light', href);
        } else {
          executeMorph('to-dark', href);
        }
      });
    });
  }

  /**
   * Execute the morph animation and navigate
   */
  function executeMorph(direction, targetHref) {
    try {
      sessionStorage.setItem('portfolio_morph', direction);
    } catch (e) {}

    // Support native View Transition API if available
    if (document.startViewTransition) {
      document.body.classList.add(direction === 'to-light' ? 'is-morphing-to-light' : 'is-morphing-to-dark');
      setTimeout(() => {
        window.location.href = targetHref;
      }, MORPH_OUT_DURATION);
      return;
    }

    // CSS Keyframe Morph
    document.body.classList.add(direction === 'to-light' ? 'is-morphing-to-light' : 'is-morphing-to-dark');

    setTimeout(() => {
      window.location.href = targetHref;
    }, MORPH_OUT_DURATION);
  }

})();
