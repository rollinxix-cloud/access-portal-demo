"use strict";

// Admin Authentication Setup
const ADMIN_CREDENTIALS = {
  username: "adminjon",
  password: "JonAdmin123"
};

// Tournament History Records Data Store
const HISTORICAL_DATA_STORE = {
  elite_league: {
    title: "ELITE LEAGUE HALL OF FAME",
    description: "Historical tracking for top-tier premier league campaigns. AC Milan (Prateek) holds the record for most titles.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 7", winner: "PNE.Bomjan23 ( Subash )" },
      { season: "Season 6", winner: "Lythx_11 (Manjil)" },
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
      { season: "Season 8", winner: "PNE.Bomjan23 (Subash)" },
      { season: "Season 7", winner: "LYTHX_ 11 (Manjil)" },
      { season: "Season 6", winner: "PNE_SLAYERx7 ( Prabesh )" },
      { season: "Season 5", winner: "PesNepal•Leo (Subash)" },
      { season: "Season 4", winner: "LYTHX_ 11 (Manjil)" },
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
      { season: "Season 7", winner: "PNE.Bomjan23 (Subash)" },
      { season: "Season 6", winner: "PNE_SIV (Siv)" },
      { season: "Season 5", winner: "Blue Lock XI (Ashman)" },
      { season: "Season 4", winner: "AC Milan (Prateek)" },
      { season: "Season 3", winner: "Brazil (Sagar)" },
      { season: "Season 2", winner: "AC Milan (Prateek)" },
      { season: "Season 1", winner: "FC Legends (Prabin Dahal)" }
    ]
  },
  ultimate_player: {
    title: "ULTIMATE PLAYER BRACKET RECORDS",
    description: "Knockout classification records tracking the absolute peak bracket challengers.",
    headers: ["Season", "Champion Team / Player"],
    records: [
      { season: "Season 15", winner: "NOT_ASLAM1zz (Amir)" },
      { season: "Season 14", winner: "Basanta (बसन्त)" },
      { season: "Season 13", winner: "Pardeshi_Sakar (Sakar)" },
      { season: "Season 12", winner: "Nepolian Habilww (Hab II)" },
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
let currentTaxRate = 12;

const elements = {
  htmlNode: document.documentElement,
  loginView: document.getElementById("login-view"),
  adminView: document.getElementById("admin-view"),
  loginForm: document.getElementById("login-form"),
  loginUsernameInput: document.getElementById("login-username"),
  loginPasswordInput: document.getElementById("login-password"),
  loginError: document.getElementById("login-error"),
  adminWelcome: document.getElementById("admin-welcome-msg"),
  dynamicDisplay: document.getElementById("dynamic-display-panel"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  themeIcon: document.getElementById("theme-icon"),
  logoutButtons: document.querySelectorAll(".logout-btn"),
  
  calcPayoutType: document.getElementById("calc-payout-type"),
  calcTotalPool: document.getElementById("calc-total-pool"),
  dynamicRatioWrapper: document.getElementById("dynamic-ratio-wrapper"),
  calcRatioWarning: document.getElementById("calc-ratio-warning"),
  labelChargeCut: document.getElementById("label-charge-cut"),
  
  resAdminCut: document.getElementById("res-admin-cut"),
  resNetPool: document.getElementById("res-net-pool"),
  rowP1: document.getElementById("row-p1"),
  rowP2: document.getElementById("row-p2"),
  rowP3: document.getElementById("row-p3"),
  rowP4: document.getElementById("row-p4"),
  lblP1: document.getElementById("lbl-p1"),
  lblP2: document.getElementById("lbl-p2"),
  resP1: document.getElementById("res-p1"),
  resP2: document.getElementById("res-p2"),
  resP3: document.getElementById("res-p3"),
  resP4: document.getElementById("res-p4"),
  copyToast: document.getElementById("copy-toast")
};

function initThemeEngine() {
  const savedTheme = localStorage.getItem("pes_matches_theme") || "dark";
  elements.htmlNode.setAttribute("data-theme", savedTheme);
  updateThemeButtonUI(savedTheme);

  elements.themeToggleBtn.addEventListener("click", () => {
    const activeTheme = elements.htmlNode.getAttribute("data-theme");
    const alternateTheme = activeTheme === "dark" ? "light" : "dark";
    elements.htmlNode.setAttribute("data-theme", alternateTheme);
    localStorage.setItem("pes_matches_theme", alternateTheme);
    updateThemeButtonUI(alternateTheme);
  });
}

function updateThemeButtonUI(theme) {
  elements.themeIcon.innerText = theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode";
}

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
  if (targetView === "login") elements.loginView.classList.remove("hidden");
  else if (targetView === "dashboard") elements.adminView.classList.remove("hidden");
}

function showDashboard() {
  elements.adminWelcome.innerText = `Logged in securely as: ${activeSessionUser.username}`;
  toggleInterfaceView("dashboard");
  handleLayoutSwitch();
}

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
    elements.loginError.innerText = "Authentication Failed: Invalid credentials.";
    elements.loginError.classList.remove("hidden");
  }
});

window.showHistory = function(categoryKey) {
  const targetCategory = HISTORICAL_DATA_STORE[categoryKey];
  if (!targetCategory) return;
  elements.dynamicDisplay.innerHTML = "";

  const layoutContainer = document.createElement("div");
  layoutContainer.className = "history-card";
  let tableRowsHtml = "";
  
  targetCategory.records.forEach(row => {
    let cellStyle = (row.winner.includes("Prateek") || row.winner.includes("Dipendra")) ? 'style="color: var(--gold); font-weight: 600;"' : '';
    tableRowsHtml += `
      <tr>
        <td style="width: 30%; font-weight: 500; color: var(--accent); padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border-color);">${escapeHtml(row.season)}</td>
        <td ${cellStyle} style="padding: 0.75rem 0.5rem; border-bottom: 1px solid var(--border-color);">${escapeHtml(row.winner)}</td>
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
        <tbody>${tableRowsHtml}</tbody>
      </table>
    </div>
  `;
  elements.dynamicDisplay.appendChild(layoutContainer);
};

window.switchRateCharge = function(rate) {
  currentTaxRate = rate;
  document.getElementById("rate-12").classList.remove("active");
  document.getElementById("rate-11").classList.remove("active");
  document.getElementById(`rate-${rate}`).classList.add("active");
  elements.labelChargeCut.innerText = `Tournament Charge (${rate}%)`;
  calculatePrizes();
};

window.handleLayoutSwitch = function() {
  const mode = elements.calcPayoutType.value;
  elements.dynamicRatioWrapper.innerHTML = "";
  elements.calcRatioWarning.classList.add("hidden");

  if (mode === "top2") {
    elements.dynamicRatioWrapper.innerHTML = `
      <div class="form-group"><label>Winner Split (%)</label><input type="number" id="ratio-1" value="70" min="0" max="100" oninput="calculatePrizes()"></div>
      <div class="form-group"><label>Runner Up (%)</label><input type="number" id="ratio-2" value="30" min="0" max="100" oninput="calculatePrizes()"></div>
    `;
  } else if (mode === "top4") {
    elements.dynamicRatioWrapper.innerHTML = `
      <div class="form-group"><label>1st Place (%)</label><input type="number" id="ratio-1" value="40" min="0" max="100" oninput="calculatePrizes()"></div>
      <div class="form-group"><label>2nd Place (%)</label><input type="number" id="ratio-2" value="30" min="0" max="100" oninput="calculatePrizes()"></div>
      <div class="form-group"><label>3rd Place (%)</label><input type="number" id="ratio-3" value="20" min="0" max="100" oninput="calculatePrizes()"></div>
      <div class="form-group"><label>4th Place (%)</label><input type="number" id="ratio-4" value="10" min="0" max="100" oninput="calculatePrizes()"></div>
    `;
  }
  
  calculatePrizes();
};

window.calculatePrizes = function() {
  const totalPool = parseFloat(elements.calcTotalPool.value) || 0;
  const mode = elements.calcPayoutType.value;
  
  const adminCut = totalPool * (currentTaxRate / 100);
  const netPrizePool = totalPool - adminCut;
  
  elements.resAdminCut.innerText = `Rs. ${adminCut.toFixed(2)}`;
  elements.resNetPool.innerText = `Rs. ${netPrizePool.toFixed(2)}`;

  elements.rowP1.classList.add("hidden");
  elements.rowP2.classList.add("hidden");
  elements.rowP3.classList.add("hidden");
  elements.rowP4.classList.add("hidden");

  if (mode === "solo") {
    elements.lblP1.innerText = "Winner Reward";
    elements.resP1.innerText = `Rs. ${netPrizePool.toFixed(2)}`;
    elements.rowP1.classList.remove("hidden");
  } 
  else if (mode === "top2") {
    elements.lblP1.innerText = "Winner Reward";
    elements.lblP2.innerText = "Runner Up Reward";
    
    const r1 = parseFloat(document.getElementById("ratio-1").value) || 0;
    const r2 = parseFloat(document.getElementById("ratio-2").value) || 0;
    
    if (r1 + r2 !== 100) elements.calcRatioWarning.classList.remove("hidden");
    else elements.calcRatioWarning.classList.add("hidden");

    elements.resP1.innerText = `Rs. ${(netPrizePool * (r1 / 100)).toFixed(2)}`;
    elements.resP2.innerText = `Rs. ${(netPrizePool * (r2 / 100)).toFixed(2)}`;
    
    elements.rowP1.classList.remove("hidden");
    elements.rowP2.classList.remove("hidden");
  } 
  else if (mode === "top4") {
    const r1 = parseFloat(document.getElementById("ratio-1").value) || 0;
    const r2 = parseFloat(document.getElementById("ratio-2").value) || 0;
    const r3 = parseFloat(document.getElementById("ratio-3").value) || 0;
    const r4 = parseFloat(document.getElementById("ratio-4").value) || 0;

    if (r1 + r2 + r3 + r4 !== 100) elements.calcRatioWarning.classList.remove("hidden");
    else elements.calcRatioWarning.classList.add("hidden");

    elements.resP1.innerText = `Rs. ${(netPrizePool * (r1 / 100)).toFixed(2)}`;
    elements.resP2.innerText = `Rs. ${(netPrizePool * (r2 / 100)).toFixed(2)}`;
    elements.resP3.innerText = `Rs. ${(netPrizePool * (r3 / 100)).toFixed(2)}`;
    elements.resP4.innerText = `Rs. ${(netPrizePool * (r4 / 100)).toFixed(2)}`;

    elements.rowP1.classList.remove("hidden");
    elements.rowP2.classList.remove("hidden");
    elements.rowP3.classList.remove("hidden");
    elements.rowP4.classList.remove("hidden");
  }
};

window.copyCalcSummary = function() {
  const total = parseFloat(elements.calcTotalPool.value) || 0;
  if (total === 0) return;

  const adminCut = elements.resAdminCut.innerText;
  const netPool = elements.resNetPool.innerText;
  const mode = elements.calcPayoutType.value;

  let textTemplate = `🏆 *PES MATCHES - TOURNAMENT BREAKDOWN* 🏆\n\n💰 Total Pool Collection: ${total} Rs.\n🛡️ Organizer Charge (${currentTaxRate}%): ${adminCut}\n✨ Net Playable Pool: ${netPool}\n\n`;

  if (mode === "solo") {
    textTemplate += `🥇 Champion Take All: ${elements.resP1.innerText}\n\nWinner takes the glory! 🎮👑`;
  } else if (mode === "top2") {
    textTemplate += `🥇 Winner Reward: ${elements.resP1.innerText}\n🥈 Runner Up Reward: ${elements.resP2.innerText}\n\nGLHF to all challengers! 🎮🔥`;
  } else if (mode === "top4") {
    textTemplate += `🥇 1st Place: ${elements.resP1.innerText}\n🥈 2nd Place: ${elements.resP2.innerText}\n🥉 3rd Place: ${elements.resP3.innerText}\n🏅 4th Place: ${elements.resP4.innerText}\n\nSuperb run to the top four! 🎮⚡`;
  }

  navigator.clipboard.writeText(textTemplate).then(() => {
    elements.copyToast.classList.remove("hidden");
    setTimeout(() => elements.copyToast.classList.add("hidden"), 2000);
  });
};

elements.logoutButtons.forEach(button => {
  button.addEventListener("click", function() {
    activeSessionUser = null;
    sessionStorage.removeItem("active_archive_session");
    toggleInterfaceView("login");
    elements.calcTotalPool.value = "";
    elements.calcPayoutType.value = "top2";
    switchRateCharge(12);
  });
});

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  verifyActiveSession();
});