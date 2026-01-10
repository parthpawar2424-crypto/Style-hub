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
    <button class="add-cart-btn" onclick="placeOrder()">Place Order</button>
    <button class="add-cart-btn" style="background:#777;margin-top:10px;" onclick="cancelOrder()">
      Cancel Order
    </button>
  `;

  box.innerHTML = html;
}

async function placeOrder() {
  console.log("Place order clicked");

  /* ✅ 1. GET LOGGED-IN USER */
  const { data: authData, error: authError } =
    await supabaseClient.auth.getUser();

  if (authError || !authData.user) {
    alert("Please login first");
    return;
  }

  const userId = authData.user.id;

  /* ✅ 2. GET CART / BUY NOW */
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
    cart.forEach(i => (total += i.price * i.qty));
    source = "cart";
  } else {
    alert("Nothing to order");
    return;
  }

  /* ✅ 3. INSERT ORDER WITH user_id */
  const orderData = {
    user_id: userId,              // ⭐ THIS WAS MISSING
    order_id: "HS-" + Math.floor(100000 + Math.random() * 900000),
    source: source,
    items: items,
    total_amount: total,
    payment_method: "COD",
    status: "Placed"
  };

  console.log("Saving order:", orderData);

  const { error } = await supabaseClient
    .from("orders")
    .insert([orderData]);

  if (error) {
    console.error(error);
    alert("Order failed: " + error.message);
    return;
  }

  /* ✅ 4. SUCCESS */
  alert("Order placed successfully!");

  localStorage.removeItem("buyNowProduct");
  localStorage.removeItem("cart");

  window.location.href = "myorders.html";
}

function cancelOrder() {
  localStorage.removeItem("buyNowProduct");
  window.history.back();
}

document.addEventListener("DOMContentLoaded", loadCheckout);
