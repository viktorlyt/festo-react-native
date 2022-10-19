import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BaseColors.white,
    // height: '100%',
    // borderWidth: 2,
  },
  logoImage: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginTop: 25,
    marginBottom: 10,
    borderRadius: 10,
  },
  Textt: {
    color: BaseColors.lightBlack,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: FontFamily.bold,
    paddingBottom: 50,
  },
  Textt2: {
    color: 'grey',
    fontSize: 14,
    textAlign: 'center',
    marginRight: 250,
    marginBottom: 5,
  },
  btmView: {
    paddingBottom: Dimensions.get('window').height - 7,
  },
  messageText: {
    color: BaseColors.lightGrey,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  btmTxtView: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  btnView: {
    width: '100%',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  loginTxt: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.5,
  },
  signUpText: {
    textDecorationLine: 'underline',
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: '700',
  },
  socialView: {
    flexDirection: 'row',
    paddingTop: 13,
  },
  socialBtn: {
    borderColor: BaseColors.borderColor,
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 4,
  },
  socialImg: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  lineView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 27,
  },
  line: {
    width: '30%',
    height: 1,
  },
  lineTxt: {
    paddingHorizontal: 10,
    opacity: 0.5,
  },
  forgotPassbtn: {
    width: '50%',
    alignSelf: 'flex-end',
  },
  forgotTxt: {
    textAlign: 'right',
    paddingTop: 12,
    textDecorationLine: 'underline',
    fontSize: 14,
    letterSpacing: 1,
  },
  noAccountTxt: {
    textAlign: 'center',
    opacity: 0.5,
  },
  accountView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 36,
  },
  accountTxt: {
    opacity: 0.5,
    color: '#000000',
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 1,
  },
  logoImg: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 30,
  },
});
