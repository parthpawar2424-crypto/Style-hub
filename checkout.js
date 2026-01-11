// checkout.js
// ===============================
// High Street – Checkout Logic
// ===============================

console.log("checkout.js loaded");

document.addEventListener("DOMContentLoaded", loadCheckout);

function loadCheckout() {
  const box = document.getElementById("checkoutBox");
  if (!box) return;

  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  let html = "<h3>Order Summary</h3><hr>";

  // -------- BUY NOW FLOW --------
  if (buyNow) {
    total = buyNow.price * buyNow.qty;

    html += `
      <img src="${buyNow.image}" style="width:120px;margin-bottom:10px;">
      <p><strong>${buyNow.name}</strong></p>
      <p>₹${buyNow.price} × ${buyNow.qty}</p>
    `;
  }

  // -------- CART FLOW --------
  else if (cart.length > 0) {
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      html += `
        <img src="${item.image}" style="width:120px;margin-bottom:10px;">
        <p><strong>${item.name}</strong></p>
        <p>₹${item.price} × ${item.qty} = ₹${itemTotal}</p>
        <hr>
      `;
    });
  }

  // -------- EMPTY --------
  else {
    box.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // -------- PAYMENT UI --------
  html += `
    <hr>
    <h3>Total Payable: ₹${total}</h3>

    <h3>Select Payment Method</h3>

    <label>
      <input type="radio" name="payment" value="COD" checked>
      Cash on Delivery
    </label><br><br>

    <label>
      <input type="radio" name="payment" value="UPI">
      UPI (Google Pay / PhonePe)
    </label>

    <div id="upiBox" style="display:none;margin-top:10px;">
      <input type="text" placeholder="Enter UPI ID" style="width:100%;">
    </div>

    <br>

    <label>
      <input type="radio" name="payment" value="CARD">
      Debit / Credit Card
    </label>

    <div id="cardBox" style="display:none;margin-top:10px;">
      <input type="text" placeholder="Card Number" style="width:100%;"><br><br>
      <input type="text" placeholder="MM/YY" style="width:48%;">
      <input type="text" placeholder="CVV" style="width:48%; float:right;">
      <div style="clear:both;"></div>
    </div>

    <br><br>

    <button class="add-cart-btn" onclick="placeOrder(${total})">
      Place Order
    </button>

    <button class="add-cart-btn"
      style="background:#777;margin-top:10px;"
      onclick="cancelOrder()">
      Cancel Order
    </button>
  `;

  box.innerHTML = html;
}

// -------------------------------
// PAYMENT UI TOGGLE
// -------------------------------
document.addEventListener("change", function (e) {
  if (e.target.name === "payment") {
    const upiBox = document.getElementById("upiBox");
    const cardBox = document.getElementById("cardBox");

    if (upiBox) upiBox.style.display = e.target.value === "UPI" ? "block" : "none";
    if (cardBox) cardBox.style.display = e.target.value === "CARD" ? "block" : "none";
  }
});

// -------------------------------
// PLACE ORDER
// -------------------------------
async function placeOrder(total) {
  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let items = [];
  let source = "";

  if (buyNow) {
    items = [buyNow];
    source = "buy_now";
  } else if (cart.length > 0) {
    items = cart;
    source = "cart";
  } else {
    alert("Nothing to order");
    return;
  }

  const paymentMethod = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  const orderData = {
    order_id: "HS-" + Math.floor(100000 + Math.random() * 900000),
    source: source,
    items: items,
    total_amount: total,
    payment_method: paymentMethod,
    status: "Placed"
  };

  const { error } = await window.supabaseClient
    .from("orders")
    .insert([orderData]);

  if (error) {
    console.error(error);
    alert("Order failed: " + error.message);
    return;
  }

  alert("Order placed successfully!");

  localStorage.removeItem("buyNowProduct");
  localStorage.removeItem("cart");

  window.location.href = "index.html";
}

// -------------------------------
// CANCEL ORDER
// -------------------------------
function cancelOrder() {
  localStorage.removeItem("buyNowProduct");
  window.history.back();
}
