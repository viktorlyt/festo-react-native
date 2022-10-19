/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Image from 'react-native-fast-image';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import FIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

export default function ViewImageModal(props) {
  const { visible = false, handleModal = () => null, imgUrl = '' } = props;
  const IOS = Platform.OS === 'ios';

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        handleModal();
      }}>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.centeredView]}
        onPress={() => {
          handleModal();
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={{
            ...styles.modalView,
          }}
          onPress={() => {
            return null;
          }}>
          <FIcon
            name="close"
            size={26}
            onPress={() => {
              handleModal();
            }}
            style={{
              position: 'absolute',
              top: IOS ? getStatusBarHeight() + 6 : 15,
              left: 12,
              zIndex: 10,
              color: '#FFF',
            }}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Image
              source={{
                uri: imgUrl,
              }}
              style={{
                flex: 1,
                resizeMode: 'contain',
              }}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
