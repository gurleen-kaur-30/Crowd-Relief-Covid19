// Import all the Images for each category
const all_marker = require('../assets/images/map/all.png');
const relief_marker = require('../assets/images/map/relief.png');
const contribute_marker = require('../assets/images/map/donation.png');

// Defing properties for the categories of incidents
const categories = {
  all: {
    title: 'All Events',
    category: 'all',
    image: all_marker,
  },
  relief: {
    title: 'Relief',
    category: 'relief',
    image: relief_marker,
    color: '#2c3e50',
  },
  contribute: {
    title: 'Contribution',
    category: 'contribute',
    image: contribute_marker,
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
