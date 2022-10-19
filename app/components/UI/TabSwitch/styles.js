import { BaseColors } from '@config/theme';
import { Platform, StyleSheet } from 'react-native';

const tabWidth = 80;
const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // backgroundColor: BaseColors.white,
    padding: 3,
    // borderRadius: 5,
    paddingVertical: IOS ? 8 : 5,
    // borderWidth: 0.5,
    // borderColor: BaseColors.primary,
  },
  slider: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
    backgroundColor: BaseColors.white,
    color: BaseColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderWidth: 1,
    borderColor: BaseColors.primary,
  },
  tab: {
    width: tabWidth,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
});

export default styles;
