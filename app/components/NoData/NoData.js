import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { BaseColors } from '@config/theme';

const styles = StyleSheet.create({
  bigFont: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 5,
    color: BaseColors.primary,
  },
  smallFont: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: BaseColors.black40,
  },
  animationWrap: {
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable_style: {
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColors.primary,
  },
  animation: {
    height: 150,
    width: 200,
  },
  icon_Style: {
    fontSize: 22,
    color: BaseColors.white,
    marginRight: 8,
  },
});
/**
 *Component that Shows NoDAta Text
 * @function CNoData
 *
 */
export default function CNoData(props) {
  const animation = useRef();
  const {
    msgNoData,
    imageSource,
    style,
    imageStyle,
    onAnimationFinish,
    textColor,
    headTitle,
    hideTopTitle,
  } = props;
  return (
    <View style={[styles.animationWrap, style]}>
      <LottieView
        ref={animation}
        onAnimationFinish={onAnimationFinish}
        autoSize={false}
        style={[styles.animation, imageStyle]}
        source={imageSource}
        autoPlay={true}
        loop={true}
      />

      {hideTopTitle ? null : (
        <Text style={[styles.bigFont, textColor]}>{headTitle}</Text>
      )}
      <Text style={[styles.smallFont, textColor]}>{msgNoData}</Text>
    </View>
  );
}

CNoData.propTypes = {
  headTitle: PropTypes.string,
  hideTopTitle: PropTypes.bool,
};

CNoData.defaultProps = {
  headTitle: 'Oops',
  hideTopTitle: false,
};
