import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: BaseColors.white,
    height: Dimensions.get('window').height,
  },
  coinView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  boxView: {
    flex: 1,
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: BaseColors.white,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: IOS ? 0.27 : 0.6,
    shadowRadius: IOS ? 4.65 : 20,
    elevation: 6,
  },
  coinTxt: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    color: BaseColors.primary,
  },
  msgTxt: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: FontFamily.regular,
    color: BaseColors.lightGrey,
    paddingTop:10
  },
  detailsView: {
    paddingVertical: 20,
    // backgroundColor: 'green',
  },
  bankDetails: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  detaltxtHeading: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: FontFamily.bold,
    color: BaseColors.lightBlack,
  },
  item: {
    paddingHorizontal: 5,
    borderRadius: 5,
    paddingVertical: 10,
    color: BaseColors.offWhite,
  },
  profileTitleView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImg: {
    width: 50,
    height: 50,
    borderRadius: 10,
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
  coin: {
    textAlign: 'center',
    fontSize: 14,
    color: BaseColors.secondary,
    fontFamily: FontFamily.bold,
  },
  list: {
    flexGrow: 1,
    backgroundColor: BaseColors.white,
  },
});
