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
  Button,
} from 'react-native';
import {Header, Title, Left, Body, CheckBox, Switch, Right, Card} from 'native-base';
import Icon from 'react-native-vector-icons/EvilIcons';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {addIncidentToFirebase} from '../actions/incidentsAction';
import {getAllItems, itemChanged} from '../actions/itemsActions';
import {Actions} from 'react-native-router-flux';
import {styles} from '../assets/styles/addincident_styles';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import {Toast} from 'native-base';

/**
 * Screen for adding an incident.
 * @extends Component
 */

class AddIncident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items : this.props.items,
      selectedCheckList: [],
      units : [],
      incident: {
        title: null,
        details: null,
        visible: true,
        timestamp: new Date().toString(),
        location: {
          coordinates: this.props.location.curr_coordinates,
        },
        category: null,
        user_id: this.props.login.userDetails.email,
        image: {
          isPresent: false,
          base64: '',
          uri: '',
        },
        items: [],
        action: null,
        urgency: 1,
      },
      disable: false,
    }

  }

  componentDidMount(){
    this.props.getAllItems()
  }

  updateUrgency = urgency => {
    this.setState({
      incident: {
        ...this.state.incident,
        urgency: urgency,
      },
    });
    console.log(this.state);
  };

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
          incident: {
            ...this.state.incident,
            image: {
              isPresent: true,
              base64: response.data,
              uri: response.uri,
            },
          },
        });
        this.showToast('Image Added!', 'success');
      }
    });
  };

  addIncident = () => {
    this.props
      .addIncidentToFirebase(this.state.incident) // waits till incident details are updated in redux
      .then(result => {
        Actions.pop(); // set markers on map page to result from firebase.
      });
  };

  handleAddRequirement(){
      let items = []
      // this.state.units.map((obj) => {
      //     if(this.state.selectedCheckList.includes(obj.item)){
      //         item.name = obj.item.key
      //         item.quantity = obj.item.value.quantity
      //         item.units = obj.units
      //         items.push(item)
      //     }
      // }) 

      this.state.selectedCheckList.map((obj) => {
          let item = {name : "" , quantity : "" , units : ""}
          item.name = obj.key
          item.quantity = obj.value.quantity

          this.state.units.map((unit) => {
            if(unit.item == obj){
              item.units = unit.units
            }
          })

         items.push(item)

      })
      
      this.setState({
        incident: {
          ...this.state.incident,
          items : items,
          category: "required"
        }
      }, () => {

      if (
        this.state.incident.title === null ||
        this.state.incident.category === null 
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
      }})

      console.log(this.state.incident.items)
  }

  onCheckBoxPress(item){
      let tmp = this.state.selectedCheckList
      if (tmp.includes(item)){
        tmp.splice(tmp.indexOf(item), 1)  
      } else {
        tmp.push(item)
      }

      this.setState({selectedCheckList: tmp})
  }

  addUnits (units,item){
    obj = {"item" : item, "units" : units}
    tmp = this.state.units
    tmp.map((obj) => {
      if(obj.item == item){
          tmp.splice(tmp.indexOf(obj),1)
      }
    })
    tmp.push(obj)
    this.setState({units : tmp})
  }

    render(){
      return( 
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
            <Text style={styles.requirementTitle}>Add Requirement</Text>
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
                  uri:
                    'data:image/jpeg;base64, ' +
                    this.state.incident.image.base64,
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
            <Text style={styles.textInputHeading}>Requirement Title</Text>
          </View>

          <TextInput
            style={styles.textInput}
            ref={input => (this.titleInput = input)}
            onChangeText={title =>
              this.setState({
                incident: {
                  ...this.state.incident,
                  title: title,
                },
              })
            }
            onSubmitEditing={() => this.detailsInput.focus()}
            keyboardType="email-address"
            returnKeyType="next"
            placeholder="Title"
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
                    value={String(item + 1)}
                    key={item}
                  />
                );
              })}
            </Picker>
          </View>
          <View style={styles.textInputHeadingContainer}>
            <Text style={styles.textInputHeading}>Select Items</Text>
          </View>
          {
            this.props.items.map( (item, index) => {
              return(
                <View style= {styles.itemList}>
                <CheckBox
                  style={styles.checkbox}
                  color='#3a54ff'
                  checked={this.state.selectedCheckList.includes(item)? true : false}
                  onPress={()=>this.onCheckBoxPress(item)}
                />
                <Text style={styles.checkboxTitle}>
                  {item.key} {"("} {item.value.quantity}{")"}
                </Text>
                <TextInput 
                  style={styles.name}
                  placeholder={"units"}
                  onChangeText={(text) => this.addUnits(text,item) }
                />
                {this.state.selectedCheckList.includes(item)?
                item.status == 1?
                 <Text style={styles.statusText}>
                   delivered
                </Text>
                :
                <Text style={styles.statusText}>
                    not delivered
                </Text>
                :
                null
                }
                </View>
              )
            })
          }

          
          <TouchableOpacity
            disabled={this.state.disable}
            style={styles.updateButton}
            onPress={() => this.handleAddRequirement()}>
            <Text style={styles.updateText}> Add </Text>
          </TouchableOpacity>

        </ScrollView>
        </View>
    )}

}


function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      addIncidentToFirebase: addIncidentToFirebase,
      getAllItems: getAllItems,
      itemChanged: itemChanged
    },
    dispatch,
  );
}

const mapStateToProps = state => ({
  login: state.login,
  location: state.location,
  incident: state.incident,
  items: state.items.all_items,
  changed: state.items.changed
});

export default connect(mapStateToProps, matchDispatchToProps)(AddIncident);
