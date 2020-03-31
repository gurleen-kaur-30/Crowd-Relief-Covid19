import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Styling for the add incident screen.
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
    marginLeft: width / 35,
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
  cameraContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageText: {
    marginLeft: width / 80,
    paddingVertical: height / 50,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  imageChangeText: {
    marginLeft: width / 80,
    paddingVertical: height / 70,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  textInputDetails: {
    width: width * 0.9,
    marginLeft: width / 20,
    paddingTop: height / 300,
  },
  textInputHeadingContainer: {
    marginHorizontal: width / 20,
    paddingTop: height / 40,
    paddingBottom: height / 100,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textInputHeading: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 19,
    flex: 1,
  },
  textInputValue: {
    color: '#555',
    flex: 1,
    fontSize: 19,
    textAlign: 'right',
    marginRight: width / 10,
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: height / 25,
  },
  buttonView: {
    flexDirection: 'row',
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
    fontSize: 17.5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  name: {
    height: height / 20,
    width: width / 4,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: width / 60,
    paddingTop: 6,
    fontSize: 16,
    flex: 1,
  },
  checkbox: {
    marginRight: 15,
    alignSelf: 'flex-start',
    height: 20,
    width: 10,
    color: '#3a5ff4',
    marginTop: 5,
    flex: 1,
  },
  checkboxTitle: {
    fontFamily: 'ProductSans-Regular',
    fontSize: 19,
    color: '#464646',
    marginLeft: 8,
    flex: 6,
  },
  itemList: {
    marginLeft: 15,
    marginTop: 20,
    flexDirection: 'row',
    flex: 10,
    marginRight: 20,
  },
  statusText: {
    marginLeft: 20,
    flex: 2,
    color: 'orange',
  },
});
