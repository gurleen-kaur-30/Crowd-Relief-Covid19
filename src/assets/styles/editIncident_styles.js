import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Styling for the edit incident screen.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    marginVertical: height / 100,
    marginHorizontal: width / 30,
  },
  urgencypicker: {
    marginVertical: height / 100,
    marginHorizontal: width / 30,
    width: width / 4,
  },
  title: {
    marginLeft: width / 20,
    fontWeight: 'bold',
    fontSize: 25,
    color: '#fff',
  },
  avatarContainer: {
    backgroundColor: '#63a4ff',
    alignItems: 'center',
    paddingVertical: height / 30,
  },
  image: {
    height: height / 2.7,
    width: width * 0.95,
  },
  imageText: {
    marginLeft: width / 80,
    paddingBottom: height / 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  imageChangeText: {
    marginLeft: width / 80,
    paddingTop: height / 40,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  textInput: {
    width: width * 0.9,
    marginLeft: width / 20,
    paddingTop: height / 300,
  },
  textInputHeadingContainer: {
    marginLeft: width / 20,
    paddingTop: height / 40,
    paddingBottom: height / 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputHeading: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 17,
  },
  switchContainer: {
    flexDirection: 'row',
    marginHorizontal: width / 20,
    paddingTop: height / 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  switchText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 17,
  },
  updateButton: {
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: width / 30,
    marginHorizontal: width / 3,
    marginVertical: height / 30,
    borderRadius: 17,
  },
  updateText: {
    color: 'white',
  },
  itemsRow: {
    flex: 10,
    flexDirection: 'row',
    paddingTop: height / 25,
    marginHorizontal: 25
  },
  buttonView: {
    flexDirection: 'row',
  },
  textInput: {
      height: 40,
      borderColor: 'black', 
      borderWidth: 1,
      margin: 20
  },
  row:{
      flexDirection: 'row',
      justifyContent: 'center'
  },
  name:{
      height: height/20,
      width: width/4.5,
      borderColor: 'black', 
      borderWidth: 1,
      paddingLeft: width/50,
      paddingTop: width/50
  },
  pickerStyle:{
    width: width/4.3,
    height: height/20,
    borderColor: 'black', 
  },
  checkbox:{
    flex: 1,
    marginTop: 10
  },
  itemName:{
    flex: 3,
    alignSelf: "flex-start"
  },
  itemQuantity:{
    flex: 3,
    alignContent: "center"
  },
  itemUnits:{
    flex : 3,
    alignContent: "center"
  }
});
