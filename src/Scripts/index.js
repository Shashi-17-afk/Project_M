document.addEventListener("DOMContentLoaded", () => {
  loadCartFromStorage();

  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });

  updateCartTotal();
});

function addToCart(event) {
  const product = event.target.closest(".product");
  const productId = product.getAttribute("data-id");

  const productNameElement = product.querySelector("h3");
  const productName = productNameElement ? productNameElement.textContent.trim() : "Product";
  const productPrice = parseFloat(
    product.querySelector(".text-primary").innerText.replace("$", "").replace(",", "")
  );

  const productImage = product.querySelector("img").src;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingProduct = cart.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1; 
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartFromStorage(); // 🔄 Updates cart display
  
  // Show confirmation
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = "Added!";
  btn.style.backgroundColor = "#28a745";
  btn.style.color = "white";
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.backgroundColor = "";
    btn.style.color = "";
  }, 1000);
}

function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1; 
    } else {
      cart.splice(itemIndex, 1); 
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartFromStorage();
}

function loadCartFromStorage() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.querySelector(".cart-items");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" width="50">
        <p>${item.name} - $${item.price} (x${item.quantity})</p>
        <button class="remove-item btn btn-danger btn-sm" data-id="${item.id}">Remove</button>
      `;
      cartContainer.appendChild(cartItem);
    });

    document.querySelectorAll(".remove-item").forEach((button) => {
      button.addEventListener("click", (e) => {
        removeFromCart(e.target.getAttribute("data-id"));
      });
    });
  }

  updateCartTotal();
}

function updateCartTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.querySelector(".cart-total").innerText = `Total: $${total.toFixed(2)}`;
}

loadCartFromStorage();
