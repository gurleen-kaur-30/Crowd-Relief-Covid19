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
import Slider from '@react-native-community/slider';

/**
 * Screen showing the edit options for the profile and personal information.
 * @extends Component
 */
class EditIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.incidentDetails.title,
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
   * Validates the title to make sure it has correct information
   */
  validateTitle() {
    let {title} = this.state,
      error = null;

    if (!title || title.length <= 3) {
      error = 'Title should be 3 or more characters';
    }
    // Checks for alpha numeric
    // else if (!/^[a-z0-9\s]+$/i.test(title)) {
    //   error = 'Title can contain only alphabets and numbers';
    // }

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

  updateSliderValue = urgency => {
    this.setState({
      urgency: urgency,
    });
    console.log(this.state);
  };

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

  updateValues = (text, index, index2) => {
    let dataArray = this.state.items;
    if( dataArray[index] ){
      let item = dataArray[index]
      if( index2 == 0 ){
        item.name = text
      } else if( index2 == 1 ){
        item.quantity = text
      } else{
        item.unit = text
      }
      dataArray[index] = item

    } else{
      let item = {name :"", quantity: "", unit: ""}
      if( index2 == 0 ){
        item.name = text
      } else if( index2 == 1 ){
        item.quantity = text
      } else{
        item.unit = text
      }
      dataArray[index] = item

    }
    this.setState({items: dataArray}, console.log(this.state.items));
  };

  render() {
    console.log("items",this.state.items)
    let pickers;
    if (this.state.category == 'contribute') {
      pickers = [
        <Picker.Item label="To be picked" value="to_pick" key="to_pick" />,
        <Picker.Item label="Picked" value="picked" key="picked" />,
      ];
    } else {
      pickers = [
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
            <Text style={styles.title}>Edit Incident</Text>
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
            <Text style={styles.textInputHeading}>Incident Title</Text>
          </View>
          <TextInput
            ref={input => (this.titleInput = input)}
            onChangeText={title => this.setState({title})}
            onSubmitEditing={() => this.detailsInput.focus()}
            returnKeyType="next"
            style={styles.textInput}
            placeholder="Title"
            value={this.state.title}
          />
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Details</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            ref={input => (this.detailsInput = input)}
            onChangeText={details => this.setState({details})}
            returnKeyType="next"
            style={styles.textInput}
            placeholder="Description"
            value={this.state.details}
          />
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Urgency on a scale of 5</Text>
          </View>
          <Slider
            value={this.state.urgency}
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
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Items</Text>
          </View>
          {this.state.items.map( (item, index) => {
            return(
              <View style={styles.itemsRow}>
            <TextInput
              key={index}  
              onChangeText={text => this.updateValues(text, index, 0)}
              // onSubmitEditing={() => this.detailsInput.focus()}
              keyboardType="email-address"
              returnKeyType="next"
              placeholder={item.name}
              style={styles.name}
              placeholderTextColor={"black"}
            />
            <TextInput 
              ref={input => (this.titleInput = input)}
              // key={String(index) + '1'}
              style={styles.name} 
              keyboardType={'numeric'}
              onChangeText={text => this.updateValues(text, index, 1)}
              // onSubmitEditing={() => this.detailsInput.focus()}
              returnKeyType="next"
              placeholder={item.quantity}
              placeholderTextColor={"black"}
            />
            <Picker
                selectedValue={item.unit}
                onValueChange={unit => {
                  this.updateValues(unit, index, 2);
                }}
                style={styles.name}>
                <Picker.Item label="Unit" value="unit" />
                <Picker.Item label="kg" value="kg" />
                <Picker.Item label="gm" value="gm" />
                <Picker.Item label="ltr" value="ltr" />
                <Picker.Item label="ml" value="ml" />
              </Picker>
            </View>
            )
          })
        }
           
         {/* <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Get Help!</Text>
            <Switch
              thumbColor="#1c76cb"
              onValueChange={getHelp => {
                this.setState({getHelp: getHelp});
              }}
              value={this.state.getHelp}
            />
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.switchText}>Share Publicly!</Text>
            <Switch
              thumbColor="#1c76cb"
              onValueChange={visible => {
                this.setState({visible: visible});
              }}
              value={this.state.visible}
            />
          </View>  */}
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
