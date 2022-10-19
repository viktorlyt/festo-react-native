import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: BaseColors.white,
    height: Dimensions.get('window').height / 1.2,
  },
  // btnView: {
  //   paddingHorizontal: 20,
  //   width: '100%',
  //   position: 'absolute',
  //   bottom: Dimensions.get('window').height / 20,
  //   alignSelf: 'center',
  // },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 20,
    alignSelf: 'center',
  },
  textInputView: {
    justifyContent: 'space-between',
    // marginTop: 25,
    // marginHorizontal: 5,
    flexDirection: 'row',
  },
});
