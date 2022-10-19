import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: BaseColors.white,
    flex: 1,
    // height: Dimensions.get('window').height,
  },
  btnView: {
    // paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 20,
    width: '100%',
    alignSelf: 'center',
  },
  textInputView: {
    // marginTop: 25,
    flexDirection: 'row',
  },
  TextInp1: {
    alignSelf: 'center',
    color: BaseColors.black,
    borderRadius: 8,
    // width: '90%',
    borderColor: BaseColors.borderColor,
    borderWidth: 1,
    // padding: 10,
  },
});
