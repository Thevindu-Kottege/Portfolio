/**
 * ============================================================
 * CONTACT FORM — js/contact.js
 * Form validation and submission handling.
 * Connect to a real backend by replacing handleFormSubmit().
 * Supports: Formspree, Netlify Forms, EmailJS, etc.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  renderContactInfo();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');

  // Real-time validation on blur
  form.querySelectorAll('[data-required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous messages
    hideMessage(successMsg);
    hideMessage(errorMsg);

    // Validate all required fields
    const fields = form.querySelectorAll('[data-required]');
    let valid = true;
    fields.forEach(field => {
      if (!validateField(field)) valid = false;
    });

    if (!valid) return;

    // Show loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Sending...
    `;

    // Collect form data
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      projectType: form.project_type.value,
      budget: form.budget?.value || '',
      message: form.message.value.trim(),
    };

    try {
      await handleFormSubmit(data, form);
      form.reset();
      showMessage(successMsg);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    } catch (err) {
      showMessage(errorMsg);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/**
 * Form submission handler.
 * Replace this function body to connect to your backend.
 *
 * Options:
 * - Formspree: fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: FormData })
 * - Netlify Forms: add data-netlify="true" to the form element
 * - EmailJS: emailjs.send(serviceId, templateId, data)
 */
async function handleFormSubmit(data, formElement) {
  // ── OPTION A: Formspree (uncomment and replace YOUR_FORM_ID)
  // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) throw new Error('Submission failed');
  // return response.json();

  // ── OPTION B: Netlify Forms (add data-netlify="true" to <form>)
  // No JS needed — Netlify handles it automatically.

  // ── DEFAULT: Simulate success (remove this when connecting to a real backend)
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

/* ── Field validation ────────────────────────────────────── */
function validateField(field) {
  const errorEl = document.getElementById(`${field.name || field.id}-error`);
  let valid = true;

  if (field.dataset.required === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    valid = emailRegex.test(field.value.trim());
    if (errorEl) errorEl.textContent = 'Please enter a valid email address.';
  } else {
    valid = field.value.trim() !== '';
    if (errorEl) errorEl.textContent = 'This field is required.';
  }

  field.classList.toggle('error', !valid);
  if (errorEl) errorEl.classList.toggle('visible', !valid);

  return valid;
}

/* ── Message helpers ─────────────────────────────────────── */
function showMessage(el) {
  if (el) {
    el.classList.add('visible');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideMessage(el) {
  if (el) el.classList.remove('visible');
}

/* ── Render contact info from CONFIG ─────────────────────── */
function renderContactInfo() {
  if (typeof CONFIG === 'undefined') return;

  document.querySelectorAll('[data-contact-email]').forEach(el => {
    el.href = `mailto:${CONFIG.email}`;
    el.textContent = CONFIG.email;
  });
}
