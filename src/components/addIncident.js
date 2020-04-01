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
  Dimensions,
  Modal,
  TouchableHighlight,
} from 'react-native';
import {Header, Title, Left, Body, Switch, Right, Card} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addIncidentToFirebase} from '../actions/incidentsAction';
import {Actions} from 'react-native-router-flux';
import {styles} from '../assets/styles/addincident_styles';
import PropTypes from 'prop-types';
import {Toast} from 'native-base';
import CheckBox from '@react-native-community/checkbox';
import ImagePicker from 'react-native-image-crop-picker';
const {width, height} = Dimensions.get('window');

/**
 * Screen for adding an incident.
 * @extends Component
 */
class AddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
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
  selectFromGallery = () => {
    ImagePicker.openPicker({
      cropping: false,
      compressImageQuality: 0.8,
      compressImageMaxWidth: width,
      compressImageMaxHeight: height,
      includeBase64: true,
    }).then(image => {
      this.setState(
        {
          incident: {
            ...this.state.incident,
            image: {
              isPresent: true,
              mime: image.mime,
              base64: image.data,
              uri: image.path,
            },
          },
        },
        this.showToast('Image Added!', 'success'),
      );
    });
  };

  selectFromCamera = () => {
    ImagePicker.openCamera({
      cropping: false,
      compressImageQuality: 0.8,
      compressImageMaxWidth: width,
      compressImageMaxHeight: height,
      includeBase64: true,
    }).then(image => {
      console.log(image);
      this.setState(
        {
          incident: {
            ...this.state.incident,
            image: {
              isPresent: true,
              mime: image.mime,
              base64: image.data,
              uri: image.path,
            },
          },
        },
        this.showToast('Image Added!', 'success'),
      );
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
        Alert.alert('please enter a positive number');
        this.unitTextInput.clear();
      }
      item.unit = inputItem;
    }
    dataArray[index] = item;
    this.setState({
      checkboxList: dataArray,
    });
    console.log(this.state.checkboxList);
  };

  openGallery() {
    this.setState({modalVisible: false}, () => this.selectFromGallery());
  }
  openCamera() {
    this.setState({modalVisible: false}, () => this.selectFromCamera());
  }

  render() {
    return (
      <ScrollView>
       <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={()=> this.setState({modalVisible: false})}
        >
        <TouchableOpacity onPress={()=>this.setState({modalVisible: false})} style={styles.modalContainer}>
            <View style={[styles.photoModal,styles.modalShadow]}>
                <TouchableOpacity style={styles.photoModalOption} onPress={()=>this.openCamera()}>
                    <Text style={styles.photoModalText}>Click Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoModalOption} onPress={()=>this.openGallery()}>
                    <Text style={styles.photoModalText}>Choose from Gallery</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
        </Modal>
        <View style={[styles.container, this.state.modalVisible?{opacity: 0.3}:{opacity:1}]}>
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
                    uri: `data:${this.state.incident.image.mime};base64,${this.state.incident.image.base64}`,
                  }}
                />
              ) : null}
              <TouchableOpacity
                onPress={() => this.setState({modalVisible: true})}>
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
                Urgency (1 is lowest)
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
              <Text style={styles.updateText}> Save</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
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
