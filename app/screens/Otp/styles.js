import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  Firstview: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BaseColors.white,
    height: Dimensions.get('window').height,
  },
  MainText1: {
    color: BaseColors.lightBlack,
    fontSize: 22,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  Secondview: {
    flexDirection: 'row',
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextView: {
    flex: 1,
    paddingTop: 50,
  },
  OTPContainer: {
    alignSelf: 'center',
  },
  OTPTxt: {
    backgroundColor: BaseColors.white,
    color: BaseColors.lightBlack,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 20,
    height: 50,
    width: 50,
    paddingHorizontal: 14,
    borderRadius: 15,
    borderWidth: 0.6,
    borderColor: 'grey',
    borderBottomWidth: 0.6,
    justifyContent: 'center',
    alignContent: 'center',
  },
  btmTxtView: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  TextTimer: {
    color: BaseColors.textGrey,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
  },
  btnView: {
    width: '100%',
    alignSelf: 'center',
  },
});
