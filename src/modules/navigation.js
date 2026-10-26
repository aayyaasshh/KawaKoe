// Navigation & View Switching Module

export function switchView(viewId) {
  document.querySelectorAll('.app-view').forEach(v => v.classList.add('hidden'));
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.remove('active', 'text-amber-400', 'bg-stone-800');
    t.classList.add('text-stone-400');
  });

  const targetView = document.getElementById(viewId);
  if (targetView) targetView.classList.remove('hidden');

  document.querySelectorAll(`[data-target="${viewId}"], #nav-btn-${viewId.replace('view-', '')}`).forEach(btn => {
    btn.classList.add('active', 'text-amber-400', 'bg-stone-800');
    btn.classList.remove('text-stone-400');
  });

  // Trigger custom view change event so modules can re-render if needed
  window.dispatchEvent(new CustomEvent('kawakoe:view-change', { detail: { viewId } }));
}

export function initNavigation() {
  // Live Clock
  function updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (clockEl) {
      const now = new Date();
      clockEl.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Desktop nav tabs
  ['pos', 'tables', 'shifts', 'reports'].forEach(name => {
    const btn = document.getElementById(`nav-btn-${name}`);
    if (btn) btn.addEventListener('click', () => switchView(`view-${name}`));
  });

  // Mobile nav buttons
  document.querySelectorAll('.nav-tab[data-target]').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.getAttribute('data-target')));
  });
}
