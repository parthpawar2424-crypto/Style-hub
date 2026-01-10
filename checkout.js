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
      total += item.price * item.qty;
      html += `
        <img src="${item.image}" style="width:120px;">
        <p><strong>${item.name}</strong></p>
        <p>₹${item.price} × ${item.qty}</p>
        <hr>
      `;
    });
  } else {
    box.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  html += `
    <h3>Total Payable: ₹${total}</h3>
    <button onclick="placeOrder()">Place Order</button>
    <button onclick="cancelOrder()">Cancel</button>
  `;

  box.innerHTML = html;
}

async function placeOrder() {
  console.log("Place order clicked");

  console.log("supabaseClient =", window.supabaseClient);

  const orderData = {
    order_id: "HS-" + Math.floor(100000 + Math.random() * 900000),
    source: "cart",
    items: JSON.parse(localStorage.getItem("cart")) || [],
    total_amount: 0,
    payment_method: "COD",
    status: "Placed"
  };

  const { data, error } = await window.supabaseClient
    .from("orders")
    .insert([orderData]);

  if (error) {
    console.error(error);
    alert("Order failed: " + error.message);
    return;
  }

  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

function cancelOrder() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", loadCheckout);
