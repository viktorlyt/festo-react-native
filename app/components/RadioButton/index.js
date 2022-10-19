import Text from '@components/UI/Text';
import { BaseColors } from '@config/theme';
import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles';

export default function RadioButton(props) {
  const { Title, onPress,selected } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={styles.container}>
      <View
        style={[
          styles.RadioOuter,
          {
            borderColor: selected ? BaseColors.primary : BaseColors.textGrey,
          },
        ]}>
        <View
          style={[
            styles.RadioInner,
            {
              backgroundColor: selected ? BaseColors.primary : BaseColors.white,
            },
          ]}
        />
      </View>
      <Text style={styles.title}>{Title}</Text>
    </TouchableOpacity>
  );
}
