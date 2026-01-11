async function loadCheckout() {
  const box = document.getElementById("checkoutBox");
  if (!box) return;

  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) {
    box.innerHTML = "Please login to place order";
    return;
  }

  const userId = auth.user.id;

  // 🔹 Fetch saved address
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("default_address")
    .eq("user_id", userId)
    .single();

  if (!profile || !profile.default_address) {
    box.innerHTML = `
      <h3>No delivery address found</h3>
      <p>Please add address in My Account</p>
      <button onclick="window.location.href='account.html'">
        Add Address
      </button>
    `;
    return;
  }

  const address = profile.default_address;

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

  box.innerHTML = `
    <h3>Delivery Address</h3>
    <p>
      ${address.house}, ${address.area}<br>
      ${address.city} - ${address.pincode}
    </p>
    <hr>

    <h3>Order Summary</h3>
    <img src="${items[0].image}" style="width:120px;">
    <p><strong>${items[0].name}</strong></p>
    <p>₹${items[0].price} × ${items[0].qty}</p>

    <h3>Total Payable: ₹${total}</h3>

    <button onclick="placeOrder()">Place Order</button>
    <button onclick="cancelOrder()">Cancel Order</button>
  `;
}

async function placeOrder() {
  const { data: auth } = await supabaseClient.auth.getUser();
  const userId = auth.user.id;

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("default_address")
    .eq("user_id", userId)
    .single();

  const items = JSON.parse(localStorage.getItem("cart")) ||
                [JSON.parse(localStorage.getItem("buyNowProduct"))];

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const orderData = {
    user_id: userId,
    order_id: "HS-" + Math.floor(100000 + Math.random() * 900000),
    items: items,
    total_amount: total,
    payment_method: "COD",
    status: "Placed",
    delivery_address: profile.default_address
  };

  const { error } = await supabaseClient
    .from("orders")
    .insert([orderData]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  localStorage.removeItem("buyNowProduct");
  window.location.href = "myorders.html";
}

function cancelOrder() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", loadCheckout);
