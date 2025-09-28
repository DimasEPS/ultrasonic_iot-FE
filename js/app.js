/**
 * Main application module
 * Orchestrates all other modules and exposes global functions
 */

// Import all modules
import { CONFIG } from "./modules/config.js";
import { showMessage, showLoading } from "./modules/utils.js";
import { login, checkAuth, logout } from "./modules/auth.js";
import { loadDistance } from "./modules/distance.js";
import { loadControl, updateControl } from "./modules/control.js";
import { loadLogs, refreshUserLogs } from "./modules/logs.js";
import { loadDistanceChart, destroyAllCharts } from "./modules/chart.js";
import {
  initializeRealTimeRefresh,
  startRealTimeRefresh,
  stopRealTimeRefresh,
} from "./modules/realtime.js";

/**
 * Application class
 * Main application controller
 */
class IoTDashboardApp {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;

    console.log("Initializing IoT Dashboard App...");

    // Initialize real-time refresh system
    initializeRealTimeRefresh();

    this.isInitialized = true;
    console.log("IoT Dashboard App initialized successfully");
  }

  /**
   * Get application configuration
   */
  getConfig() {
    return CONFIG;
  }

  /**
   * Cleanup application resources
   */
  cleanup() {
    stopRealTimeRefresh();
    destroyAllCharts();
    console.log("Application cleaned up");
  }
}

// Create application instance
const app = new IoTDashboardApp();

// Initialize application
app.init();

// Export functions to global scope for HTML onclick handlers
window.login = login;
window.logout = logout;
window.loadDistance = loadDistance;
window.loadControl = loadControl;
window.updateControl = updateControl;
window.loadLogs = loadLogs;
window.refreshUserLogs = refreshUserLogs;
window.loadDistanceChart = loadDistanceChart;

// Export application instance and modules for advanced usage
window.IoTApp = app;
window.IoTModules = {
  config: { CONFIG },
  utils: { showMessage, showLoading },
  auth: { login, checkAuth, logout },
  distance: { loadDistance },
  control: { loadControl, updateControl },
  logs: { loadLogs, refreshUserLogs },
  chart: { loadDistanceChart, destroyAllCharts },
  realtime: {
    initializeRealTimeRefresh,
    startRealTimeRefresh,
    stopRealTimeRefresh,
  },
};

// Export app for module imports
export default app;
