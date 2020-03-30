import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

//Styling used on filter screen.
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#63a4ff',
  },
  title: {
    marginLeft: width / 200,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  listView: {
    marginTop: height / 20,
  },
  filterTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width / 20,
    marginVertical: height * 0.01,
    height: height * 0.2,
  },
  filterText: {
    fontSize: 18,
    color: 'black',
    marginHorizontal: width / 20,
  },
  field: {
    padding: 5,
    marginTop: height / 100,
    backgroundColor: '#f4f3f2',
    height: height / 10,
    flexDirection: 'row',
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: width / 20,
  },
  image: {
    height: 40,
    width: 40,
    marginLeft: width / 20,
  },
  text: {
    color: '#000',
    fontSize: 15,
    marginLeft: width / 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: width / 20,
    marginVertical: height * 0.01,
  },
  check_box: {
    flex: 1,
  },
  check_box_text: {
    flex: 9,
    fontSize: 15,
    paddingLeft: width * 0.03,
  },
  applyTextContainerOuter: {
    flex: 1,
    alignItems: 'center',
  },
  applyTextContainer: {
    backgroundColor: 'black',
    padding: height * 0.02,
    width: width * 0.3,
    alignItems: 'center',
    borderRadius: 20,
    marginTop: height / 20,
  },
  applyText: {
    color: 'white',
  },
});
