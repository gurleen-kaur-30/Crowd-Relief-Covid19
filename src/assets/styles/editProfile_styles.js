import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Styling for the profile editing screen.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    flex: 2,
    textAlign: 'right',
    color: '#4ebaaa',
    // borderBottomWidth: 1,
    // borderColor: 'black'
  },
  avatarContainer: {
    backgroundColor: '#63a4ff',
    alignItems: 'center',
    paddingTop: height / 20,
    paddingBottom: height / 30,
    marginBottom: height / 30,
  },
  avatar: {
    justifyContent: 'center',
    height: width / 2.7,
    width: width / 2.7,
    borderRadius: 100,
  },
  userName: {
    paddingTop: height / 30,
    fontSize: 17,
    color: 'white',
  },
  valueItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: width / 15,
  },
  valueTextContainer: {
    // flex: 3,
    justifyContent: 'center',
  },
  valueText: {
    color: '#005b4f',
  },
  updateButton: {
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: width / 35,
    marginHorizontal: width / 3,
    marginTop: height / 30,
    borderRadius: 17,
  },
  updateText: {
    color: 'white',
  },
  photoModal: {
    backgroundColor: 'white',
    borderRadius: 30,
    elevation: 100,
    borderWidth: 0.1,
    paddingHorizontal: width / 10,
    paddingVertical: height / 25,
  },
  photoModalOption: {
    flexDirection: 'row',
    marginVertical: 15,
    alignItems: 'center',
  },
  photoModalText: {
    fontSize: 16,
    color: 'black',
    letterSpacing: 2,
  },
  modalShadow: {
    shadowColor: '#243242',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalContainer: {
    width: width,
    height: height,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
