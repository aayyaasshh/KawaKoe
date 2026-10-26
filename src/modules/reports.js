// Sales Analytics & Reporting Module
import { state } from '../state/store.js';
import { formatRupiah, formatTime } from '../utils/formatters.js';
import { showToast } from '../utils/toast.js';
import { showReceiptModal } from './receipt.js';

export function renderReports() {
  const totalRev = state.orders.reduce((a, b) => a + b.total, 0);
  const totalOrders = state.orders.length;
  const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : 0;
  const totalItemsSold = state.orders.reduce((acc, o) => acc + o.items.reduce((s, it) => s + it.quantity, 0), 0);

  const revEl = document.getElementById('rpt-total-revenue');
  if (revEl) revEl.innerText = formatRupiah(totalRev);
  const ordersEl = document.getElementById('rpt-total-orders');
  if (ordersEl) ordersEl.innerText = `${totalOrders} Nota`;
  const aovEl = document.getElementById('rpt-aov');
  if (aovEl) aovEl.innerText = formatRupiah(aov);
  const itemsSoldEl = document.getElementById('rpt-total-items-sold');
  if (itemsSoldEl) itemsSoldEl.innerText = `${totalItemsSold} Cup/Porsi`;

  // Top 5 Sellers
  const countMap = {};
  state.orders.forEach(o => {
    o.items.forEach(it => {
      countMap[it.productName] = (countMap[it.productName] || 0) + it.quantity;
    });
  });

  const sortedTop = Object.entries(countMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topContainer = document.getElementById('top-sellers-container');
  if (topContainer) {
    if (sortedTop.length === 0) {
      topContainer.innerHTML = '<div class="text-stone-500 italic p-3 text-center">Belum ada transaksi penjualan</div>';
    } else {
      topContainer.innerHTML = sortedTop.map((item, idx) => `
        <div class="flex items-center justify-between text-xs p-2 rounded bg-stone-950 border border-stone-800">
          <span class="text-stone-200"><strong>${idx + 1}.</strong> ${item[0]}</span>
          <span class="font-mono font-bold text-amber-400">${item[1]} terjual</span>
        </div>
      `).join('');
    }
  }

  // Peak Hour Bars
  const hourCounts = {};
  state.orders.forEach(o => {
    const hr = new Date(o.createdAt).getHours() + ':00';
    hourCounts[hr] = (hourCounts[hr] || 0) + 1;
  });

  const hourlyContainer = document.getElementById('hourly-chart-container');
  if (hourlyContainer) {
    const hours = Object.entries(hourCounts);
    if (hours.length === 0) {
      hourlyContainer.innerHTML = '<div class="text-stone-500 italic p-3 text-center">Belum ada transaksi di jam kerja</div>';
    } else {
      const maxCount = Math.max(...hours.map(h => h[1]), 1);
      hourlyContainer.innerHTML = hours.map(([hr, val]) => `
        <div class="space-y-1 text-xs">
          <div class="flex justify-between text-[11px] text-stone-400">
            <span>Jam ${hr}</span>
            <span class="font-mono text-amber-400">${val} transaksi</span>
          </div>
          <div class="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
            <div class="bg-amber-600 h-full rounded-full" style="width: ${(val / maxCount) * 100}%"></div>
          </div>
        </div>
      `).join('');
    }
  }

  // Transaction history table
  renderTransactionHistory();
}

export function renderTransactionHistory(filterText = '') {
  const tbody = document.getElementById('transactions-tbody');
  if (!tbody) return;

  const filtered = state.orders.filter(o => {
    if (!filterText) return true;
    return o.id.toLowerCase().includes(filterText.toLowerCase()) ||
           o.customerName.toLowerCase().includes(filterText.toLowerCase());
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-stone-500 italic font-sans">
          Belum ada riwayat transaksi. Lakukan pemesanan di menu Kasir (POS).
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(o => `
    <tr class="hover:bg-stone-900/60 transition-colors">
      <td class="py-2.5 px-3 font-bold text-amber-400">#${o.id}</td>
      <td class="py-2.5 px-3 text-stone-400">${formatTime(o.createdAt)}</td>
      <td class="py-2.5 px-3 font-sans text-stone-200">${o.customerName} ${o.tableNumber ? `(${o.tableNumber})` : ''}</td>
      <td class="py-2.5 px-3 font-sans text-stone-300">${o.items.length} item (${o.items.map(x => x.quantity + 'x ' + x.productName).join(', ')})</td>
      <td class="py-2.5 px-3 uppercase text-stone-300 font-semibold">${o.paymentMethod}</td>
      <td class="py-2.5 px-3 font-bold text-stone-100">${formatRupiah(o.total)}</td>
      <td class="py-2.5 px-3 text-right">
        <button onclick="window.reprintReceipt('${o.id}')" class="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] cursor-pointer">
          Lihat Struk
        </button>
      </td>
    </tr>
  `).join('');
}

export function initReports() {
  const searchTransInput = document.getElementById('input-search-transaction');
  if (searchTransInput) {
    searchTransInput.addEventListener('input', (e) => {
      renderTransactionHistory(e.target.value.trim());
    });
  }

  // Export CSV Action
  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
      if (state.orders.length === 0) {
        showToast('Belum ada transaksi untuk diekspor!', '⚠️');
        return;
      }
      let csv = 'ID Nota,Waktu,Pelanggan,Meja,Tipe,Metode Bayar,Subtotal,Diskon,PB1,Service,Total\n';
      state.orders.forEach(o => {
        csv += `"${o.id}","${o.createdAt}","${o.customerName}","${o.tableNumber || '-'}","${o.orderType}","${o.paymentMethod}",${o.subtotal},${o.discountAmount},${o.taxAmount},${o.serviceAmount},${o.total}\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kawakoe-sales-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Laporan CSV berhasil diunduh!', '📥');
    });
  }
}
