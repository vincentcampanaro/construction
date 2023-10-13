// Create a map centered on NYC
const map = L.map('map').setView([40.7128, -74.0060], 13);

// Add a modern Mapbox base map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmluY2VudGNhbXBhbmFybyIsImEiOiJjbG5vMDFnaW0wOWZrMmxxZGRhZGpxc2poIn0.CAmYZ_D7znuGjGsEMpVtsA', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    id: 'mapbox/streets-v11',  // Choose a Mapbox style
}).addTo(map);

// Function to add marker to map using project data
function addMarker(project) {
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
            if (project.latitude && project.longitude) {  // Check if latitude and longitude are defined
                addMarker(project);
            } else {
                console.warn('Missing latitude or longitude:', project);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching project data:', error);
    });

// Define heatmap layer
const heatmapLayer = L.heatLayer([], { radius: 25, blur: 15 });
heatmapLayer.addTo(map);

// Define heatmapData outside the function so it's only created once
const heatmapData = [];

// Function to toggle heatmap
function toggleHeatmap() {
    // If the heatmapData array is empty, populate it with data
    if (heatmapData.length === 0) {
        data.filter(project => project.latitude && project.longitude)
            .forEach(project => {
                heatmapData.push([project.latitude, project.longitude]);
            });
    }

    // Toggle the heatmap layer on and off
    if (map.hasLayer(heatmapLayer)) {
        map.removeLayer(heatmapLayer);
    } else {
        heatmapLayer.setLatLngs(heatmapData);
        heatmapLayer.addTo(map);
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
