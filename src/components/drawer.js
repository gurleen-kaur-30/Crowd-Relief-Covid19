import React, {Component} from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Alert,
  ScrollView,
  Image,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Actions} from 'react-native-router-flux';
import {styles} from '../assets/styles/drawer_styles';
import PropTypes from 'prop-types';
import {logout} from '../actions/loginAction';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import Icon from 'react-native-vector-icons/Feather';
import {Toast} from 'native-base';

/**
 * Content for the side drawer
 * @extends Component
 */

class DrawerContent extends Component {
  /**
   * Performs logout action
   */
  logout = () => {
    Promise.resolve(Actions.reset('homeLogin')).then(() => {
      this.props.logout();
      Toast.show({
        text: 'You have been logged out!',
        type: 'success',
        duration: 2000,
      });
      FilesystemStorage.clear();
    });
  };

  handleLogout() {
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: this.logout,
        },
      ],
      {cancelable: false},
    );
  }

  onClickDashboard() {
    Actions.profile();
    Actions.drawerClose();
  }

  onClickMapFeed() {
    Actions.mapFeed();
    Actions.drawerClose();
  }

  onClickEmergencyLocation() {
    Actions.emergencylocation();
    Actions.drawerClose();
  }

  onClickSettingsOption() {
    Actions.editProfile();
    Actions.drawerClose();
  }

  render() {
    if (this.props.user === null) {
      return <ActivityIndicator size={'large'} />;
    } else {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.userHeader}>
            <TouchableHighlight onPress={Actions.editProfile}>
              <Image
                style={styles.userImage}
                source={
                  this.props.user.photo.url === ''
                    ? this.props.user.photo.uri === ''
                      ? require('../assets/images/boy.png')
                      : {
                          uri: this.props.user.photo.uri,
                        }
                    : {uri: this.props.user.photo.url}
                }
              />
            </TouchableHighlight>
            <Text style={styles.userName}>{this.props.user.name}</Text>
          </View>

          <View style={styles.bar} />
          <TouchableHighlight onPress={() => this.onClickDashboard()}>
            <Text style={styles.option}>Dashboard</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.onClickMapFeed()}>
            <Text style={styles.option}>Map / Feed</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.onClickEmergencyLocation()}>
            <Text style={styles.option}>Emergency locations</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.onClickSettingsOption()}>
            <Text style={styles.option}>Settings</Text>
          </TouchableHighlight>
          {/* <TouchableHighlight onPress={Actions.aboutUs}>
						<Text style={styles.option}>About us</Text>
					</TouchableHighlight> */}
          <TouchableHighlight
            onPress={() => {
              this.handleLogout();
            }}>
            <View style={styles.logout}>
              <Icon
                name="log-out"
                size={22}
                style={styles.logoutIcon}
                color="white"
              />
              <Text style={styles.logoutOption}>Logout</Text>
            </View>
          </TouchableHighlight>
        </ScrollView>
      );
    }
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
DrawerContent.propTypes = {
  user: PropTypes.object,
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
      logout: logout,
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
});

export default connect(mapStateToProps, matchDispatchToProps)(DrawerContent);
