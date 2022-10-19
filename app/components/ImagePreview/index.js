import React, { forwardRef } from 'react';
import { Modal, Text, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BaseColors } from '@config/theme';
import styles from './styles';

/**
 * Module ImagePreview for story
 * @module ImagePreview
 *
 */
function ImagePreview(props, ref) {
  const {
    visible = false,
    handleModal = () => null,
    imageData = {},
    uploadStory = () => null,
  } = props;

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={handleModal}>
      <View style={styles.container}>
        <Icon
          name="close"
          style={styles.closeIconStyle}
          onPress={handleModal}
        />
        <Image
          source={{ uri: imageData?.uri }}
          style={styles.imgStyle}
          resizeMode="contain"
        />
        <View style={styles.bottomBtnContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.uploadBtnStyle}
            onPress={() => uploadStory(imageData)}>
            <Text style={{ color: BaseColors.white }}>Upload Story</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default forwardRef(ImagePreview);
