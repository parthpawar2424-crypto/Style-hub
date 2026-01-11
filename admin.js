console.log("admin.js loaded");

document.addEventListener("DOMContentLoaded", loadAdminOrders);

async function loadAdminOrders() {
  const box = document.getElementById("adminBox");

  const { data: auth } = await supabaseClient.auth.getUser();

  if (!auth.user) {
    box.innerHTML = "Login required";
    return;
  }

  // 🔐 ADMIN CHECK (change email to yours)
  const ADMIN_EMAIL = "youradmin@email.com";

  if (auth.user.email !== ADMIN_EMAIL) {
    box.innerHTML = "Access denied. Admin only.";
    return;
  }

  const { data: orders, error } = await supabaseClient
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    box.innerHTML = error.message;
    return;
  }

  if (orders.length === 0) {
    box.innerHTML = "No orders found";
    return;
  }

  let html = "";

  orders.forEach(order => {
    let itemsHtml = "";

    order.items.forEach(item => {
      itemsHtml += `
        <div style="margin-bottom:10px;">
          <img src="${item.image}" style="width:80px;">
          <p>${item.name} × ${item.qty}</p>
        </div>
      `;
    });

    html += `
      <div style="border:1px solid #ddd;padding:15px;margin-bottom:20px;">
        <p><strong>Order ID:</strong> ${order.order_id}</p>
        <p><strong>Total:</strong> ₹${order.total_amount}</p>
        <p><strong>Payment:</strong> ${order.payment_method}</p>
        <p><strong>Status:</strong> ${order.status}</p>

        ${itemsHtml}

        <select onchange="updateStatus('${order.id}', this.value)">
          <option value="Placed">Placed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>
    `;
  });

  box.innerHTML = html;
}

// -------------------------------
// UPDATE ORDER STATUS
// -------------------------------
async function updateStatus(orderId, newStatus) {
  const { error } = await supabaseClient
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    alert("Failed to update status");
    console.error(error);
  } else {
    alert("Order status updated");
  }
}
