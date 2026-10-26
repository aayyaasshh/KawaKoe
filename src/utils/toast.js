// Toast Notification System for POS Feedback

export function showToast(msg, icon = '✓') {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  const iconEl = document.getElementById('toast-icon');
  if (!toast) return;
  if (msgEl) msgEl.innerText = msg;
  if (iconEl) iconEl.innerText = icon;
  toast.classList.remove('hidden');
  toast.classList.add('flex');
  setTimeout(() => {
    toast.classList.add('hidden');
    toast.classList.remove('flex');
  }, 4000);
}
