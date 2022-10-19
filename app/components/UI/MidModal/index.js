/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import {
  View,
  Modal,
  Image,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import { Button } from '@components';
import { BaseColors } from '@config/theme';
import StarRating from 'react-native-star-rating';

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

export default function MidModal(props) {
  const {
    image,
    title,
    btnTxt,
    coin,
    description,
    btnYPress,
    btnNPress,
    style,
    ratings,
    secondBtnText = 'Later',
    partyRated,
    btnLoader,
    addBankAc,
    btnInviteFriends,
    displayInviteFriends = false,
    ...rest
  } = props;
  const [rating, setRating] = useState(ratings);

  const [visible, setVisible] = React.useState(true);
  return (
    <ModalPoup visible={visible}>
      <View
        style={[
          styles.mainView,
          {
            paddingHorizontal: ratings ? 25 : addBankAc ? 50 : 25,
          },
        ]}>
        <View>
          {coin ? <Text style={styles.coinTxt}>{coin}</Text> : null}
          <View>
            <Text
              style={[
                styles.titleTxt,
                { paddingVertical: description ? 0 : 10 },
              ]}>
              {title}
            </Text>
            {description ? (
              <Text style={styles.subTitle}>{description}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.startview}>
          {image ? (
            <Image style={styles.img1} source={image} />
          ) : (
            <StarRating
              maxStars={5}
              rating={rating}
              selectedStar={(rating) => {
                setRating(rating);
                partyRated(rating);
              }}
              fullStarColor={BaseColors.primary}
              emptyStarColor={BaseColors.lightRed}
              starSize={40}
              starStyle={{ margin: 2 }}
              halfStarEnabled={true}
            />
          )}
        </View>

        <View
          style={[
            styles.btnView,
            {
              paddingHorizontal: ratings || addBankAc ? 0 : 20,
            },
          ]}>
          <Button onPress={btnLoader ? null : btnYPress} type="primary">
            {btnLoader ? (
              <View>
                <ActivityIndicator
                  animating
                  size={'small'}
                  color={BaseColors.white}
                />
              </View>
            ) : (
              btnTxt
            )}
          </Button>

          {displayInviteFriends ? (
            <View
              style={{
                marginTop: 10,
              }}>
              <Button onPress={btnInviteFriends} type="outlined">
                {'Invite Friends'}
              </Button>
            </View>
          ) : null}
        </View>
        {addBankAc ? null : (
          <TouchableOpacity onPress={btnNPress}>
            <Text style={styles.later}>{secondBtnText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </ModalPoup>
  );
}

MidModal.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  btnTxt: PropTypes.string,
  style: PropTypes.object,
  btnYPress: PropTypes.func,
  btnNPress: PropTypes.func,
  coin: PropTypes.string,
};

MidModal.defaultProps = {
  title: '',
  description: '',
  btnTxt: '',
  coin: '',
  btnYPress: () => {},
  btnNPress: () => {},
  style: {},
};
