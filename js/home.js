/**
 * ============================================================
 * HOME PAGE — js/home.js
 * Renders featured projects grid and animates skill bars.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedGrid();
  initSkillBars();
});

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
