import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Picker,
  CheckBox,
} from 'react-native';
import {AccessToken, LoginManager, LoginButton} from 'react-native-fbsdk';
import {Header, Title, Left, Body, Switch, Right, Card} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addIncidentToFirebase} from '../actions/incidentsAction';
import {Actions} from 'react-native-router-flux';
import {styles} from '../assets/styles/addincident_styles';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import {Toast} from 'native-base';
import Slider from '@react-native-community/slider';

/**
 * Screen for adding an incident.
 * @extends Component
 */
class AddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incident: {
        title: null,
        details: null,
        visible: true,
        timestamp: new Date().toString(),
        location: {
          coordinates: this.props.location.curr_coordinates,
        },
        category: null,
        user_id: this.props.login.userDetails.email,
        image: {
          isPresent: false,
          base64: '',
          uri: '',
        },
        item: [],
        action: null,
        urgency: null,
      },
      disable: false,
    };
  }

  /**
   * Updates category of incident chosen by user.
   * @param  {string} category The category selected by the user.
   * @return category of the incident gets updated.
   */
  updateCategory = category => {
    this.setState({
      incident: {
        ...this.state.incident,
        category: category,
      },
    });
  };

  updateAction = action => {
    this.setState({
      incident: {
        ...this.state.incident,
        action: action,
      },
    });
  };

  updateSliderValue = urgency => {
    this.setState({
      incident: {
        ...this.state.incident,
        urgency: urgency,
      },
    });
    console.log(this.state);
  };

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
   * Validates the title to make sure it has correct information
   */
  validateTitle() {
    let {title} = this.state.incident,
      error = null;

    if (!title || title.length <= 3) {
      error = 'Title should be 3 or more characters';
    }
    // Checks for alpha numeric
    else if (!/^[a-z0-9\s]+$/i.test(title)) {
      error = 'Title can contain only alphabets and numbers';
    }

    if (!error) {
      return true;
    }

    this.showToast(error);
    return false;
  }

  /**
   * Validates the details of the incident
   * to make sure it has correct information
   */
  validateDetails() {
    let {details} = this.state.incident,
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
   * Add the incident to firebase
   */
  addIncident = () => {
    this.props
      .addIncidentToFirebase(this.state.incident) // waits till incident details are updated in redux
      .then(result => {
        Actions.pop(); // set markers on map page to result from firebase.
      });
  };

  /**
   * The function is used to update incident details with the details entered by the user.
   */
  handleAddIncident() {
    Keyboard.dismiss();

    // Validate the title and the details
    if (!this.validateTitle() || !this.validateDetails()) {
      return;
    }

    if (
      this.state.incident.title === null ||
      this.state.incident.details === null ||
      this.state.incident.category === null ||
      this.state.incident.urgency === null ||
      this.state.incident.action === null
    ) {
      this.showToast('Please dont leave any field blank');
    } else {
      this.setState({disable: true});
      Alert.alert(
        '',
        'Are the details provided by you correct?',
        [
          {
            text: 'No',
            onPress: () => {},
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: this.addIncident,
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
  _cameraImage = () => {
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
          incident: {
            ...this.state.incident,
            image: {
              isPresent: true,
              base64: response.data,
              uri: response.uri,
            },
          },
        });
        this.showToast('Image Added!', 'success');
      }
    });
  };

  render() {
    let pickers;
    if (this.state.incident.category == 'contribute') {
      pickers = [
        <Picker.Item label="Choose" value={null} key="null" />,
        <Picker.Item label="To be picked" value="to_pick" key="to_pick" />,
        <Picker.Item label="Picked" value="picked" key="picked" />,
      ];
    } else {
      pickers = [
        <Picker.Item label="Choose" value={null} key="null" />,
        <Picker.Item label="Required" value="required" key="required" />,
        <Picker.Item label="Delivered" value="delivered" key="delivered" />,
      ];
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
            <Text style={styles.title}>Add Incident</Text>
          </Body>
        </Header>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarContainer}>
            {this.state.incident.image.isPresent ? (
              <Image
                style={styles.image}
                resizeMethod={'resize'}
                source={{
                  uri:
                    'data:image/jpeg;base64, ' +
                    this.state.incident.image.base64,
                }}
              />
            ) : null}
            <TouchableOpacity onPress={() => this._cameraImage()}>
              <View style={styles.cameraContainer}>
                <Icon name="camera" size={40} color="white" />
                {this.state.incident.image.isPresent ? (
                  <Text style={styles.imageChangeText}>Change Image</Text>
                ) : (
                  <Text style={styles.imageText}>Add Image</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Kind of incident</Text>
          </View>
          <Picker
            selectedValue={this.state.incident.category}
            onValueChange={category => {
              this.updateCategory(category);
            }}
            style={styles.picker}>
            <Picker.Item label="Relief" value="relief" />
            <Picker.Item label="Contribution" value="contribute" />
          </Picker>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Action to be taken</Text>
          </View>
          <Picker
            selectedValue={this.state.incident.action}
            onValueChange={action => {
              this.updateAction(action);
            }}
            style={styles.picker}>
            {pickers}
          </Picker>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Title</Text>
          </View>

          <TextInput
            style={styles.textInput}
            ref={input => (this.titleInput = input)}
            onChangeText={title =>
              this.setState({
                incident: {
                  ...this.state.incident,
                  title: title,
                },
              })
            }
            onSubmitEditing={() => this.detailsInput.focus()}
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="Title"
          />
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Details</Text>
          </View>
          <TextInput
            ref={input => (this.detailsInput = input)}
            style={styles.textInput}
            onChangeText={details =>
              this.setState({
                incident: {
                  ...this.state.incident,
                  details: details,
                },
              })
            }
            multiline={true}
            numberOfLines={4}
            returnKeyType="next"
            placeholder="Description"
          />

          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Urgency on a scale of 5</Text>
          </View>
          <Slider
            minimumTrackTintColor="#4c93f7"
            thumbColor="#1c76cb"
            maximumTrackTintColor="#9bd5ff"
            thumbTouchSize={{
              width: 100,
              height: 100,
            }}
            step={1}
            minimumValue={1}
            maximumValue={5}
            onSlidingComplete={urgency => this.updateSliderValue(urgency)}
            onValueChange={urgency => this.updateSliderValue(urgency)}
          />
          {/* <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Get Help!</Text>
            <Switch
              thumbColor="#1c76cb"
              onValueChange={getHelp => {
                this.setState({
                  incident: {
                    ...this.state.incident,
                    getHelp: getHelp,
                  },
                });
              }}
              value={this.state.incident.getHelp}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Share Publicly!</Text>
            <Switch
              thumbColor="#1c76cb"
              onValueChange={visible => {
                this.setState({
                  incident: {
                    ...this.state.incident,
                    visible: visible,
                  },
                });
              }}
              value={this.state.incident.visible}
            />
          </View> */}
          {this.props.incident.loading && (
            <ActivityIndicator size="large" color="black" />
          )}
          <TouchableOpacity
            disabled={this.state.disable}
            style={styles.updateButton}
            onPress={() => this.handleAddIncident()}>
            <Text style={styles.updateText}> Add </Text>
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
AddIncident.propTypes = {
  addIncidentToFirebase: PropTypes.func.isRequired,
  login: PropTypes.object,
  location: PropTypes.object,
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
      addIncidentToFirebase: addIncidentToFirebase,
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
  login: state.login,
  location: state.location,
  incident: state.incident,
});

export default connect(mapStateToProps, matchDispatchToProps)(AddIncident);
