// Create a map centered on NYC
const map = L.map('map').setView([40.7128, -74.0060], 13);

// Add a base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Set a custom icon if the default icon is not loading
const myIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
    iconSize: [38, 95],
});

// Function to geocode address and add marker to map
function geocodeAndAddMarker(address) {
    const apiKey = 'dabe268c136f4d0aa3b1f7c265dc0516';
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const latLng = L.latLng(data.results[0].geometry.lat, data.results[0].geometry.lng);
            L.marker(latLng, { icon: myIcon }).addTo(map);  // Use the custom icon when adding a marker
        });
}

// Fetch data from NYC Open Data API
fetch('https://data.cityofnewyork.us/resource/dzgh-ja44.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(project => {
            const address = `${project.city}, ${project.zip_code}`;
            geocodeAndAddMarker(address);
        });
    });
