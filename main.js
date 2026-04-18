const sidebarNav = document.querySelectorAll(".nav-item");
const launchButton = document.querySelector(".launch-button");
const searchInput = document.querySelector(".search-input");
const profileButton = document.querySelector(".profile-button");


document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
  initializeButtons();
  initializeSearch();
  initializeAnimations();
  updateActiveNav();
});


function initializeNavigation() {
  sidebarNav.forEach((item) => {
    item.addEventListener("click", function (e) {
      
      sidebarNav.forEach((nav) => nav.classList.remove("active"));
      
      this.classList.add("active");
    });
  });
}

function updateActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  sidebarNav.forEach((item) => {
    const href = item.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}


function initializeButtons() {
  if (launchButton) {
    launchButton.addEventListener("click", function () {
      showNotification("Game launching...", "success");
      
      setTimeout(() => {
        showNotification("Welcome to NEON NEXUS!", "success");
      }, 500);
    });
  }

  
  const searchBtn = document.querySelector(".nav-search i");
  if (searchBtn) {
    searchBtn.addEventListener("click", performSearch);
  }

  
  const iconButtons = document.querySelectorAll(".icon-button");
  iconButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      handleIconClick(this);
    });
  });

  
  if (profileButton) {
    profileButton.addEventListener("click", function () {
      showNotification("Profile menu coming soon!", "info");
    });
  }
}


function initializeSearch() {
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }
}

function performSearch() {
  const query = searchInput.value.trim();
  if (query) {
    showNotification(`Searching for: "${query}"...`, "info");
    
    setTimeout(() => {
      showNotification(`Found results for: "${query}"`, "success");
    }, 500);
  }
}


function handleIconClick(button) {
  const icon = button.querySelector("i");
  if (icon.classList.contains("fa-envelope")) {
    showNotification("You have 2 new messages", "info");
  } else if (icon.classList.contains("fa-cog")) {
    showNotification("Opening settings...", "info");
  }
}


document.addEventListener("click", function (e) {
  

  
  if (e.target.closest(".btn-secondary") && e.target.closest(".game-card")) {
    const gameName = e.target
      .closest(".game-card")
      .querySelector("h3").textContent;
    showNotification(`Downloading "${gameName}"...`, "success");
  }

  
  if (e.target.closest(".friend-actions .btn-icon")) {
    handleFriendAction(e.target.closest(".friend-card"));
  }

  
  if (e.target.closest(".request-actions .accept")) {
    const friendName = e.target
      .closest(".request-item")
      .querySelector("h4").textContent;
    e.target.closest(".request-item").remove();
    showNotification(`You are now friends with ${friendName}!`, "success");
  }

  if (e.target.closest(".request-actions .decline")) {
    e.target.closest(".request-item").remove();
    showNotification("Friend request declined", "info");
  }

  
  if (e.target.closest(".pending-item .btn-small")) {
    const gameName = e.target
      .closest(".pending-item")
      .querySelector("h3").textContent;
    showNotification(`Scheduled download for "${gameName}"`, "success");
  }

  
  if (e.target.closest(".newsletter-form .btn-primary")) {
    const email = e.target
      .closest(".newsletter-form")
      .querySelector("input[type=email]").value;
    if (email) {
      showNotification(`Subscribed with ${email}!`, "success");
    } else {
      showNotification("Please enter your email", "error");
    }
  }

  
  if (e.target.closest(".suggestion-item .btn-icon")) {
    const friendName = e.target
      .closest(".suggestion-item")
      .querySelector("h4").textContent;
    showNotification(`Friend request sent to ${friendName}!`, "success");
  }
});


function handleFriendAction(friendCard) {
  const friendName = friendCard.querySelector("h3").textContent;
  const icons = friendCard
    .querySelector(".friend-actions")
    .querySelectorAll("i");

  icons.forEach((icon) => {
    if (icon.classList.contains("fa-gamepad")) {
      showNotification(`Joining ${friendName}'s game...`, "info");
    } else if (icon.classList.contains("fa-users")) {
      showNotification(`Viewing ${friendName}'s squad...`, "info");
    } else if (icon.classList.contains("fa-comment")) {
      showNotification(`Opening chat with ${friendName}...`, "info");
    } else if (icon.classList.contains("fa-envelope")) {
      showNotification(`Sending message to ${friendName}...`, "info");
    }
  });
}


function initializeAnimations() {
  
  const sectionHeaders = document.querySelectorAll(".section-header");
  sectionHeaders.forEach((header, index) => {
    setTimeout(() => {
      header.style.opacity = "0";
      header.style.transform = "translateY(20px)";
      header.offsetWidth; 
      header.style.transition = "all 0.6s ease";
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, index * 100);
  });

  
  const productCards = document.querySelectorAll(
    ".product-card, .product-card-small",
  );
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)";
    });
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
}


function showNotification(message, type = "info") {
  
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  
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

  
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}


function initializeResponsiveNav() {
  
  const viewport = window.innerWidth;
  if (viewport <= 768) {
    
  }
}


const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = "fadeInUp 0.6s ease forwards";
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);


document
  .querySelectorAll(".product-card, .stream-card, .friend-card")
  .forEach((card) => {
    observer.observe(card);
  });


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
  };
