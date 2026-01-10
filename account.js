async function loadAccount() {
  const { data: auth } = await supabaseClient.auth.getUser();

  if (!auth.user) {
    window.location.href = "login.html";
    return;
  }

  const user = auth.user;

  // Fill email automatically
  document.getElementById("email").value = user.email;

  // Load existing profile
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profile) {
    document.getElementById("fullName").value = profile.full_name || "";
    document.getElementById("phone").value = profile.phone || "";

    if (profile.default_address) {
      document.getElementById("house").value = profile.default_address.house || "";
      document.getElementById("street").value = profile.default_address.street || "";
      document.getElementById("city").value = profile.default_address.city || "";
      document.getElementById("state").value = profile.default_address.state || "";
      document.getElementById("pincode").value = profile.default_address.pincode || "";
    }
  }
}

async function saveAccount(e) {
  e.preventDefault();

  const { data: auth } = await supabaseClient.auth.getUser();
  const user = auth.user;

  const profileData = {
    user_id: user.id,
    full_name: document.getElementById("fullName").value,
    phone: document.getElementById("phone").value,
    email: user.email,
    default_address: {
      house: document.getElementById("house").value,
      street: document.getElementById("street").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      pincode: document.getElementById("pincode").value
    },
    updated_at: new Date()
  };

  const { error } = await supabaseClient
    .from("profiles")
    .upsert(profileData);

  const msg = document.getElementById("message");

  if (error) {
    msg.style.color = "red";
    msg.textContent = error.message;
  } else {
    msg.style.color = "green";
    msg.textContent = "Account details saved successfully!";
  }
}

document.getElementById("accountForm")
  .addEventListener("submit", saveAccount);

document.addEventListener("DOMContentLoaded", loadAccount);
