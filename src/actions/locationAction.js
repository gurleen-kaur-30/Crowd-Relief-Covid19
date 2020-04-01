import {SEARCH_LOCATION, CURR_LOCATION} from './types';
import {handleError} from './errorAction';
import Geolocation from '@react-native-community/geolocation';
import {Platform} from 'react-native';

/**
 * This function is called to update the location co-ordinates to user's current location
 * by watching those and then dispatching them to the store.
 * @return dispatches location updates to set_currLocation.
 */
export const watchCurrLocation = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      Geolocation.watchPosition(
        position => {
          let data = {};
          data.latitude = parseFloat(position.coords.latitude);
          data.longitude = parseFloat(position.coords.longitude);
          resolve(dispatch(set_currLocation(data)));
        },
        error => {
          reject(dispatch(handleError(error)));
          console.log(error.message);
        },
        {
          enableHighAccuracy: Platform.OS != 'android',
          timeout: 20000,
          distanceFilter: 5,
        },
      );
    });
  };
};

export const getCurrLocation = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          let data = {};
          data.latitude = parseFloat(position.coords.latitude);
          data.longitude = parseFloat(position.coords.longitude);
          resolve(dispatch(set_currLocation(data)));
        },
        error => {
          reject(dispatch(handleError(error)));
          console.log(error.message);
        },
        {
          enableHighAccuracy: Platform.OS != 'android',
          timeout: 20000,
        },
      );
    });
  };
};

/**
 * This function is called to update the location co-ordinates of
 * custom location by communicating changes to redux via set_location.
 * @param {float} latitude  The latitude of the location entered by the user in the search bar.
 * @param {float} longitude The longitude of the location entered by the user in the search bar.
 * @param {string} name     Name of the location entered by the user in the search bar.
 */
export const setLocationOnCustomSearch = (latitude, longitude, name) => {
  return dispatch => {
    let data = {};
    data.latitude = latitude;
    data.longitude = longitude;
    dispatch(set_location(data, name));
  };
};

/**
 * Updates the custom location co-ordinates .
 * @param {JSON} location The json object containing latitude and longitude of a location.
 * @param {string} name
 */
function set_location(location, name) {
  return {
    type: SEARCH_LOCATION,
    search_coordinates: location,
    location_name: name,
  };
}

/**
 * Updates the current location co-ordinates.
 * @param {JSON} location json object containing latitude and longitude
 */
function set_currLocation(location) {
  return {
    type: CURR_LOCATION,
    curr_coordinates: location,
  };
}
