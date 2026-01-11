async function saveAddress() {
  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) return alert("Login required");

  const userId = auth.user.id;

  const address = {
    user_id: userId,
    name: name.value,
    phone: phone.value,
    house: house.value,
    area: area.value,
    city: city.value,
    pincode: pincode.value,
    is_default: isDefault.checked
  };

  if (address.is_default) {
    await supabaseClient
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId);
  }

  await supabaseClient.from("addresses").insert([address]);

  alert("Address saved");
  loadAddresses();
}

async function loadAddresses() {
  const { data: auth } = await supabaseClient.auth.getUser();
  if (!auth.user) return;

  const { data } = await supabaseClient
    .from("addresses")
    .select("*")
    .order("created_at", { ascending: false });

  let html = "";
  data.forEach(a => {
    html += `
      <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px">
        <strong>${a.name}</strong> (${a.phone})<br>
        ${a.house}, ${a.area}, ${a.city} - ${a.pincode}<br>
        ${a.is_default ? "<b>Default</b>" : ""}
      </div>
    `;
  });

  document.getElementById("addressList").innerHTML = html;
}

loadAddresses();
