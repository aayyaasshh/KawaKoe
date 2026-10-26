// Table Floorplan & Occupancy Management Module
import { state, saveState } from '../state/store.js';
import { getMinutesAgo } from '../utils/formatters.js';
import { switchView } from './navigation.js';

let activeTableFilter = 'all';

export function renderTables() {
  const grid = document.getElementById('tables-grid');
  if (!grid) return;

  const filtered = state.tables.filter(t => activeTableFilter === 'all' || t.section === activeTableFilter);

  const occ = state.tables.filter(t => t.status === 'occupied').length;
  const avail = state.tables.filter(t => t.status === 'available').length;
  const resv = state.tables.filter(t => t.status === 'reserved').length;

  const occEl = document.getElementById('tbl-occupied-count');
  if (occEl) occEl.innerText = occ;
  const availEl = document.getElementById('tbl-available-count');
  if (availEl) availEl.innerText = avail;
  const resvEl = document.getElementById('tbl-reserved-count');
  if (resvEl) resvEl.innerText = resv;
  const rateEl = document.getElementById('tbl-occupancy-rate');
  if (rateEl) rateEl.innerText = Math.round((occ / state.tables.length) * 100) + '%';

  grid.innerHTML = filtered.map(t => {
    const isOcc = t.status === 'occupied';
    const isResv = t.status === 'reserved';
    const borderCol = isOcc ? 'border-amber-500' : isResv ? 'border-indigo-500' : 'border-stone-800';

    return `
      <div class="p-3.5 bg-stone-900 border ${borderCol} rounded-xl flex flex-col justify-between text-xs transition-all relative overflow-hidden shadow-sm">
        <div class="absolute top-0 left-0 right-0 h-1 ${isOcc ? 'bg-amber-500' : isResv ? 'bg-indigo-500' : 'bg-emerald-500'}"></div>
        <div>
          <div class="flex items-center justify-between text-[11px] text-stone-400 capitalize mb-1">
            <span>${t.section}</span>
            <span>👥 ${t.capacity}p</span>
          </div>
          <h3 class="font-bold text-sm text-stone-100">${t.name}</h3>
          ${isOcc ? `
            <div class="mt-2 text-amber-400 font-semibold truncate">${t.customerName || 'Tamu'}</div>
            <div class="text-[10px] text-stone-500">${getMinutesAgo(t.occupiedSince)}</div>
          ` : isResv ? `
            <div class="mt-2 text-indigo-300 font-medium truncate">Reservasi: ${t.customerName || '-'}</div>
          ` : `
            <div class="mt-2 text-emerald-400 font-medium">Tersedia (Kosong)</div>
          `}
        </div>
        <div class="pt-3 border-t border-stone-800/80 mt-3 flex items-center justify-between gap-1">
          ${isOcc ? `
            <button onclick="window.vacateTable('${t.id}')" class="w-full py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded text-[11px] cursor-pointer">
              Kosongkan Meja
            </button>
          ` : `
            <button onclick="window.useTableForPOS('${t.name}')" class="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-semibold cursor-pointer">
              Buka Pesanan
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');
}

export function initTables() {
  document.querySelectorAll('.table-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.table-filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-amber-600', 'text-white');
        b.classList.add('bg-stone-900', 'text-stone-400');
      });
      btn.classList.add('active', 'bg-amber-600', 'text-white');
      btn.classList.remove('bg-stone-900', 'text-stone-400');
      activeTableFilter = btn.getAttribute('data-section');
      renderTables();
    });
  });

  window.vacateTable = function(tableId) {
    const t = state.tables.find(x => x.id === tableId);
    if (t) {
      t.status = 'available';
      t.customerName = '';
      t.occupiedSince = undefined;
      saveState();
      renderTables();
    }
  };

  window.useTableForPOS = function(tableName) {
    switchView('view-pos');
    const tableSelect = document.getElementById('cart-table-select');
    if (tableSelect) tableSelect.value = tableName;
    state.selectedTable = tableName;
  };
}
