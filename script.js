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

// Function to add marker to map using project data
function addMarker(project) {
    const latLng = L.latLng(project.latitude, project.longitude);
    L.marker(latLng, { icon: myIcon }).bindPopup(`<b>${project.name}</b><br>${project.building_address}`).addTo(map);
}

// Fetch data from NYC Open Data API
fetch('https://data.cityofnewyork.us/resource/8586-3zfm.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(project => {
            addMarker(project);
        });
    })
    .catch(error => {
        console.error('Error fetching project data:', error);
    });
