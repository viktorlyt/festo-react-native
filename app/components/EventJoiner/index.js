/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Image from 'react-native-fast-image';
import FIcon from 'react-native-vector-icons/Feather';
import GradientContainer from '@components/UI/GradientContainer';
import { BaseColors, FontFamily } from '@config/theme';
import ENIcon from 'react-native-vector-icons/Entypo';

/**
 * Component for EventJoiner
 * @function EventJoiner
 *
 */
export default function EventJoiner(props) {
  const {
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
    ...rest
  } = props;

  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.item}>
      <View style={styles.profileTitleView}>
        <Image
          source={require('@assets/Images/cardImg.jpeg')}
          style={styles.eventImg}
        />
        <View style={[styles.rowView, { paddingHorizontal: 10 }]}>
          <Image
            source={require('@assets/Images/avatar.png')}
            style={styles.profileImg}
          />
          <View style={{}}>
            <Text numberOfLines={1} style={styles.userName}>
              Lelah Hirthe
            </Text>
            <Text numberOfLines={1} style={styles.Host}>
              Host
            </Text>
          </View>
          <View style={styles.reviewView}>
            <ENIcon
              style={styles.menuIcon}
              name="star"
              size={15}
              color={BaseColors.primary}
            />
            <Text numberOfLines={1} style={styles.review}>
              4.9 (15)
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={[styles.caption, { paddingHorizontal: 10 }]}>
          5th Marriage Anniversary
        </Text>
        <View style={[styles.rowView, { paddingHorizontal: 10 }]}>
          <FIcon
            style={styles.addIcon}
            name="calendar"
            size={25}
            color={BaseColors.primary}
          />
          <View style={{}}>
            <Text numberOfLines={1} style={styles.dateTxt}>
              30 May 2021 - 11 PM
            </Text>
          </View>
        </View>
        <View style={[styles.rowView, { paddingHorizontal: 10 }]}>
          <Image
            source={require('@assets/Images/avatar.png')}
            style={styles.bottomImg}
          />
          <Image
            source={require('@assets/Images/avtar.jpg')}
            style={styles.uprImg}
          />
          <View>
            <Text numberOfLines={1} style={styles.joiner}>
              15 Friends join the Party
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: BaseColors.white,
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 10,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 6,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  profileTitleView: {
    flex: 1,
  },
  eventImg: {
    width: Dimensions.get('window').width / 1.18,
    height: Dimensions.get('window').height / 4,
    borderRadius: 10,
  },
  rowView: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    paddingLeft: 5,
    fontSize: 14,
    color: BaseColors.black,
    fontWeight: 'bold',
  },
  Host: {
    fontSize: 12,
    paddingLeft: 5,
    color: BaseColors.black,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  reviewView: {
    marginLeft: 100,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  review: {
    fontSize: 12,
    paddingLeft: 5,
    color: BaseColors.black,
    fontFamily: FontFamily.bold,
  },
  caption: {
    paddingLeft: 10,
    fontSize: 16,
    color: BaseColors.black,
    fontWeight: 'bold',
  },
  commentRowView: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: 'row',
  },
  bottomImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: BaseColors.white,
  },
  uprImg: {
    width: 30,
    height: 30,
    position: 'absolute',
    left: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: BaseColors.white,
  },
  dateTxt: {
    paddingLeft: 12,
    flexDirection: 'row',
    fontSize: 12,
    color: BaseColors.black,
    fontWeight: 'bold',
  },
  joiner: {
    marginLeft: 15,
    flexDirection: 'row',
    fontSize: 14,
    color: BaseColors.black,
    fontWeight: 'bold',
  },
});

EventJoiner.propTypes = {
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

EventJoiner.defaultProps = {
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
