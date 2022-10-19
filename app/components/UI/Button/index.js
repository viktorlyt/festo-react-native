/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import GradientContainer from '@components/UI/GradientContainer';
import { BaseColors, FontFamily } from '@config/theme';
/**
 * Component for Button
 * @function Button
 *
 */
export default function Button(props) {
  const {
    children,
    type,
    shape,
    raised,
    containerStyle,
    loading,
    onPress,
    style,
    disabled,
    ...rest
  } = props;

  const renderText = () => {
    return (
      <Text
        style={{
          fontSize: 16,
          color:
            type === 'outlined'
              ? BaseColors.secondary
              : type === 'secondary'
              ? BaseColors.textGrey
              : BaseColors.white,
          fontFamily: FontFamily.medium,
        }}>
        {!loading ? (
          children
        ) : (
          <ActivityIndicator
            animating
            color={
              type === 'outlined' ? BaseColors.secondary : BaseColors.white
            }
          />
        )}
      </Text>
    );
  };

  const shadow = raised && type === 'primary' ? styles.shadow : {};

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      {...rest}
      onPress={loading ? () => {} : onPress}
      style={[
        { width: '100%' },
        {
          overflow: 'hidden',
          ...styles[shape],
          ...shadow,
          ...styles[type],
          ...style,
        },
      ]}>
      {type === 'primary' ? (
        <GradientContainer style={[styles.btnContainer, containerStyle]}>
          {renderText()}
        </GradientContainer>
      ) : type === 'secondary' ? (
        <View style={[styles.secondaryBtn, containerStyle]}>
          {renderText()}
        </View>
      ) : (
        <View style={[styles.btnContainer, containerStyle]}>
          {renderText()}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  round: {
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  square: {
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    borderBottomStartRadius: 5,
    borderBottomEndRadius: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  secondaryBtn: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    backgroundColor: BaseColors.borderColor,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: BaseColors.secondary,
  },
  text: {
    backgroundColor: 'transparent',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,
    // elevation: 1,
  },
});

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'outlined', 'text']),
  shape: PropTypes.oneOf(['round', 'square']),
  raised: PropTypes.bool,
  containerStyle: PropTypes.object,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

Button.defaultProps = {
  type: 'primary', // "primary"  | "outlined" | "text"
  shape: 'round', // "round"  | "square"
  raised: true, // true | false
  containerStyle: {},
  loading: false, // true | false
  onPress: () => {},
  style: {},
};
