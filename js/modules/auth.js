/**
 * Authentication module
 * Handles user authentication and authorization
 */
import { API } from "./api.js";
import { showMessage, showLoading } from "./utils.js";

/**
 * Handle user login
 * @param {Event} event - Form submit event
 */
export async function login(event) {
  if (event) event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  if (!username || !password) {
    showMessage("Please fill in all fields");
    return;
  }

  showLoading(true);

  try {
    const data = await API.login(username, password);

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

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    logout();
    return false;
  }
  return true;
}

/**
 * Logout user and redirect to login page
 */
export function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

/**
 * Get current user data from localStorage
 * @returns {object} User data
 */
export function getCurrentUser() {
  return {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
    username: localStorage.getItem("username"),
  };
}
