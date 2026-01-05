// auth.js

const SUPABASE_URL = "https://lnjkpbbjzjrpuwhmbqkd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuamtwYnBpempycHVod21icWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTQwNTMsImV4cCI6MjA4MzE5MDA1M30.VSPdTEwoSs4DEreHGwKSHjnDE9qGD-Lp9iLM6V3zMlw";

const supabase = supabaseLib.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Update navbar links
async function updateNavbar() {
  const authLinks = document.getElementById("authLinks");
  if (!authLinks) return;

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    authLinks.innerHTML = `
      <a href="myorders.html">My Orders</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;

    document.getElementById("logoutBtn").onclick = async (e) => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = "index.html";
    };
  } else {
    authLinks.innerHTML = `
      <a href="register.html">Register</a>
      <a href="login.html">Login</a>
    `;
  }
}

// Run on every page

updateNavbar();

