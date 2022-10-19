import { Platform, StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  msgSendViewStyle: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: BaseColors.primary,
  },
  paperclipStyle: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  auctionContainer: {
    flex: 1,
    backgroundColor: BaseColors.whiteColor,
  },
  inputMainView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 10,
    paddingBottom: IOS ? 30 : 20,
  },
  inputContainerStyle: {
    // height: 36,
    // marginBottom: 20
  },

  datePickStyle: {
    justifyContent: 'center',
    width: '100%',
    borderColor: BaseColors.borderColor,
  },

  leftIcon: {
    textAlign: 'center',
  },

  avatarSty: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    resizeMode: 'cover',
  },
  camBtnView: {
    position: 'absolute',
    backgroundColor: BaseColors.white,
    padding: 8,
    borderRadius: 8,
    right: -20,
    bottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  btnView: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  rowView: {
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
    marginHorizontal: 10,
  },
  modalRowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  dateTextStyle: {
    color: '#6a7889',
    fontSize: 10,
    marginBottom: 30,
  },
  msgImgStyle: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  msgInputViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  msgInputStyle: {
    marginBottom: 0,
    height: 45,
    paddingTop: 0,
    marginTop: 0,
  },
  emptyMsgContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
