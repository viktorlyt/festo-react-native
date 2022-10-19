import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

const styles = StyleSheet.create({
  mainContainer: {
    // marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: BaseColors.white,
    borderColor: BaseColors.borderColor,
  },
  btnCon: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: BaseColors.primary,
  },
  placeHolderCon: {
    position: 'absolute',
    left: 15,
    top: -16,
    backgroundColor: BaseColors.white,
    paddingHorizontal: 5,
  },
  optionConSty: {
    width: '100%',
    // height: 240,
  },
  optionScrollCon: {
    // paddingTop: 60,
    paddingBottom: 10,
  },
});

export default styles;
