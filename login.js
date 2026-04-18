/* ============================================
   NEON NEXUS - Login Page JavaScript
   ============================================ */

// ============= DOM Elements =============
const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const errorEmail = document.querySelector(".error-email");
const errorPassword = document.querySelector(".error-password");
const eyeIcon = document.querySelector(".eye__pass");

// ============= Initialize =============
document.addEventListener("DOMContentLoaded", function () {
  setupPasswordToggle();
  setupFormSubmission();
});

// ============= Password Visibility Toggle =============
function setupPasswordToggle() {
  if (eyeIcon) {
    eyeIcon.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye");
      }
    });
  }
}

// ============= Form Submission =============
function setupFormSubmission() {
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      validateAndLogin();
    });
  }
}

// ============= Validation & Login =============
function validateAndLogin() {
  // Reset errors
  errorEmail.style.display = "none";
  errorPassword.style.display = "none";
  errorEmail.textContent = "";
  errorPassword.textContent = "";

  let isValid = true;

  // Validate email
  const email = emailInput.value.trim();
  if (!email) {
    errorEmail.textContent = "Please enter your email";
    errorEmail.style.display = "block";
    isValid = false;
  } else if (!isValidEmail(email)) {
    errorEmail.textContent = "Please enter a valid email address";
    errorEmail.style.display = "block";
    isValid = false;
  }

  // Validate password
  const password = passwordInput.value;
  if (!password) {
    errorPassword.textContent = "Please enter your password";
    errorPassword.style.display = "block";
    isValid = false;
  } else if (password.length < 4) {
    errorPassword.textContent = "Password must be at least 4 characters";
    errorPassword.style.display = "block";
    isValid = false;
  } else if (password.length > 20) {
    errorPassword.textContent = "Password must be 20 characters or less";
    errorPassword.style.display = "block";
    isValid = false;
  }

  // If valid, proceed to login
  if (isValid) {
    performLogin(email, password);
  }
}

// ============= Email Validation =============
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============= Login Processing =============
function performLogin(email, password) {
  const loginButton = loginForm.querySelector(".btn");
  loginButton.textContent = "LOGGING IN...";
  loginButton.disabled = true;

  setTimeout(() => {
    if (email.toLowerCase() === "admin@gmail.com" && password === "admin123") {
      showLoginNotification(
        "Welcome admin! Redirecting to admin dashboard...",
        "success",
      );
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } else {
      showLoginNotification("Redirecting to home page...", "success");
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    }
  }, 700);
}

// ============= Login Notification =============
function showLoginNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `login-notification notification-${type}`;
  notification.textContent = message;

  // Add styles
  const styles = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 9999;
    animation: slideIn 0.3s ease;
    max-width: 400px;
    word-wrap: break-word;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  `;

  // Apply type-specific styles
  if (type === "success") {
    notification.style.cssText =
      styles +
      `
      background: linear-gradient(135deg, #00ff88, #00dd66);
      color: #000;
    `;
  } else if (type === "error") {
    notification.style.cssText =
      styles +
      `
      background: linear-gradient(135deg, #ff006e, #ff0055);
      color: #fff;
    `;
  } else {
    notification.style.cssText =
      styles +
      `
      background: linear-gradient(135deg, #00d4ff, #0099cc);
      color: #000;
    `;
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ============= Add Animation Keyframes =============
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============= Auto-fill for testing (optional) =============
// Uncomment the lines below to auto-fill the login form for testing
/*
window.addEventListener("load", function () {
  emailInput.value = "user@example.com";
  passwordInput.value = "password123";
});
*/
