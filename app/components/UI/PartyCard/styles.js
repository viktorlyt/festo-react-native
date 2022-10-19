import { StyleSheet, Dimensions, Platform } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';
import BaseSetting from '@config/setting';

const nWidth = BaseSetting.nWidth;
const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  item: {
    flex: 1,
    padding: 10,
    backgroundColor: BaseColors.white,
    borderRadius: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: IOS ? 0.27 : 0.6,
    shadowRadius: IOS ? 4.65 : 20,
    elevation: 6,
    marginVertical: 15,
  },
  userImg: {
    width: '100%',
    height: Dimensions.get('window').height / 4,
    borderRadius: 10,
    alignSelf: 'center',
    position: 'relative',
  },
  menuIconView: {
    position: 'absolute',
    right: 10,
    top: 10,
    flexDirection: 'row',
    // paddingVertical: 5,
    // borderRadius: 5,
    // backgroundColor: BaseColors.white,
  },
  menuIcon: {},
  paidSheetImgview: {
    position: 'absolute',
    width: '100%',
  },
  btnTxtView: {
    backgroundColor: BaseColors.lightRed,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  btnTxt: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: BaseColors.primary,
  },
  rowView: {
    paddingVertical: 8,
    // paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  paidImg: {
    top: 22,
    position: 'absolute',
    color: 'white',
    backgroundColor: BaseColors.primary,
    left: -60,
    paddingVertical: 5,
    width: '50%',
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
  },
  profileImg: {
    width: 35,
    height: 35,
    borderRadius: 30,
  },
  userName: {
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  Host: {
    fontSize: 12,
    // paddingLeft: 5,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.regular,
  },
  imgsView: {
    flexDirection: 'row',
  },
  imgOne: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: BaseColors.white,
  },
  partyDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addPerson: {
    color: BaseColors.white,
    fontFamily: FontFamily.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  caption: {
    // paddingLeft: 5,
    fontSize: 16,
    color: BaseColors.black,
    fontFamily: FontFamily.bold,
  },
  commomFlex: {
    flex: 1,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pinIcon: {
    opacity: 0.3,
  },
  btnView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnOne: {
    flex: 1,
  },
  addIcon: {
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
