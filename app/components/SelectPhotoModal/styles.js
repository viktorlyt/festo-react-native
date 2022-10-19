import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

export default StyleSheet.create({
  modalRowView: {
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
  },
});
