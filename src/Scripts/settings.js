// Settings Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  // Load user data
  loadUserSettings();

  // Username save
  const saveUsernameBtn = document.getElementById("saveUsername");
  const usernameInput = document.getElementById("usernameInput");
  
  if (saveUsernameBtn && usernameInput) {
    saveUsernameBtn.addEventListener("click", () => {
      const newUsername = usernameInput.value.trim();
      if (newUsername) {
        localStorage.setItem("username", newUsername);
        alert("Username updated successfully!");
        loadUserSettings();
      } else {
        alert("Please enter a valid username");
      }
    });
  }

  // Email save
  const saveEmailBtn = document.getElementById("saveEmail");
  const emailInput = document.getElementById("emailInput");
  
  if (saveEmailBtn && emailInput) {
    saveEmailBtn.addEventListener("click", () => {
      const newEmail = emailInput.value.trim();
      if (newEmail && isValidEmail(newEmail)) {
        localStorage.setItem("email", newEmail);
        alert("Email updated successfully!");
        loadUserSettings();
      } else {
        alert("Please enter a valid email address");
      }
    });
  }

  // Load preferences from localStorage
  loadPreferences();

  // Save preferences
  const emailNotifications = document.getElementById("emailNotifications");
  const smsNotifications = document.getElementById("smsNotifications");
  const newsletter = document.getElementById("newsletter");
  const profileVisibility = document.getElementById("profileVisibility");
  const dataSharing = document.getElementById("dataSharing");

  if (emailNotifications) {
    emailNotifications.addEventListener("change", () => {
      localStorage.setItem("emailNotifications", emailNotifications.checked);
    });
  }

  if (smsNotifications) {
    smsNotifications.addEventListener("change", () => {
      localStorage.setItem("smsNotifications", smsNotifications.checked);
    });
  }

  if (newsletter) {
    newsletter.addEventListener("change", () => {
      localStorage.setItem("newsletter", newsletter.checked);
    });
  }

  if (profileVisibility) {
    profileVisibility.addEventListener("change", () => {
      localStorage.setItem("profileVisibility", profileVisibility.value);
    });
  }

  if (dataSharing) {
    dataSharing.addEventListener("change", () => {
      localStorage.setItem("dataSharing", dataSharing.checked);
    });
  }

  // Clear Cart
  const clearCartBtn = document.getElementById("clearCartBtn");
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your cart? This action cannot be undone.")) {
        localStorage.removeItem("cart");
        alert("Cart cleared successfully!");
      }
    });
  }

  // Delete Account
  const deleteAccountBtn = document.getElementById("deleteAccountBtn");
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete your account? This will permanently delete all your data including cart, preferences, and account information. This action cannot be undone.")) {
        if (confirm("This is your last chance. Are you absolutely sure?")) {
          // Clear all user data
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          localStorage.removeItem("loginProvider");
          localStorage.removeItem("cart");
          localStorage.removeItem("emailNotifications");
          localStorage.removeItem("smsNotifications");
          localStorage.removeItem("newsletter");
          localStorage.removeItem("profileVisibility");
          localStorage.removeItem("dataSharing");
          
          alert("Account deleted successfully. Redirecting to home page...");
          window.location.href = "../../index.html";
        }
      }
    });
  }

  // Save All Button
  const saveAllBtn = document.getElementById("saveAllBtn");
  if (saveAllBtn) {
    saveAllBtn.addEventListener("click", () => {
      // Save all preferences
      if (emailNotifications) {
        localStorage.setItem("emailNotifications", emailNotifications.checked);
      }
      if (smsNotifications) {
        localStorage.setItem("smsNotifications", smsNotifications.checked);
      }
      if (newsletter) {
        localStorage.setItem("newsletter", newsletter.checked);
      }
      if (profileVisibility) {
        localStorage.setItem("profileVisibility", profileVisibility.value);
      }
      if (dataSharing) {
        localStorage.setItem("dataSharing", dataSharing.checked);
      }

      // Save username and email if changed
      if (usernameInput && usernameInput.value.trim()) {
        localStorage.setItem("username", usernameInput.value.trim());
      }
      if (emailInput && emailInput.value.trim() && isValidEmail(emailInput.value.trim())) {
        localStorage.setItem("email", emailInput.value.trim());
      }

      alert("All settings saved successfully!");
      loadUserSettings();
    });
  }
});

function loadUserSettings() {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const provider = localStorage.getItem("loginProvider");

  const usernameInput = document.getElementById("usernameInput");
  const emailInput = document.getElementById("emailInput");
  const providerBadge = document.getElementById("providerBadge");

  if (usernameInput && username) {
    usernameInput.value = username;
  }

  if (emailInput && email) {
    emailInput.value = email;
  }

  if (providerBadge) {
    if (provider) {
      providerBadge.textContent = provider;
      providerBadge.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    } else {
      providerBadge.textContent = "Regular Account";
    }
  }
}

function loadPreferences() {
  const emailNotifications = document.getElementById("emailNotifications");
  const smsNotifications = document.getElementById("smsNotifications");
  const newsletter = document.getElementById("newsletter");
  const profileVisibility = document.getElementById("profileVisibility");
  const dataSharing = document.getElementById("dataSharing");

  if (emailNotifications) {
    emailNotifications.checked = localStorage.getItem("emailNotifications") !== "false";
  }

  if (smsNotifications) {
    smsNotifications.checked = localStorage.getItem("smsNotifications") === "true";
  }

  if (newsletter) {
    newsletter.checked = localStorage.getItem("newsletter") !== "false";
  }

  if (profileVisibility) {
    const savedVisibility = localStorage.getItem("profileVisibility");
    if (savedVisibility) {
      profileVisibility.value = savedVisibility;
    }
  }

  if (dataSharing) {
    dataSharing.checked = localStorage.getItem("dataSharing") !== "false";
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
