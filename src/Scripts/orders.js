// My Orders page - load and display order history from localStorage
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

function loadOrders() {
    const ordersListEl = document.getElementById('ordersList');
    const emptyOrdersEl = document.getElementById('emptyOrders');

    // Orders are stored as array; handle legacy single-object storage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (!Array.isArray(orders)) {
        orders = orders.orderId ? [orders] : [];
    }

    if (orders.length === 0) {
        if (ordersListEl) ordersListEl.style.display = 'none';
        if (emptyOrdersEl) emptyOrdersEl.style.display = 'block';
        return;
    }

    if (emptyOrdersEl) emptyOrdersEl.style.display = 'none';
    if (ordersListEl) {
        ordersListEl.style.display = 'flex';
        ordersListEl.innerHTML = '';
    }

    // Show newest first
    const sortedOrders = [...orders].sort(function(a, b) {
        const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
        const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
        return dateB - dateA;
    });

    sortedOrders.forEach(function(order) {
        const card = createOrderCard(order);
        if (ordersListEl) ordersListEl.appendChild(card);
    });
}

function createOrderCard(order) {
    const card = document.createElement('div');
    card.className = 'order-card';

    const orderDate = order.orderDate
        ? new Date(order.orderDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : '—';

    const items = order.items || [];
    const paymentMethod = order.paymentMethod || '—';
    const total = typeof order.total === 'number' ? order.total.toFixed(2) : (order.total || '0.00');
    const orderId = order.orderId || '—';
    const status = order.status || 'Order Placed';

    let itemsHtml = '';
    items.forEach(function(item) {
        const name = typeof item.name === 'string' ? item.name : (item.name && item.name.textContent) || 'Product';
        const qty = item.quantity || 1;
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const lineTotal = (price * qty).toFixed(2);
        const img = item.image || '';
        itemsHtml += `
            <div class="order-item">
                <img src="${img}" alt="${name}" class="order-item-image" onerror="this.style.display='none'">
                <div class="order-item-details">
                    <div class="order-item-name">${escapeHtml(name)}</div>
                    <div class="order-item-qty">Qty: ${qty}</div>
                </div>
                <div class="order-item-price">$${lineTotal}</div>
            </div>
        `;
    });

    card.innerHTML = `
        <div class="order-card-header">
            <div>
                <span class="order-id">${escapeHtml(orderId)}</span>
                <span class="order-date">${escapeHtml(orderDate)}</span>
            </div>
            <span class="order-status">${escapeHtml(status)}</span>
        </div>
        <div class="order-items">
            ${itemsHtml}
        </div>
        <div class="order-card-footer">
            <span class="order-payment-method">Payment: ${escapeHtml(paymentMethod)}</span>
            <span class="order-total">Total: $${total}</span>
        </div>
    `;

    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
