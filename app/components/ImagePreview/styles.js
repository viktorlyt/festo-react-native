import { StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  closeIconStyle: {
    fontSize: 30,
    color: BaseColors.white,
    marginTop: 60,
    position: 'absolute',
    left: 15,
    zIndex: 99,
  },
  imgStyle: { width: '100%', height: '100%' },
  bottomBtnContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 22,
    alignItems: 'center',
  },
  uploadBtnStyle: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: BaseColors.primary,
    borderRadius: 15,
  },
});

export default styles;
