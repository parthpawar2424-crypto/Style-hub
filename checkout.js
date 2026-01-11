async function loadCheckout() {
  const box = document.getElementById("checkoutBox");
  if (!box) return;

  // 1️⃣ Get logged-in user
  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) {
    box.innerHTML = "Please login to continue checkout";
    return;
  }

  const userId = auth.user.id;

  // 2️⃣ Fetch address from PROFILES table
  const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("default_address")
    .eq("user_id", userId)
    .single();

  if (error || !profile || !profile.default_address) {
    box.innerHTML = `
      <h3>No delivery address found</h3>
      <p>Please add address in My Account</p>
      <button class="add-cart-btn"
        onclick="window.location.href='account.html'">
        Add Address
      </button>
    `;
    return;
  }

  const address = profile.default_address;

  // 3️⃣ Load items
  const buyNow = JSON.parse(localStorage.getItem("buyNowProduct"));
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let items = [];
  let total = 0;

  if (buyNow) {
    items = [buyNow];
    total = buyNow.price * buyNow.qty;
  } else if (cart.length > 0) {
    items = cart;
    cart.forEach(i => total += i.price * i.qty);
  } else {
    box.innerHTML = "Your cart is empty";
    return;
  }

  // 4️⃣ Render checkout UI
  let html = `
    <h3>Delivery Address</h3>
    <p><strong>${address.house}</strong></p>
    <p>${address.city} - ${address.pincode}</p>
    <hr>
    <h3>Order Summary</h3>
  `;

  items.forEach(item => {
    html += `
      <img src="${item.image}" style="width:120px;">
      <p><strong>${item.name}</strong></p>
      <p>₹${item.price} × ${item.qty}</p>
      <hr>
    `;
  });

  html += `
    <h3>Total Payable: ₹${total}</h3>
    <button class="add-cart-btn" onclick="placeOrder(${total})">
      Place Order
    </button>
    <button class="add-cart-btn"
      style="background:#777;margin-top:10px;"
      onclick="window.history.back()">
      Cancel Order
    </button>
  `;

  box.innerHTML = html;
}

async function placeOrder(total) {
  const { data: auth } = await supabaseClient.auth.getUser();
  const userId = auth.user.id;

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("default_address")
    .eq("user_id", userId)
    .single();

  const items =
    JSON.parse(localStorage.getItem("buyNowProduct"))
      ? [JSON.parse(localStorage.getItem("buyNowProduct"))]
      : JSON.parse(localStorage.getItem("cart")) || [];

  const { error } = await supabaseClient.from("orders").insert([{
    user_id: userId,
    items,
    total_amount: total,
    payment_method: "COD",
    status: "Placed",
    delivery_address: profile.default_address
  }]);

  if (error) {
    alert(error.message);
    return;
  }

  localStorage.removeItem("cart");
  localStorage.removeItem("buyNowProduct");

  alert("Order placed successfully!");
  window.location.href = "myorders.html";
}

document.addEventListener("DOMContentLoaded", loadCheckout);
