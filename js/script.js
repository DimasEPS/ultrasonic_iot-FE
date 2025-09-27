const ip = "192.168.1.12";
const API_URL = `http://${ip}:3000/api`; // pake current ip address

// Utility functions
function showMessage(message, type = "error") {
  const messageEl = document.getElementById("message");
  if (!messageEl) return;

  messageEl.textContent = message;
  messageEl.className = type;
  messageEl.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      messageEl.style.display = "none";
    }, 3000);
  }
}

function showLoading(show = true) {
  const loginBtn = document.getElementById("loginBtn");
  const loginText = document.getElementById("loginText");
  const loginLoader = document.getElementById("loginLoader");

  if (!loginBtn) return;

  if (show) {
    loginBtn.disabled = true;
    loginText.style.display = "none";
    loginLoader.style.display = "inline-block";
  } else {
    loginBtn.disabled = false;
    loginText.style.display = "inline";
    loginLoader.style.display = "none";
  }
}

// ===== LOGIN =====
async function login(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showMessage("Please fill in all fields");
    return;
  }

  showLoading(true);

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store authentication data
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("username", username);

    showMessage("Login successful! Redirecting...", "success");

    // Redirect based on role
    setTimeout(() => {
      switch (data.role) {
        case "admin-distance1":
          window.location.href = "dashboard1.html";
          break;
        case "admin-distance2":
          window.location.href = "dashboard2.html";
          break;
        case "super-admin":
          window.location.href = "super.html";
          break;
        default:
          throw new Error("Unknown user role");
      }
    }, 1000);
  } catch (err) {
    console.error("Login error:", err);
    showMessage(err.message || "Login failed. Please try again.");
  } finally {
    showLoading(false);
  }
}

// ===== AUTHENTICATION CHECK =====
function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    logout();
    return false;
  }
  return true;
}

// ===== LOGOUT =====
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ===== LOAD DISTANCE =====
async function loadDistance(type) {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/distance/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const tbody = document.querySelector("#data-table tbody");

    if (!tbody) {
      console.error("Table body not found");
      return;
    }

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="${
        type === "all" ? 5 : 4
      }" style="text-align: center; color: var(--text-secondary);">No data available</td>`;
      tbody.appendChild(tr);
      return;
    }

    data.forEach((row) => {
      const tr = document.createElement("tr");
      const timestamp = new Date(row.timestamp).toLocaleString();
      const status = row.status
        ? `<span class="status-online">Online</span>`
        : `<span class="status-offline">Offline</span>`;

      if (type === "all") {
        tr.innerHTML = `
          <td><strong>${row.source}</strong></td>
          <td>${row.id}</td>
          <td>${row.distances} cm</td>
          <td>${status}</td>
          <td>${timestamp}</td>
        `;
      } else {
        tr.innerHTML = `
          <td>${row.id}</td>
          <td>${row.distances} cm</td>
          <td>${status}</td>
          <td>${timestamp}</td>
        `;
      }
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading distance data:", err);
    const tbody = document.querySelector("#data-table tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="${
        type === "all" ? 5 : 4
      }" style="text-align: center; color: var(--error-color);">Error loading data</td></tr>`;
    }
  }
}

// ===== LOAD CONTROL =====
async function loadControl() {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/control`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    const tvElement = document.getElementById("tv");

    if (tvElement) tvElement.checked = data.TV === 1;
  } catch (err) {
    console.error("Error loading control data:", err);
  }
}

// ===== UPDATE CONTROL =====
async function updateControl() {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");
  const tvElement = document.getElementById("tv");

  if (!tvElement) {
    console.error("TV control element not found");
    return;
  }

  const TV = tvElement.checked ? 1 : 0;

  try {
    const res = await fetch(`${API_URL}/control`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ TV }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    showMessage(data.message || "Control updated successfully!", "success");
  } catch (err) {
    console.error("Error updating control:", err);
    showMessage("Failed to update control settings");
  }
}

// ===== LOAD LOGS =====
async function loadLogs() {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/auth/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const tbody = document.querySelector("#log-table tbody");

    if (!tbody) {
      console.error("Log table body not found");
      return;
    }

    tbody.innerHTML = "";

    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No user logs available</td></tr>';
      return;
    }

    data.forEach((user) => {
      const tr = document.createElement("tr");
      const lastLogin = user.last_login
        ? new Date(user.last_login).toLocaleString()
        : "-";

      tr.innerHTML = `
        <td>${user.id}</td>
        <td><strong>${user.username}</strong></td>
        <td><span class="role-badge">${user.role}</span></td>
        <td>${lastLogin}</td>
        <td>${user.last_ip || "-"}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading logs:", err);
    const tbody = document.querySelector("#log-table tbody");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Error loading user logs</td></tr>';
    }
  }
}

// ===== REFRESH USER LOGS =====
async function refreshUserLogs() {
  const refreshBtn = document.getElementById("refresh-logs-btn");
  const tbody = document.querySelector("#log-table tbody");

  if (!refreshBtn) return;

  // Show loading state
  const originalText = refreshBtn.innerHTML;
  refreshBtn.innerHTML =
    '<div class="loading" style="width: 16px; height: 16px; margin: 0;"></div> Refreshing...';
  refreshBtn.disabled = true;

  // Show loading in table
  if (tbody) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);"><div class="loading" style="margin: 1rem auto;"></div>Refreshing user logs...</td></tr>';
  }

  try {
    // Call the existing loadLogs function
    await loadLogs();

    // Show success feedback
    refreshBtn.innerHTML = "✅ Refreshed!";
    setTimeout(() => {
      refreshBtn.innerHTML = originalText;
      refreshBtn.disabled = false;
    }, 1500);
  } catch (err) {
    console.error("Error refreshing logs:", err);

    // Show error feedback
    refreshBtn.innerHTML = "❌ Error";
    setTimeout(() => {
      refreshBtn.innerHTML = originalText;
      refreshBtn.disabled = false;
    }, 2000);

    // Show error in table
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align: center; color: var(--error-color);">Error refreshing user logs</td></tr>';
    }
  }
}

// ===== CHART FUNCTIONALITY =====
let chartInstances = {};

async function loadDistanceChart(type, canvasId) {
  if (!checkAuth()) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/distance/${type}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        logout();
        return;
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      console.error(`Canvas with id ${canvasId} not found`);
      return;
    }

    // Prepare chart data
    const chartData = data.slice(0, 30).reverse(); // Show last 30 data points for better real-time view
    const labels = chartData.map((item, index) => `Point ${index + 1}`);
    const distances = chartData.map((item) => item.distances);

    // Check if chart already exists
    const existingChart = chartInstances[canvasId];

    if (existingChart && existingChart.data) {
      // Update existing chart data (more efficient for real-time)
      existingChart.data.labels = labels;
      existingChart.data.datasets[0].data = distances;
      existingChart.update("none"); // Update without animation for smoother real-time updates
      return;
    }

    // Create new chart only if it doesn't exist
    if (existingChart) {
      existingChart.destroy();
    }

    // Create new chart with consistent styling and store instance
    chartInstances[canvasId] = new Chart(canvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: `Distance Sensor ${type} (cm)`,
            data: distances,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              color: "#f8fafc",
              font: {
                size: 12,
                weight: "bold",
              },
              padding: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(30, 58, 138, 0.9)",
            titleColor: "#f8fafc",
            bodyColor: "#cbd5e1",
            borderColor: "#3b82f6",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Data Points",
              color: "#cbd5e1",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            ticks: {
              color: "#cbd5e1",
              font: {
                size: 11,
              },
            },
            grid: {
              color: "#334155",
              lineWidth: 1,
            },
          },
          y: {
            title: {
              display: true,
              text: "Distance (cm)",
              color: "#cbd5e1",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            ticks: {
              color: "#cbd5e1",
              font: {
                size: 11,
              },
            },
            grid: {
              color: "#334155",
              lineWidth: 1,
            },
            beginAtZero: true,
          },
        },
      },
    });
  } catch (err) {
    console.error(`Error loading chart for distance ${type}:`, err);
  }
}

// ===== REAL-TIME REFRESH =====
let refreshIntervals = {};

function startRealTimeRefresh() {
  const currentPage = window.location.pathname;

  // Clear existing intervals
  Object.values(refreshIntervals).forEach((interval) =>
    clearInterval(interval)
  );
  refreshIntervals = {};

  if (currentPage.includes("dashboard1.html")) {
    // Update distance data every 2 seconds for real-time feel
    refreshIntervals.distance = setInterval(() => {
      loadDistance("1");
    }, 2000);

    // Update chart every 3 seconds (slightly less frequent to avoid flickering)
    refreshIntervals.chart = setInterval(() => {
      loadDistanceChart("1", "chart1");
    }, 3000);
  } else if (currentPage.includes("dashboard2.html")) {
    refreshIntervals.distance = setInterval(() => {
      loadDistance("2");
    }, 2000);

    refreshIntervals.chart = setInterval(() => {
      loadDistanceChart("2", "chart2");
    }, 3000);
  } else if (currentPage.includes("super.html")) {
    // Super admin gets more frequent updates
    refreshIntervals.distance = setInterval(() => {
      loadDistance("all");
    }, 2000);

    refreshIntervals.charts = setInterval(() => {
      loadDistanceChart("1", "chart1");
      loadDistanceChart("2", "chart2");
    }, 3000);

    // Control and logs update less frequently
    refreshIntervals.control = setInterval(() => {
      loadControl();
    }, 5000);

    refreshIntervals.logs = setInterval(() => {
      loadLogs();
    }, 10000);
  }
}

// Function to stop real-time updates (useful when page is not visible)
function stopRealTimeRefresh() {
  Object.values(refreshIntervals).forEach((interval) =>
    clearInterval(interval)
  );
  refreshIntervals = {};
}

// Initialize real-time refresh when page loads
document.addEventListener("DOMContentLoaded", function () {
  if (
    window.location.pathname !== "/" &&
    !window.location.pathname.includes("index.html")
  ) {
    startRealTimeRefresh();
  }
});

// Pause updates when page is not visible (saves resources)
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    stopRealTimeRefresh();
  } else {
    // Resume updates when page becomes visible again
    setTimeout(() => {
      startRealTimeRefresh();
    }, 1000);
  }
});

// Cleanup intervals when page unloads
window.addEventListener("beforeunload", function () {
  stopRealTimeRefresh();
});
