// Initialize the map
const myMap = L.map("map").setView([37.09, -95.71], 5);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(myMap);

// Fetch the data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const { coordinates } = feature.geometry;
      const { mag, place } = feature.properties;
      const depth = coordinates[2];
      
      // Calculate radius based on magnitude
      const radius = mag * 20000;

      // Get color based on depth
      let color;
      if (depth < 10) color = "green";
      else if (depth < 30) color = "yellow";
      else color = "red";

      // Add a circle to the map
      L.circle([coordinates[1], coordinates[0]], {
        color: color,
        radius: radius,
        fillOpacity: 0.75
      })
      .bindPopup(`<h2>${place}</h2><hr><p>Magnitude: ${mag} | Depth: ${depth}km</p>`)
      .addTo(myMap);
    });
  });