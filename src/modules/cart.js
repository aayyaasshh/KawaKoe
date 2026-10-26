// Cart Management, Calculations & Promo Modal Module
import { state } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';

export function renderCart() {
  const list = document.getElementById('cart-item-list');
  const emptyView = document.getElementById('cart-empty-view');
  const countLabel = document.getElementById('cart-item-count');
  const btnPay = document.getElementById('btn-proceed-payment');
  const btnPayTotal = document.getElementById('btn-pay-total');

  if (countLabel) countLabel.innerText = `(${state.cart.length} item)`;

  if (state.cart.length === 0) {
    if (list) list.innerHTML = '';
    if (emptyView) emptyView.classList.remove('hidden');
    if (btnPay) {
      btnPay.disabled = true;
      btnPay.className = 'w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all shadow-md bg-stone-800 text-stone-500 cursor-not-allowed';
    }
  } else {
    if (emptyView) emptyView.classList.add('hidden');
    if (btnPay) {
      btnPay.disabled = false;
      btnPay.className = 'w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all shadow-md bg-amber-600 hover:bg-amber-500 text-white cursor-pointer';
    }

    if (list) {
      list.innerHTML = state.cart.map((item) => {
        let custBadge = '';
        if (item.customization) {
          const c = item.customization;
          custBadge = `
            <div class="text-[10px] text-stone-400 bg-stone-900/90 rounded p-1 mt-1 space-y-0.5">
              <div>${c.temperature === 'ice' ? '❄️ Ice' : '🔥 Hot'} · Gula ${c.sugarLevel} ${c.milkType !== 'fresh' ? `· <span class="text-amber-400">Susu ${c.milkType}</span>` : ''} ${c.extraShot ? '· <span class="text-amber-400">+Shot</span>' : ''}</div>
              ${c.notes ? `<div class="italic text-stone-500">"${c.notes}"</div>` : ''}
            </div>
          `;
        }
        return `
          <div class="p-2.5 bg-stone-950/70 border border-stone-800/80 rounded-xl space-y-1.5">
            <div class="flex items-start justify-between">
              <div>
                <div class="font-semibold text-xs text-stone-100">${item.productName}</div>
                <div class="text-[11px] text-stone-400 font-mono">${formatRupiah(item.unitPrice)}</div>
              </div>
              <button onclick="window.removeCartItem('${item.cartItemId}')" class="text-stone-500 hover:text-red-400 p-1 cursor-pointer">✕</button>
            </div>
            ${custBadge}
            <div class="flex items-center justify-between pt-1 border-t border-stone-800/50">
              <div class="flex items-center border border-stone-700/60 rounded overflow-hidden bg-stone-900 text-xs">
                <button onclick="window.updateCartQty('${item.cartItemId}', -1)" class="px-2 py-0.5 text-stone-400 hover:text-white cursor-pointer">－</button>
                <span class="px-2 font-mono font-bold text-stone-100">${item.quantity}</span>
                <button onclick="window.updateCartQty('${item.cartItemId}', 1)" class="px-2 py-0.5 text-stone-400 hover:text-white cursor-pointer">＋</button>
              </div>
              <span class="text-xs font-mono font-bold text-stone-200">${formatRupiah(item.subtotal)}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Calculate bill totals
  const subtotal = state.cart.reduce((a, b) => a + b.subtotal, 0);
  let discount = 0;
  if (state.discountType === 'percent') {
    discount = (subtotal * state.discountValue) / 100;
  } else if (state.discountType === 'nominal') {
    discount = Math.min(state.discountValue, subtotal);
  }

  const taxable = Math.max(0, subtotal - discount);
  const tax = state.settings.enableTax ? Math.round((taxable * state.settings.taxRate) / 100) : 0;
  const service = state.settings.enableService ? Math.round((taxable * state.settings.serviceRate) / 100) : 0;
  const grandTotal = taxable + tax + service;

  const subtotalEl = document.getElementById('summary-subtotal');
  if (subtotalEl) subtotalEl.innerText = formatRupiah(subtotal);
  const taxEl = document.getElementById('summary-tax');
  if (taxEl) taxEl.innerText = formatRupiah(tax);
  const serviceEl = document.getElementById('summary-service');
  if (serviceEl) serviceEl.innerText = formatRupiah(service);
  const grandTotalEl = document.getElementById('summary-grand-total');
  if (grandTotalEl) grandTotalEl.innerText = formatRupiah(grandTotal);
  if (btnPayTotal) btnPayTotal.innerText = formatRupiah(grandTotal);

  const rowDiscount = document.getElementById('row-discount');
  const appliedDiscountBadge = document.getElementById('applied-discount-badge');
  const btnOpenPromo = document.getElementById('btn-open-promo');

  if (discount > 0) {
    if (rowDiscount) {
      rowDiscount.classList.remove('hidden');
      rowDiscount.classList.add('flex');
    }
    const reasonEl = document.getElementById('summary-discount-reason');
    if (reasonEl) reasonEl.innerText = `Diskon (${state.discountReason})`;
    const amtEl = document.getElementById('summary-discount-amount');
    if (amtEl) amtEl.innerText = `-${formatRupiah(discount)}`;

    if (appliedDiscountBadge) {
      appliedDiscountBadge.classList.remove('hidden');
      appliedDiscountBadge.classList.add('flex');
    }
    const labelText = document.getElementById('discount-label-text');
    if (labelText) labelText.innerText = `-${formatRupiah(discount)}`;
    if (btnOpenPromo) btnOpenPromo.classList.add('hidden');
  } else {
    if (rowDiscount) {
      rowDiscount.classList.add('hidden');
      rowDiscount.classList.remove('flex');
    }
    if (appliedDiscountBadge) {
      appliedDiscountBadge.classList.add('hidden');
      appliedDiscountBadge.classList.remove('flex');
    }
    if (btnOpenPromo) btnOpenPromo.classList.remove('hidden');
  }
}

export function initCart() {
  // Global Cart Actions
  window.updateCartQty = function(id, delta) {
    const item = state.cart.find(x => x.cartItemId === id);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      state.cart = state.cart.filter(x => x.cartItemId !== id);
    } else {
      item.quantity = newQty;
      item.subtotal = item.unitPrice * newQty;
    }
    renderCart();
  };

  window.removeCartItem = function(id) {
    state.cart = state.cart.filter(x => x.cartItemId !== id);
    renderCart();
  };

  const btnClear = document.getElementById('btn-clear-cart');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      if (state.cart.length > 0 && confirm('Kosongkan keranjang pesanan?')) {
        state.cart = [];
        renderCart();
      }
    });
  }

  // Order type toggles (Dine-in / Takeaway)
  document.querySelectorAll('.order-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.order-type-btn').forEach(b => {
        b.classList.remove('active', 'bg-amber-600', 'text-white');
        b.classList.add('text-stone-400');
      });
      btn.classList.add('active', 'bg-amber-600', 'text-white');
      btn.classList.remove('text-stone-400');
      state.orderType = btn.getAttribute('data-type');
      const tableSelect = document.getElementById('cart-table-select');
      if (tableSelect) {
        tableSelect.style.display = state.orderType === 'dine-in' ? 'block' : 'none';
      }
    });
  });

  // Promo Voucher Modal Handlers
  const btnOpenPromo = document.getElementById('btn-open-promo');
  if (btnOpenPromo) {
    btnOpenPromo.addEventListener('click', () => {
      document.getElementById('modal-promo').classList.remove('hidden');
    });
  }

  const btnClosePromo = document.getElementById('btn-close-promo');
  if (btnClosePromo) {
    btnClosePromo.addEventListener('click', () => {
      document.getElementById('modal-promo').classList.add('hidden');
    });
  }

  const btnRemoveDiscount = document.getElementById('btn-remove-discount');
  if (btnRemoveDiscount) {
    btnRemoveDiscount.addEventListener('click', () => {
      state.discountType = 'none';
      state.discountValue = 0;
      state.discountReason = '';
      renderCart();
    });
  }

  document.querySelectorAll('.promo-choice-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.discountType = b.getAttribute('data-type');
      state.discountValue = Number(b.getAttribute('data-val'));
      state.discountReason = b.getAttribute('data-label');
      document.getElementById('modal-promo').classList.add('hidden');
      renderCart();
    });
  });
}
