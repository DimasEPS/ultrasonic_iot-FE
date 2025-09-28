/**
 * Control module
 * Handles device control functionality (TV switch)
 */
import { API } from "./api.js";
import { checkAuth } from "./auth.js";
import { showMessage } from "./utils.js";

/**
 * Load current control state
 */
export async function loadControl() {
  if (!checkAuth()) return;

  try {
    const data = await API.getControlData();
    const tvElement = document.getElementById("tv");

    if (tvElement) {
      tvElement.checked = data.TV === 1;
    }
  } catch (err) {
    console.error("Error loading control data:", err);
  }
}

/**
 * Update control settings
 */
export async function updateControl() {
  if (!checkAuth()) return;

  const tvElement = document.getElementById("tv");

  if (!tvElement) {
    console.error("TV control element not found");
    return;
  }

  const TV = tvElement.checked ? 1 : 0;

  try {
    const data = await API.updateControl({ TV });
    showMessage(data.message || "Control updated successfully!", "success");
  } catch (err) {
    console.error("Error updating control:", err);
    showMessage("Failed to update control settings");
  }
}
