// ============================================================
//  FusionGrid — Dashboard Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Sidebar Toggle ─────────────────────────────────────────
  window.toggleSidebar = function () {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('mobile-open');
  };

  // ── Navigation ─────────────────────────────────────────────
  const PAGE_TITLES = {
    dashboard: 'Dashboard Overview',
    leaks:     'Leak Monitor',
    alerts:    'Alert Center',
    actions:   'Action Center',
    risk:      'Risk Analysis',
    settings:  'Settings',
  };

  window.navigate = function (el) {
    if (!el) return;
    const page = el.dataset?.page || el;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList?.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    const target = document.getElementById(`page-${page}`);
    if (target) { target.classList.remove('hidden'); }
    document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || 'Dashboard';

    // Lazy render page-specific content
    if (page === 'alerts') renderFullAlerts();
    if (page === 'leaks')  renderFullLeaks();
    if (page === 'actions') renderActionList();
    if (page === 'risk')   renderRiskFull();
  };

  // ── Notifications ───────────────────────────────────────────
  window.toggleNotifications = function () {
    document.getElementById('notif-drawer').classList.toggle('open');
    document.getElementById('notif-overlay').classList.toggle('open');
  };

  window.markAllRead = function () {
    MOCK_ALERTS.forEach(a => a.read = true);
    renderNotifList();
    document.getElementById('notif-count').textContent = '0';
    document.getElementById('notif-count').style.display = 'none';
  };

  function renderNotifList() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    list.innerHTML = MOCK_ALERTS.map(a => `
      <div class="notif-item ${a.read ? '' : 'unread'}">
        <div class="notif-dot-wrap"><div class="notif-dot ${a.severity}"></div></div>
        <div class="notif-item-content">
          <div class="notif-item-title">${a.title}</div>
          <div class="notif-item-desc">${a.desc}</div>
          <div class="notif-item-time">${a.time}</div>
        </div>
        <span class="badge badge-${a.severity === 'warning' ? 'info' : a.severity}">${a.severity}</span>
      </div>
    `).join('');
  }

  renderNotifList();

  // ── Leak Table (Dashboard) ──────────────────────────────────
  function renderLeakRow(leak) {
    const severityClass = leak.severity === 'warning' ? 'info' : leak.severity;
    return `
      <tr data-severity="${leak.severity}" data-type="${leak.type.toLowerCase()}">
        <td><span class="leak-id">${leak.id}</span></td>
        <td><strong>${leak.type}</strong></td>
        <td><span class="leak-source" title="${leak.source}">${leak.source}</span></td>
        <td><span class="leak-service-tag">${leak.service}</span></td>
        <td><span class="badge badge-${severityClass}">${leak.severity}</span></td>
        <td><span class="status-badge status-${leak.status}">${leak.status === 'open' ? '● Open' : '✓ Mitigated'}</span></td>
        <td style="color:var(--text-muted);font-size:12px">${leak.time}</td>
        <td>
          <span class="action-link" onclick="openActionForLeak('${leak.id}')">Mitigate →</span>
        </td>
      </tr>`;
  }

  function renderLeakTable(data) {
    const tbody = document.getElementById('leak-tbody');
    if (!tbody) return;
    tbody.innerHTML = data.map(renderLeakRow).join('');
  }

  renderLeakTable(MOCK_LEAKS);

  // ── Filter / Search ──────────────────────────────────────────
  window.filterLeaks = function (query) {
    const q = (query || document.getElementById('leak-search')?.value || '').toLowerCase();
    const sev = document.getElementById('severity-filter')?.value || '';
    const filtered = MOCK_LEAKS.filter(l => {
      const matchQ   = !q || l.type.toLowerCase().includes(q) || l.source.toLowerCase().includes(q) || l.service.toLowerCase().includes(q);
      const matchSev = !sev || l.severity === sev;
      return matchQ && matchSev;
    });
    renderLeakTable(filtered);
  };

  // ── Full Leaks Page ──────────────────────────────────────────
  function renderFullLeaks() {
    const tbody = document.getElementById('full-leak-tbody');
    if (!tbody || tbody.innerHTML) return;
    tbody.innerHTML = MOCK_LEAKS.map(l => {
      const cls = l.severity === 'warning' ? 'info' : l.severity;
      return `
        <tr>
          <td><span class="leak-id">${l.id}</span></td>
          <td><strong>${l.type}</strong></td>
          <td><span class="leak-source" title="${l.source}">${l.source}</span></td>
          <td><span class="leak-service-tag">${l.service}</span></td>
          <td><span class="badge badge-${cls}">${l.severity}</span></td>
          <td><span class="status-badge status-${l.status}">${l.status === 'open' ? '● Open' : '✓ Mitigated'}</span></td>
          <td style="font-size:12px;color:var(--text-secondary);max-width:240px">${l.details}</td>
          <td style="color:var(--text-muted);font-size:12px">${l.time}</td>
          <td><span class="action-link" onclick="openActionForLeak('${l.id}')">Mitigate →</span></td>
        </tr>`;
    }).join('');
  }

  // ── Full Alerts Page ─────────────────────────────────────────
  function renderFullAlerts() {
    const list = document.getElementById('full-alerts-list');
    if (!list || list.innerHTML) return;
    const icons = { critical: '🚨', high: '⚠️', warning: '💡' };
    list.innerHTML = MOCK_ALERTS.map(a => `
      <div class="alert-item">
        <div class="alert-severity-icon ${a.severity}">${icons[a.severity]}</div>
        <div class="alert-body">
          <div class="alert-title">${a.title}</div>
          <div class="alert-desc">${a.desc}</div>
          <div class="alert-meta">
            <span class="badge badge-${a.severity === 'warning' ? 'info' : a.severity}">${a.severity}</span>
            <span class="alert-time">${a.time}</span>
            ${a.read ? '' : '<span class="badge badge-info">New</span>'}
          </div>
        </div>
      </div>
    `).join('');
  }

  // ── Action Center ────────────────────────────────────────────
  function renderActionList() {
    const list = document.getElementById('action-leak-list');
    if (!list || list.innerHTML) return;
    const openLeaks = MOCK_LEAKS.filter(l => l.status === 'open');
    list.innerHTML = openLeaks.map((l, i) => {
      const cls = l.severity === 'warning' ? 'info' : l.severity;
      return `
        <div class="action-leak-item ${i === 0 ? 'active' : ''}" data-id="${l.id}" onclick="selectActionLeak('${l.id}', this)">
          <div>
            <span class="badge badge-${cls}">${l.severity}</span>
          </div>
          <div class="action-leak-info">
            <strong>${l.type}</strong>
            <span>${l.service} · ${l.time}</span>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>`;
    }).join('');

    // Auto-open first
    if (openLeaks.length > 0) showMitigationSteps(openLeaks[0].id);
  }

  window.selectActionLeak = function (id, el) {
    document.querySelectorAll('.action-leak-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    showMitigationSteps(id);
  };

  window.openActionForLeak = function (id) {
    navigate(document.querySelector('[data-page="actions"]'));
    setTimeout(() => {
      const item = document.querySelector(`.action-leak-item[data-id="${id}"]`);
      if (item) { selectActionLeak(id, item); }
    }, 100);
  };

  function showMitigationSteps(id) {
    const leak = MOCK_LEAKS.find(l => l.id === id);
    if (!leak) return;

    const guide = MITIGATION_STEPS[leak.type] || MITIGATION_STEPS['default'];
    const panel = document.getElementById('action-panel');
    const cls   = leak.severity === 'warning' ? 'info' : leak.severity;

    panel.innerHTML = `
      <div class="action-panel-header">
        <div class="action-panel-title">${guide.icon} ${guide.title}</div>
        <div class="action-panel-meta">
          <span class="badge badge-${cls}">${leak.severity}</span>
          <span class="badge badge-safe">${leak.service}</span>
          <span style="font-size:12px;color:var(--text-muted)">${leak.time}</span>
        </div>
        <p style="font-size:13px;color:var(--text-secondary);margin-top:10px;line-height:1.5">${leak.details}</p>
      </div>
      <div class="mitigation-steps" id="msteps-${id}">
        ${guide.steps.map((s, i) => `
          <div class="mstep ${s.done ? 'done' : ''}" id="mstep-${id}-${i}">
            <div class="mstep-num">${s.done ? '✓' : s.step}</div>
            <div class="mstep-body">
              <div class="mstep-action">${s.action}</div>
              <div class="mstep-detail">${s.detail}</div>
            </div>
            <button class="mstep-check" onclick="toggleMStep('${id}', ${i})" title="${s.done ? 'Undo' : 'Mark done'}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${s.done
                  ? '<polyline points="20 6 9 17 4 12"/>'
                  : '<circle cx="12" cy="12" r="10"/>'}
              </svg>
            </button>
          </div>`).join('')}
      </div>
    `;
  }

  window.toggleMStep = function (leakId, stepIndex) {
    const guide = MITIGATION_STEPS[MOCK_LEAKS.find(l => l.id === leakId)?.type] || MITIGATION_STEPS['default'];
    guide.steps[stepIndex].done = !guide.steps[stepIndex].done;
    showMitigationSteps(leakId);

    // If all done → mark leak mitigated
    if (guide.steps.every(s => s.done)) {
      const leak = MOCK_LEAKS.find(l => l.id === leakId);
      if (leak) leak.status = 'mitigated';
      renderLeakTable(MOCK_LEAKS);
      updateStatCards();
    }
  };

  // ── Risk Analysis Full ───────────────────────────────────────
  function renderRiskFull() {
    const canvas = document.getElementById('radar-chart-full');
    if (!canvas || canvas._rendered) return;
    canvas._rendered = true;
    buildRadarChart(canvas, 340);

    const cats = document.getElementById('risk-cats');
    if (!cats) return;
    const colors = ['#EF4444','#F59E0B','#EF4444','#F59E0B','#EF4444','#F59E0B'];
    cats.innerHTML = RISK_SCORES.labels.map((lbl, i) => {
      const score = RISK_SCORES.current[i];
      const cl = score < 50 ? '#EF4444' : score < 70 ? '#F59E0B' : '#10B981';
      return `
        <div class="risk-cat-item">
          <div class="risk-cat-label">
            <span>${lbl}</span>
            <span style="color:${cl}">${score}/100</span>
          </div>
          <div class="risk-cat-bar">
            <div class="risk-cat-fill" style="width:${score}%;background:${cl}"></div>
          </div>
        </div>`;
    }).join('');
  }

  // ── Charts ────────────────────────────────────────────────────
  function buildTrendChart() {
    const ctx = document.getElementById('trend-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: LEAK_TREND.labels,
        datasets: [
          {
            label: 'Critical',
            data: LEAK_TREND.critical,
            backgroundColor: 'rgba(239,68,68,0.7)',
            borderRadius: 4, borderSkipped: false,
          },
          {
            label: 'High',
            data: LEAK_TREND.high,
            backgroundColor: 'rgba(245,158,11,0.7)',
            borderRadius: 4, borderSkipped: false,
          },
          {
            label: 'Warning',
            data: LEAK_TREND.warning,
            backgroundColor: 'rgba(99,102,241,0.5)',
            borderRadius: 4, borderSkipped: false,
          },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94A3B8', font: { size: 11 }, boxWidth: 12 } }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748B', font: { size: 11 } }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#64748B', font: { size: 11 }, stepSize: 5 }
          }
        }
      }
    });
  }

  function buildRadarChart(canvas, height) {
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: RISK_SCORES.labels,
        datasets: [
          {
            label: 'Current Score',
            data: RISK_SCORES.current,
            fill: true,
            backgroundColor: 'rgba(239,68,68,0.15)',
            borderColor: '#EF4444',
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#EF4444',
          },
          {
            label: 'Target (80)',
            data: RISK_SCORES.baseline,
            fill: true,
            backgroundColor: 'rgba(59,130,246,0.08)',
            borderColor: 'rgba(59,130,246,0.4)',
            borderDash: [4, 4],
            pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94A3B8', font: { size: 11 } } } },
        scales: {
          r: {
            min: 0, max: 100, ticks: { display: false },
            grid: { color: 'rgba(255,255,255,0.06)' },
            angleLines: { color: 'rgba(255,255,255,0.06)' },
            pointLabels: { color: '#94A3B8', font: { size: 11 } }
          }
        }
      }
    });
  }

  buildTrendChart();
  buildRadarChart(document.getElementById('radar-chart'));

  // ── Stat Card Updates ─────────────────────────────────────────
  function updateStatCards() {
    const open      = MOCK_LEAKS.filter(l => l.status === 'open').length;
    const critical  = MOCK_LEAKS.filter(l => l.severity === 'critical' && l.status === 'open').length;
    const mitigated = MOCK_LEAKS.filter(l => l.status === 'mitigated').length;
    animateNum('s-total',    open);
    animateNum('s-critical', critical);
    animateNum('s-mitigated',mitigated);
  }

  function animateNum(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const current = parseInt(el.textContent) || 0;
    const step    = target > current ? 1 : -1;
    if (current === target) return;
    const t = setInterval(() => {
      const now = parseInt(el.textContent) || 0;
      if (now === target) { clearInterval(t); return; }
      el.textContent = now + step;
    }, 60);
  }

  // ── Scan Button ───────────────────────────────────────────────
  window.runScan = function () {
    const dot  = document.querySelector('.scan-dot');
    const text = document.querySelector('.scan-text');
    text.textContent = 'Scanning…';
    dot.style.background = 'var(--warning)';
    setTimeout(() => {
      text.textContent = 'Live Scanning';
      dot.style.background = 'var(--safe)';
      document.getElementById('last-scan-time').textContent = 'just now';
      renderLeakTable(MOCK_LEAKS);
    }, 2500);
  };

  // ── Live clock ────────────────────────────────────────────────
  function updateScanTime() {
    const el = document.getElementById('last-scan-time');
    if (el) el.textContent = new Date().toLocaleTimeString();
  }
  setInterval(updateScanTime, 60000);

  // ── Initial stat animation ────────────────────────────────────
  setTimeout(updateStatCards, 300);

});
