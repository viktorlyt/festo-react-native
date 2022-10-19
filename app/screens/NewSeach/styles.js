import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BaseColors.primary,
  },
  headingTxt: {
    fontSize: 20,
    fontFamily: FontFamily.regular,
    color: BaseColors.lightGrey,
    textAlign: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BaseColors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  inputStyle: {
    color: BaseColors.white,
    elevation: 0,
    flex: 1,
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 0,
    paddingRight: 44,
    height: 50,
    justifyContent:'center'
  },
  searchIcon: {
    borderColor: BaseColors.borderColor,
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
  },
  list: {
    flexGrow: 1,
    marginTop: 15,
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
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    color: BaseColors.lightBlack,
  },
  title: {
    fontSize: 15,
    color: BaseColors.textGrey,
  },
  button: {
    // flex: 0.28,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: BaseColors.secondary,
    color: BaseColors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: 'center',
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
});
