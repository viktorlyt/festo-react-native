import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet, Dimensions } from 'react-native';

const nWidth = Dimensions.get('screen').width;
export default StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainView: {
    paddingVertical: 20,
    // paddingHorizontal: 25,
  },
  modalContainer: {
    backgroundColor: BaseColors.white,
    borderRadius: 20,
    elevation: 20,
  },
  titleTxt: {
    textAlign: 'center',
    paddingHorizontal: 40,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
    fontSize: 18,
  },
  coinTxt: {
    fontSize: 50,
    paddingHorizontal: 20,
    color: BaseColors.primary,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
  },
  subTitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 50,
    paddingVertical: 10,
    color: '#777777',
    fontFamily: FontFamily.regular,
  },
  img1: { height: nWidth / 2, width: nWidth / 2 },
  startview: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  later: {
    paddingTop: 15,
    color: BaseColors.borderColor,
    textAlign: 'center',
  },
  btnView: {
    paddingTop: 30,
    marginBottom: 10,
  },
});
