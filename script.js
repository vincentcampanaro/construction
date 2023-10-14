document.addEventListener("DOMContentLoaded", function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidmluY2VudGNhbXBhbmFybyIsImEiOiJjbG5vMDFnaW0wOWZrMmxxZGRhZGpxc2poIn0.CAmYZ_D7znuGjGsEMpVtsA';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.0060, 40.7128],
        zoom: 13
    });

    let heatmapLayerId = 'heatmap';

    map.on('load', () => {
        fetch('https://data.cityofnewyork.us/resource/8586-3zfm.json')
            .then(response => response.json())
            .then(data => {
                const geojson = {
                    type: 'FeatureCollection',
                    features: data.map(project => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [parseFloat(project.longitude), parseFloat(project.latitude)]
                        },
                        properties: project
                    })).filter(feature => feature.geometry.coordinates[0] && feature.geometry.coordinates[1])
                };

                map.addSource('projects', {
                    type: 'geojson',
                    data: geojson
                });

                map.addLayer({
                    id: heatmapLayerId,
                    type: 'heatmap',
                    source: 'projects',
                    maxzoom: 9,
                    paint: {
                        'heatmap-weight': 1,
                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 1,
                            9, 3
                        ],
                        'heatmap-color': [
                            'interpolate',
                            ['linear'],
                            ['heatmap-density'],
                            0, 'rgba(33,102,172,0)',
                            0.2, 'rgb(103,169,207)',
                            0.4, 'rgb(209,229,240)',
                            0.6, 'rgb(253,219,199)',
                            0.8, 'rgb(239,138,98)',
                            1, 'rgb(178,24,43)'
                        ],
                        'heatmap-radius': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 2,
                            9, 20
                        ],
                        'heatmap-opacity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            7, 1,
                            9, 0
                        ],
                    }
                }, 'waterway-label');

                // Adding markers
                geojson.features.forEach(feature => {
                    const coordinates = feature.geometry.coordinates;
                    const properties = feature.properties;
                    const html = `
                        <b>${properties.name}</b><br>
                        ${properties.building_address}<br>
                        ${properties.city}, ${properties.zip_code}<br>
                        Project Description: ${properties.projdesc}<br>
                        Construction Award: ${properties.award}<br>
                        Project Type: ${properties.consttype}<br>
                        <button onclick="searchGoogle('${properties.name}', '${properties.building_address}')">Search with Google</button>
                    `;
                    new mapboxgl.Marker()
                        .setLngLat(coordinates)
                        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(html))
                        .addTo(map);
                });
            });
    });

    document.getElementById('heatmapButton').addEventListener('click', function() {
        const heatmapLayer = map.getLayer(heatmapLayerId);
        if (heatmapLayer) {
            map.removeLayer(heatmapLayerId);
        } else {
            map.addLayer({
                id: heatmapLayerId,
                type: 'heatmap',
                source: 'projects',
                maxzoom: 9,
                paint: {
                    'heatmap-weight': 1,
                    'heatmap-intensity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 1,
                        9, 3
                    ],
                    'heatmap-color': [
                        'interpolate',
                        ['linear'],
                        ['heatmap-density'],
                        0, 'rgba(33,102,172,0)',
                        0.2, 'rgb(103,169,207)',
                        0.4, 'rgb(209,229,240)',
                        0.6, 'rgb(253,219,199)',
                        0.8, 'rgb(239,138,98)',
                        1, 'rgb(178,24,43)'
                    ],
                    'heatmap-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        0, 2,
                        9, 20
                    ],
                    'heatmap-opacity': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        7, 1,
                        9, 0
                    ],
                }
            }, 'waterway-label');
        }
    });

    document.getElementById('choroplethButton').addEventListener('click', function() {
        alert('Choropleth feature not implemented');
    });
});

function searchGoogle(name, address) {
    const query = encodeURIComponent(`${name} ${address}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}
