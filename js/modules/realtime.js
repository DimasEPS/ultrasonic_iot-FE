/**
 * Real-time updates module
 * Handles automatic data refresh intervals
 */
import { loadDistance } from "./distance.js";
import { loadDistanceChart } from "./chart.js";
import { loadControl } from "./control.js";
import { loadLogs } from "./logs.js";
import { CONFIG } from "./config.js";
import { getCurrentPageType } from "./utils.js";

// Store interval references
let refreshIntervals = {};

/**
 * Start real-time refresh based on current page
 */
export function startRealTimeRefresh() {
  const pageType = getCurrentPageType();

  // Clear existing intervals
  stopRealTimeRefresh();

  switch (pageType) {
    case "dashboard1":
      refreshIntervals.distance = setInterval(() => {
        loadDistance("1");
      }, CONFIG.INTERVALS.DISTANCE_DATA);

      refreshIntervals.chart = setInterval(() => {
        loadDistanceChart("1", "chart1");
      }, CONFIG.INTERVALS.CHART_UPDATE);
      break;

    case "dashboard2":
      refreshIntervals.distance = setInterval(() => {
        loadDistance("2");
      }, CONFIG.INTERVALS.DISTANCE_DATA);

      refreshIntervals.chart = setInterval(() => {
        loadDistanceChart("2", "chart2");
      }, CONFIG.INTERVALS.CHART_UPDATE);
      break;

    case "super":
      // Super admin gets more frequent updates
      refreshIntervals.distance = setInterval(() => {
        loadDistance("all");
      }, CONFIG.INTERVALS.DISTANCE_DATA);

      refreshIntervals.charts = setInterval(() => {
        loadDistanceChart("1", "chart1");
        loadDistanceChart("2", "chart2");
      }, CONFIG.INTERVALS.CHART_UPDATE);

      // Control and logs update less frequently
      refreshIntervals.control = setInterval(() => {
        loadControl();
      }, CONFIG.INTERVALS.CONTROL_UPDATE);

      refreshIntervals.logs = setInterval(() => {
        loadLogs();
      }, CONFIG.INTERVALS.LOGS_UPDATE);
      break;

    default:
      // No real-time updates for login page
      break;
  }
}

/**
 * Stop all real-time updates
 */
export function stopRealTimeRefresh() {
  Object.values(refreshIntervals).forEach((interval) =>
    clearInterval(interval)
  );
  refreshIntervals = {};
}

/**
 * Get current refresh intervals
 * @returns {object} Current intervals
 */
export function getCurrentIntervals() {
  return { ...refreshIntervals };
}

/**
 * Initialize real-time refresh with page visibility handling
 */
export function initializeRealTimeRefresh() {
  // Start real-time refresh when page loads (except login page)
  document.addEventListener("DOMContentLoaded", function () {
    const pageType = getCurrentPageType();
    if (pageType !== "index") {
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
}
