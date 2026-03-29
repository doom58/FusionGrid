# FusionGrid for Startups 🛡️

> AI-powered data breach & credential leak detection, purpose-built for early-stage companies.

## 🚀 Quick Start

No build step needed — open directly in your browser:

```bash
# Option 1: Open index.html directly in browser
start index.html

# Option 2: Serve locally with VS Code Live Server (recommended)
# Install "Live Server" extension → right-click index.html → Open with Live Server

# Option 3: Use Python
python -m http.server 3000
# Then open http://localhost:3000
```

## 📁 Project Structure

```
fusiongrid/
├── index.html          # Login page
├── onboarding.html     # 3-step onboarding wizard
├── dashboard.html      # Main security dashboard
├── assets/
│   └── logo.png        # FusionGrid brand logo
└── src/
    ├── css/
    │   ├── base.css        # Design tokens, resets, utilities
    │   ├── login.css       # Login page styles
    │   ├── onboarding.css  # Onboarding wizard styles
    │   └── dashboard.css   # Dashboard layout & components
    └── js/
        ├── login.js        # Auth form logic
        ├── onboarding.js   # Multi-step wizard logic
        ├── data.js         # Mock data layer (replace with API)
        └── dashboard.js    # Charts, table, notifications, actions
```

## 🎯 Pages & Features

### 🔐 Login (`index.html`)
- Email/password form with real-time validation
- GitHub & Google SSO buttons (connect your OAuth endpoints)
- Animated counter stats
- "Remember me" toggle
- Redirect to onboarding (new users) or dashboard (returning)

### 🧭 Onboarding (`onboarding.html`)
- **Step 1 — Company Profile**: Name, size, industry, domain, tech stack chips, security contact
- **Step 2 — Integrations**: GitHub, AWS, Slack, Jira, GitLab, PagerDuty connect cards
- **Step 3 — Risk Preferences**: Alert severity threshold, leak type toggles, notification channels
- All form data exported via `getFormData()` — ready for your POST endpoint

### 📊 Dashboard (`dashboard.html`)
- **Sidebar navigation** with 5 pages + user card + logout
- **Live scan status** indicator with pulse animation
- **Notification drawer** — slide-in panel with unread badges
- **4 stat cards** — Active Leaks, Critical Alerts, Mitigated, Risk Score
- **Leak Trend chart** — 7-day stacked bar (Chart.js)
- **Risk Radar chart** — 6-axis security posture radar
- **Leak detection table** — searchable, filterable, sortable by severity
- **Action Center** — click any leak → step-by-step mitigation guide with checkboxes
- **Risk Analysis page** — radar + category breakdown bars
- **Alert Center** — full alert list with severity icons

## 🔌 Connecting to Your Backend

All API hooks are clearly commented with `// TODO: replace with real API call`:

| Feature | File | Replace Placeholder |
|---|---|---|
| Login | `src/js/login.js` | `fetch('/api/auth/login', ...)` |
| GitHub SSO | `src/js/login.js` | Redirect to `/api/auth/github` |
| Onboarding save | `src/js/onboarding.js` | `fetch('/api/onboarding/complete', ...)` |
| Leak data | `src/js/data.js` | Replace `MOCK_LEAKS` with API response |
| Alert data | `src/js/data.js` | Replace `MOCK_ALERTS` with API response |

## 🌿 Git Setup

```bash
git init
git add .
git commit -m "feat: initial FusionGrid frontend"
git remote add origin https://github.com/YOUR_USERNAME/fusiongrid.git
git push -u origin main
```

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0A0F1E` | Page backgrounds |
| `--blue` | `#3B82F6` | Primary actions |
| `--critical` | `#EF4444` | Critical alerts |
| `--warning` | `#F59E0B` | High severity |
| `--safe` | `#10B981` | Mitigated / safe |
| `--cyan` | `#06B6D4` | Accents / gradients |

## 🛠️ Tech Stack

- **HTML5** — semantic, accessible markup
- **Vanilla CSS** — custom design system, glassmorphism, dark mode
- **Vanilla JS** — no framework overhead, easy to extend
- **Chart.js 4** — CDN-loaded, no npm required
- **Google Fonts** — Inter typeface

---

Built with ❤️ for the FusionGrid for Startups MVP.
