import { Platform, StyleSheet } from 'react-native';
import { isIPhoneX } from 'react-native-status-bar-height';
import { BaseColors } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  mainCon: {
    flex: 1,
    backgroundColor: BaseColors.white,
    justifyContent: 'center',
  },
  centerCon: {
    backgroundColor: BaseColors.primary,
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImgCon: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  },
  logoImg: { width: 200, height: 85, marginLeft: 10, marginVertical: 50 },
  logoText: {
    paddingTop: IOS ? 20 : 0,
    flexDirection: 'row',
    fontSize: 70,
    width: 50,
    fontWeight: '900',
    color: '#C4352F',
    fontFamily: 'SedgwickAve-Regular',
    // letterSpacing: 4,
  },
  bottomText: {
    position: 'absolute',
    bottom: isIPhoneX ? 25 : 20,
    fontSize: 15,
    color: BaseColors.primary,
    letterSpacing: 2,
    textAlign: 'center',
    width: '100%',
  },
});
