import {Dimensions, StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

//styling used on individual incident page
export const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  titleTextHeader: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  titleTextDescription: {
    fontSize: 15,
    paddingRight: width / 20,
  },
  title: {
    marginLeft: width / 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  container: {
    backgroundColor: '#63a4ff',
    flex: 1,
  },
  backButton: {
    width: width / 12,
    height: height / 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginLeft: width / 40,
    width: width * 0.95,
    paddingBottom: 20,
  },
  fabButtonIcon: {
    alignSelf: 'center',
    color: '#fff',
  },
  fabButton: {
    width: width / 7.5,
    height: width / 7.5,
    backgroundColor: '#4ebaaa',
    justifyContent: 'center',
    position: 'absolute',
    right: width / 20,
    bottom: height / 35,
    elevation: 15,
    borderRadius: 35,
  },
  avatarContainer: {
    backgroundColor: '#63a4ff',
    alignItems: 'center',
    marginVertical: height / 100,
    marginHorizontal: width / 30,
  },
  image: {
    height: height / 2.7,
    width: width,
  },
  map: {
    flex: 1,
    width: width,
    height: height / 2,
  },
  navigationContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  navigationIcon: {
    position: 'absolute',
    right: 10,
  },
  itemsRow: {
    flex: 8,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: height / 100,
    marginLeft: 20,
  },
  buttonView: {
    flexDirection: 'row',
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  name: {
    height: height / 20,
    width: width / 4,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: width / 50,
    paddingTop: width / 50,
    color: 'black',
  },

  itemName: {
    fontSize: 18,
    flex: 2,
  },
  itemQuantity: {
    fontSize: 18,
    flex: 2,
  },
  itemUnits: {
    fontSize: 18,
    flex: 2,
  },
  statusText: {
    marginTop: 13,
    fontSize: 14,
    flex: 2,
    marginRight: 10,
  },
});
