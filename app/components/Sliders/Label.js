import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseColors } from '@config/theme';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor:"#fee9e6",
    borderRadius: 4,
    
    width:80
  },
  text: {
    fontSize: 16,
    color: '#F3492E',
  },
});

export default memo(Label);
