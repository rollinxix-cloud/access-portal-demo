"use strict";

// 1. FIXED USER REGISTRATION VALIDATION CREDENTIALS
const ADMIN_CREDENTIALS = {
  username: "adminjon",
  password: "JonAdmin123"
};

// 2. COMPREHENSIVE TOURNAMENT WINNERS HISTORICAL DATABASE
const HISTORICAL_DATA_STORE = {
  elite_league: {
    title: "ELITE LEAGUE HALL OF FAME",
    description: "Historical tracking for top-tier premier league campaigns. AC Milan (Prateek) holds the record for most titles.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 5", winner: "AC Milan (Prateek)" },
      { season: "Season 4", winner: "The Destroyer (Kiran)" },
      { season: "Season 3", winner: "AC Milan (Prateek)" },
      { season: "Season 2", winner: "AC Milan (Prateek)" },
      { season: "Season 1", winner: "AC Milan (Prateek)" }
    ]
  },
  elite_division: {
    title: "ELITE DIVISION LEAGUE RECORDS",
    description: "Divisional developmental tiers and qualification tournament histories.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 5", winner: "PesNepal•Leo (Subash)" },
      { season: "Season 4", winner: "Pasa FC (Manjil)" },
      { season: "Season 3", winner: "Meher Sharma" },
      { season: "Season 2", winner: "Sagar" },
      { season: "Season 1", winner: "Bhaktapur Futsal" }
    ]
  },
  pes_camp: {
    title: "PES LEAGUE CAMP RECORDS",
    description: "Official chronicles and placement rankings for the PES League training grounds.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 5", winner: "Blue Lock XI (Ashman)" },
      { season: "Season 4", winner: "AC Milan (Prateek)" },
      { season: "Season 3", winner: "Brazil (Sagar)" },
      { season: "Season 2", winner: "AC Milan (Prateek)" },
      { season: "Season 1", winner: "FC Legends" }
    ]
  },
  ultimate_player: {
    title: "ULTIMATE PLAYER BRACKET RECORDS",
    description: "Knockout classification records tracking the absolute peak bracket challengers.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 11", winner: "PesNepal-Naughty08 (Manees)" },
      { season: "Season 10", winner: "Avengers SCO (Sagar)" },
      { season: "Season 9", winner: "LYTHX_11 (Manjil)" },
      { season: "Season 8", winner: "Cold Palmer (Hrijwan)" },
      { season: "Season 7", winner: "Cold Palmer (Hrijwan)" },
      { season: "Season 6", winner: "AC Milan (Prateek)" },
      { season: "Season 5", winner: "The Destroyer (Kiran)" },
      { season: "Season 4", winner: "Blue Lock XI (Ashman)" },
      { season: "Season 3", winner: "Black Hornet (Dipendra)" },
      { season: "Season 2", winner: "Black Hornet (Dipendra)" },
      { season: "Season 1", winner: "Black Hornet (Dipendra)" }
    ]
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

// 4. CLICKABLE DYNAMIC DISPLAY ROUTER STRATEGY (TABLE BASED)
window.showHistory = function(categoryKey) {
  const targetCategory = HISTORICAL_DATA_STORE[categoryKey];
  if (!targetCategory) return;

  elements.dynamicDisplay.innerHTML = "";

  const layoutContainer = document.createElement("div");
  layoutContainer.className = "history-card";

  // Formulate semantic HTML table rows safely
  let tableRowsHtml = "";
  
  targetCategory.records.forEach(row => {
    // Styling highlights for multi-time legendary champions
    let cellStyle = "";
    if (row.winner.includes("Prateek") || row.winner.includes("Dipendra")) {
      cellStyle = 'style="color: var(--gold); font-weight: 600;"';
    }

    tableRowsHtml += `
      <tr>
        <td style="width: 30%; font-weight: 500; color: var(--accent);">${escapeHtml(row.season)}</td>
        <td ${cellStyle}>${escapeHtml(row.winner)}</td>
      </tr>
    `;
  });

  layoutContainer.innerHTML = `
    <h3>${targetCategory.title}</h3>
    <p class="subtitle" style="margin-bottom: 1.5rem;">${targetCategory.description}</p>
    <div class="table-responsive">
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid var(--border-color);">
            <th style="padding: 0.75rem 0.5rem; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">${targetCategory.headers[0]}</th>
            <th style="padding: 0.75rem 0.5rem; font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase;">${targetCategory.headers[1]}</th>
          </tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>
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
    elements.dynamicDisplay.innerHTML = `
      <h3>Select a category to view history records</h3>
      <p class="subtitle">Click any tournament tier on the left to pull historical server statistics.</p>
    `;
  });
});

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", verifyActiveSession);