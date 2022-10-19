import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical:10
  },
  RadioOuter: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: BaseColors.textGrey,
    padding: 3,
    backgroundColor: BaseColors.white,
  },
  RadioInner: {
    borderRadius: 50,
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#585858',
    alignSelf: 'center',
    fontSize: 16,
    fontFamily: FontFamily.bold,
    marginHorizontal:10
  },
});
export default styles;
