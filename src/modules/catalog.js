// Product Catalog & Filtering Module
import { state } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';
import { openCustomizer } from './customizer.js';

export function renderProducts() {
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('product-empty-state');
  const countLabel = document.getElementById('product-count-label');
  if (!grid) return;

  const filtered = state.products.filter(p => {
    const matchCat = state.selectedCategory === 'all' || p.category === state.selectedCategory;
    const matchSearch = !state.searchQuery ||
      p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (countLabel) {
    countLabel.innerText = `Menampilkan ${filtered.length} Menu`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  grid.innerHTML = filtered.map(p => {
    return `
      <div data-product-id="${p.id}" class="product-card group bg-stone-900 border border-stone-800/80 hover:border-amber-500/80 rounded-xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer shadow-sm hover:shadow-md hover:scale-[1.01] select-none">
        <div>
          <div class="relative h-28 sm:h-32 w-full bg-stone-950 overflow-hidden">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='/src/assets/images/kawakoe_hero_espresso_1792989554253.jpg'">
            ${p.popular ? `<span class="absolute top-2 left-2 bg-amber-600/90 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">POPULAR</span>` : ''}
          </div>
          <div class="p-3">
            <h3 class="font-bold text-xs text-stone-100 group-hover:text-amber-400 transition-colors line-clamp-1">${p.name}</h3>
            <p class="text-[11px] text-stone-400 line-clamp-2 mt-0.5">${p.description}</p>
          </div>
        </div>
        <div class="p-3 pt-0 flex items-center justify-between border-t border-stone-800/60 mt-1">
          <span class="font-mono font-bold text-xs text-amber-400 tabular-nums">${formatRupiah(p.price)}</span>
          <button class="p-1 px-2.5 bg-stone-800 group-hover:bg-amber-600 group-hover:text-white text-stone-300 text-[11px] font-semibold rounded-md transition-colors">
            + Tambah
          </button>
        </div>
      </div>
    `;
  }).join('');

  document.querySelectorAll('.product-card').forEach(el => {
    el.addEventListener('click', () => {
      const pId = el.getAttribute('data-product-id');
      const prod = state.products.find(x => x.id === pId);
      if (prod) openCustomizer(prod);
    });
  });
}

export function initCatalog() {
  // Category filter buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => {
        b.classList.remove('active', 'bg-amber-600', 'text-white');
        b.classList.add('bg-stone-900', 'text-stone-400');
      });
      btn.classList.add('active', 'bg-amber-600', 'text-white');
      btn.classList.remove('bg-stone-900', 'text-stone-400');
      state.selectedCategory = btn.getAttribute('data-category');
      renderProducts();
    });
  });

  // Search input and clear button
  const searchInput = document.getElementById('input-search-product');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery) clearSearchBtn.classList.remove('hidden');
        else clearSearchBtn.classList.add('hidden');
      }
      renderProducts();
    });
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      renderProducts();
    });
  }
}
