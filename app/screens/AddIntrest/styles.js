import { StyleSheet } from 'react-native';
import { BaseColors, FontFamily } from '@config/theme';

export default StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: BaseColors.white,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: BaseColors.white,
  },
  headingTxt: {
    paddingVertical: 5,
    fontSize: 22,
    fontFamily: FontFamily.regular,
    color: BaseColors.lightBlack,
    textAlign: 'center',
  },
  scoll: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 80,
  },
  btnTxtView: {
    borderWidth: 0.6,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  btnTxt: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    color: BaseColors.textGrey,
  },
  btnView: {
    paddingHorizontal: 20,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingVertical: 15,
    backgroundColor: BaseColors.white,
  },
  loaderView: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
