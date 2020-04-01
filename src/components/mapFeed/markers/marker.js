import React, {Component} from 'react';
import {Image, Alert} from 'react-native';
import MapView from 'react-native-maps';
import {getMarkerImage, getMarkerColor} from '../../../utils/categoryUtil.js';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {bindActionCreators} from 'redux';
import getDirections from 'react-native-google-maps-directions';
import PropTypes from 'prop-types';
import {styles} from '../../../assets/styles/clusterMarker_styles';
import {getIndvIncident} from '../../../actions/incidentsAction.js';

/**
 * Class for displaying individual marker on map
 * @extends Component
 */
class MapMarker extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * This function checks if the user viewing the incident page is
   * the one who created the incident. If yes than it will display the
   * edit and delete button on navigation bar else no.
   * @param  {JSON} incident It contains the incident details.
   * @return Navigates to incident page
   */
  viewClickedIncident(item) {
    Actions.incident({incident_key: item.key}); // Navigates to incident page
  }

  editClickedIncident(item) {
    // if (
    //   this.props.incident.incident !== null
    //     ? item.key !== this.props.incident.incident.key
    //     : true
    // ) {
    //   this.props.getIndvIncident(this.props.incident_key);
    //   if (!this.props.incident.loading) {
    //     Actions.editIncident({action: true});
    //   }
    // }
    Actions.incident({incident_key: item.key, skip2edit: true});
  }

  /**
   * To open google maps app and navigate the user to the specified destination.
   * @param  {object} coordinates Contains the latitude and longitude of nearby place.
   * @return Opens the google maps app.
   */
  handleNavigation(lat, lng) {
    getDirections({
      source: {
        latitude: '',
        longitude: '',
      },
      destination: {
        latitude: lat,
        longitude: lng,
      },
      params: [
        {
          key: 'dirflg',
          value: 'd',
        },
      ],
    });
  }

  handleMarkerClick(item) {
    if (this.props.type === 'relief') {
      var s = 'deliver';
    } else if (this.props.type === 'contribute') {
      var s = 'pick up';
    }
    Alert.alert(
      '',
      'Do you want to view or ' + String(s) + ' ?',
      [
        {
          text: 'View',
          onPress: () => {
            this.viewClickedIncident(item.properties.incident);
          },
        },
        {
          text: s,
          onPress: () => {
            this.editClickedIncident(item.properties.incident);
          },
        },
      ],
      {cancelable: true},
    );
  }

  render() {
    var item = this.props.item;
    const coords = item.geometry.coordinates;
    var markerColor = getMarkerColor(this.props.type, 'point');

    //If the marker is hospital or police station.
    if (this.props.type === 'emergencyPlaces') {
      return (
        <MapView.Marker
          coordinate={{
            latitude: coords[1],
            longitude: coords[0],
          }}
          title={item.properties.name}
          description={item.properties.vicinity}
          image={item.properties.icon}
          onCalloutPress={() => {
            this.handleNavigation(coords[1], coords[0]);
          }}
        />
      );
    } else if (this.props.type === 'relief') {
      // If the marker is an relief.
      return (
        <MapView.Marker
          coordinate={{
            latitude: coords[1],
            longitude: coords[0],
          }}
          pinColor={markerColor}
          description={item.properties.incident.value.details}
          onPress={() => {
            this.handleMarkerClick(item);
          }}>
          {/* <Image
            source={getMarkerImage(item.properties.incident.value.category)}
            style={styles.markerIcon}
          /> */}
        </MapView.Marker>
      );
    } else if (this.props.type === 'contribute') {
      // If the marker is an contribute.
      return (
        <MapView.Marker
          coordinate={{
            latitude: coords[1],
            longitude: coords[0],
          }}
          pinColor={markerColor}
          description={item.properties.incident.value.details}
          onPress={() => {
            this.handleMarkerClick(item);
          }}>
          {/* <Image
            source={getMarkerImage(item.properties.incident.value.category)}
            style={styles.markerIcon}
          /> */}
        </MapView.Marker>
      );
    }
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if
 * the props used on this page does not meet the specified type.
 */
MapMarker.propTypes = {
  user: PropTypes.object,
};

function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getIndvIncident: getIndvIncident,
    },
    dispatch,
  );
}

/**
 * Mapping state to props so that state variables can be used
 * through props in children components.
 * @param state Current state in the store.
 * @return Returns states as props.
 */
const mapStateToProps = state => ({
  user: state.login.userDetails,
  incident: state.incident,
});

export default connect(mapStateToProps, matchDispatchToProps)(MapMarker);
