import React, {Component} from 'react';
import GeoJSON from 'geojson';
import supercluster from 'supercluster';
import {View, TouchableOpacity, Keyboard, Platform, Image} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
import MapMarker from '../markers/marker';
import Cluster from '../markers/cluster';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {styles, searchBarStyle} from '../../../assets/styles/map_styles.js';
var haversine = require('haversine-distance');
import {styles as markerStyle} from '../../../assets/styles/clusterMarker_styles';

/**
 * Main Map screen along with the relocation button.
 * Also handles the clustering of the incidents.
 * @extends Component
 */
class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clustersRelief: [],
      clustersContribute: [],
      clustersPlaces: [],
      curr_region: {
        latitude: this.props.curr_location.latitude,
        longitude: this.props.curr_location.longitude,
        latitudeDelta: this.props.curr_location.latitudeDelta,
        longitudeDelta: this.props.curr_location.longitudeDelta,
      },
      coordinate: new AnimatedRegion({
        latitude: this.props.curr_location.latitude,
        longitude: this.props.curr_location.longitude,
      }),
    };
    this.northeast = {
      latitude:
        this.state.curr_region.latitude +
        this.state.curr_region.latitudeDelta / 2,
      longitude:
        this.state.curr_region.longitude +
        this.state.curr_region.longitudeDelta / 2,
    };
    this.southwest = {
      latitude:
        this.state.curr_region.latitude -
        this.state.curr_region.latitudeDelta / 2,
      longitude:
        this.state.curr_region.longitude -
        this.state.curr_region.longitudeDelta / 2,
    };
    this.northwest = {
      latitude:
        this.state.curr_region.latitude -
        this.state.curr_region.latitudeDelta / 2,
      longitude:
        this.state.curr_region.longitude +
        this.state.curr_region.longitudeDelta / 2,
    };
    this.southeast = {
      latitude:
        this.state.curr_region.latitude +
        this.state.curr_region.latitudeDelta / 2,
      longitude:
        this.state.curr_region.longitude -
        this.state.curr_region.longitudeDelta / 2,
    };
  }

  /**
   * Used to fetch incidents from store and transform them so that the geo json
   * library can parse the incidents
   * @param  {String} domain Used for filtering
   * @return {Array} Returns incidents
   */
  generateIncidents(domain) {
    incidents = [];
    //Logic for filter
    var incidents_marker = this.props.all_incidents.filter(function(item) {
      if (domain === 'all') {
        return true;
      } else {
        return item.value.category === domain;
      }
    });
    for (var i = 0; i < incidents_marker.length; i++) {
      var obj = {
        latitude: incidents_marker[i].value.coordinates.latitude,
        longitude: incidents_marker[i].value.coordinates.longitude,
        incident: incidents_marker[i],
      };
      incidents.push(obj);
    }
    var curr_position = {
      lat: this.props.curr_location.latitude,
      lng: this.props.curr_location.longitude,
    };

    //near incidents filtering
    c_incidents = [];
    r_incidents = [];
    if (this.props.incident.nearby.relief) {
      r_incidents = incidents.filter(function(item) {
        var incident_location = {
          lat: item.latitude,
          lng: item.longitude,
        };
        if (
          haversine(curr_position, incident_location) < 50000 &&
          item.incident.value.category === 'relief'
        ) {
          return true;
        }
      });
    }
    if (this.props.incident.nearby.contribute) {
      c_incidents = incidents.filter(function(item) {
        var incident_location = {
          lat: item.latitude,
          lng: item.longitude,
        };
        if (
          haversine(curr_position, incident_location) < 50000 &&
          item.incident.value.category === 'contribute'
        ) {
          return true;
        }
      });
    }
    if (
      !this.props.incident.nearby.contribute &&
      !this.props.incident.nearby.relief
    ) {
      return incidents;
    } else {
      return c_incidents.concat(r_incidents);
    }
  }

  /**
   * Used to fetch  hospitals and police stations from store and transform them
   * so that the geo json library can parse the nearby hospitals.
   * @return {Array} Returns incidents
   */
  generateEmergencyPlaces() {
    emergencyPlaces = [];
    var data = this.props.emergencyPlaces.hospitals;
    for (var i = 0; i < data.length; i++) {
      var obj = {
        latitude: data[i].geometry.location.lat,
        longitude: data[i].geometry.location.lng,
        name: data[i].name,
        vicinity: data[i].vicinity,
        icon: data[i].icon,
      };
      emergencyPlaces.push(obj);
    }
    var data = this.props.emergencyPlaces.policeStations;
    for (var i = 0; i < data.length; i++) {
      var obj = {
        latitude: data[i].geometry.location.lat,
        longitude: data[i].geometry.location.lng,
        name: data[i].name,
        vicinity: data[i].vicinity,
        icon: data[i].icon,
      };
      emergencyPlaces.push(obj);
    }
    return emergencyPlaces;
  }

  /**
   * Gets the zoom level of the map which is used for clustering.
   * @param  {JSON} region The description of region
   * @return {Float}        Return zoom level.
   */
  _getZoomLevel(region) {
    var angle = 0;
    if (region.longitudeDelta < 0) {
      angle = 360.0 + region.longitudeDelta;
    } else {
      angle = region.longitudeDelta;
    }
    const level = Math.round(Math.log(360 / angle) / Math.LN2);
    return level;
  }

  /**
   * This method makes clusters of incidents and emergency places
   * depending upon the map region and zoom level.
   * @param  {JSON} region Region of map
   * @return Makes clusters.
   */
  _createRegions(region, incidents, emergencyPlaces) {
    var relief = incidents.filter(item => {
      if (item.incident.value.category === 'relief') {
        return true;
      }
    });
    var contribute = incidents.filter(item => {
      if (item.incident.value.category === 'contribute') {
        return true;
      }
    });

    // clustering of relief
    var itemsRelief = this._createRegionsHelper(
      region,
      this._createCluster(relief, {
        radius: 60,
        maxZoom: 16,
      }),
    );
    // clustering of contribute
    var itemsContribute = this._createRegionsHelper(
      region,
      this._createCluster(contribute, {
        radius: 60,
        maxZoom: 16,
      }),
    );
    // clustering of emergency places.
    var itemsEmergencyPlaces = this._createRegionsHelper(
      region,
      this._createCluster(emergencyPlaces, {
        radius: 40,
        maxZoom: 16,
      }),
    );

    this.setState({
      curr_region: region,
      clustersPlaces: itemsEmergencyPlaces,
      clustersRelief: itemsRelief,
      clustersContribute: itemsContribute,
    });
  }

  _createRegionsHelper(region, cluster) {
    var items = null;
    items = cluster.getClusters(
      [
        this.southwest.longitude,
        this.southwest.latitude,
        this.northeast.longitude,
        this.northeast.latitude,
      ],
      this._getZoomLevel(region),
    );

    // gets leaves of emergency places.
    for (var i = 0; i < items.length; i++) {
      if ('cluster' in items[i].properties) {
        items[i]['leaves'] = cluster.getLeaves(
          items[i].properties.cluster_id,
          (limit = 10),
        );
      }
    }
    return items;
  }

  /**
   * It creates a cluster of incidents and emergency places.
   * @param  {JSON} data Incidents or emergency places to cluster.
   * @return {JSON}      Returns an object according to norms of geo json.
   */
  _createCluster(data, details) {
    if (data != null) {
      const items = GeoJSON.parse(data, {
        Point: ['latitude', 'longitude'],
      });
      const cluster = new supercluster(details);
      cluster.load(items.features);
      return cluster;
    }
  }

  /**
   * Determines the region being viewed by the user.
   * @param  {JSON} region Region in vire of user.
   * @param  {Object} props  Passing the latest props(if there) to update this.props
   * @return On change the map is updated and clustering takes place.
   */
  onRegionChangeComplete(region, props) {
    this.northeast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };
    this.southwest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };
    this.northwest = {
      latitude: region.latitude - region.latitudeDelta / 2,
      longitude: region.longitude + region.longitudeDelta / 2,
    };
    this.southeast = {
      latitude: region.latitude + region.latitudeDelta / 2,
      longitude: region.longitude - region.longitudeDelta / 2,
    };

    props !== null ? (this.props = props) : null;
    if (
      this.props.all_incidents !== null &&
      this.props.emergencyPlaces.hospitals !== null &&
      this.props.emergencyPlaces.policeStations !== null
    ) {
      this._createRegions(
        region,
        this.generateIncidents(this.props.incident.domain),
        this.generateEmergencyPlaces(),
      );
    }
  }

  /**
   * Setting up the region upon relocation
   * @param {JSON} region Region to be updated with.
   */
  setRegion(region) {
    var self = this;
    setTimeout(function() {
      self.setState({
        curr_region: region,
      });
    }, 500);
  }

  /**
   * Handling the relocation of the map screen from the current location to another location or vice-versa
   * @param  {[type]} coordinates Relocation to this coordinate.
   * @param  {[type]} type        Whether its a 'search' relocation or a 'curr_location' relocation
   * @return Relocates the map to the particular region along with the marker.
   */
  handleRelocation(coordinates, type) {
    const mapRef = this.map;
    const markerRef = this.marker;

    if (type === 'search') {
      var region = {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: this.props.location.search_coordinates.latitudeDelta,
        longitudeDelta: this.props.location.search_coordinates.longitudeDelta,
      };
      mapRef.animateToRegion(region, 1000);
      if (Platform.OS === 'android') {
        markerRef._component.animateMarkerToCoordinate({
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        });
      } else {
        this.state.coordinate
          .timing({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          })
          .start();
      }
      this.setRegion(region);
      Keyboard.dismiss();
    } else if (type === 'curr_location') {
      var region = {
        latitude: this.props.curr_location.latitude,
        longitude: this.props.curr_location.longitude,
        latitudeDelta: this.props.curr_location.latitudeDelta,
        longitudeDelta: this.props.curr_location.longitudeDelta,
      };
      mapRef.animateToRegion(region, 1000);

      if (Platform.OS === 'android') {
        markerRef._component.animateMarkerToCoordinate({
          latitude: this.props.curr_location.latitude,
          longitude: this.props.curr_location.longitude,
        });
      } else {
        this.state.coordinate
          .timing({
            latitude: this.props.curr_location.latitude,
            longitude: this.props.curr_location.longitude,
          })
          .start();
      }
      this.setRegion(region);
    }
  }

  //Triggerinng on propChange like filtering/adding/modifying incidents.
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.incident.all_incidents !== this.props.incident.all_incidents ||
      nextProps.incident.domain !== this.props.incident.domain ||
      nextProps.incident.nearby !== this.props.incident.nearby
    ) {
      this.onRegionChangeComplete(this.state.curr_region, nextProps);
    }
    if (
      nextProps.location.search_coordinates !==
      this.props.location.search_coordinates
    ) {
      this.handleRelocation(nextProps.location.search_coordinates, 'search');
    }
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.map}>
        <MapView
          ref={ref => {
            this.map = ref;
          }}
          initialRegion={this.state.curr_region}
          onRegionChangeComplete={region => {
            this.onRegionChangeComplete(region, null);
          }}
          style={styles.map}>
          {/* Maps relief */}
          {this.state.clustersRelief.map((item, i) =>
            item.properties.cluster === true ? (
              <Cluster key={i} item={item} type={'relief'} />
            ) : (
              <MapMarker key={i} item={item} type={'relief'} />
            ),
          )}
          {/* Maps contribute */}
          {this.state.clustersContribute.map((item, i) =>
            item.properties.cluster === true ? (
              <Cluster key={i} item={item} type={'contribute'} />
            ) : (
              <MapMarker key={i} item={item} type={'contribute'} />
            ),
          )}
          {/* Maps emergency places */}
          {this.props.emergencyPlaces.show ? (
            this.state.clustersPlaces.map((item, i) =>
              item.properties.cluster === true ? (
                <Cluster key={i} item={item} type={'emergencyPlaces'} />
              ) : (
                <MapMarker key={i} item={item} type={'emergencyPlaces'} />
              ),
            )
          ) : (
            <View></View>
          )}
          {/* Maps current location */}
          <Marker.Animated
            ref={marker => {
              this.marker = marker;
            }}
            coordinate={
              Platform.OS === 'android'
                ? {
                    latitude: this.props.curr_location.latitude,
                    longitude: this.props.curr_location.longitude,
                  }
                : this.state.coordinate
            }>
            <Image
              source={require('../../../assets/images/marker.png')}
              style={markerStyle.markerIcon}
            />
          </Marker.Animated>
        </MapView>

        {/* Relocation Button */}
        <TouchableOpacity
          style={styles.repositionButton}
          onPress={() => {
            this.handleRelocation(null, 'curr_location');
          }}>
          <Icon name="crosshairs" size={24} style={styles.fabButtonIcon} />
        </TouchableOpacity>
      </View>
    );
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if
 * the props used on this page does not meet the specified type.
 */
MapContainer.propTypes = {
  curr_location: PropTypes.object,
  emergencyPlaces: PropTypes.object,
  incident: PropTypes.object,
  location: PropTypes.object,
  all_incidents: PropTypes.array,
};

/**
 * Mapping state to props so that state variables can be used
 * through props in children components.
 * @param state Current state in the store.
 * @return Returns states as props.
 */
const mapStateToProps = state => ({
  curr_location: state.location.curr_coordinates,
  emergencyPlaces: state.emergencyPlaces,
  all_incidents: state.incident.all_incidents,
  incident: state.incident,
  location: state.location,
});

export default connect(mapStateToProps)(MapContainer);
