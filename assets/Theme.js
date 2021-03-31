import { StyleSheet, Dimensions } from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const customStyle = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignContent: 'center',
  },
  centerItems: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title:{
    fontSize:35,
    color:"#7c9d32",
    fontWeight:"bold",
    textAlign:"center",
    width:width,
    marginTop:-50,
  },
  headerArena: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c9d32',
  },
  loginheader: {
    padding: 0,
    margin: 0,
    height: 80,
    backgroundColor: '#7CB342',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  centerPageName: {
    fontWeight: 'bold',
    fontSize: 36,
    color: '#2E7D32',
    marginVertical: 20,
    textAlign: 'center',
    justifyContent: 'center',
  },
  pVer15: {
    paddingVertical: 15,
  },
  pHor15: {
    paddingHorizontal: 15,
  },
  mVer15: {
    marginVertical: 15,
  },
  mHor15: {
    marginHorizontal: 15,
  },
  brad8: {
    borderRadius: 8,
  },
  padding5: {
    padding: 5,
  },
  mt10: {
    marginTop: 10,
  },
  mt30: {
    marginTop: 30,
  },
  mt5: {
    marginTop: 5,
  },
  m0p0: {
    margin: 0,
    padding: 0,
  },
  componentDevider: {
    marginVertical: 1,
  },
  f1: {
    width: width,
    height: height,
  },
  w100: {
    width: width,
  },
  normalTextColor: {
    color: '#6d7587',
    backgroundColor: 'transparent',
  },
});

export default customStyle;
