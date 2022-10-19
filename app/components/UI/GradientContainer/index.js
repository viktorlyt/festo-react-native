import { BaseColors } from '@config/theme';
import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
/**
 * Component for GradientContainer
 *@function GradientContainer
 */
export default function GradientContainer(props) {
  const { containerStyle, children, ...rest } = props;
  return (
    <LinearGradient
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 0.8, y: 0.0 }}
      colors={[BaseColors.secondary, BaseColors.primary]}
      {...rest}>
      <View style={containerStyle}>{children}</View>
    </LinearGradient>
  );
}

GradientContainer.propTypes = {
  containerStyle: PropTypes.object,
};

GradientContainer.defaultProps = {
  containerStyle: {},
};
