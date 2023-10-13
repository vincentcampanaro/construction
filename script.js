// Create a map centered on NYC
const map = L.map('map').setView([40.7128, -74.0060], 13);

// Add a modern Mapbox base map
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidmluY2VudGNhbXBhbmFybyIsImEiOiJjbG5vMDFnaW0wOWZrMmxxZGRhZGpxc2poIn0.CAmYZ_D7znuGjGsEMpVtsA', {
    attribution: '&copy; <a href="https://www.mapbox.com/">Mapbox</a> contributors',
    id: 'mapbox/streets-v11',  // Choose a Mapbox style
}).addTo(map);

// Set a minimalistic custom icon
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
