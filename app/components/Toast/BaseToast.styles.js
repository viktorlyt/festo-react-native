import { BaseColors, FontFamily } from '@config/theme';
import { StyleSheet } from 'react-native';
export const HEIGHT = 80;
export const WIDTH = 340;
export const BORDER_RADIUS = 6;
export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    height: HEIGHT,
    width: WIDTH,
    borderRadius: BORDER_RADIUS,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: BORDER_RADIUS,
    elevation: 2,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: 'transparent',
  },
  leadingBorder: {
    borderLeftWidth: 5,
    borderLeftColor: '#D8D8D8',
  },
  contentContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // In case of RTL, the text will start from the right
    paddingHorizontal: 20,
    backgroundColor: BaseColors.primary,
    borderRadius: 30,
  },
  text1: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    width: '100%', // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  },
  text2: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    color: '#FFF',
    width: '100%', // Fixes: https://github.com/calintamas/react-native-toast-message/issues/130
  },
});
