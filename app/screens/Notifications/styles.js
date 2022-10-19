import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  heading: {
    fontSize: 18,
    paddingHorizontal: 25,
    color: BaseColors.black,
    fontFamily: FontFamily.bold,
  },
  list: {
    flexGrow: 1,
    paddingTop: 10,
  },
  item: {
    paddingHorizontal: 20,
    borderRadius: 5,
    paddingVertical: 10,
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
    flex: 0.95,
  },
  title: {
    flex: 1,
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  friend: {
    fontSize: 12,
    color: BaseColors.lightGrey,
    fontFamily: FontFamily.regular,
  },
  time: {
    textAlign: 'center',
    fontSize: 12,
    color: BaseColors.textGrey,
    fontFamily: FontFamily.regular,
  },
  btnsView: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    // paddingHorizontal: 0,
  },
  btnTxtView: {
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  btnTxt: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: BaseColors.primary,
  },
  paidBtn: {
    backgroundColor: BaseColors?.secondary,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginRight: 6,
  },
  loaderView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  typeTextStyle: { color: '#FFF', fontSize: 10 },
});
