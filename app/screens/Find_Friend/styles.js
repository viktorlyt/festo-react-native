import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';

const nWidth = BaseSetting.nWidth;

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BaseColors.white,
  },
  headingTxt: {
    fontSize: 22,
    fontFamily: FontFamily.regular,
    color: BaseColors.textGrey,
    textAlign: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth:1,
    borderColor: BaseColors.borderColor,
    alignItems:'center',
    justifyContent:'center',
    marginBottom:20,
    marginTop:20
  },
  inputStyle: {
    color: BaseColors.white,
    elevation: 0,
    flex: 1,
    borderWidth:0,
    borderRadius:8,
    marginBottom:0,
    paddingRight:44,
  },
  searchIcon: {
    borderColor: BaseColors.borderColor,
    position:'absolute',
    right:10,
    alignSelf:'center'
  },
  list: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 8,
  },
  profileTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  usernameView: {
    marginLeft: 12,
    flex: 0.8,
  },
  title: {
    fontSize: 16,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  button: {
    textAlign: 'center',
    flexDirection: 'row',
    borderColor: BaseColors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    paddingRight: 5,
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: FontFamily.regular,
    color: BaseColors.secondary,
  },
  btnView: {
    width: '100%',
    paddingVertical: 10,
    alignSelf: 'center',
  },
  activityIndicator: {
    // alignSelf: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  skipView: {
    bottom: 10,
    position: 'relative',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
  },
  skipTxt: {
    fontSize: 18,
    fontFamily: FontFamily.regular,
    color: BaseColors.borderColor,
  },
  loaderView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  flexMainCon: {
    flexGrow: 1,
    padding: nWidth <= 2736 && nWidth >= 600 ? 20 : 10,
  },
  dividerCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});
