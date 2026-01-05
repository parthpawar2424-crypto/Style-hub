const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";
  message.style.color = "black";

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
  } else {
    message.textContent = "Login successful!";
    message.style.color = "green";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  }
});
