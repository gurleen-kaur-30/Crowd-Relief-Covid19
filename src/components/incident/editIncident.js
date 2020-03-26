import React, { Component } from 'react';
import {
	Image,
	Text,
	View,
	Alert,
	ScrollView,
	TouchableOpacity,
	TextInput,
	ActivityIndicator,
	CheckBox
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { styles } from '../../assets/styles/editIncident_styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Header, Title, Left, Body, Switch, Right, Card } from 'native-base';
import getTheme from '../../assets/styles/native-base-theme/components';
import platform from '../../assets/styles/native-base-theme/variables/platform';
import PropTypes from 'prop-types';
import { updateIncidentFirebase } from '../../actions/incidentsAction';

var ImagePicker = require('react-native-image-picker');
import { Toast } from 'native-base';

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
			image: {
				isPresent: this.props.incidentDetails.image.isPresent,
				base64: this.props.incidentDetails.image.base64,
				uri: this.props.incidentDetails.image.uri
			},
			getHelp: this.props.incidentDetails.getHelp,
			visible: this.props.incidentDetails.visible
		};
	}

	/**
	 * Displays a toast message
	 * 
	 * @param {String} error 
	 * @param {String} type 
	 * @param {Number} duration 
	 */
	showToast (message, type = 'warning', duration = 2000) {
		Toast.show({
			text: message,
			type,
			duration
		});
	}

	/**
	 * Validates the title to make sure it has correct information
	 */
	validateTitle () {
		let { title } = this.state,
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
	validateDetails () {
		let { details } = this.state,
			error = null;

		if (!details || details.length <= 10) {
			error = 'Details should be 10 or more characters.';
		}
		else if (details.length > 1000) {
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
				this.state
			)
		).then(() => {
			this.showToast('Incident updated!', 'success');
			Actions.pop();
		});
	}

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
						style: 'cancel'
					},
					{
						text: 'Yes',
						onPress: this.update
					}
				],
				{ cancelable: false }
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
				path: 'images'
			}
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
						uri: response.uri
					}
				});
				this.showToast('Image Added!', 'success');
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
							onPress={() => Actions.pop()}
						>
							<Icon name="close" size={40} color="white" />
						</TouchableOpacity>
					</Left>
					<Body>
						<Text style={styles.title}>Edit Incident</Text>
					</Body>
				</Header>
				<ScrollView
					keyboardShouldPersistTaps="always"
					showsVerticalScrollIndicator={false}
				>
					{this.state.image.isPresent ? (
						<View style={styles.avatarContainer}>
							<Image
								style={styles.image}
								resizeMethod={'resize'}
								source={{
									uri:
										'data:image/jpeg;base64, ' +
										this.state.image.base64
								}}
							/>
							<TouchableOpacity
								onPress={() => this._cameraImage()}
							>
								<Text style={styles.imageChangeText}>
									Change Image
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.avatarContainer}>
							<TouchableOpacity
								onPress={() => this._cameraImage()}
							>
								<Text style={styles.imageText}>Add Image</Text>
							</TouchableOpacity>
						</View>
					)}
					<View style={styles.textInputHeadingContainer}>
						<Text style={styles.textInputHeading}>
							Incident Title
						</Text>
					</View>

					<TextInput
						ref={input => (this.titleInput = input)}
						onChangeText={title => this.setState({ title })}
						onSubmitEditing={() => this.detailsInput.focus()}
						returnKeyType="next"
						style={styles.textInput}
						placeholder="Title"
						value={this.state.title}
					/>
					<View style={styles.textInputHeadingContainer}>
						<Text style={styles.textInputHeading}>
							Incident Details
						</Text>
					</View>
					<TextInput
						multiline={true}
						numberOfLines={4}
						ref={input => (this.detailsInput = input)}
						onChangeText={details => this.setState({ details })}
						returnKeyType="next"
						style={styles.textInput}
						placeholder="Description"
						value={this.state.details}
					/>
					<View style={styles.switchContainer}>
						<Text style={styles.switchText}>Get Help!</Text>
						<Switch
							thumbTintColor="#1c76cb"
							onValueChange={getHelp => {
								this.setState({ getHelp: getHelp });
							}}
							value={this.state.getHelp}
						/>
					</View>
					<View style={styles.switchContainer}>
						<Text style={styles.switchText}>Share Publicly!</Text>
						<Switch
							thumbTintColor="#1c76cb"
							onValueChange={visible => {
								this.setState({ visible: visible });
							}}
							value={this.state.visible}
						/>
					</View>
					{this.props.incident.loading && <ActivityIndicator size="large" color="black" />}
					<TouchableOpacity
						style={styles.updateButton}
						onPress={() => this.handleUpdate()}
					>
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
	incident: PropTypes.object
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
			updateIncidentFirebase: updateIncidentFirebase
		},
		dispatch
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
	incident: state.incident
});

export default connect(mapStateToProps, matchDispatchToProps)(EditIncident);
