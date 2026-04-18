const state = {
  games: [
    {
      id: 1,
      title: "Solar Rift",
      category: "Action",
      price: 49.99,
      status: "available",
    },
    {
      id: 2,
      title: "Cyber Run",
      category: "Racing",
      price: 39.99,
      status: "available",
    },
    {
      id: 3,
      title: "Echoes of Eden",
      category: "RPG",
      price: 59.99,
      status: "unavailable",
    },
    {
      id: 4,
      title: "Neon Spires",
      category: "Adventure",
      price: 34.99,
      status: "available",
    },
    {
      id: 5,
      title: "Phantom Galaxy",
      category: "Sci-Fi",
      price: 54.99,
      status: "available",
    },
  ],
  users: [
    {
      id: 1,
      name: "Amina Hassan",
      email: "amina@gmail.com",
      role: "admin",
      status: "active",
    },
    {
      id: 2,
      name: "Omar Samir",
      email: "omar@gmail.com",
      role: "member",
      status: "active",
    },
    {
      id: 3,
      name: "Yasmine Adel",
      email: "yasmine@gmail.com",
      role: "member",
      status: "inactive",
    },
    {
      id: 4,
      name: "Khaled Nasser",
      email: "khaled@gmail.com",
      role: "member",
      status: "active",
    },
    {
      id: 5,
      name: "Lina Farouk",
      email: "lina@gmail.com",
      role: "member",
      status: "inactive",
    },
  ],
  activeSection: "overview",
  gamesPage: 1,
  gamesPageSize: 5,
  gamesSearch: "",
  gamesFilter: "all",
  usersSearch: "",
  usersFilter: "all",
  editingGameId: null,
};

const refs = {
  sidebarLinks: document.querySelectorAll(".sidebar-link"),
  sections: document.querySelectorAll(".dashboard-section"),
  globalSearch: document.getElementById("globalSearch"),
  refreshStatsBtn: document.getElementById("refreshStatsBtn"),
  openGameModalBtn: document.getElementById("openGameModalBtn"),
  gamesSearch: document.getElementById("gamesSearch"),
  gamesFilter: document.getElementById("gamesFilter"),
  usersSearch: document.getElementById("usersSearch"),
  usersFilter: document.getElementById("usersFilter"),
  newUserBtn: document.getElementById("newUserBtn"),
  gamesTableBody: document.getElementById("gamesTableBody"),
  gamesCount: document.getElementById("gamesCount"),
  gamesPagination: document.getElementById("gamesPagination"),
  gamesPaginationInfo: document.getElementById("gamesPaginationInfo"),
  usersTableBody: document.getElementById("usersTableBody"),
  usersCount: document.getElementById("usersCount"),
  totalUsers: document.getElementById("totalUsers"),
  totalGames: document.getElementById("totalGames"),
  activeUsers: document.getElementById("activeUsers"),
  totalRevenue: document.getElementById("totalRevenue"),
  activityList: document.getElementById("activityList"),
  modal: document.getElementById("gameModal"),
  modalForm: document.getElementById("gameModalForm"),
  modalTitle: document.getElementById("modalTitle"),
  modalGameTitle: document.getElementById("modalGameTitle"),
  modalGameCategory: document.getElementById("modalGameCategory"),
  modalGamePrice: document.getElementById("modalGamePrice"),
  modalGameStatus: document.getElementById("modalGameStatus"),
  modalSaveBtn: document.getElementById("modalSaveBtn"),
  modalCancelBtn: document.getElementById("modalCancelBtn"),
  closeModalBtn: document.getElementById("closeModalBtn"),
  toastContainer: document.getElementById("toastContainer"),
};

function init() {
  attachEvents();
  render();
}

function attachEvents() {
  refs.sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActiveSection(link.dataset.view);
    });
  });

  refs.globalSearch.addEventListener("input", (event) => {
    const value = event.target.value.trim().toLowerCase();
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
  refs.gamesSearch.addEventListener("input", (event) => {
    state.gamesSearch = event.target.value.trim().toLowerCase();
    state.gamesPage = 1;
    refs.globalSearch.value = state.gamesSearch;
    renderGamesSection();
  });

  refs.gamesFilter.addEventListener("change", (event) => {
    state.gamesFilter = event.target.value;
    state.gamesPage = 1;
    renderGamesSection();
  });

  refs.usersSearch.addEventListener("input", (event) => {
    state.usersSearch = event.target.value.trim().toLowerCase();
    refs.globalSearch.value = state.usersSearch;
    renderUsersSection();
  });

  refs.usersFilter.addEventListener("change", (event) => {
    state.usersFilter = event.target.value;
    renderUsersSection();
  });

  refs.newUserBtn.addEventListener("click", () => createUser());

  refs.modalForm.addEventListener("submit", saveModalGame);
  refs.modalCancelBtn.addEventListener("click", closeGameModal);
  refs.closeModalBtn.addEventListener("click", closeGameModal);
  refs.modal.addEventListener("click", (event) => {
    if (event.target === refs.modal) closeGameModal();
  });
}

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
    refs.globalSearch.focus();
  } else if (view === "users") {
    refs.globalSearch.placeholder = "Search users...";
    refs.globalSearch.focus();
  } else {
    refs.globalSearch.placeholder = "Search games, users, actions...";
  }
  render();
}

function render() {
  renderOverview();
  renderGamesSection();
  renderUsersSection();
}

function renderOverview() {
  refs.totalUsers.textContent = state.users.length;
  refs.totalGames.textContent = state.games.length;
  refs.activeUsers.textContent = state.users.filter(
    (user) => user.status === "active",
  ).length;
  refs.totalRevenue.textContent = `$${state.games.reduce((sum, game) => sum + game.price * 12, 0).toFixed(0)}k`;
  refs.activityList.innerHTML = getActivityEvents()
    .map((event) => createActivityItem(event))
    .join("");
}

function getActivityEvents() {
  const latestGame = state.games[state.games.length - 1];
  return [
    {
      title: latestGame
        ? `Added new game ${latestGame.title}`
        : "Dashboard initialized",
      subtitle: "Game catalog updated",
      time: "2 min ago",
    },
    {
      title: "3 users signed in",
      subtitle: "Authentication activity",
      time: "14 min ago",
    },
    {
      title: "Game availability updated",
      subtitle: "Status changed in game catalog",
      time: "35 min ago",
    },
  ];
}

function createActivityItem(event) {
  return `
    <div class="activity-item">
      <div>
        <strong>${event.title}</strong>
        <p>${event.subtitle}</p>
      </div>
      <span>${event.time}</span>
    </div>
  `;
}

function renderGamesSection() {
  if (state.activeSection !== "games") return;
  const filteredGames = state.games.filter((game) => {
    const matchesSearch = [game.title, game.category].some((value) =>
      value.toLowerCase().includes(state.gamesSearch),
    );
    const matchesFilter =
      state.gamesFilter === "all" || game.status === state.gamesFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredGames.length / state.gamesPageSize),
  );
  state.gamesPage = Math.min(state.gamesPage, totalPages);
  const start = (state.gamesPage - 1) * state.gamesPageSize;
  const pageItems = filteredGames.slice(start, start + state.gamesPageSize);

  refs.gamesTableBody.innerHTML = pageItems.length
    ? pageItems.map((game) => createGameRow(game)).join("")
    : `<tr><td colspan="5" class="empty-row">No games match your search.</td></tr>`;

  refs.gamesCount.textContent = `${filteredGames.length} game${filteredGames.length === 1 ? "" : "s"}`;
  refs.gamesPaginationInfo.textContent = `Page ${state.gamesPage} of ${totalPages}`;
  refs.gamesPagination.innerHTML = createPaginationButtons(totalPages);
  refs.gamesPagination
    .querySelectorAll(".pagination-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        state.gamesPage = Number(button.dataset.page);
        renderGamesSection();
      });
    });

  refs.gamesTableBody.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", handleGameAction);
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
          <button class="btn btn-secondary" data-action="edit" data-id="${game.id}" title="Edit">
            <i class="fas fa-pen"></i>
          </button>
          <button class="btn btn-danger" data-action="delete" data-id="${game.id}" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
          <button class="btn btn-primary" data-action="toggle" data-id="${game.id}" title="Toggle status">
            <i class="fas fa-exchange-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
}

function createPaginationButtons(totalPages) {
  let buttons = "";
  for (let page = 1; page <= totalPages; page += 1) {
    buttons += `<button class="pagination-button ${page === state.gamesPage ? "active" : ""}" data-page="${page}">${page}</button>`;
  }
  return buttons;
}

function handleGameAction(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  const index = state.games.findIndex((item) => item.id === id);
  if (index === -1) return;

  if (action === "edit") {
    openGameModal("edit", id);
    return;
  }

  if (action === "delete") {
    state.games.splice(index, 1);
    showToast("Game removed successfully.");
    renderGamesSection();
    renderOverview();
    return;
  }

  if (action === "toggle") {
    state.games[index].status =
      state.games[index].status === "available" ? "unavailable" : "available";
    showToast(`Game is now ${state.games[index].status}.`);
    renderGamesSection();
    renderOverview();
  }
}

function renderUsersSection() {
  if (state.activeSection !== "users") return;

  const filteredUsers = state.users.filter((user) => {
    const matchesSearch = [user.name, user.email, user.role].some((value) =>
      value.toLowerCase().includes(state.usersSearch),
    );
    const matchesFilter =
      state.usersFilter === "all" || user.role === state.usersFilter;
    return matchesSearch && matchesFilter;
  });

  refs.usersTableBody.innerHTML = filteredUsers.length
    ? filteredUsers
        .map(
          (user) => `
            <tr>
              <td>${escapeHtml(user.name)}</td>
              <td>${escapeHtml(user.email)}</td>
              <td>${escapeHtml(user.role)}</td>
              <td><span class="badge-pill ${user.status === "active" ? "available" : "unavailable"}">${user.status}</span></td>
              <td>
                <div class="action-buttons">
                  <button class="btn btn-secondary" data-action="edit" data-id="${user.id}" title="Edit user">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button class="btn btn-danger" data-action="delete" data-id="${user.id}" title="Delete user">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          `,
        )
        .join("")
    : `<tr><td colspan="5" class="empty-row">No users match your search.</td></tr>`;

  refs.usersCount.textContent = `${filteredUsers.length} user${filteredUsers.length === 1 ? "" : "s"}`;

  refs.usersTableBody.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", handleUserAction);
  });
}

function handleUserAction(event) {
  const button = event.currentTarget;
  const action = button.dataset.action;
  const id = Number(button.dataset.id);
  if (!action || !id) return;

  if (action === "edit") {
    editUser(id);
    return;
  }

  if (action === "delete") {
    deleteUser(id);
    return;
  }
}

function promptUserDetails(existingUser = {}) {
  const name = window.prompt("User name:", existingUser.name || "");
  if (name === null) return null;
  const email = window.prompt("User email:", existingUser.email || "");
  if (email === null) return null;
  const role = window.prompt(
    "Role (admin/member):",
    existingUser.role || "member",
  );
  if (role === null) return null;
  const status = window.prompt(
    "Status (active/inactive):",
    existingUser.status || "active",
  );
  if (status === null) return null;

  const trimmedRole = role.trim().toLowerCase();
  const trimmedStatus = status.trim().toLowerCase();
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  if (
    !trimmedName ||
    !trimmedEmail ||
    !["admin", "member"].includes(trimmedRole) ||
    !["active", "inactive"].includes(trimmedStatus)
  ) {
    showToast("Invalid user data. Use admin/member and active/inactive.");
    return null;
  }

  return {
    name: trimmedName,
    email: trimmedEmail,
    role: trimmedRole,
    status: trimmedStatus,
  };
}

function createUser() {
  const userData = promptUserDetails();
  if (!userData) return;

  const nextId =
    state.users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
  state.users.unshift({ id: nextId, ...userData });
  showToast("User added successfully.");
  renderUsersSection();
  renderOverview();
}

function editUser(id) {
  const user = state.users.find((item) => item.id === id);
  if (!user) return;
  const userData = promptUserDetails(user);
  if (!userData) return;

  Object.assign(user, userData);
  showToast("User updated successfully.");
  renderUsersSection();
  renderOverview();
}

function deleteUser(id) {
  const confirmed = window.confirm("Delete this user permanently?");
  if (!confirmed) return;

  const index = state.users.findIndex((item) => item.id === id);
  if (index === -1) return;

  state.users.splice(index, 1);
  showToast("User deleted.");
  renderUsersSection();
  renderOverview();
}

function openGameModal(mode, gameId = null) {
  state.editingGameId = mode === "edit" ? gameId : null;
  refs.modalTitle.textContent = mode === "edit" ? "Edit game" : "Add new game";
  refs.modalSaveBtn.textContent = mode === "edit" ? "Update game" : "Save game";

  if (mode === "edit") {
    const game = state.games.find((item) => item.id === gameId);
    if (!game) return;
    refs.modalGameTitle.value = game.title;
    refs.modalGameCategory.value = game.category;
    refs.modalGamePrice.value = game.price.toFixed(2);
    refs.modalGameStatus.value = game.status;
  } else {
    refs.modalForm.reset();
  }

  refs.modal.classList.remove("hidden");
}

function closeGameModal() {
  refs.modal.classList.add("hidden");
  state.editingGameId = null;
  refs.modalForm.reset();
}

function saveModalGame(event) {
  event.preventDefault();
  const title = refs.modalGameTitle.value.trim();
  const category = refs.modalGameCategory.value.trim();
  const price = Number(refs.modalGamePrice.value);
  const status = refs.modalGameStatus.value;

  if (!title || !category || Number.isNaN(price) || price < 0) {
    showToast("Enter valid values for all fields.");
    return;
  }

  if (state.editingGameId !== null) {
    const game = state.games.find((item) => item.id === state.editingGameId);
    if (!game) return;
    game.title = title;
    game.category = category;
    game.price = price;
    game.status = status;
    showToast("Game updated successfully.");
  } else {
    const nextId =
      state.games.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    state.games.unshift({ id: nextId, title, category, price, status });
    showToast("Game added successfully.");
  }

  closeGameModal();
  renderGamesSection();
  renderOverview();
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  refs.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

init();