import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Color from './Color';
import { CustomIcon } from '../../../config/LoadIcons';
import { StylePropType } from './utils';
import { BaseColors } from '@config/theme';

const styles = StyleSheet.create({
  container: {
    height: 44,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    color: Color.defaultBlue,
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: Color.backgroundTransparent,
    marginBottom: 12,
    marginLeft: 10,
    marginRight: 10,
  },
});
export default class Send extends Component {
  constructor() {
    super(...arguments);
    this.handleOnPress = () => {
      const { text, onSend } = this.props;
      if (text && onSend) {
        onSend({ text: text.trim() }, true);
      }
    };
  }

  render() {
    const {
      text,
      containerStyle,
      children,
      textStyle,
      label,
      alwaysShowSend,
      disabled,
      sendButtonProps,
    } = this.props;
    if (alwaysShowSend || (text && text.trim().length > 0)) {
      return (
        <TouchableOpacity
          testID="send"
          accessible
          accessibilityLabel="send"
          style={[styles.container, containerStyle]}
          onPress={this.handleOnPress}
          accessibilityTraits="button"
          disabled={disabled}
          {...sendButtonProps}>
          <View>
            {/* {children || <Text style={[styles.text, textStyle]}>{label}</Text>} */}
            {children || (
              <CustomIcon
                name="Icons---Plane"
                size={23}
                color={BaseColors.primary}
                style={{ marginLeft: 10, alignSelf: 'center' }}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    }
    return <View />;
  }
}
Send.defaultProps = {
  text: '',
  onSend: () => {},
  label: 'Send',
  containerStyle: {},
  textStyle: {},
  children: null,
  alwaysShowSend: false,
  disabled: false,
  sendButtonProps: null,
};
Send.propTypes = {
  text: PropTypes.string,
  onSend: PropTypes.func,
  label: PropTypes.string,
  containerStyle: StylePropType,
  textStyle: StylePropType,
  children: PropTypes.element,
  alwaysShowSend: PropTypes.bool,
  disabled: PropTypes.bool,
  sendButtonProps: PropTypes.object,
};
// # sourceMappingURL=Send.js.map
