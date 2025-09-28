/**
 * Chart module
 * Handles Chart.js functionality for distance visualization
 */
import { API } from "./api.js";
import { checkAuth } from "./auth.js";
import { CONFIG } from "./config.js";

// Store chart instances
let chartInstances = {};

/**
 * Create chart configuration
 * @param {string} type - Distance sensor type
 * @param {Array} labels - Chart labels
 * @param {Array} distances - Distance data
 * @returns {object} Chart configuration
 */
function createChartConfig(type, labels, distances) {
  return {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Distance Sensor ${type} (cm)`,
          data: distances,
          borderColor: CONFIG.CHART.BORDER_COLOR,
          backgroundColor: CONFIG.CHART.BACKGROUND_COLOR,
          borderWidth: CONFIG.CHART.BORDER_WIDTH,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: CONFIG.CHART.BORDER_COLOR,
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
  };
}

/**
 * Load and display distance chart
 * @param {string} type - Distance sensor type ('1', '2')
 * @param {string} canvasId - Canvas element ID
 */
export async function loadDistanceChart(type, canvasId) {
  if (!checkAuth()) return;

  try {
    const data = await API.getDistanceData(type);
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      console.error(`Canvas with id ${canvasId} not found`);
      return;
    }

    // Prepare chart data
    const chartData = data.slice(0, CONFIG.CHART.MAX_DATA_POINTS).reverse();
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

    // Create new chart and store instance
    chartInstances[canvasId] = new Chart(
      canvas,
      createChartConfig(type, labels, distances)
    );
  } catch (err) {
    console.error(`Error loading chart for distance ${type}:`, err);
  }
}

/**
 * Destroy all chart instances
 */
export function destroyAllCharts() {
  Object.values(chartInstances).forEach((chart) => {
    if (chart && typeof chart.destroy === "function") {
      chart.destroy();
    }
  });
  chartInstances = {};
}

/**
 * Get chart instance by canvas ID
 * @param {string} canvasId - Canvas element ID
 * @returns {object|null} Chart instance
 */
export function getChartInstance(canvasId) {
  return chartInstances[canvasId] || null;
}
