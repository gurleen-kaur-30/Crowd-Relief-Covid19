import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {onPressSignUp} from '../../actions/loginAction';
import {
  styles,
  passwordStrengthColors,
} from '../../assets/styles/signin_styles';
import PropTypes from 'prop-types';
import {Actions, ActionConst} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Feather';
import {Header, Title, Left, Body, Toast} from 'native-base';
import AnimatedBar from '../animatedBar';
import zxcvbn from 'zxcvbn';

/**
 * Screen for signup.
 * @extends Component
 */
class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      passStrength: 0,
      strengthType: 'weak',
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

  componentDidUpdate() {
    // Typical usage (don't forget to compare props):
    if (!this.props.login.loading && this.props.login.signInType !== null) {
      this.showToast('Registration successful', 'success');
      Actions.mapFeed();
    }
  }

  /**
   * Hides the Keyboard and calls onPressSignUp function in loginAction screen.
   */
  handleSignUp() {
    Keyboard.dismiss();
    if (
      this.validateEmail() &&
      this.validatePassword(this.state.password) &&
      this.validateName()
    ) {
      this.props.onPressSignUp(
        this.state.email,
        this.state.password,
        this.state.name,
      );
    }
  }

  /**
   * Validates the name
   */
  validateName() {
    let {name} = this.state,
      error = null;

    if (!name || name.length <= 3) {
      error = 'Name should be 3 or more characters';
    }
    // Checks for alphabhets and space
    else if (name && !/^[a-z\s]+$/i.test(name)) {
      error = 'Name can only contain alphabets';
    }

    if (!error) {
      return true;
    }

    this.showToast(error);
    return false;
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
   * Checks if a password is strong enough to match the criteria
   *
   * Criteria for Regex used:
   * - Password must be 8 or more characters
   * - Must contain 1 uppercase character
   * - Must contain 1 lowercase character
   * - Must contain 1 digit
   * - Must contain 1 special character
   *
   * @param {String} password
   */
  isValidPassword(password) {
    const passwordValidation = new RegExp(
      '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
    );
    return passwordValidation.test(password);
  }

  /**
   * Validates if the password entered by the user is strong enough
   * and matches the criteria
   * Launches toasts in case any of the criteria aren't fulfilled
   *
   * @param {String} inputPassword
   */
  validatePassword(inputPassword) {
    let isValid = this.isValidPassword(inputPassword);

    if (isValid && this.state.passStrength > 0.5) return true;
    else if (!isValid) {
      this.showToast(
        `Your password must contain at least one uppercase letter, 
				one lowercase letter, one number and one special character.`,
        'warning',
        3000,
      );
      return false;
    } else {
      this.showToast('Password is too weak');
      return false;
    }
  }

  /**
   * Uses zxcvbn library to generate the score of the password
   * Based on the score, decision is made whether is password strong
   * enough or not
   *
   * Also check if the password matches our criteria and isValid.
   * If it's not valid then the password strength remains 'weak'
   *
   * Otherwise it uses the zxcvbn's score to choose from the given
   * scoreStrengthMap
   *
   * This strengthType is being used to give the AnimatedBar
   * it's bar color according to the strength of the password
   *
   * @param {String} pass
   */
  changePassStrength(pass) {
    let passScore = zxcvbn(pass).score,
      scoreStrengthMap = ['weak', 'fair', 'fair', 'strong'],
      isValid = this.isValidPassword(pass);

    this.setState({
      // Total score ranges from 0 (being the least)
      // to 4 (being the most secure password)
      // Here diving it by 4 gives the passStrength
      // to go from a range of  0 -> 1
      passStrength: passScore / 3,

      // Checks if the password is valid and assigns a strengthType
      // accordingly
      strengthType: isValid ? scoreStrengthMap[passScore] : 'weak',
      password: pass,
    });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Header transparent androidStatusBarColor="#1c76cb">
          <Left>
            <TouchableOpacity onPress={() => Actions.pop()}>
              <Icon name="chevron-left" size={40} />
            </TouchableOpacity>
          </Left>
          <Body>
            <Title />
          </Body>
        </Header>
        <View style={styles.box}>
          <Text style={styles.heading}>Register</Text>
          <TextInput
            autoCorrect={false}
            ref={input => (this.nameInput = input)}
            onChangeText={name => this.setState({name})}
            onSubmitEditing={() => this.emailInput.focus()}
            returnKeyType="next"
            style={styles.input_field}
            placeholder="Full name"
          />
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            ref={input => (this.emailInput = input)}
            onChangeText={email => this.setState({email})}
            onSubmitEditing={() => this.passwordInput.focus()}
            keyboardType="email-address"
            returnKeyType="next"
            style={styles.input_field}
            placeholder="Email"
          />
          <TextInput
            ref={input => (this.passwordInput = input)}
            style={styles.input_field}
            onChangeText={password => this.changePassStrength(password)}
            // onSubmitEditing={() => this.passwordConfirmInput.focus()}
            returnKeyType="next"
            secureTextEntry={true}
            placeholder="Password"
          />
          <View style={{padding: 20}}>
            <AnimatedBar
              progress={this.state.passStrength}
              barColor={passwordStrengthColors[this.state.strengthType]}
              fillColor="#63a4ff"
            />
          </View>
          <TouchableOpacity
            style={styles.button_send}
            onPress={() => this.handleSignUp()}>
            <Text style={styles.button_text}> Register </Text>
          </TouchableOpacity>
          <Text style={[styles.passwordTip, {fontWeight: 'bold'}]}>
            Your password must
          </Text>
          <Text style={styles.passwordTip}>1. Have one uppercase letter</Text>
          <Text style={styles.passwordTip}>2. Have one lowercase letter</Text>
          <Text style={styles.passwordTip}>3. Have minimum 10 characters</Text>
          <Text style={styles.passwordTip}>4. Have one Special character</Text>
          <Text style={styles.passwordTip}>5. Have one Number</Text>
        </View>
        {this.props.login.loading ? (
          <ActivityIndicator size={'large'} color="white" />
        ) : null}
      </ScrollView>
    );
  }
}

/**
 * Checks that the functions specified as isRequired are present and warns if the
 * props used on this page does not meet the specified type.
 */
Signup.propTypes = {
  onPressSignUp: PropTypes.func.isRequired,
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
      onPressSignUp: onPressSignUp,
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

export default connect(mapStateToProps, matchDispatchToProps)(Signup);
