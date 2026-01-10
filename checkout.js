alert("checkout.js loaded");
async function loadCheckout() {
  const box = document.getElementById("checkoutBox");

  if (!box) return;

  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  let html = "<h3>Order Summary</h3><hr>";

  if (buyNow) {
    total = buyNow.price * buyNow.qty;
    html += `
      <img src="${buyNow.image}" style="width:120px;">
      <p><strong>${buyNow.name}</strong></p>
      <p>₹${buyNow.price} × ${buyNow.qty}</p>
    `;
  } else if (cart.length > 0) {
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      html += `
        <img src="${item.image}" style="width:120px;">
        <p><strong>${item.name}</strong></p>
        <p>₹${item.price} × ${item.qty} = ₹${itemTotal}</p>
        <hr>
      `;
    });
  } else {
    box.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  html += `
    <h3>Total Payable: ₹${total}</h3>

    <button class="add-cart-btn" onclick="placeOrder()">Place Order</button>

    <button class="add-cart-btn"
      style="background:#777;margin-top:10px;"
      onclick="cancelOrder()">
      Cancel Order
    </button>
  `;

  box.innerHTML = html;
}

async function placeOrder() {
  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let items = [];
  let total = 0;
  let source = "";

  if (buyNow) {
    items = [buyNow];
    total = buyNow.price * buyNow.qty;
    source = "buy_now";
  } else if (cart.length > 0) {
    items = cart;
    cart.forEach(i => total += i.price * i.qty);
    source = "cart";
  } else {
    alert("Nothing to order");
    return;
  }

  const orderData = {
    order_id: "HS-" + Math.floor(100000 + Math.random() * 900000),
    source: source,
    items: items,
    total_amount: total,
    payment_method: "COD",
    status: "Placed"
  };

  const { error } = await supabaseClient
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

function cancelOrder() {
  localStorage.removeItem("buyNowProduct");
  window.history.back();
}

document.addEventListener("DOMContentLoaded", loadCheckout);
