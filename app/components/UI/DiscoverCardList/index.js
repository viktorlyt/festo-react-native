/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, Dimensions } from 'react-native';
import Image from 'react-native-fast-image';
import { BaseColors, FontFamily } from '@config/theme';
import ENIcon from 'react-native-vector-icons/Entypo';
import { CustomIcon } from '@config/LoadIcons';
import _ from 'lodash';
import styles from './styles';
import { Images } from '@config';

/**
 * Component for DiscoverMapList
 * @function DiscoverMapList
 *
 */
export default function DiscoverMapList(props) {
  const {
    children,
    type,
    userName,
    host,
    isPaid,
    event,
    date,
    peoples,
    shape,
    raised,
    containerStyle,
    loading,
    onPress,
    style,
    hostPhoto,
    distance,
    joiningUsers,
    allparties,
    partyImage,
    ratings,
    avgRating,
    is_free,
    ...rest
  } = props;

  return (
    <View
      style={[
        styles.item,
        {
          width: allparties ? '100%' : Dimensions.get('window').width / 1.7,
        },
      ]}>
      <View style={styles.profileTitleView}>
        <View>
          <Image
            source={
              !_.isEmpty(partyImage)
                ? { uri: partyImage }
                : require('@assets/Images/cardImg.jpeg')
            }
            style={[
              styles.userImg,
              {
                width: '100%',
                height: allparties
                  ? Dimensions.get('window').height / 5
                  : Dimensions.get('window').height / 6.5,
              },
            ]}
          />
          {is_free === 0 ? (
            <View style={styles.paidSheetImgview}>
              <Text
                bold
                style={[
                  styles.paidImg,
                  {
                    top: isPaid ? 15 : 20,
                    left: isPaid ? -80 : -55,
                    width: isPaid ? '100%' : '50%',
                    textAlign: 'center',
                  },
                ]}>
                Paid
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.menuIconView}>
          <CustomIcon name="marker-active" size={10} color={BaseColors.black} />

          <View
            style={{
              marginLeft: 5,
            }}>
            <Text style={styles.locationTxt}>
              {`${distance ? distance : 0} KM`}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.rowView}>
            <Image source={{ uri: hostPhoto }} style={styles.profileImg} />

            <View>
              <Text numberOfLines={1} style={styles.userName}>
                {userName}
              </Text>
              <Text numberOfLines={1} style={styles.Host}>
                {host}
              </Text>
            </View>
          </View>

          {ratings > 0 ? (
            <View style={styles.reviewView}>
              <ENIcon
                style={styles.menuIcon}
                name="star"
                size={15}
                color={BaseColors.primary}
              />
              <Text numberOfLines={1} style={styles.review}>
                {`${avgRating} (${ratings})`}
              </Text>
            </View>
          ) : null}
        </View>
        <Text numberOfLines={1} style={styles.caption}>
          {event}
        </Text>
        {date ? (
          <View style={styles.rowView}>
            <CustomIcon
              name="calender-active"
              size={20}
              color={BaseColors.primary}
            />
            <View style={{}}>
              <Text numberOfLines={1} style={styles.dateTxt}>
                {date}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.rowView}>
          {!_.isEmpty(joiningUsers) && _.isArray(joiningUsers) ? (
            joiningUsers?.map((it, ii) => {
              return (
                <>
                  {ii > 0 ? (
                    <Image source={{ uri: it }} style={styles.uprImg} />
                  ) : (
                    <Image source={{ uri: it }} style={styles.bottomImg} />
                  )}
                </>
              );
            })
          ) : (
            <Image
              source={require('../../../assets/Images/avatar.png')}
              style={styles.bottomImg}
            />
          )}
          <Text
            numberOfLines={1}
            style={[
              styles.joiner,
              {
                marginLeft: peoples > 1 ? 26 : 10,
              },
            ]}>
            {`${peoples} Friend${peoples > 1 ? 's' : ''} joined the Party`}
          </Text>
        </View>
      </View>
    </View>
  );
}

DiscoverMapList.propTypes = {
  type: PropTypes.oneOf(['primary', 'outlined', 'text']),
  shape: PropTypes.oneOf(['round', 'square']),
  raised: PropTypes.bool,
  containerStyle: PropTypes.object,
  userName: PropTypes.string,
  host: PropTypes.string,
  event: PropTypes.string,
  date: PropTypes.string,
  peoples: PropTypes.string,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

DiscoverMapList.defaultProps = {
  type: 'primary', // "primary"  | "outlined" | "text"
  shape: 'round', // "round"  | "square"
  raised: true, // true | false
  containerStyle: {},
  userName: '',
  host: '',
  event: '',
  date: '',
  peoples: '',
  loading: false, // true | false
  onPress: () => {},
  style: {},
};
