import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  animationWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    height: 250,
    width: 300,
  },
  mainViewModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  containerf: {
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: FontFamily.regular,
    backgroundColor: BaseColors.white,
    borderRadius: 10,
    height: Dimensions.get('window').height / 1.5,
    width: Dimensions.get('window').width / 1.2,
    padding: 20,
  },
  offlineTitle: {
    fontSize: 26,
    fontFamily: FontFamily.regular,
    color: BaseColors.black,
    textAlign: 'center',
  },
  offlineSubtxt: {
    fontSize: 15,
    fontFamily: FontFamily.regular,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
