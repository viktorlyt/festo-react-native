import { StyleSheet, Dimensions } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    paddingTop:10,
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: BaseColors.white,
    height: Dimensions.get('window').height,
  },
  cardView: {
    marginVertical: 15,
  },
  cardImg: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardDetailsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    flexGrow: 1,
    backgroundColor: BaseColors.white,
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
  bankDetails: {
    flexDirection: 'row',
    marginHorizontal: 8,
    paddingVertical: 5,
    justifyContent: 'space-between',
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
  },
  detailsView: {
    paddingVertical: 20,
    // backgroundColor: 'green',
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
    paddingVertical: 8,
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
  addBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: BaseColors.black,
    color: BaseColors.black,
  },
});
