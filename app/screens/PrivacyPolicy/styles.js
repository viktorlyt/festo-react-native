import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    flex:1,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 10,
    paddingVertical: 0,
    bottom:0,
    // top:50,
  },
  loaderView: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
