/**
 * User logs module
 * Handles user activity logs display and refresh
 */
import { API } from "./api.js";
import { checkAuth } from "./auth.js";
import { formatTimestamp } from "./utils.js";

/**
 * Load and display user logs
 */
export async function loadLogs() {
  if (!checkAuth()) return;

  try {
    const data = await API.getUserLogs();
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
      const lastLogin = formatTimestamp(user.last_login);

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

/**
 * Refresh user logs with visual feedback
 */
export async function refreshUserLogs() {
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
    // Call the loadLogs function
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
