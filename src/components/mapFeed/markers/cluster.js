import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import MapView from 'react-native-maps';
import {styles} from '../../../assets/styles/clusterMarker_styles';
import PropTypes from 'prop-types';
import {getMarkerColor} from '../../../utils/categoryUtil.js';

/**
 * It displays the individual cluster on the map.
 * @param {JSON} item The cluster description containing cluster_id and incident count in it.
 * @param {String} colorIncidents Cluster color for incidents
 * @param {String} colorEmergencyPlaces	Cluster color for emergency places.
 * @param {String} type Type of cluster place or incident
 */
export default Cluster = ({item, type}) => {
  const {point_count, cluster_id} = item.properties;
  const coords = item.geometry.coordinates;
  var clusterColor = getMarkerColor(type, 'cluster');

  return (
    <MapView.Marker
      coordinate={{latitude: coords[1], longitude: coords[0]}}
      anchor={{x: 0.5, y: 0.5}}
      onCalloutPress={() => {
        console.log(item);
      }}>
      <View
        style={[styles.clusterOuter, {backgroundColor: clusterColor.outer}]}>
        <View style={[styles.cluster, {backgroundColor: clusterColor.inner}]}>
          <TouchableOpacity>
            <Text style={styles.clusterText}>{point_count}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MapView.Marker>
  );
};

/**
 * Checks that the functions specified as isRequired are present and warns if
 * the props used on this page does not meet the specified type.
 */
Cluster.propTypes = {
  item: PropTypes.object,
  type: PropTypes.string,
};
