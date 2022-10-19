import React from 'react';
import { View, StyleSheet } from 'react-native';
import Image from 'react-native-fast-image';
/**
 * Compoenet for IconComponent
 * @function IconComponent
 */
const IconComponent = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Image
        style={{ width: props.size, height: props.size }}
        source={props.name}
        resizeMode={props.resizeMode || 'contain'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
export default IconComponent;
