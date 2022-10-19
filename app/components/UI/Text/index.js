/* eslint-disable react-native/no-inline-styles */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text as Txt } from 'react-native';
import { BaseColors } from '@config/theme';

/**
 * Component for Displaying Text
 * @function Text
 */
export default function Text(props) {
  const { size, color, type, bold, style, children, ...rest } = props;

  const fontColor = useMemo(() => {
    if (['primary', 'secondary', 'gray', 'black', 'white'].includes(color)) {
      return styles[color]?.color;
    }
    return color;
  }, [color]);

  return (
    <Txt
      style={[
        styles.baseFont,
        {
          fontWeight: bold ? 'bold' : 'normal',
          color: fontColor,
          ...styles[type],
        },
        { ...style },
      ]}
      {...rest}
      allowFontScaling={false}>
      {children}
    </Txt>
  );
}

const styles = StyleSheet.create({
  baseFont: {
    color: BaseColors.black70,
  },
  primary: {
    color: BaseColors.primary,
  },
  secondary: {
    color: BaseColors.secondary,
  },
  gray: {
    color: BaseColors.textSecondary,
  },
  black: {
    color: BaseColors.black,
  },
  white: {
    color: BaseColors.white,
  },
  title: {
    fontSize: 22,
  },
  heading: {
    fontSize: 20,
  },
  subHeading: {
    fontSize: 18,
  },
  normal: {
    fontSize: 14,
  },
});

Text.propTypes = {
  type: PropTypes.oneOf([
    'normal',
    'heading',
    'subHeading',
    'normal',
    'heading',
    'title',
  ]),
  color: PropTypes.string,
  bold: PropTypes.bool,
  size: PropTypes.number,
};

Text.defaultProps = {
  type: 'normal',
  color: 'black', // "primary"  | "secondary" | "gray" | "black" | "white" | "#43421"
  bold: false, // true | false
  size: 14,
};
