import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Styling for the Search Bar
const searchBarStyle = {
  container: {
    backgroundColor: 'transparent',
    marginTop: height / 70,
    marginHorizontal: width / 50,
  },
  textInputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    elevation: 7,
    width: width * 0.95,
    height: height * 0.07,
    marginHorizontal: width / 50,
  },
  textInput: {
    backgroundColor: 'white',
    color: 'rgba(0,0,0,0.7)',
    fontSize: 14,
    height: height * 0.05,
  },
  listView: {
    backgroundColor: 'rgba(256,256,256,0.95)',
    marginHorizontal: width / 50,
  },
};

//Styling for the map components
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  clearButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    paddingRight: width / 30,
  },
  repositionButton: {
    width: width / 11,
    height: width / 11,
    borderRadius: 30,
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: '#000',
    left: width / 25,
    bottom: height / 23,
  },
  filterButton: {
    width: width / 8.5,
    height: width / 8.5,
    backgroundColor: 'rgba(78, 186, 170,1)',
    borderRadius: 30,
    elevation: 6,
    justifyContent: 'center',
    position: 'absolute',
    right: width / 25,
    top: height / 9,
  },
  fabContainer: {
    backgroundColor: 'rgba(180, 0, 0,0.5)',
    alignItems: 'center',
    right: width / 20,
    bottom: height / 25,
    position: 'absolute',
    elevation: 15,
    borderRadius: 35,
    flexDirection: 'row',
  },
  fabButton: {
    borderRadius: 35,
    backgroundColor: 'rgba(180, 0, 0,1)',
    width: width / 7.5,
    height: width / 7.5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  fabButtonIcon: {
    alignSelf: 'center',
    color: '#fff',
  },
  fabText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
    paddingHorizontal: width / 50,
  },
  fabContainer2: {
    backgroundColor: 'rgba(78, 186, 170,0.5)',
    right: width / 20,
    bottom: height / 8,
  },
  fabButton2: {
    backgroundColor: 'rgba(78, 186, 170,1)',
  },
});

export {searchBarStyle, styles};
