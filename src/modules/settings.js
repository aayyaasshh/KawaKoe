// Settings Modal Module
import { state, saveState } from '../state/store.js';
import { showToast } from '../utils/toast.js';
import { renderCart } from './cart.js';

export function initSettings() {
  const btnOpen = document.getElementById('btn-open-settings');
  const modal = document.getElementById('modal-settings');
  const btnClose = document.getElementById('btn-close-settings');
  const form = document.getElementById('form-settings');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      const nameInput = document.getElementById('set-shop-name');
      if (nameInput) nameInput.value = state.settings.shopName;
      const addrInput = document.getElementById('set-shop-address');
      if (addrInput) addrInput.value = state.settings.address;
      const ssidInput = document.getElementById('set-wifi-ssid');
      if (ssidInput) ssidInput.value = state.settings.wifiSSID;
      const passInput = document.getElementById('set-wifi-pass');
      if (passInput) passInput.value = state.settings.wifiPassword;
      const taxInput = document.getElementById('set-enable-tax');
      if (taxInput) taxInput.checked = state.settings.enableTax;
      const svcInput = document.getElementById('set-enable-service');
      if (svcInput) svcInput.checked = state.settings.enableService;

      if (modal) modal.classList.remove('hidden');
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('set-shop-name');
      const addrInput = document.getElementById('set-shop-address');
      const ssidInput = document.getElementById('set-wifi-ssid');
      const passInput = document.getElementById('set-wifi-pass');
      const taxInput = document.getElementById('set-enable-tax');
      const svcInput = document.getElementById('set-enable-service');

      if (nameInput) state.settings.shopName = nameInput.value.trim();
      if (addrInput) state.settings.address = addrInput.value.trim();
      if (ssidInput) state.settings.wifiSSID = ssidInput.value.trim();
      if (passInput) state.settings.wifiPassword = passInput.value.trim();
      if (taxInput) state.settings.enableTax = taxInput.checked;
      if (svcInput) state.settings.enableService = svcInput.checked;

      saveState();
      renderCart();
      if (modal) modal.classList.add('hidden');
      showToast('Pengaturan KawaKoe POS berhasil disimpan!', '⚙️');
    });
  }
}
