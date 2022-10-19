import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

const Rail = () => {
  return (
    <View style={styles.root}/>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 4,
   
    borderRadius: 2,
    backgroundColor:BaseColors.borderColor,
  },
});

export default memo(Rail);
