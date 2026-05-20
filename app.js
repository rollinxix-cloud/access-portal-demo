"use strict";

// 1. FIXED USER REGISTRATION VALIDATION CREDENTIALS
const ADMIN_CREDENTIALS = {
  username: "adminjon",
  password: "JonAdmin123"
};

// 2. HARDCODED HISTORICAL ARCHIVE DATABASE RECORDS
const HISTORICAL_DATA_STORE = {
  elite_league: {
    title: "ELITE LEAGUE RECORDS",
    description: "Historical timelines and match outcome history tracking profiles for top tier league groups.",
    records: [
      { season: "Season 4 (2026)", details: "Prateek Khadka clinched championship title points clearing runner ups by 6 points." },
      { season: "Season 3 (2025)", details: "Highly contested bracket tiebreaker complete cleanup execution runtime run." }
    ]
  },
  elite_division: {
    title: "ELITE DIVISION LEAGUE RECORDS",
    description: "Divisional developmental tiers qualification tracking parameters history metrics logs.",
    records: [
      { season: "Qualifiers Cycle B", details: "Promotion spots locked down. Transition tables pushed directly to live database states." }
    ]
  },
  pes_camp: {
    title: "PES LEAGUE CAMP CHRONICLES",
    description: "Training grounds analytics history records, special custom event matches tracking statistics arrays.",
    records: [
      { season: "Summer Invitational", details: "Tournament tracking structures successfully closed with complete records intact." }
    ]
  },
  ultimate_player: {
    title: "ULTIMATE PLAYER BRACKET RECORDS",
    description: "Knockout classification records tracking the absolute peak bracket challengers.",
    records: null // Explicitly left null as requested for future runtime profile additions
  }
};

let activeSessionUser = null;

const elements = {
  loginView: document.getElementById("login-view"),
  adminView: document.getElementById("admin-view"),
  loginForm: document.getElementById("login-form"),
  loginUsernameInput: document.getElementById("login-username"),
  loginPasswordInput: document.getElementById("login-password"),
  loginError: document.getElementById("login-error"),
  adminWelcome: document.getElementById("admin-welcome-msg"),
  dynamicDisplay: document.getElementById("dynamic-display-panel"),
  logoutButtons: document.querySelectorAll(".logout-btn")
};

function verifyActiveSession() {
  const preservedToken = sessionStorage.getItem("active_archive_session");
  if (preservedToken) {
    activeSessionUser = JSON.parse(preservedToken);
    showDashboard();
  } else {
    toggleInterfaceView("login");
  }
}

function toggleInterfaceView(targetView) {
  elements.loginView.classList.add("hidden");
  elements.adminView.classList.add("hidden");

  if (targetView === "login") {
    elements.loginView.classList.remove("hidden");
  } else if (targetView === "dashboard") {
    elements.adminView.classList.remove("hidden");
  }
}

function showDashboard() {
  elements.adminWelcome.innerText = `Logged in securely as: ${activeSessionUser.username}`;
  toggleInterfaceView("dashboard");
}

// 3. SECURE AUTHENTICATION PIPELINE INTERCEPTION ENGINE
elements.loginForm.addEventListener("submit", function(e) {
  e.preventDefault();
  elements.loginError.classList.add("hidden");

  const enteredUser = elements.loginUsernameInput.value.trim();
  const enteredPass = elements.loginPasswordInput.value;

  if (enteredUser === ADMIN_CREDENTIALS.username && enteredPass === ADMIN_CREDENTIALS.password) {
    activeSessionUser = { username: enteredUser };
    sessionStorage.setItem("active_archive_session", JSON.stringify(activeSessionUser));
    showDashboard();
    elements.loginForm.reset();
  } else {
    elements.loginError.innerText = "Authentication Failed: Invalid username or security credentials.";
    elements.loginError.classList.remove("hidden");
  }
});

// 4. CLICKABLE DYNAMIC DISPLAY ROUTER STRATEGY
window.showHistory = function(categoryKey) {
  const targetCategory = HISTORICAL_DATA_STORE[categoryKey];
  if (!targetCategory) return;

  elements.dynamicDisplay.innerHTML = "";

  const layoutContainer = document.createElement("div");
  layoutContainer.className = "history-card";

  let specificRecordsContentHtml = "";
  
  if (targetCategory.records === null) {
    // Elegant system placeholder view for unpopulated spaces
    specificRecordsContentHtml = `
      <div class="history-item" style="border-left-color: var(--text-muted);">
        <p style="color: var(--text-muted); font-style: italic;">Records currently unpopulated (Null Reference Stack Protected). Data fields will populate on next iteration cycle update.</p>
      </div>`;
  } else {
    targetCategory.records.forEach(item => {
      specificRecordsContentHtml += `
        <div class="history-item">
          <strong>${item.season}</strong>
          <p style="margin-top: 0.25rem; color: var(--text-muted); font-size: 0.95rem;">${item.details}</p>
        </div>`;
    });
  }

  layoutContainer.innerHTML = `
    <h3>${targetCategory.title}</h3>
    <p class="subtitle" style="margin-bottom: 1rem;">${targetCategory.description}</p>
    <div class="records-container">
      ${specificRecordsContentHtml}
    </div>
  `;

  elements.dynamicDisplay.appendChild(layoutContainer);
};

// 5. SECURITY DISCONNECT EXIT SEQUENCING LAYER
elements.logoutButtons.forEach(button => {
  button.addEventListener("click", function() {
    activeSessionUser = null;
    sessionStorage.removeItem("active_archive_session");
    toggleInterfaceView("login");
    // Restore clean dashboard text states upon structural component unloading
    elements.dynamicDisplay.innerHTML = `
      <h3>Select a category to view history records</h3>
      <p class="subtitle">Click any tournament tier on the left to pull historical server statistics.</p>
    `;
  });
});

document.addEventListener("DOMContentLoaded", verifyActiveSession);