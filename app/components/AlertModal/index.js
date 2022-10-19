/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { Button, CHeader } from '@components';
import Entypo from 'react-native-vector-icons/Entypo';
import PropTypes from 'prop-types';
import { Images } from '@config/images';
import { BaseColors } from '@config/theme';
import AIcon from 'react-native-vector-icons/AntDesign';
import styles from './style';
import { CustomIcon } from '@config/LoadIcons';
/**
 * Module NewGroup for creating new group
 * @module AlertModal
 *
 */

export default function AlertModal(props, navigation) {
  const {
    lottieSrc = Images.alert,
    image,
    title,
    description,
    modalHeading,
    btnYTitle,
    btnNTitle,
    btnYPress,
    btnNPress,
    visible,
    setVisible,
    loader,
    prompt,
    btnOkPress,
    activeTochable,
    lottieViewVisible,
    link,
    onPressLink,
    onPressLink2,
    link1,
    link2,
    connector,
    closeButton,
    imgModel,
    // btnXPress = () => {
    //   setVisible(!visible);
    // },
  } = props;
  const ModalPoup = ({ visible, children }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => {
      toggleModal();
    }, [visible]);
    const toggleModal = () => {
      if (visible) {
        setShowModal(true);
        Animated.spring(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        setTimeout(() => setShowModal(false), 200);
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };
    return (
      <Modal transparent visible={showModal}>
        <View style={styles.modalBackGround}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }] },
            ]}>
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  };
  return (
    <TouchableOpacity
      onPress={() => {
        setVisible(!visible);
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          activeTochable ? setVisible(!visible) : null;
        }}
        style={styles.root}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          close={() => {
            setVisible(!visible);
          }}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            activeTochable ? setVisible(!visible) : null;
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              activeTochable ? setVisible(!visible) : null;
            }}
            style={styles.mainView}>
            <View
              style={{
                ...styles.modalView,
                //alignItems: lottieViewVisible ? 'center' : 'flex-start',
              }}>
              <View style={styles.modalText}>
                <Text style={styles.descriptionTxt}>{description}</Text>
              </View>
              {prompt ? (
                <View style={styles.centerBtn}>
                  <Button onPress={btnNPress} type="primary">
                    {btnNTitle}
                  </Button>
                </View>
              ) : (
                <View style={styles.btnView}>
                  <View style={styles.btnOne}>
                    <Button onPress={btnYPress} type="outlined">
                      {loader ? (
                        <ActivityIndicator
                          color={BaseColors.primary}
                          size="small"
                        />
                      ) : (
                        btnYTitle
                      )}
                    </Button>
                  </View>
                  <View
                    style={[
                      styles.btnOne,
                      {
                        marginLeft: 5,
                      },
                    ]}>
                    <Button
                      // onPress={btnNPress}
                      onPress={() => setVisible(false)}
                      type="primary">
                      {btnNTitle}
                    </Button>
                  </View>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

AlertModal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  modalHeading: PropTypes.string,
  btnYTitle: PropTypes.string,
  btnNTitle: PropTypes.string,
  btnYPress: PropTypes.func,
  btnNPress: PropTypes.func,
  btnXPress: PropTypes.func,
  btnOkPress: PropTypes.func,
  bt: PropTypes.func,
  activeTochable: PropTypes.bool,
  lottieViewVisible: PropTypes.bool,
  closeButton: PropTypes.bool,
};

AlertModal.defaultProps = {
  title: 'Alert',
  description: '',
  modalHeading: '',
  btnYTitle: 'OK',
  btnNTitle: 'CANCEL',
  btnYPress: () => {},
  btnNPress: () => {},
  onClose: false,
  loader: false,
  activeTochable: true,
  lottieViewVisible: true,
  btnOkPress: () => {},
  closeButton: true,
};
