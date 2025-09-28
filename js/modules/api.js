/**
 * API communication module
 * Handles all API requests and responses
 */
import { CONFIG } from "./config.js";

/**
 * Base API request function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} API response
 */
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(`${CONFIG.API_URL}${endpoint}`, finalOptions);

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.clear();
      window.location.href = "index.html";
      return;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * API methods
 */
export const API = {
  // Authentication
  async login(username, password) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  // Distance data
  async getDistanceData(type) {
    return apiRequest(`/distance/${type}`);
  },

  // Control data
  async getControlData() {
    return apiRequest("/control");
  },

  async updateControl(controlData) {
    return apiRequest("/control", {
      method: "POST",
      body: JSON.stringify(controlData),
    });
  },

  // User logs
  async getUserLogs() {
    return apiRequest("/auth/logs");
  },
};
