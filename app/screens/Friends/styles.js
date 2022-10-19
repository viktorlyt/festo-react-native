import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: BaseColors.white,
  },
  headingTxt: {
    fontSize: 20,
    fontFamily: FontFamily.regular,
    color: BaseColors.lightGrey,
    textAlign: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 0,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    paddingRight: 10,
    color: BaseColors.white,
  },
  searchIcon: {
    position: 'absolute',
    right: 30,
  },
  Text1: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: BaseColors.textGrey,
    fontWeight: '700',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  list: {
    flexGrow: 1,
    marginTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  friend: {
    fontSize: 12,
    color: BaseColors.lightGrey,
    fontFamily: FontFamily.regular,
  },
  button: {
    flexDirection: 'row',
    borderColor: BaseColors.secondary,
    color: BaseColors.secondary,
    paddingVertical: 10,
    backgroundColor: 'red',
    paddingHorizontal: 25,
    borderRadius: 25,
    // alignItems: 'center',
  },
  addIcon: {
    paddingRight: 5,
  },
  btnTxt: {
    fontSize: 17,
    // textAlign: 'center',
    color: BaseColors.secondary,
  },
  btnView: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  modalBackGround: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '45%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    position: 'absolute',
    right: 50,
    // height: '28%',
    paddingVertical: 20,
    borderRadius: 6,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  outsideModal: {
    backgroundColor: 'rgba(1, 1, 1, 0.2)',
    flex: 1,
  },

  loaderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
