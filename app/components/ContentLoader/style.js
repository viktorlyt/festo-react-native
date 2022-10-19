import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';

const nWidth = BaseSetting.nWidth;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColors.whiteColor,
    marginBottom: 60,
  },
  imageStyle: {
    width: nWidth / 3,
    height: nWidth / 3,
  },
  PT10: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: FontFamily.regular,
  },
});

export default styles;
