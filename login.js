// ============================================================
//  FusionGrid — Login Page Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  const form       = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passInput  = document.getElementById('password');
  const toggleBtn  = document.getElementById('toggle-pass');
  const eyeIcon    = document.getElementById('eye-icon');
  const spinner    = document.getElementById('signin-spinner');
  const signinText = document.getElementById('signin-text');
  const errEmail   = document.getElementById('err-email');
  const errPass    = document.getElementById('err-password');

  // ── Animated counter ────────────────────────────────────
  function animateCount(el, end, duration = 1500) {
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { el.textContent = end.toLocaleString(); clearInterval(timer); }
      else el.textContent = start.toLocaleString();
    }, duration / 60);
  }

  const statLeaks    = document.getElementById('stat-leaks');
  const statStartups = document.getElementById('stat-startups');
  if (statLeaks)    animateCount(statLeaks, 12847);
  if (statStartups) { statStartups.textContent = '3,200+'; }

  // ── Toggle password visibility ───────────────────────────
  toggleBtn?.addEventListener('click', () => {
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    eyeIcon.innerHTML = isPass
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  });

  // ── Field Validation ─────────────────────────────────────
  function validateEmail(val) {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Enter a valid email address.';
    return '';
  }
  function validatePass(val) {
    if (!val) return 'Password is required.';
    if (val.length < 8) return 'Password must be at least 8 characters.';
    return '';
  }

  function setError(input, errEl, fgId, msg) {
    errEl.textContent = msg;
    const fg = document.getElementById(fgId);
    if (msg) { input.classList.add('error'); fg?.classList.add('has-error'); }
    else      { input.classList.remove('error'); fg?.classList.remove('has-error'); }
  }

  emailInput.addEventListener('input', () => setError(emailInput, errEmail, 'fg-email', ''));
  emailInput.addEventListener('blur',  () => setError(emailInput, errEmail, 'fg-email', validateEmail(emailInput.value.trim())));
  passInput.addEventListener('input',  () => setError(passInput, errPass, 'fg-password', ''));
  passInput.addEventListener('blur',   () => setError(passInput, errPass, 'fg-password', validatePass(passInput.value)));

  // ── Form Submit ──────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(emailInput.value.trim());
    const passErr  = validatePass(passInput.value);
    setError(emailInput, errEmail, 'fg-email', emailErr);
    setError(passInput, errPass, 'fg-password', passErr);
    if (emailErr || passErr) return;

    // Loading state
    signinText.textContent = 'Authenticating…';
    spinner.classList.remove('hidden');

    // Simulate auth — replace with real API call
    // fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({email, password}) })
    await new Promise(r => setTimeout(r, 1800));

    // On success → redirect to dashboard
    window.location.href = 'dashboard.html';
  });

  // ── SSO Buttons (placeholder) ────────────────────────────
  document.getElementById('btn-github-sso')?.addEventListener('click', () => {
    // Redirect to: /api/auth/github
    alert('GitHub SSO — Connect your backend OAuth endpoint here.');
  });
  document.getElementById('btn-google-sso')?.addEventListener('click', () => {
    // Redirect to: /api/auth/google
    alert('Google SSO — Connect your backend OAuth endpoint here.');
  });

  // ── Forgot password (placeholder) ───────────────────────
  document.getElementById('forgot-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    // Navigate to: /forgot-password
    alert('Forgot Password — Connect your backend reset endpoint here.');
  });

});
