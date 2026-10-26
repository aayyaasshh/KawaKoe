// Shifts & Cash Drawer Management Module
import { state, saveState, getCurrentShiftDrawerMetrics } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { sfx } from '../utils/sound.js';
import { showToast } from '../utils/toast.js';
import { openShiftReceiptModal } from './shiftReceipt.js';
import { logoutToLoginScreen } from './auth.js';
import { renderCart } from './cart.js';
import { renderTables } from './tables.js';
import { renderReports } from './reports.js';

let activeCashLogType = 'in';

export function updateDiscrepancyBadge(actualVal, expected) {
  const badge = document.getElementById('cs-discrepancy-badge');
  if (!badge) return;

  if (actualVal === null || actualVal === undefined || actualVal === '' || isNaN(actualVal)) {
    badge.className = 'font-bold font-mono text-stone-400';
    badge.innerText = 'Masukkan nominal fisik';
    return;
  }

  const actual = Number(actualVal);
  const diff = actual - expected;

  if (diff === 0) {
    badge.className = 'font-bold font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-1 rounded-lg text-xs';
    badge.innerText = '✓ Kas Pas (Sempurna Rp 0)';
  } else if (diff > 0) {
    badge.className = 'font-bold font-mono text-blue-400 bg-blue-950/80 border border-blue-700/80 px-2.5 py-1 rounded-lg text-xs';
    badge.innerText = `▲ Kelebihan Kas +${formatRupiah(diff)}`;
  } else {
    badge.className = 'font-bold font-mono text-red-400 bg-red-950/80 border border-red-700/80 px-2.5 py-1 rounded-lg text-xs';
    badge.innerText = `▼ Selisih Kurang -${formatRupiah(Math.abs(diff))}`;
  }
}

export function openCloseShiftModal() {
  const m = getCurrentShiftDrawerMetrics();

  // Populate Cashier
  const cName = state.currentUser ? state.currentUser.name : 'Abijo';
  const cRole = state.currentUser ? state.currentUser.role : 'Kasir Utama';
  const cashierEl = document.getElementById('cs-cashier-name');
  if (cashierEl) cashierEl.innerText = `${cName} (${cRole})`;

  // Shift Start Time
  const openedDate = new Date(state.shiftStartTime || new Date());
  const shiftTimeEl = document.getElementById('cs-shift-start-time');
  if (shiftTimeEl) {
    shiftTimeEl.innerText = openedDate.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + openedDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  }

  // Fill Metrics
  const startEl = document.getElementById('cs-starting-cash');
  if (startEl) startEl.innerText = formatRupiah(m.startingCash);
  const cashSalesEl = document.getElementById('cs-cash-sales');
  if (cashSalesEl) cashSalesEl.innerText = formatRupiah(m.cashSales);
  const cashInEl = document.getElementById('cs-cash-in');
  if (cashInEl) cashInEl.innerText = '+' + formatRupiah(m.cashIn);
  const cashOutEl = document.getElementById('cs-cash-out');
  if (cashOutEl) cashOutEl.innerText = '-' + formatRupiah(m.cashOut);
  const expectedEl = document.getElementById('cs-expected-cash');
  if (expectedEl) expectedEl.innerText = formatRupiah(m.expectedCash);

  const qrisEl = document.getElementById('cs-qris-sales');
  if (qrisEl) qrisEl.innerText = formatRupiah(m.qrisSales);
  const edcEl = document.getElementById('cs-edc-sales');
  if (edcEl) edcEl.innerText = formatRupiah(m.edcSales);
  const totalSalesEl = document.getElementById('cs-total-sales');
  if (totalSalesEl) totalSalesEl.innerText = formatRupiah(m.totalRevenue);

  // Pre-fill inputs with expected cash by default so cashier can close or edit right away
  const inputActual = document.getElementById('input-cs-actual-cash');
  if (inputActual) inputActual.value = m.expectedCash;
  const notesInput = document.getElementById('input-cs-notes');
  if (notesInput) notesInput.value = '';
  updateDiscrepancyBadge(m.expectedCash, m.expectedCash);

  const modal = document.getElementById('modal-close-shift');
  if (modal) modal.classList.remove('hidden');
}

export function renderShifts() {
  const m = getCurrentShiftDrawerMetrics();

  const startEl = document.getElementById('shift-starting-cash');
  if (startEl) startEl.innerText = formatRupiah(m.startingCash);
  const cashSalesEl = document.getElementById('shift-cash-sales');
  if (cashSalesEl) cashSalesEl.innerText = formatRupiah(m.cashSales);
  const cashAdjEl = document.getElementById('shift-cash-adjustments');
  if (cashAdjEl) cashAdjEl.innerText = formatRupiah(m.netCashAdjustment);
  const expectedEl = document.getElementById('shift-expected-cash');
  if (expectedEl) expectedEl.innerText = formatRupiah(m.expectedCash);
  const qrisEl = document.getElementById('shift-qris-sales');
  if (qrisEl) qrisEl.innerText = formatRupiah(m.qrisSales);
  const edcEl = document.getElementById('shift-edc-sales');
  if (edcEl) edcEl.innerText = formatRupiah(m.edcSales);

  // Render Operational Cash Movement Logs
  const logsEl = document.getElementById('shift-logs-container');
  if (logsEl) {
    if (state.cashLogs.length === 0) {
      logsEl.innerHTML = '<div class="text-stone-500 italic p-3 text-center">Belum ada mutasi kas operasional hari ini. Mulai dengan mencatat kas masuk atau pemesanan kasir.</div>';
    } else {
      logsEl.innerHTML = state.cashLogs.map(l => `
        <div class="flex items-center justify-between p-2 rounded bg-stone-950 border border-stone-800">
          <div class="flex items-center gap-2">
            <span class="font-bold ${l.type === 'in' ? 'text-emerald-400' : 'text-red-400'}">
              ${l.type === 'in' ? '+' : '-'} ${formatRupiah(l.amount)}
            </span>
            <span class="text-stone-300">· ${l.note}</span>
          </div>
          <span class="text-stone-500 font-mono text-[11px]">${l.time}</span>
        </div>
      `).join('');
    }
  }

  // Render Closed Shifts History Archive
  const historyEl = document.getElementById('closed-shifts-container');
  const countEl = document.getElementById('closed-shifts-count');
  if (countEl) countEl.innerText = `${state.shiftHistory.length} Shift Ditutup`;

  if (historyEl) {
    if (state.shiftHistory.length === 0) {
      historyEl.innerHTML = '<div class="text-stone-500 italic p-3 text-center">Belum ada arsip tutup shift. Klik tombol "Tutup Shift Kasir" di atas untuk merekonsiliasi kasir.</div>';
    } else {
      historyEl.innerHTML = state.shiftHistory.map(s => {
        let diffBadge = '';
        if (s.discrepancy === 0) {
          diffBadge = '<span class="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px]">✓ Kas Pas (Rp 0)</span>';
        } else if (s.discrepancy > 0) {
          diffBadge = `<span class="text-blue-400 font-bold bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded text-[10px]">▲ Lebih +${formatRupiah(s.discrepancy)}</span>`;
        } else {
          diffBadge = `<span class="text-red-400 font-bold bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded text-[10px]">▼ Kurang -${formatRupiah(Math.abs(s.discrepancy))}</span>`;
        }

        const closedDate = new Date(s.closedAt);
        const dateStr = closedDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

        return `
          <div class="p-3 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-bold font-mono text-amber-400 text-xs">#${s.id}</span>
                <span class="text-stone-300 font-semibold">${s.cashierName}</span>
                <span class="text-stone-500 text-[11px]">· ${dateStr}</span>
              </div>
              <div class="flex flex-wrap items-center gap-3 text-[11px] text-stone-400">
                <span>Omzet: <strong class="text-stone-200 font-mono">${formatRupiah(s.totalRevenue)}</strong></span>
                <span>Fisik Laci: <strong class="text-stone-200 font-mono">${formatRupiah(s.actualCash)}</strong></span>
                <span>${s.ordersCount} Nota</span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              ${diffBadge}
              <button onclick="window.reprintShiftReceipt('${s.id}')" class="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                <span>🖨️ Struk Rekap</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

export function initShifts() {
  // Set Starting Cash Modal
  const btnEditStartingCash = document.getElementById('btn-edit-starting-cash');
  const modalStartingCash = document.getElementById('modal-starting-cash');
  const btnCloseStartingCash = document.getElementById('btn-close-starting-cash');
  const formStartingCash = document.getElementById('form-starting-cash');

  if (btnEditStartingCash) {
    btnEditStartingCash.addEventListener('click', () => {
      const input = document.getElementById('input-new-starting-cash');
      if (input) input.value = state.shiftStartingCash || '';
      if (modalStartingCash) modalStartingCash.classList.remove('hidden');
    });
  }
  if (btnCloseStartingCash) {
    btnCloseStartingCash.addEventListener('click', () => {
      if (modalStartingCash) modalStartingCash.classList.add('hidden');
    });
  }
  if (formStartingCash) {
    formStartingCash.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('input-new-starting-cash');
      const val = input ? (Number(input.value) || 0) : 0;
      state.shiftStartingCash = val;
      saveState();
      renderShifts();
      if (modalStartingCash) modalStartingCash.classList.add('hidden');
    });
  }

  // Cash in / out modal
  const btnOpenCashModal = document.getElementById('btn-open-cash-modal');
  const modalCashInOut = document.getElementById('modal-cash-in-out');
  const btnCloseCashModal = document.getElementById('btn-close-cash-modal');

  if (btnOpenCashModal) {
    btnOpenCashModal.addEventListener('click', () => {
      if (modalCashInOut) modalCashInOut.classList.remove('hidden');
    });
  }
  if (btnCloseCashModal) {
    btnCloseCashModal.addEventListener('click', () => {
      if (modalCashInOut) modalCashInOut.classList.add('hidden');
    });
  }

  document.querySelectorAll('.cash-type-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.cash-type-btn').forEach(x => {
        x.classList.remove('active', 'border-emerald-500', 'bg-emerald-950/40', 'text-emerald-200');
        x.classList.add('border-stone-800', 'bg-stone-800/40', 'text-stone-400');
      });
      b.classList.add('active', 'border-emerald-500', 'bg-emerald-950/40', 'text-emerald-200');
      b.classList.remove('border-stone-800', 'bg-stone-800/40', 'text-stone-400');
      activeCashLogType = b.getAttribute('data-type');
    });
  });

  const formCashLog = document.getElementById('form-cash-log');
  if (formCashLog) {
    formCashLog.addEventListener('submit', (e) => {
      e.preventDefault();
      const amtInput = document.getElementById('cash-log-amount');
      const noteInput = document.getElementById('cash-log-note');
      const amt = amtInput ? Number(amtInput.value) : 0;
      const note = noteInput ? noteInput.value.trim() : '';
      const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      state.cashLogs.unshift({
        id: 'log-' + Date.now(),
        type: activeCashLogType,
        amount: amt,
        note,
        time
      });

      saveState();
      renderShifts();
      if (modalCashInOut) modalCashInOut.classList.add('hidden');
      formCashLog.reset();
    });
  }

  // Open Close Shift Modal button
  const btnCloseShiftAction = document.getElementById('btn-close-shift-action');
  if (btnCloseShiftAction) {
    btnCloseShiftAction.addEventListener('click', () => {
      openCloseShiftModal();
    });
  }

  // Close Shift Modal Close button
  const btnCloseCsModal = document.getElementById('btn-close-cs-modal');
  if (btnCloseCsModal) {
    btnCloseCsModal.addEventListener('click', () => {
      const modal = document.getElementById('modal-close-shift');
      if (modal) modal.classList.add('hidden');
    });
  }

  // Realtime discrepancy on physical cash input
  const inputCsActual = document.getElementById('input-cs-actual-cash');
  if (inputCsActual) {
    inputCsActual.addEventListener('input', (e) => {
      const m = getCurrentShiftDrawerMetrics();
      updateDiscrepancyBadge(e.target.value.trim(), m.expectedCash);
    });
  }

  // Quick Match button (Samakan dengan ekspektasi)
  const btnMatch = document.getElementById('btn-cs-match-expected');
  if (btnMatch) {
    btnMatch.addEventListener('click', () => {
      const m = getCurrentShiftDrawerMetrics();
      if (inputCsActual) inputCsActual.value = m.expectedCash;
      updateDiscrepancyBadge(m.expectedCash, m.expectedCash);
      sfx.playBeep();
    });
  }

  // Button "Cetak Struk Rekap" inside Close Shift Modal (Live Preview)
  const btnPrintThermal = document.getElementById('btn-print-shift-thermal');
  if (btnPrintThermal) {
    btnPrintThermal.addEventListener('click', () => {
      const m = getCurrentShiftDrawerMetrics();
      const inputActualVal = inputCsActual ? inputCsActual.value.trim() : '';
      const actualCash = inputActualVal !== '' ? Number(inputActualVal) : m.expectedCash;
      const discrepancy = actualCash - m.expectedCash;
      const notesInput = document.getElementById('input-cs-notes');

      const previewShift = {
        id: 'SHF-PREVIEW',
        cashierName: state.currentUser ? state.currentUser.name : 'Abijo',
        openedAt: state.shiftStartTime,
        closedAt: new Date().toISOString(),
        startingCash: m.startingCash,
        cashSales: m.cashSales,
        qrisSales: m.qrisSales,
        edcSales: m.edcSales,
        cashIn: m.cashIn,
        cashOut: m.cashOut,
        expectedCash: m.expectedCash,
        actualCash,
        discrepancy,
        totalRevenue: m.totalRevenue,
        ordersCount: m.totalOrders,
        notes: notesInput ? (notesInput.value.trim() || 'Struk Rekap Shift Kasir (Preview)') : 'Struk Rekap Shift Kasir'
      };

      openShiftReceiptModal(previewShift);
    });
  }

  // Confirm and Lock Shift Execution
  const btnConfirmCloseShift = document.getElementById('btn-confirm-close-shift');
  if (btnConfirmCloseShift) {
    btnConfirmCloseShift.addEventListener('click', () => {
      const m = getCurrentShiftDrawerMetrics();
      let inputVal = inputCsActual ? inputCsActual.value.trim() : '';

      // If input is empty, default automatically to expected cash without blocking popup
      if (inputVal === '') {
        inputVal = String(m.expectedCash);
        if (inputCsActual) inputCsActual.value = inputVal;
      }

      const actualCash = Number(inputVal) || 0;
      const discrepancy = actualCash - m.expectedCash;
      const cName = state.currentUser ? state.currentUser.name : 'Abijo';
      const notesInput = document.getElementById('input-cs-notes');

      const shiftRecord = {
        id: 'SHF-' + Math.floor(100000 + Math.random() * 900000),
        cashierName: cName,
        openedAt: state.shiftStartTime,
        closedAt: new Date().toISOString(),
        startingCash: m.startingCash,
        cashSales: m.cashSales,
        qrisSales: m.qrisSales,
        edcSales: m.edcSales,
        cashIn: m.cashIn,
        cashOut: m.cashOut,
        expectedCash: m.expectedCash,
        actualCash,
        discrepancy,
        totalRevenue: m.totalRevenue,
        ordersCount: m.totalOrders,
        notes: notesInput ? (notesInput.value.trim() || 'Tutup shift selesai dengan baik') : 'Tutup shift selesai'
      };

      // 1. Save to shift history archive
      state.shiftHistory.unshift(shiftRecord);

      // 2. Reset shift drawer & orders for next shift session
      state.orders = [];
      state.cashLogs = [];
      state.shiftStartingCash = 0;
      state.shiftStartTime = new Date().toISOString();
      state.cart = [];

      saveState();

      // 3. Hide Close Shift Modal
      const modal = document.getElementById('modal-close-shift');
      if (modal) modal.classList.add('hidden');

      // 4. Re-render UI
      renderShifts();
      renderReports();
      renderTables();
      renderCart();

      sfx.playSuccess();

      // 5. Redirect to Login Screen for handover
      logoutToLoginScreen(shiftRecord);

      // 6. Open on-screen Struk Rekap Shift modal on top so cashier can inspect & print
      openShiftReceiptModal(shiftRecord);

      // 7. Show Toast notification
      showToast(`✓ Shift #${shiftRecord.id} berhasil ditutup & dialihkan ke login`, '🔒');
    });
  }
}
