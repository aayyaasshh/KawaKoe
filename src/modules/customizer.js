// Drink Customizer Modal Logic
import { state } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { sfx } from '../utils/sound.js';
import { renderCart } from './cart.js';

export function openCustomizer(prod) {
  state.activeCustomizerProduct = prod;
  state.activeCustQty = 1;
  state.activeCustTemp = 'ice';
  state.activeCustSugar = '100%';
  state.activeCustIce = 'normal';
  state.activeCustMilk = 'fresh';
  state.activeCustExtraShot = false;
  state.activeCustNotes = '';

  document.getElementById('customizer-title').innerText = prod.name;
  document.getElementById('customizer-image').src = prod.image;
  document.getElementById('customizer-price-stock').innerText = formatRupiah(prod.price);
  document.getElementById('customizer-notes').value = '';
  document.getElementById('check-extra-shot').checked = false;
  document.getElementById('cust-qty').innerText = '1';

  const isCoffee = prod.isCoffee || prod.category === 'signature' || prod.category === 'espresso' || prod.category === 'manual-brew';
  document.getElementById('field-temp').style.display = isCoffee ? 'block' : 'none';
  document.getElementById('field-sugar').style.display = isCoffee ? 'block' : 'none';
  document.getElementById('field-ice').style.display = isCoffee ? 'block' : 'none';
  document.getElementById('field-milk').style.display = isCoffee ? 'block' : 'none';
  document.getElementById('field-extra-shot').style.display = isCoffee ? 'block' : 'none';

  resetCustomizerButtons();
  updateCustomizerTotal();
  document.getElementById('modal-customizer').classList.remove('hidden');
}

function resetCustomizerButtons() {
  document.querySelectorAll('.cust-temp-btn').forEach(b => {
    const isAct = b.getAttribute('data-temp') === state.activeCustTemp;
    b.className = `cust-temp-btn p-2.5 rounded-lg border font-semibold cursor-pointer ${
      isAct ? 'active border-cyan-500 bg-cyan-950/40 text-cyan-200' : 'border-stone-800 bg-stone-800/40 text-stone-400'
    }`;
  });
  document.querySelectorAll('.cust-sugar-btn').forEach(b => {
    const isAct = b.getAttribute('data-sugar') === state.activeCustSugar;
    b.className = `cust-sugar-btn p-2 rounded-lg border cursor-pointer ${
      isAct ? 'active border-amber-500 bg-amber-950/40 text-amber-200 font-semibold' : 'border-stone-800 bg-stone-800/40 text-stone-400'
    }`;
  });
  document.querySelectorAll('.cust-ice-btn').forEach(b => {
    const isAct = b.getAttribute('data-ice') === state.activeCustIce;
    b.className = `cust-ice-btn p-2 rounded-lg border cursor-pointer ${
      isAct ? 'active border-amber-500 bg-amber-950/40 text-amber-200 font-semibold' : 'border-stone-800 bg-stone-800/40 text-stone-400'
    }`;
  });
  document.querySelectorAll('.cust-milk-btn').forEach(b => {
    const isAct = b.getAttribute('data-milk') === state.activeCustMilk;
    b.className = `cust-milk-btn p-2.5 text-left rounded-lg border cursor-pointer ${
      isAct ? 'active border-amber-500 bg-amber-950/40 text-amber-200' : 'border-stone-800 bg-stone-800/40 text-stone-400'
    }`;
  });
}

function updateCustomizerTotal() {
  if (!state.activeCustomizerProduct) return;
  let unit = state.activeCustomizerProduct.price;
  if (state.activeCustMilk === 'oat') unit += 8000;
  if (state.activeCustMilk === 'almond') unit += 10000;
  if (state.activeCustExtraShot) unit += 6000;
  const tot = unit * state.activeCustQty;
  document.getElementById('cust-total-calc').innerText = formatRupiah(tot);
}

export function initCustomizerModal() {
  document.querySelectorAll('.cust-temp-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.activeCustTemp = b.getAttribute('data-temp');
      document.getElementById('field-ice').style.display = state.activeCustTemp === 'ice' ? 'block' : 'none';
      resetCustomizerButtons();
      updateCustomizerTotal();
    });
  });

  document.querySelectorAll('.cust-sugar-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.activeCustSugar = b.getAttribute('data-sugar');
      resetCustomizerButtons();
    });
  });

  document.querySelectorAll('.cust-ice-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.activeCustIce = b.getAttribute('data-ice');
      resetCustomizerButtons();
    });
  });

  document.querySelectorAll('.cust-milk-btn').forEach(b => {
    b.addEventListener('click', () => {
      state.activeCustMilk = b.getAttribute('data-milk');
      resetCustomizerButtons();
      updateCustomizerTotal();
    });
  });

  const checkExtraShot = document.getElementById('check-extra-shot');
  if (checkExtraShot) {
    checkExtraShot.addEventListener('change', (e) => {
      state.activeCustExtraShot = e.target.checked;
      updateCustomizerTotal();
    });
  }

  const btnMinus = document.getElementById('btn-cust-minus');
  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (state.activeCustQty > 1) {
        state.activeCustQty--;
        document.getElementById('cust-qty').innerText = state.activeCustQty;
        updateCustomizerTotal();
      }
    });
  }

  const btnPlus = document.getElementById('btn-cust-plus');
  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      state.activeCustQty++;
      document.getElementById('cust-qty').innerText = state.activeCustQty;
      updateCustomizerTotal();
    });
  }

  const btnClose = document.getElementById('btn-close-customizer');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      document.getElementById('modal-customizer').classList.add('hidden');
    });
  }

  // Confirm Add to Cart
  const btnConfirm = document.getElementById('btn-confirm-add-cart');
  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      const prod = state.activeCustomizerProduct;
      if (!prod) return;

      let unit = prod.price;
      if (state.activeCustMilk === 'oat') unit += 8000;
      if (state.activeCustMilk === 'almond') unit += 10000;
      if (state.activeCustExtraShot) unit += 6000;

      const notes = document.getElementById('customizer-notes').value.trim();

      state.cart.push({
        cartItemId: 'c-' + Date.now() + Math.random().toString(36).substring(2, 6),
        productId: prod.id,
        productName: prod.name,
        unitPrice: unit,
        quantity: state.activeCustQty,
        subtotal: unit * state.activeCustQty,
        customization: prod.isCoffee || prod.category === 'signature' || prod.category === 'espresso' || prod.category === 'manual-brew' ? {
          temperature: state.activeCustTemp,
          sugarLevel: state.activeCustSugar,
          iceLevel: state.activeCustTemp === 'ice' ? state.activeCustIce : 'normal',
          milkType: state.activeCustMilk,
          extraShot: state.activeCustExtraShot,
          notes: notes
        } : null
      });

      sfx.playBeep();
      document.getElementById('modal-customizer').classList.add('hidden');
      renderCart();
    });
  }
}
