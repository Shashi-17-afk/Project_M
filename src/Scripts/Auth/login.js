document.addEventListener("DOMContentLoaded",() => {
  const loginBtn = document.getElementById("loginBtn");
  const loginModal = document.getElementById("loginModal");
  const loginSubmit = document.getElementById("loginSubmit");
  const registerLink = document.getElementById("registerLink");
  const profileIcon = document.getElementById("profileIcon");
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutTooltip = document.getElementById("logoutTooltip");

  // Function to update profile information
  function updateProfileInfo(username, email, provider) {
    const profileUsername = document.getElementById("profileUsername");
    const profileEmail = document.getElementById("profileEmail");
    const profileProvider = document.getElementById("profileProvider");
    
    if (profileUsername) profileUsername.textContent = username || "User";
    if (profileEmail) profileEmail.textContent = email || "user@example.com";
    if (profileProvider) {
      profileProvider.textContent = provider ? `Logged in via ${provider}` : "";
      profileProvider.style.display = provider ? "block" : "none";
    }
  }

  // Check if user is already logged in
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const provider = localStorage.getItem("loginProvider");
  
  if (username) {
    if (loginBtn) loginBtn.style.display = "none";
    if (profileIcon) {
      profileIcon.style.display = "block";
      const iconElement = profileIcon.querySelector('i');
      if (iconElement) {
        iconElement.style.display = "block";
      }
    }
    // Update profile dropdown info
    updateProfileInfo(username, email, provider);
  } else {
    if (loginBtn) loginBtn.style.display = "block";
    if (profileIcon) profileIcon.style.display = "none";
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      if (loginModal) loginModal.style.display = "block";
    });
  }

  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const usernameInput = document.getElementById("username");
      const emailInput = document.getElementById("email");
      if (usernameInput && emailInput) {
        const username = usernameInput.value;
        const email = emailInput.value;
        if (username && email) {
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
          if (loginModal) loginModal.style.display = "none";
          if (loginBtn) loginBtn.style.display = "none";
          if (profileIcon) {
            profileIcon.style.display = "block";
            const iconElement = profileIcon.querySelector('i');
            if (iconElement) {
              iconElement.style.display = "block";
            }
          }
          // Update profile info
          updateProfileInfo(username, email, null);
          // Clear form
          usernameInput.value = "";
          emailInput.value = "";
        } else {
          alert("Please enter both username and email");
        }
      }
    });
  }

  // Profile dropdown functionality
  const profileDropdown = document.getElementById("profileDropdown");
  
  if (profileIcon) {
    profileIcon.style.cursor = "pointer";
    
    // Toggle dropdown on click
    profileIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      if (profileDropdown) {
        profileDropdown.classList.toggle("active");
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (profileDropdown && !profileDropdown.contains(e.target) && !profileIcon.contains(e.target)) {
      profileDropdown.classList.remove("active");
    }
  });

  // View Profile functionality
  const viewProfileBtn = document.getElementById("viewProfile");
  if (viewProfileBtn) {
    viewProfileBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const username = localStorage.getItem("username");
      const email = localStorage.getItem("email");
      const provider = localStorage.getItem("loginProvider");
      
      if (username) {
        alert(`Profile Information:\n\nUsername: ${username}\nEmail: ${email}\n${provider ? `Login Provider: ${provider}` : ''}`);
      }
      if (profileDropdown) profileDropdown.classList.remove("active");
    });
  }

  // Settings functionality
  const settingsBtn = document.getElementById("settingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentPath = window.location.pathname || window.location.href;
      let settingsPath = 'src/Html/settings.html';
      
      // Determine correct path based on current location
      if (currentPath.includes('/src/Html/') || currentPath.includes('\\src\\Html\\')) {
        settingsPath = 'settings.html';
      } else if (currentPath.includes('/Html/')) {
        settingsPath = 'src/Html/settings.html';
      }
      
      window.location.href = settingsPath;
      if (profileDropdown) profileDropdown.classList.remove("active");
    });
  }

  if (registerLink) {
    registerLink.addEventListener("click", (event) => {
      event.preventDefault();
      alert("Registration functionality not implemented yet.");
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("loginProvider");
      if (loginBtn) loginBtn.style.display = "block";
      if (profileIcon) {
        profileIcon.style.display = "none";
        const iconElement = profileIcon.querySelector('i');
        if (iconElement) {
          iconElement.style.display = "none";
        }
      }
      if (profileDropdown) profileDropdown.classList.remove("active");
      alert("Logged out successfully");
      // Reload page to update UI
      window.location.reload();
    });
  }

  if (loginModal) {
    window.addEventListener("click", (event) => {
      if (event.target == loginModal) {
        loginModal.style.display = "none";
      }
    });
  }

  // Social Login Functions
  const handleSocialLogin = (provider, username, email) => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("loginProvider", provider);
    
    if (loginModal) loginModal.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (profileIcon) {
      profileIcon.style.display = "block";
      const iconElement = profileIcon.querySelector('i');
      if (iconElement) {
        iconElement.style.display = "block";
      }
    }
    
    // Update profile info
    updateProfileInfo(username, email, provider);
    
    alert(`Successfully logged in with ${provider}!`);
  };

  // Google Login
  const googleLoginBtn = document.getElementById("googleLogin");
  if (googleLoginBtn) {
    googleLoginBtn.style.cursor = "pointer";
    googleLoginBtn.addEventListener("click", () => {
      // Simulate Google login - in a real app, this would use Google OAuth
      const googleUsername = "Google User";
      const googleEmail = "user@gmail.com";
      handleSocialLogin("Google", googleUsername, googleEmail);
    });
  }

  // Facebook Login
  const facebookLoginBtn = document.getElementById("facebookLogin");
  if (facebookLoginBtn) {
    facebookLoginBtn.style.cursor = "pointer";
    facebookLoginBtn.addEventListener("click", () => {
      // Simulate Facebook login - in a real app, this would use Facebook OAuth
      const facebookUsername = "Facebook User";
      const facebookEmail = "user@facebook.com";
      handleSocialLogin("Facebook", facebookUsername, facebookEmail);
    });
  }

  // Twitter Login
  const twitterLoginBtn = document.getElementById("twitterLogin");
  if (twitterLoginBtn) {
    twitterLoginBtn.style.cursor = "pointer";
    twitterLoginBtn.addEventListener("click", () => {
      // Simulate Twitter login - in a real app, this would use Twitter OAuth
      const twitterUsername = "Twitter User";
      const twitterEmail = "user@twitter.com";
      handleSocialLogin("Twitter", twitterUsername, twitterEmail);
    });
  }
});
