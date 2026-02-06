document.addEventListener("DOMContentLoaded", () => {
  const dormGrid = document.getElementById("dorm-grid");
  const filters = document.getElementById("filters");

  // Fetch dorm data from the API
  fetch("https://script.google.com/macros/s/AKfycbxLWalLI-8g9KCPgaa-IL2ZsB-EYZmfSoCUiRgD-ZaR6k5KHwzJeSj_SSCuBoWvXnec/exec") // Replace YOUR_DEPLOYMENT_ID with your actual deployment ID
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch dorm data");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid data format: Expected an object");
      }
      const dorms = Object.values(data).flat(); // Flatten all sheets into a single array
      renderDorms(dorms);
      setupFilters(dorms); // Setup filters after dorms are loaded
    })
    .catch((error) => {
      console.error("Error fetching dorm data:", error);
      dormGrid.innerHTML = `<p class='text-red-500'>Failed to load dorm data.</p>`;
    });

  // Render dorms in the grid
  function renderDorms(dorms) {
    dormGrid.innerHTML = ""; // Clear existing content
    dorms.forEach((dorm) => {
      const dormCard = document.createElement("div");
      dormCard.className = "bg-white p-4 rounded shadow hover:shadow-lg transition";
      dormCard.innerHTML = `
        <h3 class="text-lg font-bold mb-2">${dorm.Name}</h3>
        <p class="text-gray-700">Capacity: ${dorm.Capacity}</p>
        <p class="text-gray-700">Sex: ${dorm.Sex}</p>
        <p class="text-gray-700">Quad: ${dorm.Quad}</p>
        <p class="text-gray-700">Colors: ${dorm.Colors}</p>
        <p class="text-gray-700">Chapel: ${dorm.Chapel}</p>
        <p class="text-gray-700">Mascot: ${dorm.Mascot}</p>
        <p class="text-gray-700">Notes: ${dorm.Notes || "N/A"}</p>
      `;
      dormGrid.appendChild(dormCard);
    });
  }

  // Setup filters for dorms
  function setupFilters(dorms) {
    // Add filter inputs
    filters.innerHTML = `
      <input id="filter-name" type="text" placeholder="Filter by name" class="border p-2 rounded mb-2">
      <input id="filter-capacity" type="number" placeholder="Filter by capacity" class="border p-2 rounded mb-2">
    `;

    const filterNameInput = document.getElementById("filter-name");
    const filterCapacityInput = document.getElementById("filter-capacity");

    // Filter logic
    filterNameInput.addEventListener("input", () => applyFilters(dorms));
    filterCapacityInput.addEventListener("input", () => applyFilters(dorms));

    function applyFilters(dorms) {
      const nameFilter = filterNameInput.value.toLowerCase();
      const capacityFilter = parseInt(filterCapacityInput.value, 10);

      const filteredDorms = dorms.filter((dorm) => {
        const matchesName = dorm.name.toLowerCase().includes(nameFilter);
        const matchesCapacity = isNaN(capacityFilter) || dorm.capacity >= capacityFilter;
        return matchesName && matchesCapacity;
      });

      renderDorms(filteredDorms);
    }
  }
});