mapboxgl.accessToken = MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-90.0715, 29.9511], // Centered on New Orleans
  zoom: 13
});

map.on('load', () => {
  map.addSource('nola-heat', {
    type: 'geojson',
    data: 'data/nola_heat.geojson'
  });

  map.addLayer({
    id: 'heat-layer',
    type: 'fill',
    source: 'nola-heat',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'heat_risk_score'],
        0, '#00ff00',
        100, '#ff0000'
      ],
      'fill-opacity': 0.6
    }
  });

  // Add popup on click
  map.on('click', 'heat-layer', (e) => {
    const props = e.features[0].properties;
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`
        <strong>${props.name}</strong><br>
        Heat Risk: ${props.heat_risk_score}<br>
        Poverty Rate: ${props.poverty_rate}%<br>
        Tree Cover: ${props.tree_cover}%
      `)
      .addTo(map);
  });

  map.on('mouseenter', 'heat-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'heat-layer', () => {
    map.getCanvas().style.cursor = '';
  });
});
