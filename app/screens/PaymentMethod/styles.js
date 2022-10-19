import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: BaseColors.white,
    height: Dimensions.get('window').height,
  },
  addIcon: {
    marginLeft: 20,
    color: BaseColors.secondary,
  },
  addBtn: {
    marginTop: 10,
    borderColor: BaseColors.black,
    color: BaseColors.black,
  },
  payBtn: {
    marginVertical: 10,
  },
  paypalBtn: {
    marginTop: 10,
    borderColor: BaseColors.borderColor,
    color: '#253B80',
  },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: Dimensions.get('window').height / 20,
    alignSelf: 'center',
  },

  // card
  cardImg: {
    position: 'absolute',
    alignSelf: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: '100%',
    borderRadius: 10,
  },
  cardDetailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    paddingVertical: 15,
    flexGrow: 1,
  },
  nameTxt: {
    fontSize: 16,
    fontFamily: FontFamily.regular,
    color: BaseColors.white,
  },
  numTxt: {
    fontSize: 18,
    paddingVertical: 30,
    alignSelf: 'center',
    textAlign: 'center',
    color: BaseColors.white,
  },
});
