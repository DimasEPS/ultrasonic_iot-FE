/**
 * Utility functions module
 * Contains reusable utility functions
 */

/**
 * Show message to user
 * @param {string} message - Message to display
 * @param {string} type - Message type ('error', 'success')
 */
export function showMessage(message, type = "error") {
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

/**
 * Show/hide loading state for login button
 * @param {boolean} show - Whether to show loading state
 */
export function showLoading(show = true) {
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

/**
 * Format timestamp to locale string
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted date string
 */
export function formatTimestamp(timestamp) {
  return timestamp ? new Date(timestamp).toLocaleString() : "-";
}

/**
 * Create status HTML element
 * @param {boolean} status - Online/offline status
 * @returns {string} HTML string for status
 */
export function createStatusHTML(status) {
  return status
    ? `<span class="status-online">Online</span>`
    : `<span class="status-offline">Offline</span>`;
}

/**
 * Get current page type
 * @returns {string} Page type ('dashboard1', 'dashboard2', 'super', 'index')
 */
export function getCurrentPageType() {
  const currentPage = window.location.pathname;

  if (currentPage.includes("dashboard1.html")) return "dashboard1";
  if (currentPage.includes("dashboard2.html")) return "dashboard2";
  if (currentPage.includes("super.html")) return "super";
  return "index";
}
