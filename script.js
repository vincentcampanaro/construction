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
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

    fetch(apiUrl, {
        headers: { 'User-Agent': 'Construction/1.0 (vincentcampanaro@stern.nyu.edu)' }
    })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latLng = L.latLng(data[0].lat, data[0].lon);
                L.marker(latLng).addTo(map);
            } else {
                console.warn(`No results found for address: ${address}`);
            }
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
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
