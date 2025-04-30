document.addEventListener("DOMContentLoaded",() => {
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const loginSubmit = document.getElementById("loginSubmit");
  const registerLink = document.getElementById("registerLink");
  const profileIcon = document.getElementById("profileIcon");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutTooltip = document.getElementById("logoutTooltip");

  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  loginSubmit.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    loginModal.style.display = "none";
    loginBtn.style.display = "none";
    profileIcon.innerText = username;
  });

  profileIcon.addEventListener("mouseover", () => {
    logoutTooltip.style.display = "block";
  });

  profileIcon.addEventListener("mouseout", () => {
    logoutTooltip.style.display = "none";
  });

  registerLink.addEventListener("click", (event) => {
    event.preventDefault();
    alert("Registration functionality not implemented yet.");
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    loginBtn.style.display = "block";
    profileIcon.innerText = "";
    alert("Logged out successfully");
  });

  window.addEventListener("click", (event) => {
    if (event.target == loginModal) {
      loginModal.style.display = "none";
    }
  });
});
