import { StyleSheet } from 'react-native';
import { FontFamily, BaseColors } from '@config/theme';

export default StyleSheet.create({
  modalView: {
    marginHorizontal: 20,
    paddingBottom: 10,
    marginBottom: 10,
    backgroundColor: BaseColors.white,
    borderColor: BaseColors.white,
    borderRadius: 20,
    elevation: 3,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  modalText: {
    paddingVertical: 20,
    paddingHorizontal: 25,

    color: BaseColors.lightBlack,
  },
  descriptionTxt: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
  },
  centerBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnView: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnOne: {
    flex:1
  },


  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});