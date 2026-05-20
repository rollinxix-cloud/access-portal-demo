"use strict";

// 1. SYSTEM BASE CONFIGURATION & MOCK STORAGE DATA
const ADMIN_CREDENTIALS = {
  username: "admin@system.local",
  password: "AdminPass123!"
};

// Application Global State Context Manager
let state = {
  currentUser: null,
  staffAccounts: []
};

// DOM Node Selectors Optimization Mapping
const elements = {
  loginView: document.getElementById("login-view"),
  adminView: document.getElementById("admin-view"),
  staffView: document.getElementById("staff-view"),
  loginForm: document.getElementById("login-form"),
  provisionForm: document.getElementById("provision-form"),
  loginUsernameInput: document.getElementById("login-username"),
  loginPasswordInput: document.getElementById("login-password"),
  loginError: document.getElementById("login-error"),
  provisionUsernameInput: document.getElementById("staff-username"),
  provisionPasswordInput: document.getElementById("staff-password"),
  provisionError: document.getElementById("provision-error"),
  provisionSuccess: document.getElementById("provision-success"),
  staffTableBody: document.getElementById("staff-table-body"),
  adminWelcome: document.getElementById("admin-welcome-msg"),
  staffWelcome: document.getElementById("staff-welcome-msg"),
  logoutButtons: document.querySelectorAll(".logout-btn")
};

// 2. STATE SYNCHRONIZATION RUNTIME HOOKS
function initializeSystemData() {
  const localStore = localStorage.getItem("system_staff_accounts");
  if (localStore) {
    state.staffAccounts = JSON.parse(localStore);
  } else {
    // Generate initial baseline setup directory
    state.staffAccounts = [
      { id: "1", username: "staff_alpha", password: "StaffPassword1!", status: "Active" },
      { id: "2", username: "staff_beta", password: "StaffPassword2!", status: "Revoked" }
    ];
    persistStaffAccounts();
  }
  
  // Rehydrate existing runtime session token instances if available
  const activeSession = sessionStorage.getItem("active_session");
  if (activeSession) {
    state.currentUser = JSON.parse(activeSession);
    routeToDashboard(state.currentUser.role);
  } else {
    renderView("login");
  }
}

function persistStaffAccounts() {
  localStorage.setItem("system_staff_accounts", JSON.stringify(state.staffAccounts));
}

// 3. SECURE INTERACTION ROUTER VIEW-SWITCHER
function renderView(viewName) {
  elements.loginView.classList.add("hidden");
  elements.adminView.classList.add("hidden");
  elements.staffView.classList.add("hidden");

  if (viewName === "login") {
    elements.loginView.classList.remove("hidden");
  } else if (viewName === "Admin") {
    elements.adminView.classList.remove("hidden");
    renderStaffDirectory();
  } else if (viewName === "Staff") {
    elements.staffView.classList.remove("hidden");
  }
}

function routeToDashboard(role) {
  if (role === "Admin") {
    elements.adminWelcome.innerText = `Logged in securely as: ${state.currentUser.username}`;
    renderView("Admin");
  } else if (role === "Staff") {
    elements.staffWelcome.innerText = `Operator Session: ${state.currentUser.username}`;
    renderView("Staff");
  }
}

// 4. AUTHENTICATION CONTROLLER RUNTIME PIPELINE
elements.loginForm.addEventListener("submit", function(event) {
  event.preventDefault();
  elements.loginError.classList.add("hidden");
  elements.loginError.innerText = "";

  const inputUser = elements.loginUsernameInput.value.trim();
  const inputPass = elements.loginPasswordInput.value;

  // Evaluate Root Administrative Level Authority Chain
  if (inputUser === ADMIN_CREDENTIALS.username && inputPass === ADMIN_CREDENTIALS.password) {
    state.currentUser = { username: inputUser, role: "Admin" };
    sessionStorage.setItem("active_session", JSON.stringify(state.currentUser));
    routeToDashboard("Admin");
    elements.loginForm.reset();
    return;
  }

  // Evaluate Staff Account Execution Chain Strategy
  const foundStaff = state.staffAccounts.find(account => account.username === inputUser);
  
  if (foundStaff) {
    if (foundStaff.password === inputPass) {
      if (foundStaff.status === "Revoked") {
        elements.loginError.innerText = "Authentication Failed: This staff account access privileges have been revoked.";
        elements.loginError.classList.remove("hidden");
        return;
      }
      
      state.currentUser = { username: foundStaff.username, role: "Staff" };
      sessionStorage.setItem("active_session", JSON.stringify(state.currentUser));
      routeToDashboard("Staff");
      elements.loginForm.reset();
      return;
    }
  }

  // Generic global fallback protection statement preventing user scanning
  elements.loginError.innerText = "Authentication Failed: Invalid username or security credentials.";
  elements.loginError.classList.remove("hidden");
});

// 5. ACCOUNT PROVISIONING & REVOCATION SUB-SYSTEM CONTROLLER
elements.provisionForm.addEventListener("submit", function(event) {
  event.preventDefault();
  elements.provisionError.classList.add("hidden");
  elements.provisionSuccess.classList.add("hidden");

  const newUsername = elements.provisionUsernameInput.value.trim();
  const newPassword = elements.provisionPasswordInput.value;

  // Prevent collision duplicates with Admin profile space definitions
  if (newUsername.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
    elements.provisionError.innerText = "Error: System structural namespace collision with Admin account designation.";
    elements.provisionError.classList.remove("hidden");
    return;
  }

  // Confirm standard directory schema constraint logic uniqueness metrics
  const identityExists = state.staffAccounts.some(account => account.username.toLowerCase() === newUsername.toLowerCase());
  if (identityExists) {
    elements.provisionError.innerText = "Error: A database resource with that username configuration already exists.";
    elements.provisionError.classList.remove("hidden");
    return;
  }

  // Provision item registration payload execution
  const newAccount = {
    id: Date.now().toString(),
    username: newUsername,
    password: newPassword,
    status: "Active"
  };

  state.staffAccounts.push(newAccount);
  persistStaffAccounts();
  renderStaffDirectory();
  
  elements.provisionSuccess.classList.remove("hidden");
  elements.provisionForm.reset();
});

function toggleStaffStatus(id) {
  state.staffAccounts = state.staffAccounts.map(account => {
    if (account.id === id) {
      const updatedStatus = account.status === "Active" ? "Revoked" : "Active";
      return { ...account, status: updatedStatus };
    }
    return account;
  });

  persistStaffAccounts();
  renderStaffDirectory();

  // Enforce session eviction check if updated profile configuration maps to live operator data state
  if (state.currentUser && state.currentUser.role === "Staff") {
    const updatedRecord = state.staffAccounts.find(acc => acc.id === id);
    if (updatedRecord && updatedRecord.username === state.currentUser.username && updatedRecord.status === "Revoked") {
      executeTerminationSequence();
    }
  }
}

function renderStaffDirectory() {
  elements.staffTableBody.innerHTML = "";

  if (state.staffAccounts.length === 0) {
    elements.staffTableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No managed staff accounts configured in data directory.</td></tr>`;
    return;
  }

  state.staffAccounts.forEach(account => {
    const tableRow = document.createElement("tr");

    const badgeClass = account.status === "Active" ? "badge-active" : "badge-revoked";
    const actionButtonText = account.status === "Active" ? "Revoke Access" : "Grant Access";
    const actionButtonClass = account.status === "Active" ? "btn-toggle-active" : "btn-toggle-revoked";

    tableRow.innerHTML = `
      <td><strong>${escapeHtml(account.username)}</strong></td>
      <td><span class="text-muted">Staff Operator</span></td>
      <td><span class="badge ${badgeClass}">${account.status}</span></td>
      <td>
        <button class="btn btn-sm ${actionButtonClass}" data-id="${account.id}">${actionButtonText}</button>
      </td>
    `;

    // Operational event interception framework attachment
    tableRow.querySelector("button").addEventListener("click", function() {
      toggleStaffStatus(account.id);
    });

    elements.staffTableBody.appendChild(tableRow);
  });
}

// 6. TERMINATION PROTOCOL LAYER (LOGOUT)
elements.logoutButtons.forEach(btn => {
  btn.addEventListener("click", executeTerminationSequence);
});

function executeTerminationSequence() {
  state.currentUser = null;
  sessionStorage.removeItem("active_session");
  renderView("login");
}

// XSS Mitigation Strategy sanitization layer
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Initialize Application Engine Execution Scope Context
document.addEventListener("DOMContentLoaded", initializeSystemData);