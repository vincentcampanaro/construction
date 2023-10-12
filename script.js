const L = require('leaflet');

// Create a map centered on NYC
const map = L.map('map').setView([40.7128, -74.0060], 13);

// Add a base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch data from NYC Open Data API
fetch('https://data.cityofnewyork.us/resource/dzgh-ja44.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(project => {
            // Assume each project has a latitude and longitude property
            const latLng = L.latLng(project.latitude, project.longitude);
            L.marker(latLng).addTo(map);
        });
    });
