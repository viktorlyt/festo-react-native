import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: BaseColors.white,
  },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 20,
    alignSelf: 'center',
  },
  loaderView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
