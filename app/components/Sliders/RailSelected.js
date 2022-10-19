import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';
import { BaseColors } from '@config/theme';

const RailSelected = () => {
  return (
    <View style={styles.root}/>
  );
};

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor:BaseColors.primary,
    borderRadius: 3,
  },
});

export default memo(RailSelected);
