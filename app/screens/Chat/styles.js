import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import { Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: Platform.OS === 'ios' ? 20 : 25,
    // marginTop: 50,
    // paddingTop:50,
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
  list: {
    flexGrow: 1,
    marginTop: 15,
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingVertical: 10,
    borderBottomWidth: 0.4,
    borderBottomColor: BaseColors.borderColor,
    backgroundColor: '#FFF',
  },
  profileTitleView: {
    flex: 1,
    flexDirection: 'row',
  },
  userImg: {
    width: 47,
    height: 47,
    borderRadius: 47,
  },
  usernameView: {
    marginLeft: 12,
    flex: 1,
    // justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  friend: {
    fontSize: 13,
    color: BaseColors.lightGrey,
    fontFamily: FontFamily.regular,
  },
  time: {
    // flex: 0.4,
    fontSize: 13,
    color: BaseColors.textGrey,
    fontFamily: FontFamily.regular,
  },
  button: {
    flex: 0.4,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    color: BaseColors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
    textAlign: 'center',
  },
  addIcon: {
    paddingRight: 5,
  },
  btnTxt: {
    fontSize: 17,
    color: BaseColors.secondary,
  },
  btnView: {
    width: '100%',
    paddingVertical: 20,
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  centerViewStyle: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  msgContainer: { flex: 1, flexDirection: 'row' },
  msgTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  badgeContainer: {
    height: 25,
    width: 25,
    borderRadius: 15,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  badgeCount: { color: BaseColors.white, fontSize: 12 },
  storyViewStyle: {
    height: 52,
    width: 52,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColors.primary,
  },
});
