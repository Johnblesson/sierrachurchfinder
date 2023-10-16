let tbody = document.getElementById("tbody");
let searchInput = document.getElementById("search");
let locationSelect = document.getElementById("locationSearch");

// Fetch function
// fetch("https://sierrachurches1.onrender.com/churches")
fetch("http://localhost:5000/api/churches")
    .then(res => res.json())
    .then(json => {
        const allData = json;
        renderTable(allData);

        const uniqueLocations = [...new Set(allData.map(data => data.location))];
        uniqueLocations.sort(); // Sort locations alphabetically

        uniqueLocations.forEach(location => {
            const option = document.createElement("option");
            option.value = location;
            option.textContent = location;
            locationSelect.appendChild(option);
        });

        searchInput.addEventListener("input", filterData);
        locationSelect.addEventListener("change", filterData);

        function filterData() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedLocation = locationSelect.value.toLowerCase();
            let filteredData;

            if (selectedLocation === "") {
                filteredData = allData.filter(data => (
                    data.name.toLowerCase().includes(searchTerm) ||
                    data.address.toLowerCase().includes(searchTerm) ||
                    data.contact.toLowerCase().includes(searchTerm) ||
                    data.location.toLowerCase().includes(searchTerm) // Add location to input search
                ));
            } else {
                filteredData = allData.filter(data => (
                    (data.name.toLowerCase().includes(searchTerm) ||
                    data.address.toLowerCase().includes(searchTerm) ||
                    data.contact.toLowerCase().includes(searchTerm)) &&
                    (data.location.toLowerCase() === selectedLocation || selectedLocation === "all")
                ));
            }

            renderTable(filteredData);
        }
    });

// Render table rows
function renderTable(data) {
    tbody.innerHTML = ""; // Clear existing rows
    data.forEach(dataItem => {
        tbody.appendChild(td_fun(dataItem));
    });
}

// Create td
function td_fun({ logo, name, address, contact, location }) {
    let td = document.createElement("tr");
    td.innerHTML = `
    <td class="px-6 py-4">
    <div class="d-flex align-items-center">
        <div class="flex-shrink-0">
            <img src="${logo}" class="rounded-circle" alt="" width="50" height="50">
        </div>
        <div class="ms-3">
            <div class="fw-medium text-dark">${name}</div>
            <div class="text-secondary">${address}</div>
        </div>
    </div>
</td>
<td class="px-6 py-4">
    <span class="badge bg-success">${contact}</span>
</td>
<td class="px-6 py-4">
    <span class="text-secondary">${location}</span>
</td>
    `;
    return td;
}