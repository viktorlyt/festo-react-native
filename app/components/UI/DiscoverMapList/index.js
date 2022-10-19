/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { Text } from '@components';
import Image from 'react-native-fast-image';
import FIcon from 'react-native-vector-icons/Feather';
import { WebView } from 'react-native-webview';
import { isArray } from 'lodash';
import { BaseColors, FontFamily } from '@config/theme';
import { CustomIcon } from '@config/LoadIcons';
import _ from 'lodash';
import { Images } from '@config';

const IOS = Platform.OS === 'ios';
/**
 * Component for DiscoverCardList
 * @function DiscoverCardList
 *
 */
export default function DiscoverCardList(props) {
  const {
    image,
    peopleImg,
    children,
    type,
    userName,
    host,
    event,
    date,
    peoples,
    shape,
    raised,
    containerStyle,
    loading,
    onPress,
    style,
    data,
    price,
    is_free,
    fromTime,
    joinedUsers = 0,
    ...rest
  } = props;

  return (
    <View style={styles.item}>
      {IOS ? (
        <View style={styles.userImg}>
          <Image
            source={{
              uri: image[0]?.image_url,
            }}
            style={{ flex: 1 }}
          />
          {is_free === 0 ? (
            <View style={styles.paidSheetImgview}>
              <Text bold style={styles.paidImg}>
                Paid
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.userImg}>
          <WebView source={{ uri: image[0]?.image_url }} style={{ flex: 1 }} />
          {is_free === 0 ? (
            <Text
              style={{
                position: 'absolute',
                top: 0,
              }}>
              <Image
                source={{
                  uri: 'https://festo.ams3.digitaloceanspaces.com/user_chat/1654751723-MaskGroup.png',
                }}
                style={{
                  width: 80,
                  height: 80,
                }}
                resizeMode="contain"
              />
            </Text>
          ) : null}
        </View>
      )}
      <View style={styles.usernameView}>
        <View style={styles.rowView}>
          {IOS ? (
            <Image source={{ uri: peopleImg }} style={styles.profileImg} />
          ) : (
            <View style={styles.profileImg}>
              <WebView source={{ uri: peopleImg }} style={{ flex: 1 }} />
            </View>
          )}
          <View style={{}}>
            <Text numberOfLines={1} style={styles.userName}>
              {userName}
            </Text>
            <Text numberOfLines={1} style={styles.Host}>
              {host}
            </Text>
          </View>
          {/* 30 May 2021 - 11 PM */}
        </View>
        <Text style={styles.caption}>{event}</Text>
        <View style={styles.rowView}>
          <CustomIcon
            name="calender-active"
            size={20}
            color={BaseColors.primary}
          />
          <View>
            <Text numberOfLines={1} style={styles.dateTxt}>
              {`${date} - ${fromTime}`}
            </Text>
          </View>
        </View>
        {is_free == 0 ? (
          <View style={styles.rowView}>
            <CustomIcon name="price" size={15} color={BaseColors.primary} />
            <View>
              <Text numberOfLines={1} style={styles.dateTxt} bold>
                {price ? `$${price}` : '$0'}
              </Text>
            </View>
          </View>
        ) : null}
        <View style={styles.rowView}>
          {isArray(peoples) &&
            peoples.length > 0 &&
            peoples.map((item, index) => {
              if (IOS) {
                return (
                  <Image
                    key={`party_users_${index}`}
                    source={{
                      uri: item,
                    }}
                    resizeMode="cover"
                    style={index > 0 ? styles.uprImg : styles.bottomImg}
                  />
                );
              }
              return (
                <View
                  key={`party_users_${index}`}
                  style={[
                    index > 0 ? styles.uprImg : styles.bottomImg,
                    { overflow: 'hidden' },
                  ]}>
                  <WebView source={{ uri: item }} style={{ flex: 1 }} />
                </View>
              );
            })}
          <Text numberOfLines={1} style={styles.joiner}>
            {joinedUsers} Friends join the Party
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: BaseColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: IOS ? 0 : 0.8,
    shadowRadius: IOS ? 0 : 20,
    elevation: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: Dimensions.get('window').width,
  },
  userImg: {
    flex: 1,
    width: '100%',
    height: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
  },
  profileImg: {
    width: 35,
    height: 35,
    borderRadius: 30,
    overflow: 'hidden',
  },
  bottomImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  uprImg: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 20,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  usernameView: {
    flex: 1,
    marginLeft: 12,
    paddingHorizontal: 3,
  },
  rowView: {
    flex: 1,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    paddingLeft: 5,
    fontSize: 12,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  Host: {
    fontSize: 10,
    paddingLeft: 5,
    color: BaseColors.textGrey,
    fontFamily: FontFamily.regular,
  },
  caption: {
    paddingLeft: 5,
    paddingVertical: 3,
    fontSize: 14,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  addIcon: {
    opacity: 0.5,
  },
  dateTxt: {
    paddingLeft: 10,
    flexDirection: 'row',
    fontSize: 12,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  joiner: {
    paddingHorizontal: 3,
    flex: 1,
    marginLeft: 20,
    flexDirection: 'row',
    fontSize: 10,
    color: BaseColors.lightBlack,
    fontFamily: FontFamily.bold,
  },
  paidSheetImgview: {
    position: 'absolute',
    width: '100%',
  },
  paidImg: {
    top: 20,
    position: 'absolute',
    color: 'white',
    backgroundColor: BaseColors.primary,
    left: -60,
    paddingVertical: 5,
    width: '100%',
    textAlign: 'center',
    transform: [{ rotate: '-45deg' }],
  },
});

DiscoverCardList.propTypes = {
  type: PropTypes.oneOf(['primary', 'outlined', 'text']),
  shape: PropTypes.oneOf(['round', 'square']),
  raised: PropTypes.bool,
  containerStyle: PropTypes.object,
  userName: PropTypes.string,
  host: PropTypes.string,
  event: PropTypes.string,
  date: PropTypes.string,
  peoples: PropTypes.array,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

DiscoverCardList.defaultProps = {
  type: 'primary', // "primary"  | "outlined" | "text"
  shape: 'round', // "round"  | "square"
  raised: true, // true | false
  containerStyle: {},
  userName: '',
  host: '',
  event: '',
  date: '',
  peoples: [],
  loading: false, // true | false
  onPress: () => {},
  style: {},
};
