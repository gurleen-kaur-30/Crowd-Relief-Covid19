import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Picker,
  Button,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {styles} from '../../assets/styles/editIncident_styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Header, Title, Left, Body, Switch, Right, Card} from 'native-base';
import PropTypes from 'prop-types';
import {updateIncidentFirebase} from '../../actions/incidentsAction';
import ImagePicker from 'react-native-image-picker';
import {Toast} from 'native-base';
import Icon1 from 'react-native-vector-icons/MaterialIcons';

/**
 * Screen showing the edit options for the profile and personal information.
 * @extends Component
 */
class EditIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: this.props.incidentDetails.details,
      action: this.props.incidentDetails.action,
      urgency: this.props.incidentDetails.urgency,
      category: this.props.incidentDetails.category,
      items: this.props.incidentDetails.items,
      image: {
        isPresent: this.props.incidentDetails.image.isPresent,
        base64: this.props.incidentDetails.image.base64,
        uri: this.props.incidentDetails.image.uri,
      },
    };
  }

  /**
   * Displays a toast message
   *
   * @param {String} error
   * @param {String} type
   * @param {Number} duration
   */
  showToast(message, type = 'warning', duration = 2000) {
    Toast.show({
      text: message,
      type,
      duration,
    });
  }

  /**
   * Validates the details of the incident
   * to make sure it has correct information
   */
  validateDetails() {
    let {details} = this.state,
      error = null;

    if (!details || details.length <= 10) {
      error = 'Details should be 10 or more characters.';
    } else if (details.length > 1000) {
      error = 'Details should be less than 1000 characters.';
    }

    if (!error) {
      return true;
    }

    this.showToast(error);
    return false;
  }

  /**
   * Performs update
   */
  update = () => {
    Promise.resolve(
      this.props.updateIncidentFirebase(
        this.props.incident.incident.key,
        this.state,
      ),
    ).then(() => {
      this.showToast('Incident updated!', 'success');
      Actions.pop();
    });
  };

  /**
   * Updates the incident in firebase.
   * @return Updated incident
   */
  handleUpdate() {
    if (!this.validateTitle() || !this.validateDetails()) {
      return;
    } else {
      Alert.alert(
        '',
        'Do you want to update the incident details?',
        [
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: this.update,
          },
        ],
        {cancelable: false},
      );
    }
  }

  /**
   * This function provides options for adding incident image, and updates the image object.
   * @return updates the incident image.
   */
  _cameraImage() {
    var options = {
      title: 'Select Option',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        this.showToast('ImagePicker Error: ' + response.error);
      } else if (response.didCancel) {
      } else if (response.customButton) {
        this.showToast('User tapped custom button: ' + response.customButton);
      } else {
        this.setState({
          image: {
            isPresent: true,
            base64: response.data,
            uri: response.uri,
          },
        });
        this.showToast('Image Added!', 'success');
      }
    });
  }

  render() {
    console.log('state', this.state);
    console.log(this.props.action);
    let pickers;
    if (this.state.category == 'contribute') {
      if (this.props.action) {
        pickers = [<Picker.Item label="Picked" value="picked" key="picked" />];
      } else {
        pickers = [
          <Picker.Item label="To be picked" value="to_pick" key="to_pick" />,
        ];
      }
    } else {
      if (this.props.action) {
        pickers = [
          <Picker.Item label="Delivered" value="delivered" key="delivered" />,
        ];
      } else {
        pickers = [
          <Picker.Item label="Required" value="required" key="required" />,
        ];
      }
    }
    return (
      <View style={styles.container}>
        <Header androidStatusBarColor="#1c76cb">
          <Left>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => Actions.pop()}>
              <Icon name="close" size={40} color="white" />
            </TouchableOpacity>
          </Left>
          <Body>
            <Text style={styles.title}>
              Edit {this.state.category} Incident
            </Text>
          </Body>
        </Header>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {this.state.image.isPresent ? (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.image}
                resizeMethod={'resize'}
                source={{
                  uri: 'data:image/jpeg;base64, ' + this.state.image.base64,
                }}
              />
              <TouchableOpacity onPress={() => this._cameraImage()}>
                <Text style={styles.imageChangeText}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={() => this._cameraImage()}>
                <Text style={styles.imageText}>Add Image</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Action to be taken</Text>
          </View>
          <Picker
            selectedValue={this.state.action}
            onValueChange={action => {
              this.setState({action});
            }}
            style={styles.picker}>
            {pickers}
          </Picker>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Details</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            ref={input => (this.detailsInput = input)}
            onChangeText={details => this.setState({details})}
            returnKeyType="next"
            style={[styles.textInput, {height: 100}]}
            placeholder="Description"
            value={this.state.details}
            editable={!this.props.action}
          />
          {this.props.action ? (
            <View></View>
          ) : (
            <View style={styles.textInputHeadingContainer}>
              <Text style={[styles.textInputHeading, {flex: 3}]}>
                Urgency on a scale of 5
              </Text>
              <Picker
                value={this.state.urgency}
                selectedValue={this.state.urgency}
                onValueChange={urgency => {
                  this.setState({urgency});
                }}
                style={styles.urgencypicker}>
                {[...Array(5).keys()].map(item => {
                  return (
                    <Picker.Item
                      label={String(item + 1)}
                      value={String(item + 1)}
                      key={item}
                    />
                  );
                })}
              </Picker>
            </View>
          )}
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Items</Text>
          </View>
          {this.props.incident.loading && (
            <ActivityIndicator size="large" color="black" />
          )}
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => this.handleUpdate()}>
            <Text style={styles.updateText}> Update </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
EditIncident.propTypes = {
  updateIncidentFirebase: PropTypes.func.isRequired,
  incidentDetails: PropTypes.object,
  incident: PropTypes.object,
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
      updateIncidentFirebase: updateIncidentFirebase,
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
  incidentDetails: state.incident.incident.value,
  incident: state.incident,
});

export default connect(mapStateToProps, matchDispatchToProps)(EditIncident);
