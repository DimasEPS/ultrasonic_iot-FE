/**
 * Configuration module
 * Contains all configuration constants and settings
 */
export const CONFIG = {
  IP: "192.168.1.12",
  PORT: 3000,

  get API_URL() {
    return `http://${this.IP}:${this.PORT}/api`;
  },

  // Refresh intervals in milliseconds
  INTERVALS: {
    DISTANCE_DATA: 2000, // 2 seconds
    CHART_UPDATE: 3000, // 3 seconds
    CONTROL_UPDATE: 5000, // 5 seconds
    LOGS_UPDATE: 10000, // 10 seconds
  },

  // Chart configuration
  CHART: {
    MAX_DATA_POINTS: 30,
    BORDER_COLOR: "#3b82f6",
    BACKGROUND_COLOR: "rgba(59, 130, 246, 0.1)",
    BORDER_WIDTH: 3,
  },
};
