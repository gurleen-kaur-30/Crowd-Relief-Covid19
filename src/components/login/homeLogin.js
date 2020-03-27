import React, {Component} from 'react';
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {fbSignIn, googleSignin} from '../../actions/loginAction';
import {Actions, ActionConst} from 'react-native-router-flux';
import {styles} from '../../assets/styles/homeScreen_styles';
import {GoogleSignin} from '@react-native-community/google-signin';
import Config from 'react-native-config';
import PropTypes from 'prop-types';
import {Toast} from 'native-base';
import Slides from '../introSlides';
import AsyncStorage from '@react-native-community/async-storage';

/**
 * Screen showing all login options.
 * @extends Component
 */
class HomeLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onboarding: 'done',
    };
  }

  componentDidMount() {
    GoogleSignin.configure({
      webClientId: "180312338542-6rbr8ph1d3m8rtesuushqe4vrrmsvdci.apps.googleusercontent.com",
      scopes: [],
      offlineAccess: true, 
      hostedDomain: '', 
      loginHint: '', 
      forceConsentPrompt: true, 
      accountName: '',
    });

    // Only show onboarding screens
    // when the app launches for the first time
    // after that, do not show these screens again on the home screen
    AsyncStorage.getItem('onboarding')
      .then(isOnboardingDone => {
        if (!isOnboardingDone) {
          this.setState({
            onboarding: 'pending',
          });
          AsyncStorage.setItem('onboarding', 'done').done();
        } else {
          this.setState({
            onboarding: isOnboardingDone,
          });
        }
      })
      .done();
  }

  componentDidUpdate() {
    // Typical usage (don't forget to compare props):
    if (!this.props.login.loading && this.props.login.signInType !== null) {
      Toast.show({
        text: 'Login successful',
        type: 'success',
        duration: 2000,
      });
      Actions.profile();
    }
  }

  googleSignIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        this.props.googleSignin(userInfo)
    } catch (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
         } else {
        // some other error happened
        }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.heading}>
          <Image
            source={require('../../assets/images/earthquake.png')}
            style={styles.logo}
          />
          <Text style={styles.welcome}> Crowd Alert </Text>
        </View>
        {this.props.login.loading ? (
          <ActivityIndicator size={'large'} color="white" />
        ) : null}
        <View style={styles.button_container}>
          <Text style={styles.login_text_heading}> LOGIN WITH </Text>
          <TouchableOpacity
            style={[styles.button_google, styles.loginButton]}
            onPress={() => this.googleSignIn()}>
            <Text style={styles.button_login_text}> Google </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button_fb, styles.loginButton]}
            onPress={() => this.props.fbSignIn()}>
            <Text style={styles.button_login_text}> Facebook </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button_email, styles.loginButton]}
            onPress={() => Actions.signin()}>
            <Text style={styles.button_login_text}> Email </Text>
          </TouchableOpacity>
        </View>
        {/* {this.state.onboarding === 'pending' && <Slides />} */}
      </View>
    );
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
HomeLogin.propTypes = {
  fbSignIn: PropTypes.func.isRequired,
  googleSignin: PropTypes.func.isRequired,
  login: PropTypes.object,
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
      fbSignIn: fbSignIn,
      googleSignin: googleSignin,
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
});

export default connect(mapStateToProps, matchDispatchToProps)(HomeLogin);
