async function loadCheckout() {
  const box = document.getElementById("checkoutBox");

  /* 🔐 CHECK LOGIN */
  const { data: auth } = await supabaseClient.auth.getUser();

  if (!auth.user) {
    box.innerHTML = `
      <p>Please login to continue checkout</p>
      <a href="login.html">Login</a>
    `;
    return;
  }

  const userId = auth.user.id;

  /* 📦 FETCH SAVED ADDRESS */
  const { data: account } = await supabaseClient
    .from("accounts")
    .select("*")
    .eq("user_id", userId)
    .single();

  /* 🏠 IF ADDRESS EXISTS */
  if (account) {
    box.innerHTML = `
      <h3>Delivery Address</h3>
      <p><strong>${account.full_name}</strong></p>
      <p>${account.address}</p>
      <p>${account.city}, ${account.pincode}</p>
      <p>📞 ${account.phone}</p>

      <button class="add-cart-btn" onclick="loadOrderSummary()">
        Deliver Here
      </button>

      <button class="add-cart-btn"
        style="background:#777;margin-top:10px;"
        onclick="window.location.href='account.html'">
        Change Address
      </button>
    `;
    return;
  }

  /* ❌ NO ADDRESS */
  box.innerHTML = `
    <h3>No delivery address found</h3>
    <p>Please add address in My Account</p>
    <button class="add-cart-btn"
      onclick="window.location.href='account.html'">
      Add Address
    </button>
  `;
}

/* ================= ORDER SUMMARY ================= */

function loadOrderSummary() {
  const box = document.getElementById("checkoutBox");

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
  } 
  else if (cart.length > 0) {
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
  } 
  else {
    box.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  html += `
    <h3>Total Payable: ₹${total}</h3>

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

/* ================= PLACE ORDER ================= */

async function placeOrder(total) {
  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) {
    alert("Login required");
    return;
  }

  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let items = [];
  let source = "";

  if (buyNow) {
    items = [buyNow];
    source = "buy_now";
  } else {
    items = cart;
    source = "cart";
  }

  const orderData = {
    user_id: auth.user.id,
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
    alert("Order failed: " + error.message);
    return;
  }

  alert("Order placed successfully!");

  localStorage.removeItem("buyNowProduct");
  localStorage.removeItem("cart");

  window.location.href = "myorders.html";
}

/* ================= CANCEL ================= */

function cancelOrder() {
  localStorage.removeItem("buyNowProduct");
  window.history.back();
}

/* LOAD */
document.addEventListener("DOMContentLoaded", loadCheckout);
