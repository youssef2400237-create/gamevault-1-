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

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .product-card,
  .stream-card,
  .friend-card {
    opacity: 0;
  }
`;
document.head.appendChild(style);




function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}


function getTimeAgo(minutes) {
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(minutes / 1440);
    return `${days}d ago`;
  }
}


window.addEventListener("load", function () {
  
});


let resizeTimer;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    
  }, 250);
});




function getCart() {
  const cart = localStorage.getItem("neon_nexus_cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("neon_nexus_cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);
  showNotification(`Added "${product.name}" to cart!`, "success");
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  renderCart();
  showNotification("Item removed from cart", "info");
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCart();
  }
}

function clearCart() {
  saveCart([]);
  renderCart();
  showNotification("Cart cleared", "info");
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return total + price * item.quantity;
  }, 0);
}


function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCounts = document.querySelectorAll(".cart-count");

  cartCounts.forEach((count) => {
    count.textContent = totalItems > 0 ? totalItems : "";
  });
}

function showCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.add("show");
    renderCart();
  }
}

function hideCartModal() {
  const modal = document.getElementById("cartModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function renderCart() {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total strong");
  const cart = getCart();

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Your cart is empty</p>
        <span>Add some games to get started!</span>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
      </div>
    `,
      )
      .join("");
  }

  if (cartTotal) {
    cartTotal.textContent = formatPrice(getCartTotal());
  }
}


function getProductData(cardElement) {
  const img = cardElement.querySelector("img");
  const title = cardElement.querySelector("h3");
  const priceElement =
    cardElement.querySelector(".price-tag") ||
    cardElement.querySelector(".old-price");

  if (!img || !title) return null;

  
  const id = title.textContent
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  
  let price = "$9.99"; 
  if (priceElement) {
    
    price = priceElement.textContent;
  }

  return {
    id: id,
    name: title.textContent,
    image: img.src,
    price: price,
  };
}


document.addEventListener("DOMContentLoaded", function () {
  
  updateCartCount();

  
  document.addEventListener("click", function (e) {
    if (e.target.closest(".cart-button")) {
      showCartModal();
    }

    
    if (
      e.target.closest(".cart-close-btn") ||
      e.target.classList.contains("cart-modal")
    ) {
      hideCartModal();
    }

    
    if (e.target.closest(".cart-clear-btn")) {
      clearCart();
    }

    
    if (e.target.closest(".cart-checkout-btn")) {
      if (getCart().length > 0) {
        showNotification("Checkout functionality coming soon!", "info");
      } else {
        showNotification("Your cart is empty", "error");
      }
    }

    
    if (
      e.target.closest("button") &&
      e.target.closest(".product-card, .game-card") &&
      e.target.textContent.includes("ADD TO CART")
    ) {
      e.preventDefault();
      const card = e.target.closest(".product-card, .game-card");
      const productData = getProductData(card);

      if (productData) {
        if (productData.price === "free") {
          showNotification(
            `"${productData.name}" is free to download!`,
            "success",
          );
        } else {
          addToCart(productData);
        }
      }
    }
  });

  
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      hideCartModal();
    }
  });
});
