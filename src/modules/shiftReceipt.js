// Shift Thermal Receipt Generator & Modal Handler
import { state } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { showToast } from '../utils/toast.js';
import { logoutToLoginScreen } from './auth.js';

export function generateShiftReportHTML(shift) {
  const openedDate = new Date(shift.openedAt);
  const closedDate = new Date(shift.closedAt);
  const openStr = openedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + openedDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const closeStr = closedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) + ' ' + closedDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  let diffText = 'PAS (Rp 0)';
  if (shift.discrepancy > 0) diffText = `LEBIH +${formatRupiah(shift.discrepancy)}`;
  else if (shift.discrepancy < 0) diffText = `KURANG -${formatRupiah(Math.abs(shift.discrepancy))}`;

  return `
    <div style="background-color: #ffffff !important; color: #111827 !important; width: 100%; box-sizing: border-box; font-family: 'JetBrains Mono', Courier, monospace; font-size: 11px; line-height: 1.5;">
      <div style="text-align: center; border-bottom: 2px dashed #4b5563; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; color: #111827;">${state.settings.shopName}</div>
        <div style="font-size: 10px; color: #4b5563; font-style: italic;">${state.settings.tagline}</div>
        <div style="font-size: 9px; color: #6b7280; margin-top: 3px;">${state.settings.address}</div>
        <div style="font-size: 12px; font-weight: 800; margin-top: 6px; letter-spacing: 0.5px; border: 1px solid #111827; padding: 3px 6px; display: inline-block;">
          *** REKAP TUTUP SHIFT KASIR ***
        </div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px; font-size: 10px;">
        <div style="display: flex; justify-content: space-between;"><span>ID Shift:</span><strong>#${shift.id}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Kasir:</span><strong>${shift.cashierName}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Buka Shift:</span><span>${openStr}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Tutup Shift:</span><span>${closeStr}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Total Nota:</span><span>${shift.ordersCount} Transaksi</span></div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px;">
        <div style="font-weight: 700; margin-bottom: 4px; text-decoration: underline;">AUDIT KAS LACI (DRAWER)</div>
        <div style="display: flex; justify-content: space-between;"><span>Modal Kas Awal:</span><span>${formatRupiah(shift.startingCash)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Penjualan Tunai (+):</span><span>${formatRupiah(shift.cashSales)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Kas Masuk (+):</span><span>${formatRupiah(shift.cashIn)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Kas Keluar (-):</span><span>${formatRupiah(shift.cashOut)}</span></div>
        <div style="display: flex; justify-content: space-between; border-top: 1px dotted #9ca3af; padding-top: 3px; font-weight: 600;">
          <span>Ekspektasi Kas Fisik:</span><span>${formatRupiah(shift.expectedCash)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 12px; margin-top: 2px;">
          <span>Fisik Laci Dihitung:</span><span>${formatRupiah(shift.actualCash)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 2px; color: ${shift.discrepancy === 0 ? '#047857' : (shift.discrepancy > 0 ? '#1d4ed8' : '#b91c1c')};">
          <span>Status Selisih:</span><span>${diffText}</span>
        </div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px;">
        <div style="font-weight: 700; margin-bottom: 4px; text-decoration: underline;">PENJUALAN NON-TUNAI</div>
        <div style="display: flex; justify-content: space-between;"><span>QRIS (bee genZ):</span><span>${formatRupiah(shift.qrisSales)}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>EDC / Kartu:</span><span>${formatRupiah(shift.edcSales)}</span></div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #111827; margin-top: 4px; padding-top: 4px; font-weight: 800; font-size: 12px;">
          <span>TOTAL OMZET SHIFT:</span><span>${formatRupiah(shift.totalRevenue)}</span>
        </div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 8px; font-size: 10px;">
        <div><strong>Catatan Shift:</strong> ${shift.notes || '-'}</div>
      </div>

      <div style="display: flex; justify-content: space-between; text-align: center; font-size: 10px; margin-top: 12px; padding: 0 8px;">
        <div>
          <div>Kasir Bertugas,</div>
          <div style="height: 38px;"></div>
          <div style="border-top: 1px solid #111827; padding-top: 2px; font-weight: 700;">${shift.cashierName}</div>
        </div>
        <div>
          <div>Supervisor/Owner,</div>
          <div style="height: 38px;"></div>
          <div style="border-top: 1px solid #111827; padding-top: 2px; font-weight: 700;">( .................... )</div>
        </div>
      </div>

      <div style="text-align: center; font-size: 8px; color: #6b7280; margin-top: 12px; border-top: 1px dashed #9ca3af; padding-top: 6px;">
        Dicetak otomatis oleh KawaKoe POS System · Waktu: ${closeStr}
      </div>
    </div>
  `;
}

export function generateShiftPlainText(shift) {
  const d = new Date(shift.closedAt);
  const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  let diff = 'PAS (Rp 0)';
  if (shift.discrepancy > 0) diff = `LEBIH +${formatRupiah(shift.discrepancy)}`;
  if (shift.discrepancy < 0) diff = `KURANG -${formatRupiah(Math.abs(shift.discrepancy))}`;

  return `☕ *REKAP TUTUP SHIFT KASIR - ${state.settings.shopName}*
---------------------------------------
🆔 ID Shift: #${shift.id}
👤 Kasir: ${shift.cashierName}
🕒 Waktu Tutup: ${dateStr}
🧾 Total Nota: ${shift.ordersCount} Transaksi
---------------------------------------
💰 *AUDIT KAS LACI (DRAWER):*
- Modal Kas Awal: ${formatRupiah(shift.startingCash)}
- Penjualan Tunai: ${formatRupiah(shift.cashSales)}
- Kas Masuk (+): ${formatRupiah(shift.cashIn)}
- Kas Keluar (-): ${formatRupiah(shift.cashOut)}
---------------------------------------
💵 Ekspektasi Fisik: ${formatRupiah(shift.expectedCash)}
💵 Fisik Dihitung: ${formatRupiah(shift.actualCash)}
⚖️ Status Selisih: *${diff}*
---------------------------------------
💳 *PENJUALAN NON-TUNAI:*
- QRIS (bee genZ): ${formatRupiah(shift.qrisSales)}
- EDC / Kartu: ${formatRupiah(shift.edcSales)}
---------------------------------------
📊 *TOTAL OMZET SHIFT: ${formatRupiah(shift.totalRevenue)}*
📝 Catatan: ${shift.notes || '-'}
---------------------------------------
*KawaKoe Coffee POS System*`;
}

export function openShiftReceiptModal(shift) {
  state.lastClosedShift = shift;
  const content = generateShiftReportHTML(shift);

  const screenContent = document.getElementById('shift-receipt-screen-content');
  if (screenContent) screenContent.innerHTML = content;

  const printable = document.getElementById('thermal-receipt-printable');
  if (printable) printable.innerHTML = content;

  const modal = document.getElementById('modal-shift-receipt');
  if (modal) modal.classList.remove('hidden');
}

export function initShiftReceiptModal() {
  const btnPrint = document.getElementById('btn-print-shift-preview');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      if (state.lastClosedShift) {
        const printable = document.getElementById('thermal-receipt-printable');
        if (printable) printable.innerHTML = generateShiftReportHTML(state.lastClosedShift);
      }
      showToast('Membuka dialog pencetakan printer thermal...', '🖨️');
      try {
        window.print();
      } catch (_) {}
    });
  }

  const btnCopy = document.getElementById('btn-copy-shift-receipt');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      if (!state.lastClosedShift) return;
      const txt = generateShiftPlainText(state.lastClosedShift);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(() => {
          showToast('Teks rekap shift berhasil disalin!', '📋');
        }).catch(() => {
          showToast('Teks rekap shift siap disalin!', '📋');
        });
      } else {
        showToast('Teks rekap shift siap disalin!', '📋');
      }
    });
  }

  const btnShareWa = document.getElementById('btn-share-shift-wa');
  if (btnShareWa) {
    btnShareWa.addEventListener('click', () => {
      if (!state.lastClosedShift) return;
      const txt = generateShiftPlainText(state.lastClosedShift);
      const url = `https://wa.me/?text=${encodeURIComponent(txt)}`;
      window.open(url, '_blank');
    });
  }

  const btnClose = document.getElementById('btn-close-shift-receipt');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      document.getElementById('modal-shift-receipt').classList.add('hidden');
    });
  }

  const btnRedirectLogin = document.getElementById('btn-redirect-login-shift');
  if (btnRedirectLogin) {
    btnRedirectLogin.addEventListener('click', () => {
      document.getElementById('modal-shift-receipt').classList.add('hidden');
      logoutToLoginScreen(state.lastClosedShift);
      showToast('Tutup sesi selesai. Silakan login kasir berikutnya.', '🔒');
    });
  }

  const btnDone = document.getElementById('btn-done-shift-receipt');
  if (btnDone) {
    btnDone.addEventListener('click', () => {
      document.getElementById('modal-shift-receipt').classList.add('hidden');
    });
  }

  // Global reprintShiftReceipt handler
  window.reprintShiftReceipt = function(shiftId) {
    const shift = state.shiftHistory.find(s => s.id === shiftId);
    if (!shift) {
      showToast('Data shift tidak ditemukan!', '⚠️');
      return;
    }
    openShiftReceiptModal(shift);
  };
}
