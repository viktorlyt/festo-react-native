/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Lightbox from 'react-native-lightbox';
import MIcon from 'react-native-vector-icons/Ionicons';

/**
 * Component for LightBox
 * @function LightBox
 *
 */
export default function LightBoxContainer(props) {
  const { children, navigator } = props;

  return (
    <Lightbox
      renderHeader={(close) => (
        <TouchableOpacity onPress={close}>
          <MIcon name="close" size={26} style={styles.closeButton} />
        </TouchableOpacity>
      )}
      underlayColor="white"
      navigator={navigator}
      springConfig={{ overshootClamping: true }}
      activeProps={{
        style: {
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height / 1.5,
          marginTop: 20,
        },
        resizeMode: 'cover',
      }}>
      {children()}
    </Lightbox>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    color: 'white',
    borderRadius: 3,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginTop: 50,
  },
});

LightBoxContainer.propTypes = {};

LightBoxContainer.defaultProps = {};
