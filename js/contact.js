/**
 * ============================================================
 * CONTACT FORM — js/contact.js
 * Unified handler for Design (#contact-form) and Photography
 * (#photography-contact-form) contact pages.
 * Uses CONFIG.emailjs credentials (js/config.js).
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialise whichever form is present on the current page
  initContactForm('contact-form', {
    success: 'form-success',
    error: 'form-error',
  });
  initContactForm('photography-contact-form', {
    success: 'photo-form-status',
    error: 'photo-form-status',
    isPhotoForm: true,
  });
  renderContactInfo();
});

/* ── Form initialiser ─────────────────────────────────────── */
function initContactForm(formId, { success: successId, error: errorId, isPhotoForm = false }) {
  const form = document.getElementById(formId);
  if (!form) return;

  const successMsg = document.getElementById(successId);
  const errorMsg   = document.getElementById(errorId);

  // Real-time validation on blur
  form.querySelectorAll('[data-required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous status messages
    hideMessage(successMsg);
    hideMessage(errorMsg);
    if (isPhotoForm && successMsg) {
      successMsg.textContent = '';
      successMsg.className = 'form-status';
    }

    // Validate all required fields
    const fields = form.querySelectorAll('[data-required]');
    let valid = true;
    fields.forEach(field => { if (!validateField(field)) valid = false; });
    if (!valid) return;

    // Loading state
    const submitBtn = form.querySelector('[type="submit"]');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      Sending...
    `;

    // Build template params — field names normalised for EmailJS template
    const data = {
      from_name:    (form.elements.name?.value || '').trim(),
      reply_to:     (form.elements.email?.value || '').trim(),
      project_type: (form.elements.project_type?.value || '').trim(),
      budget:       (form.elements.budget?.value || ''),
      message:      (form.elements.message?.value || '').trim(),
      // Useful context in the template
      form_source:  isPhotoForm ? 'Photography Portfolio' : 'Design Portfolio',
    };

    try {
      await sendViaEmailJS(data);
      form.reset();
      if (isPhotoForm && successMsg) {
        successMsg.textContent = 'Message sent — I\'ll be in touch soon.';
        successMsg.classList.add('visible', 'success');
      } else {
        showMessage(successMsg);
      }
    } catch (err) {
      console.error('Contact form error:', err);
      if (isPhotoForm && errorMsg) {
        errorMsg.textContent = 'Something went wrong. Please try again or email directly.';
        errorMsg.classList.add('visible', 'error');
      } else {
        showMessage(errorMsg);
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
    }
  });
}

/* ── EmailJS sender ───────────────────────────────────────── */
async function sendViaEmailJS(data) {
  // Require CONFIG.emailjs — fails gracefully if not loaded
  if (typeof emailjs === 'undefined') {
    throw new Error('EmailJS SDK not loaded.');
  }
  const cfg = (typeof CONFIG !== 'undefined' && CONFIG.emailjs) || {
    serviceId:  'service_pg7au8k',
    templateId: 'template_3sx48b8',
    publicKey:  'Z1A6TfvzrBz_Qre0X',
  };

  const response = await emailjs.send(cfg.serviceId, cfg.templateId, data, cfg.publicKey);
  return response;
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
