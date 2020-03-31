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
      user: {
        name: this.props.user.name,
        email: this.props.user.email,
        phone_no: this.props.user.phone_no,
        photo: this.props.user.photo,
        agency: this.props.user.agency,
      },
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
    let phoneNumber = this.state.user[type],
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
    let name = this.state.user[type],
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
      {key: 'agency', label: 'Agency Name'},
    ].some(i => !this.validateName(i.key, i.label, i.isRequired));
  }

  /**
   * Runs over the phone numbers in the state and validates them
   * Returns false in case validation fails
   */
  validateAllPhoneNumbers() {
    return ![{key: 'phone_no', label: 'Phone number', isRequired: true}].some(
      i => !this.validatePhoneNumber(i.key, i.label, i.isRequired),
    );
  }

  /**
   * Update the user details in firebase
   * and show a toast on success
   */
  update = () => {
    this.props.updateUserFirebase(this.state.user).then(() => {
      this.showToast('Profile Updated', 'success');
      Actions.pop();
    });
  };

  handleUpdate() {
    if (
      !this.validateAllNames() ||
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
    const state = this.state.user;
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
          user: {
            ...this.state.user,
            photo: {
              url: '',
              base64: response.data,
            },
          },
        });
        this.showToast('Image Added!', 'success');
        this.handleInput('isChanged', true);
      }
    });
  };

  render() {
    var user = this.state.user;
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
                user.photo.url === ''
                  ? user.photo.base64 === ''
                    ? require('../../assets/images/boy.png')
                    : {
                        uri: 'data:image/jpeg;base64, ' + user.photo.base64,
                      }
                  : {uri: user.photo.url}
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
              value={user.name}
            />
          </View>

          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Email</Text>
            </View>
            <Text style={styles.textInput}>{user.email}</Text>
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Contact Number</Text>
            </View>
            <TextInput
              autoCorrect={false}
              ref={input => (this.phoneNoInput = input)}
              onChangeText={phone_no => this.handleInput('phone_no', phone_no)}
              onSubmitEditing={() => this.agencyNameInput.focus()}
              keyboardType="phone-pad"
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Phone No."
              value={user.phone_no}
            />
          </View>
          <View style={styles.valueItem}>
            <View style={styles.valueTextContainer}>
              <Text style={styles.valueText}>Agency Name</Text>
            </View>
            <TextInput
              autoCorrect={false}
              ref={input => (this.agencyNameInput = input)}
              onChangeText={agency => this.handleInput('agency', agency)}
              returnKeyType="next"
              style={styles.textInput}
              underlineColorAndroid="transparent"
              placeholder="Agency Name"
              value={user.agency}
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
