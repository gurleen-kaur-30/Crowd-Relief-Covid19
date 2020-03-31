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
} from 'react-native';
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
import CheckBox from '@react-native-community/checkbox';
import ImageResizer from 'react-native-image-resizer';

/**
 * Screen for adding an incident.
 * @extends Component
 */
class AddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incident: {
        details: null,
        visible: true,
        timestamp: new Date().toString(),
        location: {
          coordinates: this.props.location.curr_coordinates,
        },
        category: this.props.category,
        user_id: this.props.login.userDetails.email,
        image: {
          isPresent: false,
          path: '',
          uri: '',
        },
        items: [],
        action: this.props.action,
        urgency: 1,
      },
      disable: false,
      checkboxList: [],
    };
  }

  UNSAFE_componentWillMount() {
    var a = [];
    this.props.items.all_items.forEach(function(item) {
      a.push({
        name: item.key,
        quantity: item.value.quantity,
        unit: 0,
        status: 0,
        include: false,
      });
    });
    this.setState({checkboxList: a});
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

  updateUrgency = urgency => {
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
    var items2store = this.state.checkboxList.filter(function(item) {
      if (item.include) {
        return true;
      }
    });
    this.setState({
      incident: {
        ...this.state.incident,
        items: items2store,
      },
    });
    console.log(this.state.incident);
    if (items2store.length !== 0) {
      this.props
        .addIncidentToFirebase(this.state.incident) // waits till incident details are updated in redux
        .then(result => {
          Actions.pop(); // set markers on map page to result from firebase.
        });
    } else {
      this.showToast('Please select atleast 1 item');
    }
  };

  /**
   * The function is used to update incident details with the details entered by the user.
   */
  handleAddIncident() {
    Keyboard.dismiss();

    // Validate the title and the details
    if (!this.validateDetails()) {
      return;
    }

    if (
      this.state.incident.details === null ||
      this.state.incident.category === null ||
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
        ImageResizer.createResizedImage(
          response.uri,
          100,
          100,
          'JPEG',
          80,
          (rotation = 0),
        ).then(response => {
          console.log(response);
          this.setState({
            incident: {
              ...this.state.incident,
              image: {
                isPresent: true,
                path: response.path,
                uri: response.uri,
              },
            },
          });
        });

        this.showToast('Image Added!', 'success');
      }
    });
  };

  addValues = (inputItem, index, index2) => {
    let dataArray = this.state.checkboxList;
    console.log(inputItem, index, index2);
    let item = dataArray[index];
    if (index2 == 0) {
      item.include = inputItem;
    } else if (index2 == 1) {
      if (inputItem == '-') {
        this.unitTextInput.clear();
        Alert.alert('Please enter a positive number');
      }
      item.unit = inputItem;
    }
    dataArray[index] = item;
    this.setState({
      checkboxList: dataArray,
    });
    console.log(this.state.checkboxList);
  };

  render() {
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
                  uri: this.state.incident.image.uri,
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
            <Text style={styles.textInputHeading}>
              Kind of incident: {this.state.incident.category}
            </Text>
          </View>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>
              Action to be taken: {this.state.incident.action}
            </Text>
          </View>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Details</Text>
          </View>
          <TextInput
            ref={input => (this.detailsInput = input)}
            style={[styles.textInput, {height: 100}]}
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
            <Text style={[styles.textInputHeading, {flex: 3}]}>
              Urgency on a scale of 5
            </Text>
            <Picker
              selectedValue={this.state.incident.urgency}
              onValueChange={urgency => {
                this.updateUrgency(urgency);
              }}
              style={styles.urgencypicker}>
              {[...Array(5).keys()].map(item => {
                return (
                  <Picker.Item
                    label={String(item + 1)}
                    value={item + 1}
                    key={item}
                  />
                );
              })}
            </Picker>
          </View>
          {this.state.checkboxList.map((item, index) => {
            return (
              <View style={styles.itemList} key={index}>
                <CheckBox
                  style={styles.checkbox}
                  color="#3a54ff"
                  value={this.state.checkboxList[index].include}
                  onValueChange={val => this.addValues(val, index, 0)}
                />
                <Text style={styles.checkboxTitle}>
                  {item.name} ( {item.quantity} )
                </Text>
                <TextInput
                  autoCorrect={false}
                  ref={input => {
                    this.unitTextInput = input;
                  }}
                  keyboardType="numeric"
                  style={styles.name}
                  placeholder={'units'}
                  onChangeText={text => this.addValues(text, index, 1)}
                />
              </View>
            );
          })}
          {this.props.incident.loading && (
            <ActivityIndicator size="large" color="black" />
          )}
          <TouchableOpacity
            disabled={this.state.disable}
            style={styles.updateButton}
            onPress={() => this.handleAddIncident()}>
            <Text style={styles.updateText}> Add Incident</Text>
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
  items: state.items,
});

export default connect(mapStateToProps, matchDispatchToProps)(AddIncident);
