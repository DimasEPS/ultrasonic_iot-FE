/**
 * Distance data module
 * Handles distance sensor data display and management
 */
import { API } from "./api.js";
import { checkAuth } from "./auth.js";
import { formatTimestamp, createStatusHTML } from "./utils.js";

/**
 * Load and display distance data in table
 * @param {string} type - Distance sensor type ('1', '2', 'all')
 */
export async function loadDistance(type) {
  if (!checkAuth()) return;

  try {
    const data = await API.getDistanceData(type);
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
      const timestamp = formatTimestamp(row.timestamp);
      const status = createStatusHTML(row.status);

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
