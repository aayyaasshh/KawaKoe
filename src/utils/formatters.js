// Formatting utilities for Currency & Time

export function formatRupiah(num) {
  if (isNaN(num) || num === null || num === undefined) return 'Rp 0';
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

export function formatTime(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
  } catch (_) {
    return '';
  }
}

export function getMinutesAgo(isoStr) {
  try {
    const diff = Math.floor((new Date() - new Date(isoStr)) / (1000 * 60));
    if (diff <= 0) return 'Baru saja';
    if (diff < 60) return `${diff} mnt lalu`;
    return `${Math.floor(diff / 60)} jam lalu`;
  } catch (_) {
    return '';
  }
}
