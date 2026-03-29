// ============================================================
//  FusionGrid — Mock Data Layer
//  Replace fetch() calls with real API endpoints
// ============================================================

const MOCK_LEAKS = [
  { id: 'LK-001', type: 'API Key',        source: 'GitHub / acme-backend',    severity: 'critical', service: 'AWS',     details: 'AKIA…X7YZ exposed in public commit',     time: '2 min ago',  status: 'open' },
  { id: 'LK-002', type: 'Password Hash',  source: 'Dark Web / BreachForums',  severity: 'critical', service: 'DB',      details: 'admin@acme.com bcrypt hash leaked',        time: '14 min ago', status: 'open' },
  { id: 'LK-003', type: 'JWT Secret',     source: 'Pastebin',                 severity: 'high',     service: 'Auth',    details: 'JWT signing secret found in paste#8f2a',   time: '28 min ago', status: 'open' },
  { id: 'LK-004', type: 'Stripe Key',     source: 'GitHub / acme-payments',   severity: 'critical', service: 'Stripe',  details: 'sk_live_… exposed in payment module',      time: '45 min ago', status: 'mitigated' },
  { id: 'LK-005', type: 'DB Credentials', source: 'Dark Web / RaidForums',    severity: 'high',     service: 'Postgres','details': 'prod DB user/pass in leaked dataset',     time: '1 hr ago',   status: 'open' },
  { id: 'LK-006', type: 'Email Dump',     source: 'HaveIBeenPwned',           severity: 'warning',  service: 'Comms',   details: '1,204 employee emails in Collection #44',  time: '2 hrs ago',  status: 'open' },
  { id: 'LK-007', type: 'SSH Private Key',source: 'GitHub / devops-scripts',  severity: 'critical', service: 'Infra',   details: 'RSA 2048 private key pushed to public repo',time: '3 hrs ago',  status: 'open' },
  { id: 'LK-008', type: 'OAuth Token',    source: 'Pastebin',                 severity: 'high',     service: 'GitHub',  details: 'GitHub OAuth token with repo write access', time: '4 hrs ago',  status: 'mitigated' },
  { id: 'LK-009', type: 'Slack Token',    source: 'GitHub / config-dump',     severity: 'warning',  service: 'Slack',  details: 'xoxb- bot token found in config file',      time: '5 hrs ago',  status: 'open' },
  { id: 'LK-010', type: 'Env File',       source: 'GitHub / frontend-repo',   severity: 'high',     service: 'Config',  details: '.env file with prod secrets committed',    time: '6 hrs ago',  status: 'mitigated' },
];

const MOCK_ALERTS = [
  { id: 'AL-001', title: 'Critical AWS Key Exposed',     desc: 'Active AWS IAM key detected in public GitHub repo.', severity: 'critical', time: '2 min ago',  read: false },
  { id: 'AL-002', title: 'Password Hash on Dark Web',    desc: 'Admin credentials found on BreachForums dataset.',   severity: 'critical', time: '14 min ago', read: false },
  { id: 'AL-003', title: 'SSH Key in Public Repo',       desc: 'Unencrypted private key pushed to github.com.',      severity: 'critical', time: '3 hrs ago',  read: false },
  { id: 'AL-004', title: 'Stripe Live Key Leaked',       desc: 'Payment secret key found, now rotated successfully.',severity: 'high',     time: '45 min ago', read: true },
  { id: 'AL-005', title: 'Employee Email Dump Found',    desc: '1,204 emails in HaveIBeenPwned Collection #44.',     severity: 'warning',  time: '2 hrs ago',  read: true },
  { id: 'AL-006', title: 'Potential DB Dump Detected',   desc: 'Production DB credentials spotted in leaked data.',  severity: 'high',     time: '1 hr ago',   read: false },
];

const MITIGATION_STEPS = {
  'API Key': {
    icon: '🔑',
    title: 'API Key Exposed',
    steps: [
      { step: 1, action: 'Revoke the exposed key immediately', detail: 'Go to your AWS IAM console → Access Keys → Deactivate / Delete the flagged key.', done: false },
      { step: 2, action: 'Audit recent usage of the key', detail: 'Check CloudTrail logs for any unauthorized API calls made using this key in the last 72 hours.', done: false },
      { step: 3, action: 'Rotate with a new key', detail: 'Generate a new IAM key with least-privilege permissions and update your application secrets.', done: false },
      { step: 4, action: 'Clean commit history', detail: 'Use BFG Repo Cleaner or `git filter-repo` to remove the secret from all commits. Force push.', done: false },
      { step: 5, action: 'Add pre-commit secret scanning', detail: 'Install `git-secrets` or GitHub\'s secret scanning to prevent future leaks.', done: false },
    ]
  },
  'Password Hash': {
    icon: '🔐',
    title: 'Password Hash Leaked',
    steps: [
      { step: 1, action: 'Force-reset the affected account password', detail: 'Immediately invalidate and reset the password for admin@acme.com.', done: false },
      { step: 2, action: 'Invalidate all active sessions', detail: 'Revoke all JWT/session tokens for the compromised account.', done: false },
      { step: 3, action: 'Enable MFA for admin accounts', detail: 'Require TOTP or hardware key for all accounts with admin privileges.', done: false },
      { step: 4, action: 'Check for unauthorized access', detail: 'Review login logs for unusual access patterns in the past 30 days.', done: false },
    ]
  },
  'default': {
    icon: '🛡️',
    title: 'Security Breach Detected',
    steps: [
      { step: 1, action: 'Contain the exposure', detail: 'Immediately revoke, rotate, or invalidate the leaked credential or secret.', done: false },
      { step: 2, action: 'Assess the blast radius', detail: 'Determine what systems and data the leaked credential had access to.', done: false },
      { step: 3, action: 'Review audit logs', detail: 'Check all systems for unauthorized access using the compromised credential.', done: false },
      { step: 4, action: 'Notify affected parties', detail: 'If user data was exposed, follow your incident response plan and notify affected users.', done: false },
      { step: 5, action: 'Implement preventive controls', detail: 'Add secret scanning, limit permissions, and enforce regular rotation policies.', done: false },
    ]
  }
};

const RISK_SCORES = {
  labels: ['API Security', 'Credential Hygiene', 'Data Exposure', 'Code Security', 'Infra Config', 'Employee Risk'],
  current: [38, 55, 62, 45, 70, 48],
  baseline: [80, 80, 80, 80, 80, 80]
};

const LEAK_TREND = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  critical: [2, 5, 3, 7, 4, 1, 3],
  high:     [4, 6, 8, 5, 9, 3, 5],
  warning:  [6, 3, 7, 4, 6, 2, 4],
};
