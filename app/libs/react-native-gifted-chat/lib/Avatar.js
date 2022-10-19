import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Lightbox from 'react-native-lightbox';
import GiftedAvatar from './GiftedAvatar';
import { StylePropType, isSameUser, isSameDay } from './utils';
const styles = {
  left: StyleSheet.create({
    container: {
      marginRight: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
    imageActive: {
      flex: 1,
      resizeMode: 'contain',
    },
  }),
  right: StyleSheet.create({
    container: {
      marginLeft: 8,
    },
    onTop: {
      alignSelf: 'flex-start',
    },
    onBottom: {},
    image: {
      height: 36,
      width: 36,
      borderRadius: 18,
    },
    imageActive: {
      flex: 1,
      resizeMode: 'contain',
    },
  }),
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
};
export default class Avatar extends React.Component {
  renderAvatar() {
    if (this.props.renderAvatar) {
      const { renderAvatar, ...avatarProps } = this.props;
      return this.props.renderAvatar(avatarProps);
    }
    if (this.props.currentMessage) {
      return (
        <GiftedAvatar
          avatarStyle={[
            styles[this.props.position].image,
            this.props.imageStyle && this.props.imageStyle[this.props.position],
          ]}
          textStyle={this.props.textStyle ? this.props.textStyle : {}}
          user={this.props.currentMessage.user}
          onPress={() =>
            this.props.onPressAvatar &&
            this.props.onPressAvatar(this.props.currentMessage.user)
          }
          onLongPress={() =>
            this.props.onLongPressAvatar &&
            this.props.onLongPressAvatar(this.props.currentMessage.user)
          }
        />
      );
    }
    return null;
  }
  render() {
    const {
      renderAvatarOnTop,
      showAvatarForEveryMessage,
      containerStyle,
      position,
      currentMessage,
      renderAvatar,
      previousMessage,
      lightboxProps,
      nextMessage,
      imageStyle,
    } = this.props;
    const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
    const computedStyle = renderAvatarOnTop ? 'onTop' : 'onBottom';
    if (renderAvatar === null) {
      return null;
    }
    if (
      !showAvatarForEveryMessage &&
      currentMessage &&
      messageToCompare &&
      isSameUser(currentMessage, messageToCompare) &&
      isSameDay(currentMessage, messageToCompare)
    ) {
      return (
        <View
          style={[
            styles[position].container,
            containerStyle && containerStyle[position],
          ]}>
          <GiftedAvatar
            avatarStyle={[
              styles[position].image,
              imageStyle && imageStyle[position],
            ]}
          />
        </View>
      );
    }
    return (
      <View
        style={[
          styles[position].container,
          styles[position][computedStyle],
          containerStyle && containerStyle[position],
        ]}>
        <Lightbox
          activeProps={{
            style: styles.imageActive,
          }}
          springConfig={{ overshootClamping: true }}
          {...lightboxProps}>
          {this.renderAvatar()}
        </Lightbox>
      </View>
    );
  }
}
Avatar.defaultProps = {
  renderAvatarOnTop: false,
  showAvatarForEveryMessage: false,
  position: 'left',
  currentMessage: {
    user: null,
  },
  previousMessage: {},
  nextMessage: {},
  containerStyle: {},
  imageStyle: {},
  onPressAvatar: () => {},
  onLongPressAvatar: () => {},
};
Avatar.propTypes = {
  renderAvatarOnTop: PropTypes.bool,
  showAvatarForEveryMessage: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  onPressAvatar: PropTypes.func,
  onLongPressAvatar: PropTypes.func,
  renderAvatar: PropTypes.func,
  containerStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  imageStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
};
//# sourceMappingURL=Avatar.js.map
