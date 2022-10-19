/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text, Header } from '@components';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import BaseSetting from '@config/setting';
import _, { findIndex, isEmpty } from 'lodash';
import styles from './styles';
import { Images } from '@config/images';
import AIcon from 'react-native-vector-icons/AntDesign';
import CNoData from '@components/CNoData';
import * as Animatable from 'react-native-animatable';
const SeeAllPeople = ({ navigation, route }) => {
  const [allpeople, setAllPeople] = useState([]);
  const [defaultItem, setDefaultItem] = useState({});
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    seeAllPeopleApi();
  }, []);

  const stopLoader = () => {
    setRefreshLoader(false);
    setPageLoader(false);
  };

  const onRefresh = () => {
    setRefreshLoader(true);
    seeAllPeopleApi();
  };

  const seeAllPeopleApi = async () => {
    setPageLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.seeAllPeople}`,
        'GET',
      );

      if (response.status) {
        setAllPeople(response?.data?.rows);
      } else {
        Toast.show(response?.message);
      }
      stopLoader();
    } catch (error) {
      Toast.show(error.toString());
      stopLoader();
    }
  };

  // this function for cancel friend request
  async function cancelFriendRequist(id) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelFriend}?user_id=${id}`,
        'GET',
      );

      if (response.status) {
        const fIndex = findIndex(allpeople, (item) => item.id === id);
        if (fIndex > -1) {
          const arr = [...allpeople];
          arr[fIndex].is_requested = false;
          setAllPeople(arr);
        }
        Toast.show(response?.message);
      } else {
        Toast.show(response?.message);
      }
      setDefaultItem({});
    } catch (error) {
      Toast.show(error.toString());
      setDefaultItem({});
    }
  }

  // this function for sending friend request
  async function sendFriendRequist(id) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.addFriend}?user_id=${id}`,
        'GET',
      );

      if (response.status) {
        const fIndex = findIndex(allpeople, (item) => item.id === id);
        if (fIndex > -1) {
          const arr = [...allpeople];
          arr[fIndex].is_requested = true;
          setAllPeople(arr);
        }
        Toast.show(response?.message);
      } else {
        Toast.show(response?.message);
      }
      setDefaultItem({});
    } catch (error) {
      Toast.show(error.toString());
      setDefaultItem({});
    }
  }

  const renderPeopleItem = ({ item, index }) => {
    const disabled = !isEmpty(defaultItem);
    const isFriend = item?.is_friend;
    const isRequested = item?.is_requested;
    return (
      <View style={[styles.item, index === 0 ? { marginTop: 10 } : {}]}>
        <View style={styles.profileTitleView}>
          <Image
            source={
              _.isNull(item?.photo) ? Images?.usrImg : { uri: item?.photo }
            }
            style={styles.userImg}
          />
          <View style={styles.usernameView}>
            <Text bold numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.title}>
              {`${
                item.mutual_friends_count > 0
                  ? `${item.mutual_friends_count} Mutual Friend${
                      item.mutual_friends_count === 1 ? '' : 's'
                    }`
                  : 'Friend'
              }`}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={isFriend ? 1 : 0.6}
          onPress={() => {
            if (!isFriend) {
              setDefaultItem(item);
              isRequested
                ? cancelFriendRequist(item?.id)
                : sendFriendRequist(item?.id);
            } else {
              return null;
            }
          }}
          style={[
            styles.button,
            {
              borderWidth: isRequested || disabled ? 0 : 1,
              color: disabled ? '#a1a1a1' : BaseColors.secondary,
              backgroundColor: disabled
                ? '#dfdfdf'
                : isRequested
                ? BaseColors.lightRed
                : isFriend
                ? BaseColors.primary
                : BaseColors.white,
              width: isRequested ? 160 : 100,
              justifyContent: 'center',
            },
          ]}>
          {item.id === defaultItem.id ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator
                color={BaseColors.secondary}
                size="small"
                animating
              />
            </View>
          ) : isRequested ? (
            <Text
              color={disabled ? '#a1a1a1' : BaseColors.secondary}
              style={styles.btnTxt}>
              Cancel Request
            </Text>
          ) : isFriend ? (
            <Text
              color={disabled ? '#a1a1a1' : BaseColors.white}
              style={[styles.btnTxt]}>
              Friends
            </Text>
          ) : (
            <>
              <AIcon
                style={styles.addIcon}
                name="plus"
                size={20}
                color={disabled ? '#a1a1a1' : BaseColors.secondary}
              />
              <Text
                color={disabled ? '#a1a1a1' : BaseColors.secondary}
                style={[styles.btnTxt]}>
                Add
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderPageLoader = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator
          animating
          color={BaseColors.primary}
          size={'large'}
        />
      </View>
    );
  };
  const renderNoData = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CNoData />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BaseColors.white,
      }}>
      <Header
        title="People you may know"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      {pageLoader ? (
        renderPageLoader()
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 10,
          }}>
          {!_.isEmpty(allpeople) && _.isArray(allpeople) ? (
            <Animatable.View animation="fadeIn" style={{ flex: 1 }}>
              <FlatList
                data={allpeople}
                renderItem={renderPeopleItem}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    colors={[BaseColors.primary]}
                    tintColor={BaseColors.primary}
                    refreshing={refreshLoader}
                    onRefresh={() => {
                      onRefresh();
                    }}
                  />
                }
              />
            </Animatable.View>
          ) : (
            renderNoData()
          )}
        </View>
      )}
    </View>
  );
};

export default SeeAllPeople;
