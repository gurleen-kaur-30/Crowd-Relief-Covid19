import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {styles} from '../../assets/styles/editProfile_styles';
import PropTypes from 'prop-types';
import {updateUserFirebase} from '../../actions/loginAction';
import Icon from 'react-native-vector-icons/EvilIcons';
import {Header, Title, Left, Body, Toast} from 'native-base';
import ImagePicker from 'react-native-image-picker';

/**
 * Screen showing the edit options for the profile and personal information.
 * @extends Component
 */
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      email: this.props.user.email,
      phone_no: this.props.user.phone_no,
      photo: this.props.user.photo,
      emergency_contact_name: this.props.user.emergency_contact_name,
      emergency_contact_phone_no: this.props.user.emergency_contact_phone_no,
      isChanged: false,
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
   * Validates the phone number
   */
  validatePhoneNumber(type, label, isRequired = false) {
    let phoneNumber = this.state[type],
      error = null,
      // In case the user enter the emergency contact number
      // then we need to validate it
      validate = (!isRequired && phoneNumber) || isRequired;

    if (validate && (!phoneNumber || phoneNumber.length !== 10)) {
      error = `${label} must contain 10 digits`;
    } else if (phoneNumber && !/^\d+$/.test(phoneNumber)) {
      error = `${label} can only contain digits`;
    }

    if (!error) {
      return true;
    }

    this.showToast(error);
    return false;
  }

  /**
   * Validates the name type
   */
  validateName(type, label, isRequired = false) {
    let name = this.state[type],
      error = null;

    if (isRequired && (!name || name.length <= 3)) {
      error = `${label} should be 3 or more characters`;
    }
    // Checks for alphabhets and space
    else if (name && !/^[a-z\s]+$/i.test(name)) {
      error = `${label} can only contain alphabets`;
    }

    if (!error) {
      return true;
    }

    this.showToast(error);
    return false;
  }

  /**
   * Runs over the names in the state and validates them
   * Returns false in case validation fails
   */
  validateAllNames() {
    return ![
      {key: 'name', label: 'Name', isRequired: true},
      {key: 'emergency_contact_name', label: 'Emergency contact name'},
    ].some(i => !this.validateName(i.key, i.label, i.isRequired));
  }

  /**
   * Runs over the phone numbers in the state and validates them
   * Returns false in case validation fails
   */
  validateAllPhoneNumbers() {
    return ![
      {key: 'phone_no', label: 'Phone number', isRequired: true},
      {
        key: 'emergency_contact_phone_no',
        label: 'Emergency contact phone number',
      },
    ].some(i => !this.validatePhoneNumber(i.key, i.label, i.isRequired));
  }

  /**
   * Validates the email entered by the user
   * against an acceptable regex pattern
   *
   */
  validateEmail() {
    let {email} = this.state;

    if (email === '') {
      this.showToast("You can't leave the email field blank!");
      return false;
    } else {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!email.match(mailformat)) {
        this.showToast('Please check your email format');
        return false;
      } else {
        return true;
      }
    }
  }

  /**
   * Update the user details in firebase
   * and show a toast on success
   */
  update = () => {
    this.props.updateUserFirebase(this.state).then(() => {
      this.showToast('Profile Updated', 'success');
      Actions.pop();
    });
  };

  handleUpdate() {
    if (
      !this.validateAllNames() ||
      !this.validateEmail() ||
      !this.validateAllPhoneNumbers() ||
      !this.state.isChanged
    ) {
      return;
    } else {
      this.update();
    }
  }

  /**
   * handle input change across TextInput
   */
  handleInput(name, value) {
    const state = this.state;
    state[name] = value;
    this.setState({...state, isChanged: true});
  }

  /**
   *  This function provides options for adding incident image, and updates the image object.
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
          photo: {
            url: '',
            base64: response.data,
          },
        });
        this.showToast('Image Added!', 'success');
        this.handleInput('isChanged', true);
      }
    });
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
            <Title>Profile Settings</Title>
          </Body>
        </Header>

        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              resizeMethod={'resize'}
              source={
                this.state.photo.url === ''
                  ? this.state.photo.base64 === ''
                    ? require('../../assets/images/boy.png')
                    : {
                        uri:
                          'data:image/jpeg;base64, ' + this.state.photo.base64,
                      }
                  : {uri: this.state.photo.url}
              }
            />
            <TouchableOpacity
              activeOpacity={0.4}
              onPress={() => this._cameraImage()}>
              <Text style={styles.userName}>Change Profile Photo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Name</Text>
            </View>
            <TextInput
              autoCorrect={false}
              ref={input => (this.nameInput = input)}
              onChangeText={name => this.handleInput('name', name)}
              onSubmitEditing={() => this.emailInput.focus()}
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Name"
              value={this.state.name}
            />
          </View>

          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Email</Text>
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              ref={input => (this.emailInput = input)}
              onChangeText={email => this.handleInput('email', email)}
              onSubmitEditing={() => this.phoneNoInput.focus()}
              keyboardType="email-address"
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Email"
              value={this.state.email}
            />
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Contact Number</Text>
            </View>
            <TextInput
              autoCorrect={false}
              ref={input => (this.phoneNoInput = input)}
              onChangeText={phone_no => this.handleInput('phone_no', phone_no)}
              onSubmitEditing={() => this.emergencyContactNameInput.focus()}
              keyboardType="phone-pad"
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Phone No."
              value={this.state.phone_no}
            />
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Emergency Contact Name</Text>
            </View>
            <TextInput
              autoCorrect={false}
              ref={input => (this.emergencyContactNameInput = input)}
              onChangeText={emergency_contact_name =>
                this.handleInput(
                  'emergency_contact_name',
                  emergency_contact_name,
                )
              }
              onSubmitEditing={() => this.emergencyContactPhoneInput.focus()}
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Contact Name"
              value={this.state.emergency_contact_name}
            />
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Emergency Contact Number</Text>
            </View>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              ref={input => (this.emergencyContactPhoneInput = input)}
              onChangeText={emergency_contact_phone_no =>
                this.handleInput(
                  'emergency_contact_phone_no',
                  emergency_contact_phone_no,
                )
              }
              keyboardType="phone-pad"
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Contact Number"
              value={this.state.emergency_contact_phone_no}
            />
          </View>
          {this.props.updateLoading && (
            <ActivityIndicator size={'large'} color="black" />
          )}
          <TouchableOpacity
            disabled={!this.state.isChanged}
            activeOpacity={0.7}
            style={
              this.state.isChanged
                ? styles.updateButton
                : [styles.updateButton, {backgroundColor: '#7f7f7f'}]
            }
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
EditProfile.propTypes = {
  updateUserFirebase: PropTypes.func.isRequired,
  user: PropTypes.object,
  updateLoading: PropTypes.bool,
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
      updateUserFirebase: updateUserFirebase,
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
  updateLoading: state.login.loading,
});

export default connect(mapStateToProps, matchDispatchToProps)(EditProfile);
