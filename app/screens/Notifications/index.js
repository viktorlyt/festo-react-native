/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Image from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import styles from './styles';
import { Header, AlertModal } from '@components';
import { BaseColors } from '@config/theme';
import authActions from '@redux/reducers/auth/actions';
import { NotificationLoader } from '@components/ContentLoader';
import CNoData from '@components/CNoData';
import BaseSetting from '@config/setting';
import Swipeable from 'react-native-swipeable';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getApiData } from '@utils/apiHelper';
import { useFocusEffect } from '@react-navigation/native';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isObject,
  toNumber,
} from 'lodash';
import { Images } from '@config';

/**
 * Module  Notifications
 * @module  Notifications
 *
 */

export default function Notifications({ navigation, route }) {
  const dispatch = useDispatch();
  const { setActiveScreen } = authActions;
  const { notification } = useSelector((state) => state.notification);
  const { activeScreen } = useSelector((state) => state.auth);
  const [pageLoad, setPageLoad] = useState(true);
  const [arrIndex, setArrIndex] = useState({});
  const [notificationList, setNotificationList] = useState({});
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);
  const [cAlert, setCAlert] = useState(false);
  const [deleteType, setDeleteType] = useState({});
  const [btnLoader, setBtnLoader] = useState(false);

  function stopLoader() {
    setPageLoad(false);
    setMoreLoad(false);
    setRefreshLoader(false);
  }
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);

  function onOpen(event, gestureState, swipeable) {
    if (currentlyOpenSwipeable && currentlyOpenSwipeable !== swipeable) {
      currentlyOpenSwipeable.recenter();
    }
    setCurrentlyOpenSwipeable(swipeable);
  }

  function onClose() {
    if (currentlyOpenSwipeable) {
      currentlyOpenSwipeable.recenter();
    }
    setCurrentlyOpenSwipeable(null);
  }

  useFocusEffect(
    useCallback(() => {
      getNotificationList(true);
      dispatch(setActiveScreen('notification'));
    }, []),
  );

  useEffect(() => {
    if (activeScreen === 'notification') {
      setPageLoad(true);
      setTimeout(() => {
        getNotificationList(true);
      }, 200);
    }
  }, [notification]);

  // this function for handle friend request
  async function handleFriendRequest(id, type) {
    let endPoints =
      type === 'accept'
        ? `${BaseSetting.endpoints.acceptFriendRequest}?user_id=${id}`
        : `${BaseSetting.endpoints.cancelFriendRequest}?user_id=${id}`;

    try {
      const response = await getApiData(endPoints, 'GET');
      if (response.status === true) {
        getNotificationList(true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setArrIndex({});
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setArrIndex({});
    }
  }

  // this function for handle party request
  async function handlepartyRequest(party_id, id, type) {
    let endPoints =
      type === 'accept'
        ? `${BaseSetting.endpoints.acceptPartyRequest}?party_id=${party_id}&user_id=${id}`
        : `${BaseSetting.endpoints.cancelPartyRequest}?party_id=${party_id}&user_id=${id}`;

    try {
      const response = await getApiData(endPoints, 'GET');
      if (response.status === true) {
        getNotificationList(true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setArrIndex({});
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setArrIndex({});
    }
  }

  // this function for handle party invitation
  async function handlepartyInvitation(party_id, id, type) {
    let endPoints =
      type === 'accept'
        ? `${BaseSetting.endpoints.acceptPartyInvitaton}?party_id=${party_id}&user_id=${id}`
        : `${BaseSetting.endpoints.cancelPartyRequest}?party_id=${party_id}&user_id=${id}`;

    try {
      const response = await getApiData(endPoints, 'GET');
      if (response.status === true) {
        getNotificationList(true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setArrIndex({});
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setArrIndex({});
    }
  }

  // this function for handle delete notification
  async function handleDeleteNotification() {
    setBtnLoader(true);
    let endPoints =
      deleteType?.type === 'delete'
        ? `${BaseSetting.endpoints.deleteNotification}?id=${deleteType?.id}`
        : `${BaseSetting.endpoints.removeAllNotification}`;

    try {
      const response = await getApiData(endPoints, 'GET');
      if (response.status === true) {
        getNotificationList(true);
        setCAlert(false);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setDeleteType({});
      setBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setCAlert(false);
      setDeleteType({});
      setBtnLoader(false);
    }
  }

  // this function for getnotification list
  async function getNotificationList(bool) {
    const cPage =
      notificationList &&
      notificationList.pagination &&
      notificationList.pagination.currentPage
        ? toNumber(notificationList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.notificationList}?page=${page_no}`,
        'GET',
      );
      if (
        isObject(response) &&
        !isEmpty(response) &&
        response.status === true
      ) {
        const obj = bool ? {} : cloneDeep(notificationList);

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
        setNotificationList(obj);
      }
      stopLoader();
    } catch (error) {
      console.log('error ===>>>', error);
      stopLoader();
    }
  }

  async function getMoreData() {
    const cPage =
      notificationList &&
      notificationList.pagination &&
      notificationList.pagination.currentPage
        ? toNumber(notificationList.pagination.currentPage)
        : 0;
    const tPage =
      notificationList &&
      notificationList.pagination &&
      notificationList.pagination.totalPage
        ? toNumber(notificationList.pagination.totalPage)
        : 0;
    if (notificationList.pagination.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      getNotificationList(false);
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
    } else if (isEmpty(notificationList)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  function onRefresh() {
    setRefreshLoader(true);
    setPageLoad(true);
    setTimeout(() => {
      getNotificationList(true);
    }, 2000);
  }

  function renderEmptyComponent() {
    return (
      <CNoData titleText="Empty !" descriptionText="🔔 Nothing New Here…" />
    );
  }

  function navigatePurchase(item) {
    navigation.navigate('PaymentMethod', {
      partyData: {
        party_id: item?.data?.party_id,
        title: item?.title || '',
        price: item?.price || 0,
      },
    });
    setTimeout(() => {
      setArrIndex({});
    }, 200);
  }

  const renderItem = ({ item, index }) => {
    const disabled = !isEmpty(arrIndex); // && arrIndex?.index !== index;
    return (
      <Swipeable
        rightButtons={[
          <View
            style={{
              width: '20%',
              height: '100%',
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: BaseColors.lightRed,
            }}>
            <TouchableOpacity
              onPress={() => {
                setDeleteType({ id: item?.id, type: 'delete' });
                setTimeout(() => {
                  setCAlert(true);
                }, 100);
              }}>
              <MIcon name="delete" color="red" size={36} />
            </TouchableOpacity>
          </View>,
        ]}
        onRightButtonsOpenRelease={onOpen}
        onRightButtonsCloseRelease={onClose}>
        <View
          style={[
            styles.item,
            {
              backgroundColor:
                index % 2 === 0 ? BaseColors.white : BaseColors.offWhite,
              position: 'relative',
            },
          ]}>
          <View style={styles.profileTitleView}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                navigation.push('Profile', {
                  from: 'friends',
                  id: item?.from_user_id,
                });
              }}>
              <Image
                source={
                  isEmpty(item?.user_info?.photo)
                    ? Images?.usrImg
                    : { uri: item?.user_info?.photo }
                }
                style={styles.userImg}
              />
            </TouchableOpacity>
            <View style={styles.usernameView}>
              <View style={{ flexDirection: 'row' }}>
                <Text numberOfLines={1} style={styles.title}>
                  {item?.user_info?.name}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {item?.is_paid_party === 1 ||
                  item?.type === 'party_reminder' ? (
                    <View style={styles.paidBtn}>
                      <Text style={styles.typeTextStyle}>
                        {item?.type === 'party_reminder' ? 'Reminder' : 'Paid'}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={styles.time}>{item?.format_time}</Text>
                </View>
              </View>
              <Text numberOfLines={1} style={styles.friend}>
                {item?.message}
              </Text>
              {/* {item?.type === 'party_invitation' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  {`Invite you on ${item?.title}`}
                </Text>
              ) : item?.type === 'friend_request' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  Send you friend request
                </Text>
              ) : item?.type === 'party_request' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  {`Request you for ${item?.title}`}
                </Text>
              ) : item?.type === 'accept_friend_request' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  Accepted your friend request
                </Text>
              ) : item?.type === 'accept_party_request' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  Accepted your party request
                </Text>
              ) : item?.type === 'accept_party_invitation' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  Accepted your party invitation
                </Text>
              ) : item?.type === 'party_reminder' ||
                item?.type === 'party_payment' ? (
                <Text numberOfLines={1} style={styles.friend}>
                  {item?.message}
                </Text>
              ) : null} */}
            </View>
          </View>
          {item?.type === 'party_invitation' ||
          item?.type === 'friend_request' ||
          item?.type === 'party_request' ? (
            <View style={styles.btnsView}>
              <TouchableOpacity
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.6}
                style={[
                  styles.btnTxtView,
                  {
                    backgroundColor: disabled ? '#dfdfdf' : BaseColors.lightRed,
                  },
                ]}
                onPress={() => {
                  item?.type === 'party_invitation'
                    ? handlepartyInvitation(
                        item?.data?.party_id,
                        item?.from_user_id,
                        'cancel',
                      )
                    : item?.type === 'friend_request'
                    ? handleFriendRequest(item?.data?.user_id, 'cancel')
                    : item?.type === 'party_request'
                    ? handlepartyRequest(
                        item?.data?.party_id,
                        item?.from_user_id,
                        'cancel',
                      )
                    : null;
                  setArrIndex({ index: index, btn: 1 });
                }}>
                {arrIndex.index === index && arrIndex.btn === 1 ? (
                  <ActivityIndicator
                    color={BaseColors.secondary}
                    size="small"
                    animating
                  />
                ) : (
                  <Text
                    style={[
                      styles.btnTxt,
                      { color: disabled ? '#a1a1a1' : BaseColors.primary },
                    ]}>
                    {item?.type === 'party_invitation'
                      ? 'Ignore'
                      : item?.type === 'friend_request'
                      ? 'Cancel Request'
                      : 'Cancel'}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                disabled={disabled}
                activeOpacity={disabled ? 1 : 0.6}
                style={[
                  styles.btnTxtView,
                  {
                    borderWidth: 0.6,
                    backgroundColor: disabled ? '#dfdfdf' : BaseColors.white,
                    borderColor: BaseColors.borderColor,
                  },
                ]}
                onPress={() => {
                  item?.type === 'party_invitation' && item?.is_paid_party === 0
                    ? handlepartyInvitation(
                        item?.data?.party_id,
                        item?.from_user_id,
                        'accept',
                      )
                    : item?.type === 'party_invitation' &&
                      item?.is_paid_party === 1
                    ? navigatePurchase(item)
                    : item?.type === 'friend_request'
                    ? handleFriendRequest(item?.data?.user_id, 'accept')
                    : item?.type === 'party_request'
                    ? handlepartyRequest(
                        item?.data?.party_id,
                        item?.from_user_id,
                        'accept',
                      )
                    : null;
                  setArrIndex({ index: index, btn: 2 });
                }}>
                {arrIndex.index === index && arrIndex.btn === 2 ? (
                  <ActivityIndicator
                    color={BaseColors.secondary}
                    size="small"
                    animating
                  />
                ) : (
                  <Text
                    style={[
                      styles.btnTxt,
                      { color: disabled ? '#a1a1a1' : BaseColors.primary },
                    ]}>
                    {item?.type === 'party_invitation' &&
                    item?.is_paid_party === 1
                      ? 'Pay To Join Party'
                      : item?.type === 'friend_request' ||
                        item?.type === 'party_request'
                      ? 'Accept'
                      : 'Join Party'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Swipeable>
    );
  };

  return (
    <>
      <Header
        title="Notifications"
        leftIcon
        leftIconName="arrowleft"
        rightIcon={isEmpty(notificationList?.data) ? false : true}
        rightText="Remove All"
        onBackPress={() => navigation.goBack()}
        onRightAction={() => {
          setDeleteType({ id: 0, type: 'all' });
          setTimeout(() => {
            setCAlert(true);
          }, 100);
        }}
      />
      <View style={styles.container}>
        {pageLoad ? (
          <View style={styles.loaderView}>
            <NotificationLoader />
          </View>
        ) : (
          <FlatList
            data={notificationList?.data}
            horizontal={false}
            scrollsToTop={false}
            renderItem={renderItem}
            refreshing={refreshLoader}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
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
        )}
      </View>
      <AlertModal
        title=" "
        loader={btnLoader}
        visible={cAlert}
        setVisible={setCAlert}
        description={
          deleteType?.type === 'delete'
            ? 'Are you sure you want to delete this notification?'
            : 'Are you sure you want to delete All notification?'
        }
        btnYPress={() => {
          handleDeleteNotification();
        }}
        btnYTitle={'Confirm'}
        btnNTitle={'Cancel'}
      />
    </>
  );
}
