// KawaKoe POS - Main Application Entry Point (Modular Architecture)
import { initNavigation } from './modules/navigation.js';
import { initAuth } from './modules/auth.js';
import { initCatalog, renderProducts } from './modules/catalog.js';
import { initCustomizerModal } from './modules/customizer.js';
import { initCart, renderCart } from './modules/cart.js';
import { initPayment } from './modules/payment.js';
import { initTables, renderTables } from './modules/tables.js';
import { initShifts, renderShifts } from './modules/shifts.js';
import { initReports, renderReports } from './modules/reports.js';
import { initReceiptModal } from './modules/receipt.js';
import { initShiftReceiptModal } from './modules/shiftReceipt.js';
import { initSettings } from './modules/settings.js';

// Listen to view-change events to trigger view updates
window.addEventListener('kawakoe:view-change', (e) => {
  const { viewId } = e.detail;
  if (viewId === 'view-tables') renderTables();
  if (viewId === 'view-shifts') renderShifts();
  if (viewId === 'view-reports') renderReports();
  if (viewId === 'view-pos') renderProducts();
});

// Bootstrap All Modules
function initApp() {
  initNavigation();
  initAuth();
  initCatalog();
  initCustomizerModal();
  initCart();
  initPayment();
  initTables();
  initShifts();
  initReports();
  initReceiptModal();
  initShiftReceiptModal();
  initSettings();

  // Initial UI Render
  renderProducts();
  renderCart();
  renderShifts();
  renderTables();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
