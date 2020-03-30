// Import all the Images for each category
const all_marker = require('../assets/images/map/all.png');
const relief_marker = require('../assets/images/map/relief.png');
const contribute_marker = require('../assets/images/map/donation.png');

// Defing properties for the categories of incidents
export const categories = {
  all: {
    title: 'All Events',
    category: 'all',
    image: all_marker,
  },
  relief: {
    title: 'Relief',
    category: 'relief',
    image: relief_marker,
  },
  contribute: {
    title: 'Contribution',
    category: 'contribute',
    image: contribute_marker,
  },
};

export const marker = {
  emergencyPlaces: {
    colors: {
      cluster: {
        outer: 'rgba(0,0,0,0.25)',
        inner: 'rgba(0,0,0,1)',
      },
      point: 'rgba',
    },
  },
  relief: {
    colors: {
      cluster: {
        outer: 'rgba(180,0,0,0.25)',
        inner: 'rgba(180,0,0,1)',
      },
      point: 'rgba(180,0,0,1)',
    },
  },
  contribute: {
    colors: {
      cluster: {
        outer: 'rgba(78, 186, 170,0.25)',
        inner: 'rgba(78, 186, 170,1)',
      },
      point: 'rgba(78, 186, 170,1)',
    },
  },
};

// Get image for the given category
export function getMarkerColor(category, type) {
  return marker[category].colors[type];
}

// Get image for the given category
export function getMarkerImage(category) {
  return categories[category].image;
}
