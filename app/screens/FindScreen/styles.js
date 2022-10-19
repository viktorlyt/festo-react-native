import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors,FontFamily } from '@config/theme';

export default StyleSheet.create({
  mainview: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: BaseColors.white,
  },
  img1: {
    alignSelf: 'center',
    height: Dimensions.get('window').height / 2.7,
    width: Dimensions.get('window').height / 2.5,
  },
  view2: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  txt1: {
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
    fontSize: 22,
    paddingVertical: 5,
  },
  txt2: {
    color: BaseColors.textGrey,
    fontFamily: FontFamily.regular,
    fontSize: 15,
    textAlign: 'center',
  },
  btmView: {
    paddingVertical: 10,
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
});
