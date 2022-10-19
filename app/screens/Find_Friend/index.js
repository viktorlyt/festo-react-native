/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import styles from './styles';
import FIcon from 'react-native-vector-icons/Feather';
import AIcon from 'react-native-vector-icons/AntDesign';
import { Button, TextInput, Header } from '@components';
import CNoData from '@components/CNoData';
import { BaseColors, FontFamily } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import { Images } from '@config/images';
import { ListContentLoader } from '@components/ContentLoader';
import * as Animatable from 'react-native-animatable';
import BaseSetting from '@config/setting';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isNull,
  isObject,
  toNumber,
  findIndex,
} from 'lodash';

/**
 * Module   Find_Friend
 * @module   Find_Friend
 *
 */

export default function Find_Friend({ navigation, route }) {
  const from = route?.params?.from || '';
  const isFromProfile = from === 'profile';
  const [search, setSearch] = useState('');
  const [pageLoad, setPageLoad] = useState(true);
  const [friendList, setFriendList] = useState({});
  const [arrIndex, setArrIndex] = useState('');

  const [refreshLoader, setRefreshLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  useEffect(() => {
    getUserList(true);
  }, [search]);

  function stopLoader() {
    setPageLoad(false);
    setRefreshLoader(false);
    setMoreLoad(false);
  }

  // this function for get users list
  async function getUserList(bool) {
    const cPage =
      friendList && friendList.pagination && friendList.pagination.currentPage
        ? toNumber(friendList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.userList}?name=${search}&page=${page_no}`,
        'GET',
      );

      if (
        isObject(response) &&
        !isEmpty(response) &&
        response.status === true
      ) {
        const obj = bool ? {} : cloneDeep(friendList);

        const newListData =
          response && response.data && response.data.rows
            ? response.data.rows
            : [];
        const paginationDatas =
          response && response.data && response.data.pagination
            ? response.data.pagination
            : {};

        if (isArray(newListData)) {
          if (isArray(obj.data) && obj.data.length > 0) {
            obj.data = flattenDeep([...obj.data, newListData]);
          } else {
            obj.data = newListData;
          }
          obj.pagination = paginationDatas;
        }
        setFriendList(obj);
      }
      stopLoader();
    } catch (error) {
      console.log('error ===>>>', error);
      stopLoader();
    }
  }

  // this function for get users list
  async function sendFriendRequist(id) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.addFriend}?user_id=${id}`,
        'GET',
      );
      if (response.status) {
        const fIndex = findIndex(friendList.data, (item) => item.id === id);
        if (fIndex > -1) {
          const arr = { ...friendList };
          arr.data[fIndex].is_already_requested = 1;
          setFriendList(arr);
        }
        Toast.show(response?.message);
      } else {
        Toast.show(response?.message || 'Something went wrong');
      }
      setArrIndex('');
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setArrIndex('');
    }
  }

  // this function for get users list
  async function cancelFriendRequist(id) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelFriend}?user_id=${id}`,
        'GET',
      );

      if (response.status) {
        const fIndex = findIndex(friendList.data, (item) => item.id === id);
        if (fIndex > -1) {
          const arr = { ...friendList };
          arr.data[fIndex].is_already_requested = 0;
          setFriendList(arr);
        }
        Toast.show(response?.message);
      } else {
        Toast.show(response?.message || 'Something went wrong');
      }
      setArrIndex('');
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setArrIndex('');
    }
  }

  async function getMoreData() {
    const cPage =
      friendList && friendList.pagination && friendList.pagination.currentPage
        ? toNumber(friendList.pagination.currentPage)
        : 0;
    const tPage =
      friendList && friendList.pagination && friendList.pagination.totalPage
        ? toNumber(friendList.pagination.totalPage)
        : 0;
    if (friendList.pagination.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      getUserList(false);
    }
  }

  function renderFooterComponent() {
    if (moreLoad) {
      return (
        <View style={styles.loaderFooterView}>
          <ActivityIndicator
            size={'small'}
            animating
            color={BaseColors.primary}
          />
        </View>
      );
    } else if (isEmpty(friendList)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  function onRefresh() {
    setRefreshLoader(true);
    setPageLoad(true);
    setTimeout(() => {
      getUserList(true);
    }, 2000);
  }

  function renderEmptyComponent() {
    return (
      <CNoData
        titleText="Errr...Error404?"
        descriptionText=" Nothing found. 😲"
      />
    );
  }

  const renderItem = ({ item, index }) => {
    const is_Loader = !isEmpty(arrIndex.toString());
    const isFriend = item?.is_friend;
    const isRequested = item?.is_already_requested === 1;
    return (
      <View style={styles.item}>
        <View style={styles.profileTitleView}>
          <Image
            source={isNull(item?.photo) ? Images?.usrImg : { uri: item?.photo }}
            style={styles.userImg}
          />
          <View style={styles.usernameView}>
            <Text numberOfLines={1} style={styles.title}>
              {item.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={is_Loader ? 1 : 0.6}
          onPress={() => {
            if (is_Loader) {
              return null;
            } else if (!isFriend) {
              setArrIndex(index);
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
              borderWidth: isRequested || is_Loader ? 0 : 1,
              backgroundColor: is_Loader
                ? '#dfdfdf'
                : isRequested
                  ? BaseColors.lightRed
                  : isFriend
                    ? BaseColors.primary
                    : BaseColors.white,
              width: isRequested ? 160 : 100,
            },
          ]}>
          {index === arrIndex ? (
            <ActivityIndicator
              color={BaseColors.secondary}
              size="small"
              animating
            />
          ) : isRequested ? (
            <Text
              style={[
                styles.btnTxt,
                { color: is_Loader ? '#a1a1a1' : BaseColors.primary },
              ]}>
              Cancel Request
            </Text>
          ) : isFriend ? (
            <Text
              style={[
                styles.btnTxt,
                { color: is_Loader ? '#a1a1a1' : BaseColors.white },
              ]}>
              Friends
            </Text>
          ) : (
            <>
              <AIcon
                style={[
                  styles.addIcon,
                  { color: is_Loader ? '#a1a1a1' : BaseColors.primary },
                ]}
                name="plus"
                size={20}
                color={BaseColors.secondary}
              />
              <Text
                style={[
                  styles.btnTxt,
                  { color: is_Loader ? '#a1a1a1' : BaseColors.primary },
                ]}>
                Add
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: BaseColors.white,
        flex: 1,
      }}>
      <Header
        otherCon={{ height: isFromProfile ? 40 : 0 }} 
          whiteHeader
        leftIcon={isFromProfile ? true : false}
        leftIconName={isFromProfile ? 'arrowleft' : ''}
        onBackPress={isFromProfile ? () => navigation.goBack() : null}
      />
      <View style={styles.container}>
        <Text
          style={[
            styles.headingTxt,
            { fontFamily: FontFamily.bold, color: BaseColors.lightBlack },
          ]}>
          Add Friends
        </Text>
        <Text style={[styles.headingTxt, { fontSize: 16 }]}>
          Add your friends on Festo and see their parties
        </Text>
        <View style={[styles.searchSection]}>
          <TextInput
            style={styles.inputStyle}
            onChange={(text) => {
              setSearch(text);
            }}
            underlineColorAndroid="transparent"
            value={search}
            autoCapitalize={false}
            placeholderTextColor={BaseColors.borderColor}
            otherPlaceholder={'Search friends with name'}
          />
          <FIcon
            style={styles.searchIcon}
            name="search"
            size={24}
            color={BaseColors.borderColor}
          />
        </View>
        {pageLoad ? (
          <View style={styles.loaderView}>
            {/* <ListContentLoader /> */}
            <ActivityIndicator color={BaseColors.primary} size="large" />
          </View>
        ) : (
          <>
            <Animatable.View animation="bounceIn" style={{ flex: 1 }}>
            <FlatList
              data={friendList?.data}
              horizontal={false}
              scrollsToTop={false}
              renderItem={renderItem}
              refreshing={refreshLoader}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              ListEmptyComponent={renderEmptyComponent}
              ListFooterComponent={renderFooterComponent}
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
              onEndReached={getMoreData}
              onEndReachedThreshold={0.5}
            />
            </Animatable.View>
          </>
        )}
        <View style={styles.btnView}>
          <Button
            type="primary"
            onPress={() => {
              isFromProfile
                ? navigation.goBack()
                : navigation.reset({
                  index: 0,
                  routes: [{ name: 'Party' }],
                });
            }}>
            Continue
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
