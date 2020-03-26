import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Styling for the About Us page
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerTitle: {
    marginLeft: width / 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff'
  },
  headerStyle: {
    backgroundColor: '#63a4ff'
  },
  backButton: {
    width: width / 12,
    height: height / 13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButtonIcon: {
    color: 'white'
  },
  logo: {
    flex: 1,
    alignSelf: 'center',
    height: width / 3,
    width: width / 3,
    marginTop: 8
  },
  title: {
    fontSize: 18,
    margin: 8,
    marginBottom: height / 38,
    textAlign: 'center'
  },
  space: {
    marginTop: height / 38
  },
  dividerYellow: {
    flex: 1,
    borderBottomColor: '#FCCA15',
    borderBottomWidth: 1,
    marginHorizontal: width / 8,
    marginBottom: height / 38
  },
  dividerBlue: {
    flex: 1,
    borderBottomColor: '#63a4ff',
    borderBottomWidth: 1,
    marginHorizontal: width / 8,
    marginTop: 12,
    marginBottom: height / 38
  },
  description: {
    marginHorizontal: width / 16,
    marginBottom: height / 38,
    fontSize: 15,
    textAlign: 'center'
  },
  linksContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  link: {
    marginHorizontal: width / 16,
    marginBottom: height / 38,
    fontSize: 14,
    color: '#389D48'
  },
  projects: {
    flex: 1,
    marginHorizontal: width / 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  projectsTitle: {
    flex: 1,
    fontSize: 18
  },
  listItem: {
    marginRight: width / 16
  },
  social: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: height / 40,
    paddingTop: 0
  },
  socialItem: {
    marginHorizontal: width / 50,
    height: width / 10,
    width: width / 10,
    borderRadius: (width / 10) * 0.5,
    borderColor: 'orange'
  }
});
