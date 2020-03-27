// Import all the Images for each category
const road_marker = require('../assets/images/map/road.png');
const health_marker = require('../assets/images/map/medical-icon.png');
const fire_marker = require('../assets/images/map/fire.png');
const flood_marker = require('../assets/images/map/floods_marker_100.png');
const electric_marker = require('../assets/images/map/electric_marker_100.png');
const earthquake_marker = require('../assets/images/map/earthquakes.png');
const all_marker = require('../assets/images/map/disaster.png');

// Defing properties for the categories of incidents
const categories = {
  all: {
    title: 'All Incidents',
    category: 'all',
    image: all_marker,
  },
  relief: {
    title: 'Relief',
    category: 'relief',
    image: road_marker,
    color: '#2c3e50',
  },
  contribute: {
    title: 'Contribute',
    category: 'contribute',
    image: fire_marker,
    color: '#ed810e',
  },
};

// Get image for the given category
export function getMarkerImage(category) {
  return categories[category].image;
}

// Get color for the given category
export function getColor(category) {
  return categories[category].color;
}

export {categories};
