// Centralized Reactive State Store & Persistence
import { INITIAL_PRODUCTS } from '../data/products.js';
import { INITIAL_TABLES } from '../data/tables.js';

// Load stored orders
let savedOrders = [];
try {
  const parsed = JSON.parse(localStorage.getItem('kawakoe_orders'));
  if (Array.isArray(parsed)) {
    // Purge old mock data if present
    const hasOldMock = parsed.some(o => o.id === 'KWK-1001' || o.id === 'KWK-1002');
    savedOrders = hasOldMock ? [] : parsed;
  }
} catch (_) {
  savedOrders = [];
}

// Load starting cash
let savedStartingCash = 0;
try {
  const sc = localStorage.getItem('kawakoe_starting_cash');
  if (sc !== null) savedStartingCash = Number(sc) || 0;
} catch (_) {}

// Load shift history
let savedShiftHistory = [];
try {
  const sh = JSON.parse(localStorage.getItem('kawakoe_shift_history'));
  if (Array.isArray(sh)) savedShiftHistory = sh;
} catch (_) {}

let savedShiftStartTime = localStorage.getItem('kawakoe_shift_start_time');
if (!savedShiftStartTime) {
  savedShiftStartTime = new Date().toISOString();
  localStorage.setItem('kawakoe_shift_start_time', savedShiftStartTime);
}

// Load user session
let savedUser = null;
try {
  savedUser = JSON.parse(localStorage.getItem('kawakoe_user'));
} catch (_) {}

// Load tables
let savedTables = INITIAL_TABLES;
try {
  const st = JSON.parse(localStorage.getItem('kawakoe_tables'));
  if (Array.isArray(st) && st.length > 0) savedTables = st;
} catch (_) {}

export const state = {
  products: INITIAL_PRODUCTS,
  tables: savedTables,
  orders: savedOrders,
  cart: [],
  selectedCategory: 'all',
  searchQuery: '',
  orderType: 'dine-in',
  selectedTable: '',
  customerName: '',
  discountType: 'none',
  discountValue: 0,
  discountReason: '',
  currentUser: savedUser,
  cashierName: savedUser ? `${savedUser.name} (Kasir)` : 'Abijo (Kasir)',
  shiftStartingCash: savedStartingCash,
  shiftStartTime: savedShiftStartTime,
  shiftHistory: savedShiftHistory,
  cashLogs: JSON.parse(localStorage.getItem('kawakoe_cash_logs')) || [],
  settings: JSON.parse(localStorage.getItem('kawakoe_settings')) || {
    shopName: 'KawaKoe Coffee & Roastery',
    tagline: 'Artisan Roast & Nusantara Coffee Culture',
    address: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    phone: '0812-8899-7700',
    wifiSSID: 'KawaKoe_Visitor',
    wifiPassword: 'kawakoebrewing',
    taxRate: 10,
    serviceRate: 5,
    enableTax: true,
    enableService: true
  },
  activeCustomizerProduct: null,
  activeCustQty: 1,
  activeCustTemp: 'ice',
  activeCustSugar: '100%',
  activeCustIce: 'normal',
  activeCustMilk: 'fresh',
  activeCustExtraShot: false,
  activeCustNotes: '',
  activePayMethod: 'cash',
  lastCompletedOrder: null,
  lastClosedShift: null
};

export function saveState() {
  localStorage.setItem('kawakoe_tables', JSON.stringify(state.tables));
  localStorage.setItem('kawakoe_orders', JSON.stringify(state.orders));
  localStorage.setItem('kawakoe_settings', JSON.stringify(state.settings));
  localStorage.setItem('kawakoe_cash_logs', JSON.stringify(state.cashLogs));
  localStorage.setItem('kawakoe_starting_cash', String(state.shiftStartingCash));
  localStorage.setItem('kawakoe_shift_history', JSON.stringify(state.shiftHistory));
  localStorage.setItem('kawakoe_shift_start_time', state.shiftStartTime);
}

export function getCurrentGrandTotal() {
  const subtotal = state.cart.reduce((a, b) => a + b.subtotal, 0);
  let discount = 0;
  if (state.discountType === 'percent') discount = (subtotal * state.discountValue) / 100;
  else if (state.discountType === 'nominal') discount = Math.min(state.discountValue, subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const tax = state.settings.enableTax ? Math.round((taxable * state.settings.taxRate) / 100) : 0;
  const service = state.settings.enableService ? Math.round((taxable * state.settings.serviceRate) / 100) : 0;
  return taxable + tax + service;
}

export function getCurrentShiftDrawerMetrics() {
  const cashSales = state.orders.filter(o => o.paymentMethod === 'cash').reduce((a, b) => a + b.total, 0);
  const qrisSales = state.orders.filter(o => o.paymentMethod === 'qris').reduce((a, b) => a + b.total, 0);
  const edcSales = state.orders.filter(o => o.paymentMethod === 'edc').reduce((a, b) => a + b.total, 0);

  const cashIn = state.cashLogs.filter(l => l.type === 'in').reduce((a, b) => a + b.amount, 0);
  const cashOut = state.cashLogs.filter(l => l.type === 'out').reduce((a, b) => a + b.amount, 0);
  const netCashAdjustment = cashIn - cashOut;

  const startingCash = state.shiftStartingCash;
  const expectedCash = startingCash + cashSales + netCashAdjustment;
  const totalRevenue = cashSales + qrisSales + edcSales;

  return {
    startingCash,
    cashSales,
    qrisSales,
    edcSales,
    cashIn,
    cashOut,
    netCashAdjustment,
    expectedCash,
    totalRevenue,
    totalOrders: state.orders.length
  };
}
