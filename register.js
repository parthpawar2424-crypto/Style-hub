const form = document.getElementById("registerForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match";
    message.style.color = "red";
    return;
  }

  message.textContent = "Creating account...";
  message.style.color = "black";

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });

  if (error) {
    message.textContent = error.message;
    message.style.color = "red";
  } else {
    message.textContent = "Registration successful! Please login.";
    message.style.color = "green";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);
  }
});
