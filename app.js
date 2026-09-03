"use strict";

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: "adminjon",
  password: "JonAdmin123"
};

// Storage Key for Local History Persistence
const STORAGE_KEY = "pes_matches_custom_history";

// Active Room Tracker
let currentActiveRoom = "elite_league";

// Initial/Default Records for 4 Tournament Rooms
const DEFAULT_HISTORY = {
  elite_league: [
    { season: "Season 7", winner: "PNE.Bomjan23 (Subash)", details: "Grand Final Winner" },
    { season: "Season 6", winner: "Lythx_11 (Manjil)", details: "Clean sheet streak" },
    { season: "Season 5", winner: "AC Milan (Prateek)", details: "Undefeated champion" },
    { season: "Season 4", winner: "The Destroyer (Kiran)", details: "High goal ratio" },
    { season: "Season 3", winner: "AC Milan (Prateek)", details: "Back to back title" }
  ],
  elite_division: [
    { season: "Season 8", winner: "PNE.Bomjan23 (Subash)", details: "Division Champion" },
    { season: "Season 7", winner: "LYTHX_ 11 (Manjil)", details: "Conceded only 3 goals" },
    { season: "Season 6", winner: "PNE_SLAYERx7 (Prabesh)", details: "34 Goals scored" }
  ],
  pes_camp: [
    { season: "Season 7", winner: "PNE.Bomjan23 (Subash)", details: "Camp Gold Medal" },
    { season: "Season 6", winner: "PNE_SIV (Siv)", details: "Camp Leader" }
  ],
  ultimate_player: [
    { season: "Season 15", winner: "NOT_ASLAM1zz (Amir)", details: "Knockout Champion" },
    { season: "Season 14", winner: "Basanta (बसन्त)", details: "Tight final match" },
    { season: "Season 13", winner: "Pardeshi_Sakar (Sakar)", details: "Penalty Shootout win" }
  ]
};

// History Store Initialization
let historyStore = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_HISTORY;

// Titles Map
const ROOM_TITLES = {
  elite_league: "ELITE LEAGUE RECORDS",
  elite_division: "eLITE DIVISION LEAGUE RECORDS",
  pes_camp: "PES LEAGUE CAMP RECORDS",
  ultimate_player: "ULTIMATE PLAYER RECORDS"
};

// Community Milestones Data
const MILESTONES_DATA = [
  { title: "Most Goals in a Season", value: "34 Goals", recordHolder: "PNE_SLAYERx7 (Prabesh)", context: "Elite Division Season 6" },
  { title: "Iron Defense (Fewest Conceded)", value: "3 Goals", recordHolder: "LYTHX_ 11 (Manjil)", context: "Elite Division Season 7" },
  { title: "Longest Undefeated Streak", value: "14 Matches", recordHolder: "AC Milan (Prateek)", context: "Elite League Season 3-5" },
  { title: "Biggest Grand Final Margin", value: "5 - 0 Victory", recordHolder: "PesNepal•Leo (Subash)", context: "Elite Division Season 5" },
  { title: "Most Knockout Titles", value: "3 Championships", recordHolder: "Black Hornet (Dipendra)", context: "Ultimate Player Season 1-3" }
];

let activeSessionUser = null;
let currentTaxRate = 12;

// DOM Elements Container
const elements = {
  htmlNode: document.documentElement,
  loginView: document.getElementById("login-view"),
  adminView: document.getElementById("admin-view"),
  loginForm: document.getElementById("login-form"),
  loginUsernameInput: document.getElementById("login-username"),
  loginPasswordInput: document.getElementById("login-password"),
  loginError: document.getElementById("login-error"),
  adminWelcome: document.getElementById("admin-welcome-msg"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  themeIcon: document.getElementById("theme-icon"),
  logoutButtons: document.querySelectorAll(".logout-btn"),
  
  milestonesContainer: document.getElementById("milestones-container"),
  calcPayoutType: document.getElementById("calc-payout-type"),
  calcTotalPool: document.getElementById("calc-total-pool"),
  calcCustomRate: document.getElementById("calc-custom-rate"),
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

// Theme Management Engine
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

// Download push.bat helper function
window.downloadPushBat = function() {
  const batContent = `@echo off\r\necho ===================================\r\necho   PES MATCHES - Quick GitHub Push\r\necho ===================================\r\ngit add .\r\nset /p commit_msg="Enter commit message (or press ENTER for 'Update site'): "\r\nif "%commit_msg%"=="" set commit_msg=Update site\r\ngit commit -m "%commit_msg%"\r\ngit push origin main\r\necho ===================================\r\necho   Successfully pushed to GitHub!\r\necho ===================================\r\npause\r\n`;
  
  const blob = new Blob([batContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "push.bat";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ------------------------------------------------------------------
// HISTORY MANAGER ROOM LOGIC (ADD, EDIT, DELETE, SWITCH)
// ------------------------------------------------------------------

window.switchHistoryRoom = function(roomKey) {
  currentActiveRoom = roomKey;

  const tabs = document.querySelectorAll(".room-tab-btn");
  tabs.forEach(tab => tab.classList.remove("active"));
  
  const roomIndexMap = { elite_league: 0, elite_division: 1, pes_camp: 2, ultimate_player: 3 };
  if (tabs[roomIndexMap[roomKey]]) {
    tabs[roomIndexMap[roomKey]].classList.add("active");
  }

  document.getElementById("active-room-title").innerText = ROOM_TITLES[roomKey];
  resetHistoryForm();
  renderActiveRoomTable();
};

function renderActiveRoomTable() {
  const tbody = document.getElementById("history-table-body");
  const records = historyStore[currentActiveRoom] || [];

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
          No records added yet for this room. Use the form above to add an entry!
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = records.map((item, index) => `
    <tr>
      <td style="font-weight: 600; color: var(--accent);">${escapeHtml(item.season)}</td>
      <td style="font-weight: 500;">${escapeHtml(item.winner)}</td>
      <td style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(item.details || '-')}</td>
      <td style="text-align: right; white-space: nowrap;">
        <button class="action-icon-btn edit-btn" onclick="triggerEditRecord(${index})" title="Edit Record">✏️</button>
        <button class="action-icon-btn delete-btn" onclick="deleteRecord(${index})" title="Delete Record">🗑️</button>
      </td>
    </tr>
  `).join('');
}

window.handleSaveRecord = function(event) {
  event.preventDefault();
  
  const seasonInput = document.getElementById("hist-season").value.trim();
  const winnerInput = document.getElementById("hist-winner").value.trim();
  const detailsInput = document.getElementById("hist-details").value.trim();
  const editIndex = parseInt(document.getElementById("edit-record-index").value, 10);

  if (!seasonInput || !winnerInput) return;

  const recordObject = {
    season: seasonInput,
    winner: winnerInput,
    details: detailsInput
  };

  if (!historyStore[currentActiveRoom]) {
    historyStore[currentActiveRoom] = [];
  }

  if (editIndex >= 0) {
    historyStore[currentActiveRoom][editIndex] = recordObject;
  } else {
    historyStore[currentActiveRoom].unshift(recordObject);
  }

  saveHistoryToStorage();
  resetHistoryForm();
  renderActiveRoomTable();
};

window.triggerEditRecord = function(index) {
  const record = historyStore[currentActiveRoom][index];
  if (!record) return;

  document.getElementById("hist-season").value = record.season;
  document.getElementById("hist-winner").value = record.winner;
  document.getElementById("hist-details").value = record.details || "";
  document.getElementById("edit-record-index").value = index;

  document.getElementById("hist-submit-btn").innerText = "💾 Save Changes";
  document.getElementById("hist-cancel-btn").classList.remove("hidden");
};

window.deleteRecord = function(index) {
  if (confirm("Are you sure you want to remove this history record?")) {
    historyStore[currentActiveRoom].splice(index, 1);
    saveHistoryToStorage();
    renderActiveRoomTable();
  }
};

window.resetHistoryForm = function() {
  document.getElementById("history-entry-form").reset();
  document.getElementById("edit-record-index").value = "-1";
  document.getElementById("hist-submit-btn").innerText = "➕ Add History Record";
  document.getElementById("hist-cancel-btn").classList.add("hidden");
};

function saveHistoryToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyStore));
}

window.exportHistoryData = function() {
  const jsonString = JSON.stringify(historyStore, null, 2);
  navigator.clipboard.writeText(jsonString).then(() => {
    alert("History data JSON copied to clipboard! You can back this up anytime.");
  });
};

// ------------------------------------------------------------------
// AUTHENTICATION & CALCULATOR LOGIC
// ------------------------------------------------------------------

function renderMilestones() {
  if (!elements.milestonesContainer) return;
  elements.milestonesContainer.innerHTML = MILESTONES_DATA.map(item => `
    <div class="milestone-box">
      <span class="milestone-title">${escapeHtml(item.title)}</span>
      <strong class="milestone-val">${escapeHtml(item.value)}</strong>
      <div class="milestone-holder">${escapeHtml(item.recordHolder)}</div>
      <div class="milestone-ctx">${escapeHtml(item.context)}</div>
    </div>
  `).join('');
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
  renderMilestones();
  renderActiveRoomTable();
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

// Calculator Calculations
window.switchRateCharge = function(rate) {
  currentTaxRate = rate;
  if (elements.calcCustomRate) elements.calcCustomRate.value = "";
  
  [5, 8, 10, 11, 12].forEach(p => {
    const btn = document.getElementById(`rate-preset-${p}`);
    if (btn) btn.classList.remove("active");
  });

  const activeBtn = document.getElementById(`rate-preset-${rate}`);
  if (activeBtn) activeBtn.classList.add("active");

  elements.labelChargeCut.innerText = `Tournament Charge (${currentTaxRate}%)`;
  calculatePrizes();
};

window.handleCustomRateInput = function() {
  const val = parseFloat(elements.calcCustomRate.value);
  
  [5, 8, 10, 11, 12].forEach(p => {
    const btn = document.getElementById(`rate-preset-${p}`);
    if (btn) btn.classList.remove("active");
  });

  if (!isNaN(val) && val >= 0) {
    currentTaxRate = val;
    elements.labelChargeCut.innerText = `Tournament Charge (${currentTaxRate}%)`;
  } else {
    currentTaxRate = 0;
    elements.labelChargeCut.innerText = `Tournament Charge (0%)`;
  }
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
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeEngine();
  verifyActiveSession();
});
