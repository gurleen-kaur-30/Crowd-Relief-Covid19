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
  Button,
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
import ImageResizer from 'react-native-image-resizer';
import CheckBox from '@react-native-community/checkbox';

/**
 * Screen showing the edit options for the profile and personal information.
 * @extends Component
 */
class EditIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxList: [],
      incident: this.props.incidentDetails,
      metaItems: this.props.incidentDetails.items,
    };
  }

  UNSAFE_componentWillMount() {
    var a = [];
    this.props.items.all_items.forEach(function(item) {
      a.push({
        name: item.key,
        quantity: item.value.quantity,
        unit: null,
        status: 0,
        include: false,
      });
    });
    this.state.incident.items.forEach(function(item) {
      a.forEach(function(item2) {
        if (item.name === item2.name) {
          item2.unit = item.unit;
          item2.status = item.status;
          item2.include = item.include;
        }
      });
    });
    this.setState({checkboxList: a});
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

  updateDetails(details) {
    this.setState({
      incident: {
        ...this.state.incident,
        details: details,
      },
    });
  }

  /**
   * Performs update
   */
  update = () => {
    if (this.props.action) {
      var items = this.state.metaItems;
      var count = 0;
      var new_action = '';
      var visible = this.state.incident.visible;
      items.forEach(function(item) {
        if (item.change) {
          item.unit = (parseInt(item.unit) - parseInt(item.change)).toString();
          if (parseInt(item.unit) <= 0) {
            item.status = 1;
            item.unit = '0';
            count += 1;
          }
          delete item.change;
        }
      });
      if (count == items.length) {
        if (this.state.incident.category == 'contribute') {
          new_action = 'picked';
        } else {
          new_action = 'delivered';
        }
        visible = false;
      } else {
        if (this.state.incident.category == 'contribute') {
          new_action = 'to_be_picked';
        } else {
          new_action = 'required';
        }
      }
      this.setState({
        incident: {
          ...this.state.incident,
          items: items,
          action: new_action,
          visible: visible,
        },
      });

      Promise.resolve(
        this.props.updateIncidentFirebase(
          this.props.incident.incident.key,
          this.state.incident,
        ),
      ).then(() => {
        this.showToast('Incident updated!', 'success');
        Actions.pop();
      });
    } else {
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

      if (items2store.length !== 0) {
        Promise.resolve(
          this.props.updateIncidentFirebase(
            this.props.incident.incident.key,
            this.state.incident,
          ),
        ).then(() => {
          this.showToast('Incident updated!', 'success');
          Actions.pop();
        });
      } else {
        this.showToast('Please select atleast 1 item');
      }
    }
  };

  /**
   * Updates the incident in firebase.
   * @return Updated incident
   */
  handleUpdate() {
    if (!this.validateDetails()) {
      return;
    }
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
  }

  changeUnits(units, item) {
    console.log(units, item);
    let items = this.state.metaItems;

    items[items.indexOf(item)]['change'] = units;
    console.log(items);
    this.setState({
      metaItems: items,
    });
  }

  addValues = (inputItem, index, index2) => {
    let dataArray = this.state.checkboxList;
    console.log(inputItem, index, index2);
    let item = dataArray[index];
    if (index2 == 0) {
      item.include = inputItem;
    } else if (index2 == 1) {
      item.unit = inputItem;
    }
    dataArray[index] = item;
    this.setState({
      checkboxList: dataArray,
    });
    console.log(this.state.checkboxList);
  };

  render() {
    console.log('state', this.state);
    console.log(this.props.action);
    if (this.props.action) {
      var items = this.state.incident.items;
    } else {
      var items = this.state.checkboxList;
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
            <Text style={styles.title}>
              {this.props.action ? this.state.incident.category : 'Edit'}{' '}
              incident
            </Text>
          </Body>
        </Header>
        <ScrollView
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {this.state.incident.image.isPresent ? (
            <View style={styles.avatarContainer}>
              <Image
                style={styles.image}
                resizeMethod={'resize'}
                source={{
                  uri: this.state.incident.image.uri,
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
            <Text style={styles.textInputHeading}>
              Current Action: {this.state.incident.action}
            </Text>
          </View>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Incident Details</Text>
          </View>
          <TextInput
            multiline={true}
            numberOfLines={4}
            ref={input => (this.detailsInput = input)}
            onChangeText={details => {
              this.updateDetails(details);
            }}
            returnKeyType="next"
            style={[styles.textInput, {height: 100}]}
            placeholder="Description"
            value={this.state.incident.details}
            editable={!this.props.action}
          />
          {this.props.action ? (
            <View style={styles.textInputHeadingContainer}>
              <Text style={styles.textInputHeading}>
                Urgency level: {this.state.incident.urgency}
              </Text>
            </View>
          ) : (
            <View style={styles.textInputHeadingContainer}>
              <Text style={[styles.textInputHeading, {flex: 3}]}>
                Urgency on a scale of 5
              </Text>
              <Picker
                value={this.state.incident.urgency}
                selectedValue={this.state.incident.urgency}
                onValueChange={urgency => {
                  this.setState({urgency});
                }}
                style={styles.urgencypicker}>
                {[...Array(5).keys()].map(item => {
                  return (
                    <Picker.Item
                      label={String(item + 1)}
                      value={String(item + 1)}
                      key={item}
                    />
                  );
                })}
              </Picker>
            </View>
          )}
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Items</Text>
          </View>
          {this.props.action ? (
            <View style={[styles.itemsRow]}>
              <Text style={styles.itemName}> Items </Text>
              <Text style={styles.itemUnits}>Units</Text>
              {this.props.action ? (
                this.state.incident.category == 'contribute' ? (
                  <Text style={styles.itemUnits}> Units picked </Text>
                ) : (
                  <Text style={styles.itemUnits}> Units delivered </Text>
                )
              ) : null}
            </View>
          ) : (
            <View></View>
          )}
          {items.map((item, index) => {
            return (
              <View style={styles.itemsRow} key={index}>
                {!this.props.action ? (
                  <CheckBox
                    style={styles.checkbox}
                    color="#3a54ff"
                    value={this.state.checkboxList[index].include}
                    onValueChange={val => this.addValues(val, index, 0)}
                  />
                ) : null}
                <Text style={styles.checkboxTitle}>
                  {item.name} ( {item.quantity} )
                </Text>
                <TextInput
                  keyboardType={'numeric'}
                  placeholder={'unit'}
                  value={item.unit}
                  placeholderTextColor={item.unit ? 'black' : null}
                  style={!this.props.action ? styles.units : styles.itemUnits}
                  editable={!this.props.action}
                  onChangeText={text => this.addValues(text, index, 1)}
                />
                {this.props.action ? (
                  <TextInput
                    placeholder={'units'}
                    keyboardType="numeric"
                    placeholderTextColor={'black'}
                    style={[
                      styles.itemUnits,
                      {
                        borderWidth: 1,
                      },
                    ]}
                    onChangeText={text => this.changeUnits(text, item)}
                  />
                ) : (
                  <View></View>
                )}
              </View>
            );
          })}
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
  items: state.items,
});

export default connect(mapStateToProps, matchDispatchToProps)(EditIncident);
