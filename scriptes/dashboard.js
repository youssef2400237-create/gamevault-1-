const state = {
  games: [
    { id: 1, title: "Solar Rift",      category: "Action",    price: 49.99, status: "available"   },
    { id: 2, title: "Cyber Run",       category: "Racing",    price: 39.99, status: "available"   },
    { id: 3, title: "Echoes of Eden",  category: "RPG",       price: 59.99, status: "unavailable" },
    { id: 4, title: "Neon Spires",     category: "Adventure", price: 34.99, status: "available"   },
    { id: 5, title: "Phantom Galaxy",  category: "Sci-Fi",    price: 54.99, status: "available"   },
  ],
  users: [
    { id: 1, name: "Amina Hassan",  email: "amina@gmail.com",   role: "admin",  status: "active"   },
    { id: 2, name: "Omar Samir",    email: "omar@gmail.com",    role: "member", status: "active"   },
    { id: 3, name: "Yasmine Adel",  email: "yasmine@gmail.com", role: "member", status: "inactive" },
    { id: 4, name: "Khaled Nasser", email: "khaled@gmail.com",  role: "member", status: "active"   },
    { id: 5, name: "Lina Farouk",   email: "lina@gmail.com",    role: "member", status: "inactive" },
  ],
  activeSection:  "overview",
  gamesPage:      1,
  gamesPageSize:  5,
  gamesSearch:    "",
  gamesFilter:    "all",
  usersSearch:    "",
  usersFilter:    "all",
  editingGameId:  null,
  editingUserId:  null,
};

const refs = {
  // sidebar
  sidebar:            document.getElementById("sidebar"),
  sidebarOverlay:     document.getElementById("sidebarOverlay"),
  hamburgerBtn:       document.getElementById("hamburgerBtn"),
  sidebarCloseBtn:    document.getElementById("sidebarCloseBtn"),
  sidebarLinks:       document.querySelectorAll(".sidebar-link"),

  // sections
  sections:           document.querySelectorAll(".dashboard-section"),

  // topbar
  globalSearch:       document.getElementById("globalSearch"),
  refreshStatsBtn:    document.getElementById("refreshStatsBtn"),
  openGameModalBtn:   document.getElementById("openGameModalBtn"),

  // games section
  gamesSearch:        document.getElementById("gamesSearch"),
  gamesFilter:        document.getElementById("gamesFilter"),
  newGameBtn:         document.getElementById("newGameBtn"),
  gamesTableBody:     document.getElementById("gamesTableBody"),
  gamesCount:         document.getElementById("gamesCount"),
  gamesPagination:    document.getElementById("gamesPagination"),
  gamesPaginationInfo:document.getElementById("gamesPaginationInfo"),

  // users section
  usersSearch:        document.getElementById("usersSearch"),
  usersFilter:        document.getElementById("usersFilter"),
  newUserBtn:         document.getElementById("newUserBtn"),
  usersTableBody:     document.getElementById("usersTableBody"),
  usersCount:         document.getElementById("usersCount"),

  // overview stats
  totalUsers:         document.getElementById("totalUsers"),
  totalGames:         document.getElementById("totalGames"),
  activeUsers:        document.getElementById("activeUsers"),
  totalRevenue:       document.getElementById("totalRevenue"),
  activityList:       document.getElementById("activityList"),

  // game modal
  gameModal:          document.getElementById("gameModal"),
  gameModalForm:      document.getElementById("gameModalForm"),
  modalTitle:         document.getElementById("modalTitle"),
  modalGameTitle:     document.getElementById("modalGameTitle"),
  modalGameCategory:  document.getElementById("modalGameCategory"),
  modalGamePrice:     document.getElementById("modalGamePrice"),
  modalGameStatus:    document.getElementById("modalGameStatus"),
  modalSaveBtn:       document.getElementById("modalSaveBtn"),
  modalCancelBtn:     document.getElementById("modalCancelBtn"),
  closeModalBtn:      document.getElementById("closeModalBtn"),

  // user modal
  userModal:          document.getElementById("userModal"),
  userModalForm:      document.getElementById("userModalForm"),
  userModalTitle:     document.getElementById("userModalTitle"),
  modalUserName:      document.getElementById("modalUserName"),
  modalUserEmail:     document.getElementById("modalUserEmail"),
  modalUserRole:      document.getElementById("modalUserRole"),
  modalUserStatus:    document.getElementById("modalUserStatus"),
  userModalSaveBtn:   document.getElementById("userModalSaveBtn"),
  userModalCancelBtn: document.getElementById("userModalCancelBtn"),
  closeUserModalBtn:  document.getElementById("closeUserModalBtn"),

  // toast
  toastContainer:     document.getElementById("toastContainer"),
};

/* =============================================
   INIT
   ============================================= */
function init() {
  attachEvents();
  render();
}

/* =============================================
   EVENTS
   ============================================= */
function attachEvents() {
  // Sidebar toggle (mobile)
  refs.hamburgerBtn.addEventListener("click", openSidebar);
  refs.sidebarCloseBtn.addEventListener("click", closeSidebar);
  refs.sidebarOverlay.addEventListener("click", closeSidebar);

  // Close sidebar when nav link clicked on mobile
  refs.sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveSection(link.dataset.view);
      if (window.innerWidth <= 900) closeSidebar();
    });
  });

  refs.globalSearch.addEventListener("input", (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (state.activeSection === "games") {
      state.gamesSearch = value;
      state.gamesPage = 1;
      refs.gamesSearch.value = value;
      renderGamesSection();
    }
    if (state.activeSection === "users") {
      state.usersSearch = value;
      refs.usersSearch.value = value;
      renderUsersSection();
    }
  });

  refs.refreshStatsBtn.addEventListener("click", renderOverview);
  refs.openGameModalBtn.addEventListener("click", () => openGameModal("add"));

  refs.gamesSearch.addEventListener("input", (e) => {
    state.gamesSearch = e.target.value.trim().toLowerCase();
    state.gamesPage = 1;
    refs.globalSearch.value = state.gamesSearch;
    renderGamesSection();
  });

  refs.gamesFilter.addEventListener("change", (e) => {
    state.gamesFilter = e.target.value;
    state.gamesPage = 1;
    renderGamesSection();
  });

  refs.usersSearch.addEventListener("input", (e) => {
    state.usersSearch = e.target.value.trim().toLowerCase();
    refs.globalSearch.value = state.usersSearch;
    renderUsersSection();
  });

  refs.usersFilter.addEventListener("change", (e) => {
    state.usersFilter = e.target.value;
    renderUsersSection();
  });

  refs.newUserBtn.addEventListener("click", () => openUserModal("add"));
  if (refs.newGameBtn) {
    refs.newGameBtn.addEventListener("click", () => openGameModal("add"));
  }

  // Game modal
  refs.gameModalForm.addEventListener("submit", saveModalGame);
  refs.modalCancelBtn.addEventListener("click", closeGameModal);
  refs.closeModalBtn.addEventListener("click", closeGameModal);
  refs.gameModal.addEventListener("click", (e) => {
    if (e.target === refs.gameModal) closeGameModal();
  });

  // User modal
  refs.userModalForm.addEventListener("submit", saveModalUser);
  refs.userModalCancelBtn.addEventListener("click", closeUserModal);
  refs.closeUserModalBtn.addEventListener("click", closeUserModal);
  refs.userModal.addEventListener("click", (e) => {
    if (e.target === refs.userModal) closeUserModal();
  });

  // Close modals with Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeGameModal();
      closeUserModal();
      if (window.innerWidth <= 900) closeSidebar();
    }
  });
}

/* =============================================
   SIDEBAR MOBILE TOGGLE
   ============================================= */
function openSidebar() {
  refs.sidebar.classList.add("open");
  refs.sidebarOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  refs.sidebar.classList.remove("open");
  refs.sidebarOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

/* =============================================
   NAVIGATION
   ============================================= */
function setActiveSection(view) {
  state.activeSection = view;
  refs.sidebarLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.view === view);
  });
  refs.sections.forEach((section) => {
    section.classList.toggle("hidden", section.dataset.section !== view);
  });
  refs.globalSearch.value = "";
  if (view === "games") {
    refs.globalSearch.placeholder = "Search games...";
  } else if (view === "users") {
    refs.globalSearch.placeholder = "Search users...";
  } else {
    refs.globalSearch.placeholder = "Search games, users, actions...";
  }
  render();
}

/* =============================================
   RENDER
   ============================================= */
function render() {
  renderOverview();
  renderGamesSection();
  renderUsersSection();
}

function renderOverview() {
  refs.totalUsers.textContent  = state.users.length;
  refs.totalGames.textContent  = state.games.length;
  refs.activeUsers.textContent = state.users.filter((u) => u.status === "active").length;
  refs.totalRevenue.textContent = `$${state.games.reduce((sum, g) => sum + g.price * 12, 0).toFixed(0)}k`;
  refs.activityList.innerHTML  = getActivityEvents().map(createActivityItem).join("");
}

function getActivityEvents() {
  const latestGame = state.games[state.games.length - 1];
  return [
    {
      title:    latestGame ? `Added new game: ${latestGame.title}` : "Dashboard initialized",
      subtitle: "Game catalog updated",
      time:     "2 min ago",
    },
    { title: "3 users signed in",         subtitle: "Authentication activity",          time: "14 min ago" },
    { title: "Game availability updated", subtitle: "Status changed in game catalog",   time: "35 min ago" },
  ];
}

function createActivityItem({ title, subtitle, time }) {
  return `
    <div class="activity-item">
      <div>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <span>${escapeHtml(time)}</span>
    </div>`;
}

/* =============================================
   GAMES SECTION
   ============================================= */
function renderGamesSection() {
  if (state.activeSection !== "games") return;

  const filtered = state.games.filter((game) => {
    const matchSearch = [game.title, game.category].some((v) =>
      v.toLowerCase().includes(state.gamesSearch)
    );
    const matchFilter = state.gamesFilter === "all" || game.status === state.gamesFilter;
    return matchSearch && matchFilter;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.gamesPageSize));
  state.gamesPage  = Math.min(state.gamesPage, totalPages);
  const start      = (state.gamesPage - 1) * state.gamesPageSize;
  const pageItems  = filtered.slice(start, start + state.gamesPageSize);

  refs.gamesTableBody.innerHTML = pageItems.length
    ? pageItems.map(createGameRow).join("")
    : `<tr><td colspan="5" class="empty-row">No games match your search.</td></tr>`;

  refs.gamesCount.textContent           = `${filtered.length} game${filtered.length === 1 ? "" : "s"}`;
  refs.gamesPaginationInfo.textContent  = `Page ${state.gamesPage} of ${totalPages}`;
  refs.gamesPagination.innerHTML        = createPaginationButtons(totalPages);

  refs.gamesPagination.querySelectorAll(".pagination-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.gamesPage = Number(btn.dataset.page);
      renderGamesSection();
    });
  });

  refs.gamesTableBody.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", handleGameAction);
  });
}

function createGameRow(game) {
  return `
    <tr>
      <td>${escapeHtml(game.title)}</td>
      <td>${escapeHtml(game.category)}</td>
      <td>$${game.price.toFixed(2)}</td>
      <td><span class="badge-pill ${game.status}">${game.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary" data-action="edit"   data-id="${game.id}" title="Edit"><i class="fas fa-pen"></i></button>
          <button class="btn btn-danger"    data-action="delete" data-id="${game.id}" title="Delete"><i class="fas fa-trash"></i></button>
          <button class="btn btn-primary"   data-action="toggle" data-id="${game.id}" title="Toggle status"><i class="fas fa-exchange-alt"></i></button>
        </div>
      </td>
    </tr>`;
}

function createPaginationButtons(totalPages) {
  let out = "";
  for (let p = 1; p <= totalPages; p++) {
    out += `<button class="pagination-button ${p === state.gamesPage ? "active" : ""}" data-page="${p}">${p}</button>`;
  }
  return out;
}

function handleGameAction(e) {
  const btn    = e.currentTarget;
  const action = btn.dataset.action;
  const id     = Number(btn.dataset.id);
  const idx    = state.games.findIndex((g) => g.id === id);
  if (idx === -1) return;

  if (action === "edit")   { openGameModal("edit", id); return; }
  if (action === "delete") {
    state.games.splice(idx, 1);
    showToast("Game removed successfully.");
    renderGamesSection();
    renderOverview();
    return;
  }
  if (action === "toggle") {
    state.games[idx].status = state.games[idx].status === "available" ? "unavailable" : "available";
    showToast(`Game is now ${state.games[idx].status}.`);
    renderGamesSection();
    renderOverview();
  }
}

/* =============================================
   USERS SECTION
   ============================================= */
function renderUsersSection() {
  if (state.activeSection !== "users") return;

  const filtered = state.users.filter((user) => {
    const matchSearch = [user.name, user.email, user.role].some((v) =>
      v.toLowerCase().includes(state.usersSearch)
    );
    const matchFilter = state.usersFilter === "all" || user.role === state.usersFilter;
    return matchSearch && matchFilter;
  });

  refs.usersTableBody.innerHTML = filtered.length
    ? filtered.map(createUserRow).join("")
    : `<tr><td colspan="5" class="empty-row">No users match your search.</td></tr>`;

  refs.usersCount.textContent = `${filtered.length} user${filtered.length === 1 ? "" : "s"}`;

  refs.usersTableBody.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", handleUserAction);
  });
}

function createUserRow(user) {
  const statusClass = user.status === "active" ? "available" : "unavailable";
  return `
    <tr>
      <td>${escapeHtml(user.name)}</td>
      <td>${escapeHtml(user.email)}</td>
      <td>${escapeHtml(user.role)}</td>
      <td><span class="badge-pill ${statusClass}">${user.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-secondary" data-action="edit"   data-id="${user.id}" title="Edit user"><i class="fas fa-pen"></i></button>
          <button class="btn btn-danger"    data-action="delete" data-id="${user.id}" title="Delete user"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
}

function handleUserAction(e) {
  const btn    = e.currentTarget;
  const action = btn.dataset.action;
  const id     = Number(btn.dataset.id);
  if (!action || !id) return;

  if (action === "edit")   { openUserModal("edit", id); return; }
  if (action === "delete") { deleteUser(id); }
}

function deleteUser(id) {
  const idx = state.users.findIndex((u) => u.id === id);
  if (idx === -1) return;
  state.users.splice(idx, 1);
  showToast("User deleted.");
  renderUsersSection();
  renderOverview();
}

/* =============================================
   GAME MODAL
   ============================================= */
function openGameModal(mode, gameId = null) {
  state.editingGameId = mode === "edit" ? gameId : null;
  refs.modalTitle.textContent   = mode === "edit" ? "Edit game"    : "Add new game";
  refs.modalSaveBtn.textContent = mode === "edit" ? "Update game"  : "Save game";

  if (mode === "edit") {
    const game = state.games.find((g) => g.id === gameId);
    if (!game) return;
    refs.modalGameTitle.value    = game.title;
    refs.modalGameCategory.value = game.category;
    refs.modalGamePrice.value    = game.price.toFixed(2);
    refs.modalGameStatus.value   = game.status;
  } else {
    refs.gameModalForm.reset();
  }

  refs.gameModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGameModal() {
  refs.gameModal.classList.add("hidden");
  document.body.style.overflow = "";
  state.editingGameId = null;
  refs.gameModalForm.reset();
  refs.gameModalForm.querySelectorAll(".field-error").forEach((el) => el.remove());
  refs.gameModalForm.querySelectorAll("input, select").forEach((el) => {
    el.style.borderColor = "";
  });
}

function saveModalGame(e) {
  e.preventDefault();
  const title    = refs.modalGameTitle.value.trim();
  const category = refs.modalGameCategory.value.trim();
  const price    = Number(refs.modalGamePrice.value);
  const status   = refs.modalGameStatus.value;

  refs.gameModalForm.querySelectorAll(".field-error").forEach((el) => el.remove());
  let isValid = true;

  function showFieldError(inputEl, message) {
    const err = document.createElement("span");
    err.className = "field-error";
    err.style.cssText = "color:#ff6b7d;font-size:0.78rem;display:block;margin-top:4px;";
    err.textContent = message;
    inputEl.closest("label").appendChild(err);
    inputEl.style.borderColor = "#ff6b7d";
    isValid = false;
  }

  if (!title)    showFieldError(refs.modalGameTitle,    "Game title is required.");
  else           refs.modalGameTitle.style.borderColor = "";
  if (!category) showFieldError(refs.modalGameCategory, "Category is required.");
  else           refs.modalGameCategory.style.borderColor = "";
  if (!refs.modalGamePrice.value || isNaN(price) || price < 0)
    showFieldError(refs.modalGamePrice, "Enter a valid price (0 or more).");
  else refs.modalGamePrice.style.borderColor = "";

  if (!isValid) return;

  if (state.editingGameId !== null) {
    const game = state.games.find((g) => g.id === state.editingGameId);
    if (!game) return;
    Object.assign(game, { title, category, price, status });
    showToast("Game updated successfully.");
  } else {
    const nextId = state.games.reduce((max, g) => Math.max(max, g.id), 0) + 1;
    state.games.unshift({ id: nextId, title, category, price, status });
    showToast("Game added successfully.");
  }

  closeGameModal();
  renderGamesSection();
  renderOverview();
}

/* =============================================
   USER MODAL
   ============================================= */
function openUserModal(mode, userId = null) {
  state.editingUserId = mode === "edit" ? userId : null;
  refs.userModalTitle.textContent   = mode === "edit" ? "Edit user"   : "Add new user";
  refs.userModalSaveBtn.textContent = mode === "edit" ? "Update user" : "Save user";

  if (mode === "edit") {
    const user = state.users.find((u) => u.id === userId);
    if (!user) return;
    refs.modalUserName.value   = user.name;
    refs.modalUserEmail.value  = user.email;
    refs.modalUserRole.value   = user.role;
    refs.modalUserStatus.value = user.status;
  } else {
    refs.userModalForm.reset();
  }

  refs.userModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeUserModal() {
  refs.userModal.classList.add("hidden");
  document.body.style.overflow = "";
  state.editingUserId = null;
  refs.userModalForm.reset();
  refs.userModalForm.querySelectorAll(".field-error").forEach((el) => el.remove());
  refs.userModalForm.querySelectorAll("input, select").forEach((el) => {
    el.style.borderColor = "";
  });
}

function saveModalUser(e) {
  e.preventDefault();
  const name   = refs.modalUserName.value.trim();
  const email  = refs.modalUserEmail.value.trim();
  const role   = refs.modalUserRole.value;
  const status = refs.modalUserStatus.value;

  refs.userModalForm.querySelectorAll(".field-error").forEach((el) => el.remove());
  let isValid = true;

  function showFieldError(inputEl, message) {
    const err = document.createElement("span");
    err.className = "field-error";
    err.style.cssText = "color:#ff6b7d;font-size:0.78rem;display:block;margin-top:4px;";
    err.textContent = message;
    inputEl.closest("label").appendChild(err);
    inputEl.style.borderColor = "#ff6b7d";
    isValid = false;
  }

  if (!name)  showFieldError(refs.modalUserName,  "Name is required.");
  else        refs.modalUserName.style.borderColor = "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    showFieldError(refs.modalUserEmail, "Enter a valid email address.");
  else refs.modalUserEmail.style.borderColor = "";

  if (!isValid) return;

  if (state.editingUserId !== null) {
    const user = state.users.find((u) => u.id === state.editingUserId);
    if (!user) return;
    Object.assign(user, { name, email, role, status });
    showToast("User updated successfully.");
  } else {
    const nextId = state.users.reduce((max, u) => Math.max(max, u.id), 0) + 1;
    state.users.unshift({ id: nextId, name, email, role, status });
    showToast("User added successfully.");
  }

  closeUserModal();
  renderUsersSection();
  renderOverview();
}

/* =============================================
   TOAST
   ============================================= */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className  = "toast";
  toast.textContent = message;
  refs.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity   = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

/* =============================================
   UTILS
   ============================================= */
function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

init();
