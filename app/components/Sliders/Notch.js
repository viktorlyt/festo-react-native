import { BaseColors } from '@config/theme';
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const Notch = (props) => {
  return <View style={styles.root} {...props} />;
};

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: BaseColors.lightRed,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});

export default memo(Notch);
