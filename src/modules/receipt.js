// Customer Order Thermal Receipt Generator & Modal Handler
import { state } from '../state/store.js';
import { formatRupiah } from '../utils/formatters.js';

export function generateReceiptHTML(order) {
  const d = new Date(order.createdAt);
  const dateStr = d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  let itemsHtml = order.items.map(it => {
    let mods = '';
    if (it.customization) {
      const c = it.customization;
      mods = `<div style="font-size: 9px; color: #6b7280; padding-left: 8px; margin-top: 2px;">
        · ${c.temperature === 'ice' ? 'Ice' : 'Hot'}, Gula ${c.sugarLevel} ${c.milkType !== 'fresh' ? `, Susu ${c.milkType}` : ''} ${c.extraShot ? ', +Shot' : ''}
        ${c.notes ? `<br>Catatan: "${c.notes}"` : ''}
      </div>`;
    }
    return `
      <div style="margin-bottom: 6px; color: #111827;">
        <div style="display: flex; justify-content: space-between; font-weight: 600;">
          <span>${it.quantity}x ${it.productName}</span>
          <span style="font-family: monospace;">${formatRupiah(it.subtotal)}</span>
        </div>
        ${mods}
      </div>
    `;
  }).join('');

  return `
    <div style="background-color: #ffffff !important; color: #111827 !important; width: 100%; box-sizing: border-box; font-family: 'JetBrains Mono', Courier, monospace;">
      <div style="text-align: center; border-bottom: 1px dashed #9ca3af; padding-bottom: 8px; margin-bottom: 8px;">
        <div style="font-weight: 800; font-size: 14px; text-transform: uppercase; color: #111827; letter-spacing: 0.5px;">${state.settings.shopName}</div>
        <div style="font-size: 10px; color: #4b5563; font-style: italic; margin-top: 1px;">${state.settings.tagline}</div>
        <div style="font-size: 9px; color: #6b7280; margin-top: 3px; line-height: 1.3;">${state.settings.address}</div>
        <div style="font-size: 9px; color: #6b7280;">Telp: ${state.settings.phone}</div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px; font-size: 10px; line-height: 1.5; color: #1f2937;">
        <div style="display: flex; justify-content: space-between;"><span>No. Nota:</span><strong style="color: #111827;">#${order.id}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Waktu:</span><span>${dateStr}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Kasir:</span><span>${order.cashierName}</span></div>
        <div style="display: flex; justify-content: space-between;"><span>Tipe:</span><strong style="color: #111827;">${order.orderType.toUpperCase()} ${order.tableNumber ? `(${order.tableNumber})` : ''}</strong></div>
        <div style="display: flex; justify-content: space-between;"><span>Pelanggan:</span><span>${order.customerName}</span></div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px;">
        ${itemsHtml}
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px; font-size: 10px; line-height: 1.6; color: #374151;">
        <div style="display: flex; justify-content: space-between;"><span>Subtotal:</span><span style="font-family: monospace;">${formatRupiah(order.subtotal)}</span></div>
        ${order.discountAmount > 0 ? `<div style="display: flex; justify-content: space-between; color: #059669; font-weight: 600;"><span>Diskon:</span><span>-${formatRupiah(order.discountAmount)}</span></div>` : ''}
        ${order.taxAmount > 0 ? `<div style="display: flex; justify-content: space-between;"><span>PB1 (${state.settings.taxRate}%):</span><span style="font-family: monospace;">${formatRupiah(order.taxAmount)}</span></div>` : ''}
        ${order.serviceAmount > 0 ? `<div style="display: flex; justify-content: space-between;"><span>Service (${state.settings.serviceRate}%):</span><span style="font-family: monospace;">${formatRupiah(order.serviceAmount)}</span></div>` : ''}
        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px; margin-top: 4px; border-top: 1px dotted #9ca3af; padding-top: 4px; color: #111827;">
          <span>TOTAL:</span><span style="font-family: monospace;">${formatRupiah(order.total)}</span>
        </div>
      </div>

      <div style="border-bottom: 1px dashed #9ca3af; padding-bottom: 6px; margin-bottom: 6px; font-size: 10px; color: #374151;">
        <div style="display: flex; justify-content: space-between;"><span>Metode:</span><strong style="text-transform: uppercase; color: #111827;">${order.paymentMethod}</strong></div>
        ${order.paymentMethod === 'cash' ? `
          <div style="display: flex; justify-content: space-between;"><span>Tunai:</span><span style="font-family: monospace;">${formatRupiah(order.cashReceived)}</span></div>
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: #111827;"><span>Kembalian:</span><span style="font-family: monospace;">${formatRupiah(order.changeAmount)}</span></div>
        ` : ''}
        ${order.paymentMethod === 'qris' ? `
          <div style="margin-top: 4px; font-size: 9px; color: #047857; text-align: center; font-weight: 600; background: #ecfdf5; padding: 3px 6px; border-radius: 4px;">
            ✓ QRIS Terverifikasi (bee genZ · NMID: ID1026566671222)
          </div>
        ` : ''}
      </div>

      <div style="text-align: center; font-size: 9px; color: #6b7280; line-height: 1.4; padding-top: 2px;">
        <div style="background: #f3f4f6; padding: 4px 6px; border-radius: 4px; margin-bottom: 5px; color: #111827;">
          WiFi: <strong style="color: #111827;">${state.settings.wifiSSID}</strong> | Pass: <strong style="color: #111827;">${state.settings.wifiPassword}</strong>
        </div>
        <div>Terima kasih atas kunjungan Anda di KawaKoe!</div>
        <div style="font-size: 8px; color: #9ca3af; margin-top: 4px;">*** KawaKoe POS System ***</div>
      </div>
    </div>
  `;
}

export function showReceiptModal(order) {
  state.lastCompletedOrder = order;
  const container = document.getElementById('receipt-screen-content');
  if (container) container.innerHTML = generateReceiptHTML(order);
  const modal = document.getElementById('modal-receipt');
  if (modal) modal.classList.remove('hidden');
}

export function initReceiptModal() {
  const btnClose = document.getElementById('btn-close-receipt');
  if (btnClose) {
    btnClose.addEventListener('click', () => {
      document.getElementById('modal-receipt').classList.add('hidden');
    });
  }

  const btnNewOrder = document.getElementById('btn-receipt-new-order');
  if (btnNewOrder) {
    btnNewOrder.addEventListener('click', () => {
      document.getElementById('modal-receipt').classList.add('hidden');
    });
  }

  // Print Thermal Receipt Action
  const btnPrint = document.getElementById('btn-print-receipt');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      if (!state.lastCompletedOrder) return;
      const printable = document.getElementById('thermal-receipt-printable');
      if (printable) printable.innerHTML = generateReceiptHTML(state.lastCompletedOrder);
      window.print();
    });
  }

  // WhatsApp Share Action
  const btnShareWa = document.getElementById('btn-share-wa');
  if (btnShareWa) {
    btnShareWa.addEventListener('click', () => {
      if (!state.lastCompletedOrder) return;
      const o = state.lastCompletedOrder;
      let text = `*${state.settings.shopName.toUpperCase()}*\n`;
      text += `${state.settings.address}\n--------------------\n`;
      text += `No. Nota: #${o.id}\n`;
      text += `Pelanggan: ${o.customerName}\n`;
      text += `Tipe: ${o.orderType.toUpperCase()} ${o.tableNumber ? `(${o.tableNumber})` : ''}\n--------------------\n`;
      o.items.forEach(it => {
        text += `${it.quantity}x ${it.productName} = ${formatRupiah(it.subtotal)}\n`;
      });
      text += `--------------------\n*TOTAL: ${formatRupiah(o.total)}*\nMetode: ${o.paymentMethod.toUpperCase()}\n--------------------\n`;
      text += `WiFi: ${state.settings.wifiSSID} (${state.settings.wifiPassword})\n`;
      text += `Terima kasih atas kunjungan Anda di KawaKoe!`;

      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Expose global reprintReceipt for order history table
  window.reprintReceipt = function(orderId) {
    const o = state.orders.find(x => x.id === orderId);
    if (o) showReceiptModal(o);
  };
}
