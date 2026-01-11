async function loadCheckout() {
  const box = document.getElementById("checkoutBox");

  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) {
    box.innerHTML = "Please login to continue checkout.";
    return;
  }

  const userId = auth.user.id;

  // 1️⃣ Fetch addresses
  const { data: addresses } = await supabaseClient
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!addresses || addresses.length === 0) {
    box.innerHTML = `
      <p>No delivery address found</p>
      <button onclick="goToAccount()">Add Address</button>
    `;
    return;
  }

  const defaultAddress =
    addresses.find(a => a.is_default) || addresses[0];

  // 2️⃣ Get cart data
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    box.innerHTML = "Your cart is empty.";
    return;
  }

  let total = 0;
  cart.forEach(i => total += i.price * i.qty);

  // 3️⃣ Build UI
  let addressHtml = addresses.map(a => `
    <label style="display:block;margin-bottom:8px;">
      <input type="radio" name="address"
        value='${JSON.stringify(a)}'
        ${a.id === defaultAddress.id ? "checked" : ""}>
      ${a.house}, ${a.area}, ${a.city} - ${a.pincode}
    </label>
  `).join("");

  let itemsHtml = cart.map(i => `
    <div style="margin-bottom:10px;">
      <img src="${i.image}" width="80"><br>
      ${i.name}<br>
      ₹${i.price} × ${i.qty}
    </div>
  `).join("");

  box.innerHTML = `
    <h3>Delivery Address</h3>
    ${addressHtml}
    <button onclick="goToAccount()">Edit Address</button>

    <hr>

    <h3>Order Summary</h3>
    ${itemsHtml}
    <h3>Total: ₹${total}</h3>

    <button onclick="placeOrder(${total})">Place Order</button>
    <button onclick="cancelOrder()">Cancel</button>
  `;
}

async function placeOrder(total) {
  const { data: auth } = await supabaseClient.auth.getUser();
  const userId = auth.user.id;

  const selected = document.querySelector(
    'input[name="address"]:checked'
  );

  if (!selected) {
    alert("Please select an address");
    return;
  }

  const address = JSON.parse(selected.value);
  const items = JSON.parse(localStorage.getItem("cart")) || [];

  const { error } = await supabaseClient.from("orders").insert([{
    user_id: userId,
    items: items,
    total_amount: total,
    payment_method: "COD",
    status: "Placed",
    delivery_address: address
  }]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "myorders.html";
}

function goToAccount() {
  window.location.href = "account.html";
}

function cancelOrder() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", loadCheckout);
