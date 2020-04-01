import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import MapView, {Marker} from 'react-native-maps';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  Container,
  Content,
  Card,
  CardItem,
  Header,
  Left,
  Body,
  Right,
  Picker,
} from 'native-base';
import {styles} from '../../assets/styles/incident_styles';
import getDirections from 'react-native-google-maps-directions';
import {Actions} from 'react-native-router-flux';
import DeleteButtonIncident from './navBarButtons/deleteIncident.js';
import EditButtonIncident from './navBarButtons/editIncidentButton.js';
// import ShareButtonIncident from './navBarButtons/shareIncidentButton.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getIndvIncident} from '../../actions/incidentsAction.js';
import IconDirection from 'react-native-vector-icons/MaterialCommunityIcons';

/**
 * Screen for showing individual incidents.
 * @extends Component
 */
class Incident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMapReady: false,
      isLoading: false,
    };
  }

  /**
   * Function to check if map has been loaded then only display marker on the map.
   * @return  sets isMapReady ready to true.
   */
  onMapLayout = () => {
    this.setState({isMapReady: true});
  };

  /**
   * This screen gets opened either through a shared link or normally
   * through app navigation. When the screen gets opened through a shared
   * url than it contains an incident_key prop passed while navigating to this
   * screen , if the prop is found than it fetches the particular incident from
   * the firebase else it fetches the incident details from redux and incident
   *  state is updated accordingly.
   * @return sets the incident to be viewed.
   */
  UNSAFE_componentWillMount() {
    if (
      this.props.incident.incident !== null
        ? this.props.incident_key !== this.props.incident.incident.key
        : true
    ) {
      this.props.getIndvIncident(this.props.incident_key);
    }
    if (this.props.skip2edit && !this.props.incident.loading) {
      Actions.editIncident({action: true});
    }
  }

  //Handles the navigation by opening the Google Maps
  handleDirections() {
    var coordinates = this.props.incident.incident.value.location.coordinates;
    getDirections({
      source: {
        latitude: '',
        longitude: '',
      },
      destination: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      params: [
        {
          key: 'dirflg',
          value: 'd',
        },
      ],
    });
  }

  toggleLoader = value => {
    this.setState({isLoading: value});
  };

  getActivityIndicator() {
    return (
      <ActivityIndicator size={'large'} style={styles.loader} color="black" />
    );
  }

  /**
   * The UI of incident screen.
   * @return the incident screen.
   */
  render() {
    if (
      this.props.incident.incident !== null
        ? this.props.incident_key !== this.props.incident.incident.key
        : true
    ) {
      return this.getActivityIndicator();
    } else {
      var incidentDetails = this.props.incident.incident.value;
      var action = '';
      if (incidentDetails.action === 'to_be_picked') {
        action = 'To be picked';
      } else if (incidentDetails.action === 'required') {
        action = 'Required';
      } else if (incidentDetails.action === 'picked') {
        action = 'Picked';
      } else if (incidentDetails.action === 'delivered') {
        action = 'Delivered';
      }
      return (
        <Container style={styles.container}>
          <Header androidStatusBarColor="#1c76cb">
            <Left>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => Actions.pop()}>
                <Icon name="angle-left" size={35} color="white" />
              </TouchableOpacity>
            </Left>
            <Body>
              <Text style={styles.title}>Incident Details</Text>
            </Body>
            <Right>
              <EditButtonIncident key={1} />
              <DeleteButtonIncident key={2} toggleLoader={this.toggleLoader} />
              {/* <ShareButtonIncident key={3} /> */}
            </Right>
          </Header>
          <ScrollView
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}>
            {incidentDetails.image.isPresent ? (
              <View style={styles.avatarContainer}>
                <Image
                  style={styles.image}
                  resizeMethod={'resize'}
                  source={{
                    uri: `data:${incidentDetails.image.mime};base64,${incidentDetails.image.base64}`,
                  }}
                />
              </View>
            ) : null}
            <Card style={styles.card}>
              <CardItem>
                <Text style={styles.titleTextHeader}>Action</Text>
                <Text style={styles.titleTextDescription}>{action}</Text>
              </CardItem>
            </Card>
            <Card style={styles.card}>
              <CardItem>
                <Text style={styles.titleTextHeader}>Category</Text>
                <Text style={styles.titleTextDescription}>
                  {incidentDetails.category}
                </Text>
              </CardItem>
            </Card>
            <Card style={styles.card}>
              <CardItem>
                <Text style={styles.titleTextHeader}>Urgency</Text>
                <Text style={styles.titleTextDescription}>
                  {incidentDetails.urgency}
                </Text>
              </CardItem>
            </Card>
            {incidentDetails.details !== '' ? (
              <Card style={styles.card}>
                <CardItem>
                  <Text style={styles.titleTextHeader}>Description</Text>
                </CardItem>
                <CardItem>
                  <Text style={styles.titleTextDescription}>
                    {incidentDetails.details}
                  </Text>
                </CardItem>
              </Card>
            ) : null}
            <Card style={styles.card}>
              <CardItem>
                <Text style={styles.titleTextHeader}>Items</Text>
              </CardItem>
              {this.props.incident.incident.value.items &&
                this.props.incident.incident.value.items.map((item, index) => {
                  return (
                    <View style={styles.itemsRow} key={index}>
                      <TextInput
                        placeholder={item.name}
                        editable={false}
                        placeholderTextColor={'black'}
                        style={styles.itemName}
                      />
                      <TextInput
                        placeholder={item.quantity}
                        editable={false}
                        placeholderTextColor={'black'}
                        style={styles.itemQuantity}
                      />
                      <TextInput
                        placeholder={item.unit}
                        editable={false}
                        placeholderTextColor={'black'}
                        style={styles.itemUnits}
                      />
                      {incidentDetails.category != 'contribute' ? (
                        item.status == 1 ? (
                          <Text style={[styles.statusText, {color: 'green'}]}>
                            delivered
                          </Text>
                        ) : (
                          <Text style={[styles.statusText, {color: 'orange'}]}>
                            required
                          </Text>
                        )
                      ) : item.status == 1 ? (
                        <Text style={[styles.statusText, {color: 'green'}]}>
                          picked
                        </Text>
                      ) : (
                        <Text style={[styles.statusText, {color: 'orange'}]}>
                          to be picked
                        </Text>
                      )}
                    </View>
                  );
                })}
            </Card>

            <Card style={styles.card}>
              <CardItem>
                <MapView
                  region={{
                    latitude: incidentDetails.location.coordinates.latitude,
                    longitude: incidentDetails.location.coordinates.longitude,
                    latitudeDelta: 0.0052,
                    longitudeDelta: 0.0052,
                  }}
                  onLayout={this.onMapLayout}
                  style={styles.map}>
                  {this.state.isMapReady && (
                    <MapView.Marker
                      coordinate={{
                        latitude: incidentDetails.location.coordinates.latitude,
                        longitude:
                          incidentDetails.location.coordinates.longitude,
                      }}
                    />
                  )}
                </MapView>
              </CardItem>
            </Card>
            {this.state.isLoading && this.getActivityIndicator()}
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.fabButton}
            onPress={() => this.handleDirections()}>
            <IconDirection
              name="directions"
              size={30}
              style={styles.fabButtonIcon}
            />
          </TouchableOpacity>
        </Container>
      );
    }
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
Incident.propTypes = {
  incident: PropTypes.object,
  user: PropTypes.object,
  getIndvIncident: PropTypes.func.isRequired,
};
/**
 * Mapping dispatchable actions to props so that actions can be used
 * through props in children components.
 * @param dispatch Dispatches an action to trigger a state change.
 * @return Turns action creator objects into an objects with the same keys.
 */
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
  incident: state.incident,
  user: state.login.userDetails,
});

export default connect(mapStateToProps, matchDispatchToProps)(Incident);
