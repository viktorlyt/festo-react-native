import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  modalRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: BaseColors.borderColor,
  },
  modelTxt: {
    textAlign: 'center',
    color: BaseColors.textGrey,
    fontSize: 16,
  },
  title: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: BaseColors.textGrey,
    fontWeight: '700',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 8,
  },
  profileTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ProfileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  usernameView: {
    marginLeft: 12,
    flex: 0.8,
  },
  userName: {
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  friend: {
    fontSize: 12,
    color: BaseColors.lightGrey,
    fontFamily: FontFamily.regular,
  },
  joinbutton: {
    flexDirection: 'row',
    borderColor: BaseColors.secondary,
    color: BaseColors.secondary,
    paddingVertical: 10,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  btnTxt: {
    fontSize: 17,
    color: BaseColors.secondary,
  },
  loaderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBtn: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
});
