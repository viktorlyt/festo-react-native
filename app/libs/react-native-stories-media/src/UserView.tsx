import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';

type Props = {
  onClosePress: () => void;
  profile: string;
  name: string;
  datePublication: string;
  userId: number;
  handleModal: () => void;
};

const IOS = Platform.OS === 'ios';
const diffDateWithNow = (date) => {
  const cDate = moment.unix(date);
  let startDate = new Date(cDate);

  // Do your operations
  let endDate = new Date();
  let seconds = (endDate.getTime() - startDate.getTime()) / 1000;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let current: string;
  if (days >= 1) {
    current = days == 1 ? 'day' : 'days';
    return Math.trunc(days) + ' ' + current;
  } else if (hours > 1) {
    current = hours < 2 ? 'hour' : 'hours';
    return Math.trunc(hours) + ' ' + current;
  } else {
    current = minutes <= 1 ? 'minute' : 'minutes';
    return Math.trunc(minutes) + ' ' + current;
  }
};

export default memo(function UserView(props: Props) {
  console.log('props.userId ====>>', props.userId);
  return (
    <View style={styles.userView}>
      <TouchableOpacity
        onPress={() => {
          if (props.userId) {
            props.handleModal(props.userId);
          }
        }}>
        <Image source={{ uri: props.profile }} style={styles.image} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <View style={styles.barUsername}>
          <Text style={styles.name}>{props.name}</Text>
        </View>

        <Text style={styles.time}>
          {!!props.datePublication &&
            `${diffDateWithNow(props.datePublication)} ago`}
        </Text>
      </View>
      <TouchableOpacity onPress={props.onClosePress}>
        <Icon name="close" color="white" size={25} style={{ marginRight: 8 }} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  barUsername: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
  },
  userView: {
    flexDirection: 'row',
    position: 'absolute',
    top: IOS ? 55 : 20,
    width: '98%',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    color: 'white',
  },
  time: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 3,
    marginLeft: 12,
    color: 'white',
  },
});
