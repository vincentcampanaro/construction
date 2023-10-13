// Create a map centered on NYC
const map = L.map('map').setView([40.7128, -74.0060], 13);

// Add a modern Mapbox base map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmluY2VudGNhbXBhbmFybyIsImEiOiJjbG5vMDFnaW0wOWZrMmxxZGRhZGpxc2poIn0.CAmYZ_D7znuGjGsEMpVtsA', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    id: 'mapbox/streets-v11',  // Choose a Mapbox style
}).addTo(map);

// Function to add marker to map using project data
function addMarker(project) {
    // Check if latitude and longitude are defined
    if (project.latitude && project.longitude) {
        const latLng = L.latLng(project.latitude, project.longitude);
        L.circleMarker(latLng, { radius: 5, color: 'blue', fillColor: 'blue', fillOpacity: 1 })
            .bindPopup(`
                <b>${project.name}</b><br>
                ${project.building_address}<br>
                ${project.city}, ${project.zip_code}<br>
                Project Description: ${project.projdesc}<br>
                Construction Award: ${project.award}<br>
                Project Type: ${project.consttype}<br>
                <button onclick="searchGoogle('${project.name}', '${project.building_address}')">Search with Google</button>
            `)
            .addTo(map);
    } else {
        console.warn('Missing latitude or longitude:', project);
    }
}

// Function to search Google
function searchGoogle(name, address) {
    const query = encodeURIComponent(`${name} ${address}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}

// Fetch data from NYC Open Data API
let data;
fetch('https://data.cityofnewyork.us/resource/8586-3zfm.json')
    .then(response => response.json())
    .then(fetchedData => {
        data = fetchedData;
        data.forEach(project => {
            addMarker(project);
        });
    })
    .catch(error => {
        console.error('Error fetching project data:', error);
    });

// Add Leaflet.heat library
const heat = L.heatLayer([], {radius: 25});
heat.addTo(map);

// Function to toggle heatmap
function toggleHeatmap() {
    // Toggle the heatmap layer on and off
    if (map.hasLayer(heat)) {
        map.removeLayer(heat);
    } else {
        const heatmapData = data
            .filter(project => project.latitude && project.longitude)
            .map(project => [project.latitude, project.longitude]);
        if (heatmapData.length > 0) {  // Check if heatmapData is not empty
            heat = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);  // Reinitialize heat layer
        } else {
            console.warn('No data available for heatmap');
        }
    }
}

document.getElementById('heatmapButton').addEventListener('click', toggleHeatmap);

// Choropleth map toggle function placeholder (actual implementation requires GeoJSON data)
let choroplethLayer;
function toggleChoropleth() {
    if (choroplethLayer) {
        choroplethLayer.remove();
        choroplethLayer = null;  // Reset the choroplethLayer variable
    } else {
        // Placeholder for GeoJSON data and choropleth layer creation
        alert('Choropleth feature not implemented');
    }
}

document.getElementById('choroplethButton').addEventListener('click', toggleChoropleth);
