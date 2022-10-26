import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 5,
    paddingBottom: 30,
  },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 20,
    alignSelf: 'center',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  descriptionTxt: {},
});
