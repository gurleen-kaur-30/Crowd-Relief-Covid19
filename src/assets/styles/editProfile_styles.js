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
  photoModal : {
    width : width/1.75,
    height : height/5,
    marginTop : height/3,
    marginLeft : width/4.5,
    backgroundColor : 'white',
    borderRadius : 4,
    elevation: 100,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    paddingVertical : 15
},
  photoModalOption : {
    flexDirection : 'row',
    marginTop : 18,
    alignItems:"center",
},
photoModalText : {
    fontFamily : 'ProductSans-Regular',
    fontSize : 16,
    color : 'black',
    marginLeft : 7,
    letterSpacing : 1.99
},
shadow: {
    textShadowColor: '#26243242',
    shadowOpacity: 0.2,
    elevation:100,
    textShadowOffset:{width: 2,height: 0.1},
    zIndex : 10,
},
photoModalArrow : {
    marginLeft : 173,
    marginTop : -10
},
modalShadow:{
    shadowColor: '#243242',
    shadowOffset: {
        width: 0, height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8
},
modalContainer:{
  width: width,
  height: height,
  backgroundColor: 'transparent',
},

});
