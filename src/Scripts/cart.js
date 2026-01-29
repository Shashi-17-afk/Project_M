// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    setupEventListeners();
});

// Load cart from localStorage and display
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.getElementById('emptyCart');
    const cartContainer = document.querySelector('.cart-container');

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        updateSummary(0);
        return;
    }

    cartContainer.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });

    updateSummary();
    updateItemCount();
}

// Create cart item element
function createCartItemElement(item, index) {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'cart-item';
    cartItemDiv.setAttribute('data-id', item.id);

    // Get product name - handle both text content and innerHTML
    let productName = '';
    if (typeof item.name === 'string') {
        productName = item.name;
    } else if (item.name && typeof item.name === 'object') {
        if (item.name.textContent) {
            productName = item.name.textContent.trim();
        } else if (item.name.innerText) {
            productName = item.name.innerText.trim();
        } else {
            productName = 'Product';
        }
    } else {
        productName = item.name || 'Product';
    }
    
    // Clean up product name
    productName = productName.toString().trim();

    // Get product image
    const productImage = item.image || '../../public/images/default-product.jpg';

    cartItemDiv.innerHTML = `
        <img src="${productImage}" alt="${productName}" class="cart-item-image">
        <div class="cart-item-details">
            <h3 class="cart-item-title">${productName}</h3>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-stock">In Stock</div>
            <div class="cart-item-actions">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" 
                           onchange="updateQuantity('${item.id}', this.value)" 
                           onkeyup="updateQuantity('${item.id}', this.value)">
                    <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                </div>
                <button class="remove-item-btn" onclick="removeItem('${item.id}')">Delete</button>
                <button class="save-for-later" onclick="saveForLater('${item.id}')">Save for later</button>
            </div>
        </div>
    `;

    return cartItemDiv;
}

// Increase quantity
function increaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity < 99) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Update quantity
function updateQuantity(productId, quantity) {
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = Math.min(qty, 99);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Remove item from cart
function removeItem(productId) {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

// Save for later (placeholder)
function saveForLater(productId) {
    alert('Item saved for later!');
    // You can implement save for later functionality here
}

// Update order summary
function updateSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const quantity = item.quantity || 1;
        return sum + (price * quantity);
    }, 0);

    // Calculate shipping (free over $35, otherwise $5.99)
    const shipping = subtotal >= 35 ? 0 : 5.99;

    // Calculate tax (8% of subtotal)
    const tax = subtotal * 0.08;

    // Calculate total
    const total = subtotal + shipping + tax;

    // Update display
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('mobileSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}

// Update item count
function updateItemCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const itemCountElement = document.getElementById('itemCount');
    
    if (itemCountElement) {
        itemCountElement.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Proceed to checkout button
    const proceedCheckoutBtn = document.getElementById('proceedCheckout');
    if (proceedCheckoutBtn) {
        proceedCheckoutBtn.addEventListener('click', function() {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Check if Cash on Delivery is selected
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            const paymentMethod = selectedPayment ? selectedPayment.value : 'credit';
            
            if (paymentMethod === 'cod') {
                // Directly place order for COD
                handleCashOnDelivery();
            } else {
                // Show payment modal for other methods
                showPaymentModal();
            }
        });
    }

    // Close modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            hidePaymentModal();
        });
    }

    // Place order button
    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            handlePlaceOrder();
        });
    }

    // Close modal on overlay click
    const modalOverlay = document.getElementById('paymentModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                hidePaymentModal();
            }
        });
    }

    // Format card number input
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    // Format expiry date input
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    // Format CVV input (numbers only)
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Listen for payment method changes
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            // If COD is selected and modal is open, close it and place order
            if (this.value === 'cod') {
                const modal = document.getElementById('paymentModal');
                if (modal && modal.style.display === 'flex') {
                    hidePaymentModal();
                    handleCashOnDelivery();
                }
            }
        });
    });
}

// Show payment modal
function showPaymentModal() {
    // Check if Cash on Delivery is selected
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment ? selectedPayment.value : 'credit';
    
    if (paymentMethod === 'cod') {
        // Skip modal for COD
        handleCashOnDelivery();
        return;
    }
    
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Hide payment modal
function hidePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Handle place order
function handlePlaceOrder() {
    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = selectedPayment ? selectedPayment.value : 'credit';

    // If Cash on Delivery, skip payment form validation
    if (paymentMethod === 'cod') {
        handleCashOnDelivery();
        return;
    }

    // For other payment methods, validate payment form
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value;
    const billingAddress = document.getElementById('billingAddress').value;

    // Basic validation
    if (!cardNumber || cardNumber.length < 16) {
        alert('Please enter a valid card number');
        return;
    }

    if (!expiryDate || expiryDate.length < 5) {
        alert('Please enter a valid expiry date');
        return;
    }

    if (!cvv || cvv.length < 3) {
        alert('Please enter a valid CVV');
        return;
    }

    if (!cardName) {
        alert('Please enter cardholder name');
        return;
    }

    if (!billingAddress) {
        alert('Please enter billing address');
        return;
    }

    // Process order for card payments
    processOrder(paymentMethod);
}

// Handle Cash on Delivery
function handleCashOnDelivery() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Calculate order total
    const subtotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);
    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Get user email
    const userEmail = localStorage.getItem('email') || 'customer@example.com';
    const username = localStorage.getItem('username') || 'Customer';

    // Create order details
    const orderDetails = {
        orderId: 'ORD-' + Date.now(),
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: 'Cash on Delivery',
        orderDate: new Date().toISOString(),
        status: 'Order Placed'
    };

    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (!Array.isArray(orders)) {
        orders = [];
    }
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Send order confirmation email
    sendOrderConfirmationEmail(userEmail, username, orderDetails);

    // Show success message
    showOrderPlacedMessage(orderDetails);

    // Clear cart
    localStorage.removeItem('cart');
    
    // Hide modal and reload cart
    hidePaymentModal();
    loadCart();
}

// Send order confirmation email
function sendOrderConfirmationEmail(email, username, orderDetails) {
    // Create email content
    const emailContent = {
        to: email,
        subject: `Order Confirmation - ${orderDetails.orderId}`,
        body: `
Dear ${username},

Thank you for your order!

Order ID: ${orderDetails.orderId}
Order Date: ${new Date(orderDetails.orderDate).toLocaleString()}
Payment Method: ${orderDetails.paymentMethod}

Order Summary:
${orderDetails.items.map(item => `- ${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${orderDetails.subtotal.toFixed(2)}
Shipping: ${orderDetails.shipping === 0 ? 'FREE' : '$' + orderDetails.shipping.toFixed(2)}
Tax: $${orderDetails.tax.toFixed(2)}
Total: $${orderDetails.total.toFixed(2)}

${orderDetails.paymentMethod === 'Cash on Delivery' 
    ? 'Your order has been placed successfully! You will pay cash when the order is delivered.\n\nWe\'ll send you another email when your order ships.'
    : 'Your order has been placed successfully and payment has been processed.\n\nWe\'ll send you another email when your order ships.'}

Thank you for shopping with TechVault!

Best regards,
TechVault Team
        `,
        sentAt: new Date().toISOString(),
        status: 'sent'
    };

    // Store email in localStorage (simulating email storage)
    let sentEmails = JSON.parse(localStorage.getItem('sentEmails')) || [];
    if (!Array.isArray(sentEmails)) {
        sentEmails = [];
    }
    sentEmails.push(emailContent);
    localStorage.setItem('sentEmails', JSON.stringify(sentEmails));

    // Log email details
    console.log('📧 Order Confirmation Email Sent:', {
        to: email,
        subject: emailContent.subject,
        orderId: orderDetails.orderId,
        timestamp: emailContent.sentAt
    });

    // In a real application, this would make an API call to send the email
    // Example: await fetch('/api/send-email', { method: 'POST', body: JSON.stringify(emailContent) });
}

// Show order placed message
function showOrderPlacedMessage(orderDetails) {
    // Create and show success modal
    const successModal = document.createElement('div');
    successModal.className = 'order-success-modal';
    successModal.innerHTML = `
        <div class="order-success-content">
            <div class="success-icon">
                <i class="bi bi-check-circle-fill"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p class="order-id">Order ID: <strong>${orderDetails.orderId}</strong></p>
            <p class="order-total">Total Amount: <strong>$${orderDetails.total.toFixed(2)}</strong></p>
            <p class="payment-method">Payment Method: <strong>Cash on Delivery</strong></p>
            <p class="email-confirmation">
                <i class="bi bi-envelope-check"></i>
                Order confirmation email has been sent to your email address.
            </p>
            <p class="order-note">
                You will pay cash when the order is delivered. We'll notify you when your order ships.
            </p>
            <button class="btn-continue-shopping" onclick="window.location.href='../../index.html'">
                Continue Shopping
            </button>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    // Auto-close after 10 seconds or on click
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
        }
    }, 10000);
    
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.remove();
        }
    });
}

// Process order for other payment methods
function processOrder(paymentMethod) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        return sum + (price * (item.quantity || 1));
    }, 0);
    const shipping = subtotal >= 35 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    // Get user email
    const userEmail = localStorage.getItem('email') || 'customer@example.com';
    const username = localStorage.getItem('username') || 'Customer';

    // Create order details
    const orderDetails = {
        orderId: 'ORD-' + Date.now(),
        items: cart,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        paymentMethod: getPaymentMethodName(paymentMethod),
        orderDate: new Date().toISOString(),
        status: 'Order Placed'
    };

    // Save order
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    if (!Array.isArray(orders)) {
        orders = [];
    }
    orders.push(orderDetails);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Send email
    sendOrderConfirmationEmail(userEmail, username, orderDetails);

    // Show success message
    alert(`Order placed successfully!\n\nOrder ID: ${orderDetails.orderId}\nTotal: $${total.toFixed(2)}\nPayment Method: ${getPaymentMethodName(paymentMethod)}\n\nOrder confirmation email has been sent!\n\nThank you for your purchase!`);

    // Clear cart
    localStorage.removeItem('cart');
    
    // Hide modal and reload cart
    hidePaymentModal();
    loadCart();
}

// Get payment method name
function getPaymentMethodName(value) {
    const methods = {
        'credit': 'Credit/Debit Card',
        'paypal': 'PayPal',
        'apple': 'Apple Pay',
        'google': 'Google Pay',
        'cod': 'Cash on Delivery'
    };
    return methods[value] || 'Credit/Debit Card';
}

// Make functions globally available
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.saveForLater = saveForLater;

