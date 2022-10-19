import { StyleSheet, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';

export default StyleSheet.create({
  list: {
    paddingVertical: 15,
    flexGrow: 1,
  },
  Text1: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: BaseColors.borderColor,
    fontWeight: '700',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 8,
  },
  profileTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  usernameView: {
    marginLeft: 12,
    flex: 0.8,
  },
  title: {
    fontSize: 16,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  title1: {
    fontSize: 14,
    color: BaseColors.textGrey,
  },
  button: {
    textAlign: 'center',
    flexDirection: 'row',
    borderColor: BaseColors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnTxt: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: FontFamily.regular,
    color: BaseColors.secondary,
  },

  //modal

  modalBackGround: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '45%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: IOS ? 0.27 : 0.6,
    shadowRadius: IOS ? 4.65 : 20,
    elevation: 6,
  },
});
