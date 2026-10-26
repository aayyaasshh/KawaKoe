// Payment Modal Logic & Order Execution
import { state, saveState, getCurrentGrandTotal } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { sfx } from '../utils/sound.js';
import { showToast } from '../utils/toast.js';
import { renderCart } from './cart.js';
import { renderProducts } from './catalog.js';
import { showReceiptModal } from './receipt.js';

export function updateCashChange(received, total) {
  const changeBox = document.getElementById('pay-cash-change-box');
  const changeVal = document.getElementById('pay-cash-change-val');
  const label = document.getElementById('pay-cash-status-label');
  const diff = received - total;

  if (diff >= 0) {
    if (label) {
      label.innerText = 'Uang Kembalian:';
      label.className = 'text-emerald-300';
    }
    if (changeVal) {
      changeVal.innerText = formatRupiah(diff);
      changeVal.className = 'text-base font-bold font-mono text-emerald-400';
    }
    if (changeBox) changeBox.className = 'p-3 rounded-xl border bg-emerald-950/30 border-emerald-800/60 flex items-center justify-between text-xs';
  } else {
    if (label) {
      label.innerText = 'Uang Masih Kurang:';
      label.className = 'text-red-300';
    }
    if (changeVal) {
      changeVal.innerText = formatRupiah(Math.abs(diff));
      changeVal.className = 'text-base font-bold font-mono text-red-400';
    }
    if (changeBox) changeBox.className = 'p-3 rounded-xl border bg-red-950/30 border-red-800/60 flex items-center justify-between text-xs';
  }
}

export function updateSplitCalc(total, count) {
  const res = Math.ceil(total / count);
  const el = document.getElementById('split-result-amount');
  if (el) el.innerText = formatRupiah(res);
}

export function initPayment() {
  const paymentModal = document.getElementById('modal-payment');
  const btnProceed = document.getElementById('btn-proceed-payment');

  if (btnProceed) {
    btnProceed.addEventListener('click', () => {
      if (state.cart.length === 0) return;

      const grandTotal = getCurrentGrandTotal();
      const custName = document.getElementById('cart-customer-name').value.trim() || 'Pelanggan Tamu';
      const tableVal = document.getElementById('cart-table-select').value;
      state.customerName = custName;
      state.selectedTable = tableVal;

      const custInfoEl = document.getElementById('pay-modal-customer-info');
      if (custInfoEl) {
        custInfoEl.innerText = `${custName} · ${state.orderType.toUpperCase()} ${state.orderType === 'dine-in' && tableVal ? `(${tableVal})` : ''}`;
      }
      const totalDisplayEl = document.getElementById('pay-modal-total-display');
      if (totalDisplayEl) totalDisplayEl.innerText = formatRupiah(grandTotal);

      const cashIn = document.getElementById('input-cash-received');
      if (cashIn) cashIn.value = grandTotal;
      updateCashChange(grandTotal, grandTotal);

      updateSplitCalc(grandTotal, 2);
      if (paymentModal) paymentModal.classList.remove('hidden');
    });
  }

  const btnClose = document.getElementById('btn-close-payment');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (paymentModal) paymentModal.classList.add('hidden');
    });
  }

  // Payment Method Switcher
  document.querySelectorAll('.pay-method-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.pay-method-btn').forEach(x => {
        x.classList.remove('active', 'border-amber-500', 'bg-amber-950/40', 'text-stone-100');
        x.classList.add('border-stone-800', 'bg-stone-900', 'text-stone-400');
      });
      b.classList.add('active', 'border-amber-500', 'bg-amber-950/40', 'text-stone-100');
      b.classList.remove('border-stone-800', 'bg-stone-900', 'text-stone-400');
      state.activePayMethod = b.getAttribute('data-method');

      ['cash', 'qris', 'edc', 'ewallet', 'split'].forEach(m => {
        const el = document.getElementById(`pay-ui-${m}`);
        if (el) el.style.display = (m === state.activePayMethod) ? 'block' : 'none';
      });
    });
  });

  const inputCashRec = document.getElementById('input-cash-received');
  if (inputCashRec) {
    inputCashRec.addEventListener('input', (e) => {
      const rec = Number(e.target.value) || 0;
      const tot = getCurrentGrandTotal();
      updateCashChange(rec, tot);
    });
  }

  document.querySelectorAll('.cash-preset-btn').forEach(b => {
    b.addEventListener('click', () => {
      const tot = getCurrentGrandTotal();
      const val = b.getAttribute('data-amount');
      const rec = val === 'pas' ? tot : Number(val);
      if (inputCashRec) inputCashRec.value = rec;
      updateCashChange(rec, tot);
    });
  });

  document.querySelectorAll('.split-btn').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.split-btn').forEach(x => {
        x.classList.remove('active', 'border-purple-500', 'bg-purple-950/40', 'text-purple-200');
        x.classList.add('border-stone-800', 'bg-stone-800/40', 'text-stone-400');
      });
      b.classList.add('active', 'border-purple-500', 'bg-purple-950/40', 'text-purple-200');
      b.classList.remove('border-stone-800', 'bg-stone-800/40', 'text-stone-400');
      updateSplitCalc(getCurrentGrandTotal(), Number(b.getAttribute('data-count')));
    });
  });

  // Complete Payment Execution
  const btnConfirmPay = document.getElementById('btn-confirm-payment');
  if (btnConfirmPay) {
    btnConfirmPay.addEventListener('click', () => {
      const grandTotal = getCurrentGrandTotal();
      const cashRecInput = document.getElementById('input-cash-received');
      const cashRec = cashRecInput ? (Number(cashRecInput.value) || grandTotal) : grandTotal;

      if (state.activePayMethod === 'cash' && cashRec < grandTotal) {
        showToast('Nominal uang tunai kurang dari total tagihan!', '⚠️');
        return;
      }

      const subtotal = state.cart.reduce((a, b) => a + b.subtotal, 0);
      let discount = 0;
      if (state.discountType === 'percent') discount = (subtotal * state.discountValue) / 100;
      else if (state.discountType === 'nominal') discount = Math.min(state.discountValue, subtotal);
      const taxable = Math.max(0, subtotal - discount);
      const tax = state.settings.enableTax ? Math.round((taxable * state.settings.taxRate) / 100) : 0;
      const service = state.settings.enableService ? Math.round((taxable * state.settings.serviceRate) / 100) : 0;

      const newOrder = {
        id: 'KWK-' + Math.floor(1000 + Math.random() * 9000),
        orderNumber: state.orders.length + 1,
        items: [...state.cart],
        subtotal,
        discountAmount: discount,
        discountReason: state.discountReason,
        taxAmount: tax,
        serviceAmount: service,
        total: grandTotal,
        paymentMethod: state.activePayMethod,
        cashReceived: state.activePayMethod === 'cash' ? cashRec : grandTotal,
        changeAmount: state.activePayMethod === 'cash' ? Math.max(0, cashRec - grandTotal) : 0,
        orderType: state.orderType,
        tableNumber: state.orderType === 'dine-in' ? state.selectedTable : undefined,
        customerName: state.customerName,
        cashierName: state.cashierName,
        status: 'completed',
        createdAt: new Date().toISOString()
      };

      // If table chosen, mark table occupied
      if (state.orderType === 'dine-in' && state.selectedTable) {
        const tbl = state.tables.find(t => t.name === state.selectedTable);
        if (tbl) {
          tbl.status = 'occupied';
          tbl.customerName = state.customerName;
          tbl.occupiedSince = new Date().toISOString();
        }
      }

      state.orders.unshift(newOrder);
      state.lastCompletedOrder = newOrder;
      saveState();

      sfx.playSuccess();
      if (paymentModal) paymentModal.classList.add('hidden');

      // Clear cart
      state.cart = [];
      const custNameInput = document.getElementById('cart-customer-name');
      if (custNameInput) custNameInput.value = '';
      const tableSelect = document.getElementById('cart-table-select');
      if (tableSelect) tableSelect.value = '';
      state.discountType = 'none';
      state.discountValue = 0;
      state.discountReason = '';
      renderCart();
      renderProducts();

      // Show receipt preview
      showReceiptModal(newOrder);
    });
  }
}
