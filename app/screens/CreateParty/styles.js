import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  mainView: {
    width: '90%',
    alignSelf: 'center',
  },
  TextInp1: {
    alignSelf: 'center',
    color: BaseColors.black,
    borderRadius: 8,
    borderColor: BaseColors.borderColor,
    borderWidth: 1,
    marginBottom: 0,
  },
  titleText: {
    color: 'black',
    paddingBottom: 5,
    fontFamily: FontFamily.regular,
  },
  errorTxt: {
    color: '#FF0B1E',
    paddingLeft: 5,
    paddingBottom: 10,
  },
  textInp4: {
    alignSelf: 'center',
    color: BaseColors.black,
    borderRadius: 8,
    borderColor: BaseColors.borderColor,
    borderWidth: 1,
    marginBottom: 0,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: BaseColors.borderColor,
    height: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
  },
  datePickerStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flatStyle: {},
  richBar: {},
  contentStyle: {
    borderColor: '#e3e3e3',
    color: BaseColors.black,
  },
  rich: {},
});
