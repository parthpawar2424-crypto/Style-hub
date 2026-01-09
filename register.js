// register.js
const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
    return;
  }

  message.style.color = "green";
  message.textContent = "Registration successful. Please login.";
});
