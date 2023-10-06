// Define the URLs for earthquake data and tectonic plates data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Function to determine the color based on earthquake depth
function getColor(depth) {
    switch (true) {
        case depth > 100:
            return "#FF0000";
        case depth > 80:
            return "#FF4500";
        case depth > 60:
            return "#FF8C00";
        default:
            return "#98FB98";
    }
}

// Function to determine radius based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 20000; // Adjust this based on visualization preferences
}

d3.json(earthquakeUrl).then(earthquakeData => {
    d3.json(tectonicPlatesUrl).then(tectonicData => {
        createMap(earthquakeData.features, tectonicData.features);
    });
});

function createMap(earthquakeData, tectonicData) {
    const earthquakeLayer = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return new L.circle(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                fillOpacity: .6,
                color: "#000",
                stroke: true,
                weight: .8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}<br>Depth: ${feature.geometry.coordinates[2]}`);
        }
    });

    const tectonicLayer = L.geoJSON(tectonicData, {
        color: "#FFD700",
        weight: 2
    });

    const baseMap = {
        "Street Map": L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoiam9uZXMiLCJhIjoiY2o4aXJzYjEwMDBpcTJ3bzFqaXV3dGF5MCJ9.B6Px1H9Z3sUkX3kXK_HD8A", {
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1
        })
    };

    const overlayMaps = {
        Earthquakes: earthquakeLayer,
        "Tectonic Plates": tectonicLayer
    };

    const myMap = L.map("map", {
        center: [39.8283, -98.5795], 
        zoom: 4, 
        layers: [baseMap["Street Map"], earthquakeLayer, tectonicLayer]
    });

    L.control.layers(baseMap, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}