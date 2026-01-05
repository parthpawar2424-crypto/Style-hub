// auth.js  (place at repo root as you already did)

const SUPABASE_URL = "https://lnjkpbpizjrpuhwmbqkd.supabase.co";   // <--- your project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuamtwYnBpempycHVod21icWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MTQwNTMsImV4cCI6MjA4MzE5MDA1M30.VSPdTEwoSs4DEreHGwKSHjnDE9qGD-Lp9iLM6V3zMlw";             // <--- your anon key

// create a client using the global supabase object (from CDN)
// NOTE: we name the variable supabaseClient (NOT supabase) to avoid collisions
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window.supabaseClient = supabaseClient;

/* ------- helper: update navbar links based on auth state ------- */
async function updateNavbar() {
  const authLinks = document.getElementById("authLinks");
  if (!authLinks) return;

  const { data } = await supabaseClient.auth.getUser();

  if (data && data.user) {
    authLinks.innerHTML = `
      <a href="myorders.html">My Orders</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      await supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });
  } else {
    authLinks.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>
    `;
  }
}

/* run on load */
document.addEventListener("DOMContentLoaded", updateNavbar);


