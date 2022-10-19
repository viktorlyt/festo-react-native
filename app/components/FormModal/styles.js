import { StyleSheet, Platform } from 'react-native';
import { BaseColors } from '@config/theme';

const IOS = Platform.OS === 'ios';
export default StyleSheet.create({
  Text1: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: 10,
    paddingBottom: IOS ? 15 : 10,
  },
  titleContainer: {
    borderBottomColor: BaseColors.borderColor,
    borderBottomWidth: 0.5,
  },
});
