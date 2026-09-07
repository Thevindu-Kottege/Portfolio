/**
 * ============================================================
 * WORK PAGE — js/work.js
 * Renders all projects and handles category filtering.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  renderWorkGrid('all');
  initFilters();
});

let currentCategory = 'all';

function renderWorkGrid(category) {
  const grid = document.getElementById('work-grid');
  if (!grid || typeof getAllProjects !== 'function') return;

  const projects = category === 'all'
    ? getAllProjects()
    : getProjectsByCategory(category);

  if (projects.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding: 4rem 0;">
        <p style="color: var(--text-tertiary); font-size: var(--text-lg);">No projects in this category yet.</p>
      </div>`;
    return;
  }

  // Animate out → update → animate in
  grid.style.opacity = '0';
  grid.style.transform = 'scale(0.98)';
  grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  setTimeout(() => {
    grid.innerHTML = projects.map(p => buildProjectCard(p)).join('');
    grid.style.opacity = '1';
    grid.style.transform = 'scale(1)';

    // Re-run scroll reveal for new cards
    // Immediately reveal since user can already see the section
    grid.querySelectorAll('.reveal').forEach(el => {
      setTimeout(() => el.classList.add('revealed'), 50);
    });
  }, 200);
}

function initFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.category;
      if (cat === currentCategory) return;

      currentCategory = cat;

      // Update active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      renderWorkGrid(cat);
    });
  });
}
