// Authentication & Cashier Session Management
import { state } from '../state/store.js';
import { sfx } from '../utils/sound.js';
import { openShiftReceiptModal } from './shiftReceipt.js';
import { showToast } from '../utils/toast.js';

export function logoutToLoginScreen(shiftRecord = null) {
  localStorage.removeItem('kawakoe_user');
  state.currentUser = null;
  const screenLogin = document.getElementById('screen-login');
  if (screenLogin) {
    screenLogin.classList.remove('hidden');
    if (shiftRecord) {
      const banner = document.getElementById('login-shift-closed-banner');
      const titleEl = document.getElementById('login-shift-closed-title');
      const descEl = document.getElementById('login-shift-closed-desc');
      if (banner) banner.classList.remove('hidden');
      if (titleEl) titleEl.innerText = `Shift #${shiftRecord.id} Berhasil Ditutup`;
      if (descEl) {
        let diffText = 'Kas pas (Rp 0)';
        if (shiftRecord.discrepancy > 0) diffText = `Lebih +${shiftRecord.discrepancy.toLocaleString('id-ID')}`;
        if (shiftRecord.discrepancy < 0) diffText = `Kurang -${Math.abs(shiftRecord.discrepancy).toLocaleString('id-ID')}`;
        descEl.innerText = `Kas fisik tercatat Rp ${shiftRecord.actualCash.toLocaleString('id-ID')} (${diffText}). Laci kas telah siap untuk kasir shift berikutnya.`;
      }
    }
  }
  const inputUsername = document.getElementById('input-login-username');
  const inputPassword = document.getElementById('input-login-password');
  if (inputUsername) inputUsername.value = 'abijo';
  if (inputPassword) inputPassword.value = '';
}

export function initAuth() {
  const screenLogin = document.getElementById('screen-login');
  const btnQuickFill = document.getElementById('btn-quick-fill-demo');
  const formLogin = document.getElementById('form-login');
  const inputUsername = document.getElementById('input-login-username');
  const inputPassword = document.getElementById('input-login-password');
  const errorAlert = document.getElementById('login-error-alert');
  const btnLogout = document.getElementById('btn-logout');
  const cashierLabel = document.getElementById('cashier-label');

  function updateCashierUI(user) {
    if (cashierLabel) {
      cashierLabel.innerText = user ? `Kasir ${user.name}` : 'Kasir Abijo';
    }
    state.cashierName = user ? `${user.name} (Kasir)` : 'Abijo (Kasir)';
  }

  // Check active session
  if (state.currentUser && state.currentUser.username === 'abijo') {
    if (screenLogin) screenLogin.classList.add('hidden');
    updateCashierUI(state.currentUser);
  } else {
    if (screenLogin) screenLogin.classList.remove('hidden');
  }

  // Quick fill button for demo credentials (abijo / 12345678)
  if (btnQuickFill) {
    btnQuickFill.addEventListener('click', () => {
      if (inputUsername) inputUsername.value = 'abijo';
      if (inputPassword) inputPassword.value = '12345678';
      if (errorAlert) errorAlert.classList.add('hidden');
      sfx.playBeep();
    });
  }

  // Form submit handler
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = inputUsername ? inputUsername.value.trim().toLowerCase() : '';
      const p = inputPassword ? inputPassword.value.trim() : '';

      if (u === 'abijo' && p === '12345678') {
        const userObj = {
          username: 'abijo',
          name: 'Abijo',
          role: 'Kasir Utama',
          loginTime: new Date().toISOString()
        };
        state.currentUser = userObj;
        localStorage.setItem('kawakoe_user', JSON.stringify(userObj));
        updateCashierUI(userObj);

        if (errorAlert) errorAlert.classList.add('hidden');
        if (screenLogin) screenLogin.classList.add('hidden');
        sfx.playSuccess();
      } else {
        if (errorAlert) errorAlert.classList.remove('hidden');
        sfx.playBeep();
      }
    });
  }

  // Logout button handler
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('Keluar dari sesi kasir Abijo?\nAnda dapat login kembali dengan akun demo abijo / 12345678.')) {
        logoutToLoginScreen();
        sfx.playBeep();
      }
    });
  }

  // Wire banner button on login screen to view latest shift receipt
  const btnLoginViewShift = document.getElementById('btn-login-view-shift-receipt');
  if (btnLoginViewShift) {
    btnLoginViewShift.addEventListener('click', () => {
      if (state.lastClosedShift) {
        openShiftReceiptModal(state.lastClosedShift);
      } else if (state.shiftHistory.length > 0) {
        openShiftReceiptModal(state.shiftHistory[0]);
      } else {
        showToast('Belum ada arsip shift', 'ℹ️');
      }
    });
  }
}
