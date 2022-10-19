import { Platform, StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  view1: {
    flex: 1,
    backgroundColor: '#ed533b',
    justifyContent: 'center',
  },
  view2: {
    paddingHorizontal: 15,
    paddingVertical: 40,
    backgroundColor: BaseColors.white,
    marginHorizontal: 15,
    borderRadius: 35,
  },
  txtView: {
    paddingVertical: 20,
  },
  Festotext: {
    color: BaseColors.primary,
    fontSize: 34,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
  },
  moretext: {
    color: BaseColors.lightGrey,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },

  touchable_style: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  img_style: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  ic_style: {
    color: BaseColors.primaryDark,
    backgroundColor: BaseColors.white,
  },
  view_style: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 200,
    height: 85,
    alignSelf: 'center',
    marginVertical: 30,
  },
  text: {
    marginLeft: 30,
  },
  arrow_icon: {
    width: 15,
    height: 10,
  },
  btnView: {
    marginVertical: 10,
  },
  versionText: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
