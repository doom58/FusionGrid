// ============================================================
//  FusionGrid — Onboarding Wizard Logic
// ============================================================

let currentStep = 1;
const totalSteps = 3;

const progressFill   = document.getElementById('progress-fill');
const currentStepEl  = document.getElementById('current-step');
const btnPrev        = document.getElementById('btn-prev');
const btnNext        = document.getElementById('btn-next');

function updateProgress() {
  const pct = (currentStep / totalSteps) * 100;
  progressFill.style.width = pct + '%';
  currentStepEl.textContent = currentStep;

  // Step dots
  document.querySelectorAll('.step-dot').forEach(dot => {
    const s = parseInt(dot.dataset.step);
    dot.classList.toggle('active', s === currentStep);
    dot.classList.toggle('done',   s < currentStep);
    if (s < currentStep) dot.querySelector('span').textContent = '';
    else dot.querySelector('span').textContent = s;
  });

  // Step labels
  document.querySelectorAll('.step-label').forEach(lbl => {
    const s = parseInt(lbl.dataset.step);
    lbl.classList.toggle('active', s === currentStep);
    lbl.classList.toggle('done',   s < currentStep);
  });

  // Buttons
  btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  btnNext.textContent = currentStep === totalSteps ? '🚀 Launch Dashboard' : 'Next Step →';
}

function showStep(step) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-${step}`)?.classList.add('active');
}

// ── Validation ───────────────────────────────────────────────
function validateStep1() {
  let ok = true;
  const company = document.getElementById('company-name');
  const size    = document.getElementById('company-size');
  const industry= document.getElementById('industry');
  const website = document.getElementById('website');
  const adminEl = document.getElementById('admin-email');

  const errCompany = document.getElementById('err-company');
  const errSize    = document.getElementById('err-size');
  const errInd     = document.getElementById('err-industry');
  const errWeb     = document.getElementById('err-website');
  const errAdmin   = document.getElementById('err-admin-email');

  if (!company?.value.trim()) { errCompany.textContent = 'Company name is required.'; ok = false; }
  else errCompany.textContent = '';

  if (!size?.value) { errSize.textContent = 'Please select team size.'; ok = false; }
  else errSize.textContent = '';

  if (!industry?.value) { errInd.textContent = 'Please select an industry.'; ok = false; }
  else errInd.textContent = '';

  if (!website?.value.trim()) { errWeb.textContent = 'Domain is required.'; ok = false; }
  else errWeb.textContent = '';

  const emailVal = adminEl?.value.trim();
  if (!emailVal) { errAdmin.textContent = 'Security email is required.'; ok = false; }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { errAdmin.textContent = 'Enter a valid email.'; ok = false; }
  else errAdmin.textContent = '';

  return ok;
}

// ── Navigation ───────────────────────────────────────────────
function nextStep() {
  if (currentStep === 1 && !validateStep1()) return;

  if (currentStep < totalSteps) {
    currentStep++;
    showStep(currentStep);
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // ── Save preferences (replace with real API call) ─────
    // fetch('/api/onboarding/complete', { method: 'POST', body: JSON.stringify(getFormData()) })
    btnNext.textContent = 'Saving…';
    btnNext.disabled = true;
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── Tech stack chips ─────────────────────────────────────────
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

// ── Radio option selection ───────────────────────────────────
document.querySelectorAll('.radio-option').forEach(opt => {
  opt.addEventListener('click', () => {
    const group = opt.closest('.radio-group');
    group.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input[type="radio"]').checked = true;
  });
});

// ── Collect form data (for backend) ─────────────────────────
function getFormData() {
  const chips = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.val);
  return {
    company: document.getElementById('company-name')?.value,
    size: document.getElementById('company-size')?.value,
    industry: document.getElementById('industry')?.value,
    domain: document.getElementById('website')?.value,
    adminEmail: document.getElementById('admin-email')?.value,
    techStack: chips,
    severityThreshold: document.querySelector('input[name="severity"]:checked')?.value,
    notifications: {
      email: document.getElementById('n-email')?.checked,
      inApp: document.getElementById('n-app')?.checked,
      slack: document.getElementById('n-slack')?.checked,
    },
    leakTypes: {
      api: document.getElementById('t-api')?.checked,
      credentials: document.getElementById('t-creds')?.checked,
      email: document.getElementById('t-email')?.checked,
      payment: document.getElementById('t-payment')?.checked,
      database: document.getElementById('t-db')?.checked,
    }
  };
}

// Init
updateProgress();
