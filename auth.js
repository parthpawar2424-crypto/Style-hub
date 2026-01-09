/// auth.js
const authLinks = document.getElementById("authLinks");

async function updateNav() {
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (session) {
    authLinks.innerHTML = `
      <a href="myorders.html">My Orders</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;

    document.getElementById("logoutBtn").onclick = async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "index.html";
    };
  } else {
    authLinks.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

updateNav();
