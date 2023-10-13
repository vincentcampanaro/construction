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

// Configuration for heatmap
var cfg = {
    radius: 15,
    maxOpacity: .8,
    scaleRadius: false,
    useLocalExtrema: true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
};

// Create an empty data object for the heatmap
var heatmapData = {
    max: 8,
    data: []
};

// Define heatmap layer
const heatmapLayer = new HeatmapOverlay(cfg).addTo(map);

// Populate heatmap data object from project data
data.filter(project => project.latitude && project.longitude)
    .forEach(project => {
        heatmapData.data.push({
            lat: project.latitude,
            lng: project.longitude,
            count: 1  // Assuming a count of 1 for each project, adjust as necessary
        });
    });

// Set heatmap data
heatmapLayer.setData(heatmapData);

// Function to toggle heatmap
function toggleHeatmap() {
    if (map.hasLayer(heatmapLayer)) {
        map.removeLayer(heatmapLayer);
    } else {
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
