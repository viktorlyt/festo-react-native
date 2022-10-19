import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
  },

  heading: {
    fontSize: 18,
    color: BaseColors.black,
    fontFamily: FontFamily.bold,
  },
  subHeading: {
    fontSize: 14,
    marginBottom: 10,
    color: BaseColors.black,
  },
  mainView: {
    paddingBottom: 10,
  },
  tabIconView: {
    padding: 10,
    marginHorizontal: 15,
  },
  tabNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  btnView: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  btnOne: {
    width: '48%',
  },
  tabText: {
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.medium,
  },
  rightIcon: {
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  BottomTabs: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomColor: BaseColors.borderColor,
  },
  btmtabText: {
    fontSize: 18,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  btmTxt: {
    fontSize: 14,
    color: BaseColors.primary,
  },
  Texto: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    borderBottomColor: BaseColors.textGrey,
    fontWeight: '700',
    paddingVertical: 15,
    borderBottomWidth: 0.5,
  },
  Vieww: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  textQuestion: {
    color: '#585858',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  //BlockList
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
    width: 112,
    justifyContent: 'center',
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
  doneBtn: {
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
    paddingHorizontal: 20,
    position: 'absolute',
    right: 50,
    height: '28%',
    paddingVertical: 30,
    borderRadius: 6,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loaderView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
