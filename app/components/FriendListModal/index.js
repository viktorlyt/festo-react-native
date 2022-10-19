/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Text,
  Animated,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Platform,
} from 'react-native';
import styles from './styles';
import RBSheet from 'react-native-raw-bottom-sheet';
import AIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import nToast from 'react-native-toast-message';
import { getApiData } from '@utils/apiHelper';
import { BaseColors } from '@config/theme';
import { AlertModal } from '@components';
import BaseSetting from '@config/setting';
import CNoData from '@components/CNoData';
import { useSelector } from 'react-redux';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isNull,
  isObject,
  toNumber,
} from 'lodash';
import { Images } from '@config';

export default function FriendListModal(props) {
  const { ListRef, handleNavigate, navigation, userId, isFromFriends, modalVisible = false } = props;
  const { userData } = useSelector((state) => state.auth);
  const socketObj = useSelector((state) => state.socket.socketObj);
  const [friendListObj, setFriendListObj] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  const [userData1, setUserData] = useState('');
  const [cAlert, setCAlert] = useState({});
  const [visible, setVisible] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [arrIndex, setArrIndex] = useState('');
  const IOS = Platform.OS === 'ios';
  const [itemIndex, setItemIndex] = useState('');
  const [xyPoint, setXYPoint] = useState({});

  const nWidth = BaseSetting.nWidth;
  const nHeight = BaseSetting.nHeight;

  useEffect(() => {
    if (modalVisible) {
      getFriendList(true);
    }
  }, [modalVisible]);

  // this function for get friend list
  async function getFriendList(bool) {
    const cPage =
      friendListObj &&
      friendListObj.pagination &&
      friendListObj.pagination.currentPage
        ? toNumber(friendListObj.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }

    const endpoints = !isEmpty(userId)
      ? `${BaseSetting.endpoints.friendList}?user_id=${userId}&page=${page_no}`
      : `${BaseSetting.endpoints.friendList}?page=${page_no}`;

    try {
      const response = await getApiData(endpoints, 'GET');
      if (
        isObject(response) &&
        !isEmpty(response) &&
        response.status === true
      ) {
        const obj = bool ? {} : cloneDeep(friendListObj);

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
        setFriendListObj(obj);
      } else {
        nToast.show({
          type: 'error',
          text1: 'Error!',
          text2: response?.message || 'Something went wrong! Please try again',
        });
        // Toast.show(
        //   response?.message || 'Something went wrong! Please try again',
        // );
      }
      stopLoader();
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error',
        text1: 'Error!',
        text2: error.toString(),
      });

      stopLoader();
    }
  }

  // this function for block user
  async function BlockUser() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.BlockUser}?uid2=${userData1?.item?.id}`,
        'GET',
      );

      if (response.status === true) {
        setBtnLoader(false);
        setCAlert({});
        getFriendList(true);
        // Toast.show(response?.message);
        nToast.show({
          type: 'success',
          text1: 'Hurrah!',
          text2: response?.message || '',
        });
      } else {
        nToast.show({
          type: 'error',
          text1: 'Error!',
          text2: response?.message || 'Something went wrong! Please try again',
        });
        // Toast.show(
        //   response?.message || 'Something went wrong! Please try again',
        // );
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error',
        text1: 'Error!',
        text2: error.toString(),
      });
      setBtnLoader(false);
    }
  }

  // this function for un friend user
  async function unFriendUser() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.unFriendUser}?uid2=${userData1?.item?.id}`,
        'GET',
      );

      if (response.status === true) {
        setBtnLoader(false);
        setCAlert({});
        getFriendList(true);
        // Toast.show(response?.message);
        nToast.show({
          type: 'success',
          text1: 'Hurrah !',
          text2: response?.message,
        });
      } else {
        // Toast.show(
        //   response?.message || 'Something went wrong! Please try again',
        // );
        nToast.show({
          type: 'error',
          text1: 'Error!',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error',
        text1: 'Error!',
        text2: error.toString(),
      });
      setBtnLoader(false);
    }
  }

  // this function for get users list
  async function sendFriendRequist() {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.addFriend}?user_id=${userData1?.item?.id}`,
        'GET',
      );

      if (response.status) {
        getFriendList(true);
        setArrIndex('');
      } else {
        // Toast.show(
        //   response?.message || 'Something went wrong! Please try again',
        // );
        nToast.show({
          type: 'error',
          text1: 'Error!',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error',
        text1: 'Error!',
        text2: error.toString(),
      });
      setArrIndex('');
    }
  }

  // this function for get users list
  async function cancelFriendRequist() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelFriend}?user_id=${userData1?.item?.id}`,
        'GET',
      );

      if (response.status) {
        getFriendList(true);
        setBtnLoader(false);
      } else {
        // Toast.show(
        //   response?.message || 'Something went wrong! Please try again',
        // );
        nToast.show({
          type: 'error',
          text1: 'Error!',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error',
        text1: 'Error!',
        text2: error.toString(),
      });

      setBtnLoader(false);
    }
  }

  function stopLoader() {
    setPageLoader(false);
    setRefreshLoader(false);
    setMoreLoad(false);
  }

  function onRefresh() {
    setRefreshLoader(true);
    setPageLoader(true);
    setTimeout(() => {
      getFriendList(true);
    }, 2000);
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
    } else if (isEmpty(friendListObj)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  function renderEmptyComponent() {
    return <CNoData />;
  }

  async function getMoreData() {
    const cPage =
      friendListObj &&
      friendListObj.pagination &&
      friendListObj.pagination.currentPage
        ? toNumber(friendListObj.pagination.currentPage)
        : 0;
    const tPage =
      friendListObj &&
      friendListObj.pagination &&
      friendListObj.pagination.totalPage
        ? toNumber(friendListObj.pagination.totalPage)
        : 0;
    if (friendListObj.pagination.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      getFriendList(false);
    }
  }

  const ModalPoup = ({ visible, children }) => {
    const [showModal, setShowModal] = React.useState(visible);
    const scaleValue = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
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
      <Modal
        transparent
        animationType="fade"
        visible={showModal}
        onRequestClose={() => {
          setVisible(false);
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackGround}
          onPress={() => {
            // if (!isEmpty(socketObj)) {
            setVisible(false);
            // }
          }}>
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ scale: scaleValue }] },
              {
                position: 'absolute',
                right: 116,
                bottom:
                  xyPoint?.pageY > nWidth ? nHeight - xyPoint?.pageY : null,
                top: xyPoint?.pageY > nWidth ? null : xyPoint?.pageY,
              },
            ]}>
            {userData1?.type === 'friend' ? (
              <TouchableOpacity
                onPress={() => {
                  ListRef.current.close();
                  if (
                    isObject(userData1?.item?.chat_data) &&
                    !isEmpty(userData1?.item?.chat_data)
                  ) {
                    const { id, chat_data, name, photo } = userData1?.item;

                    const obj = {
                      id: chat_data?.id || '',
                      sender_id: userData?.id,
                      owner_id: userData?.id,
                      receiver_id: id,
                      user_id: id,
                      conversation_id: chat_data?.token || '',
                      username: name,
                      photo,
                    };

                    if (!isEmpty(socketObj)) {
                      if (chat_data?.exist) {
                        socketObj &&
                          socketObj.emit(
                            'userconnect',
                            { userId: userData.id },
                            (v) => {
                              const arrayData = v.getUser;
                              const value = arrayData.find(
                                (i) => i.conv_token == chat_data?.token,
                              );
                              if (!isEmpty(value)) {
                                navigation.navigate('ChatMessage', {
                                  userChat: value,
                                });
                              }
                            },
                          );
                      } else {
                        socketObj &&
                          socketObj.emit('conversation', obj, (v) => {
                            navigation.navigate('ChatMessage', { userChat: v });
                          });
                      }
                    } else {
                      // Toast.show('Socket connection error');
                      nToast.show({
                        type: 'error',
                        text1: 'Error!',
                        text2: 'Socket connection error',
                      });
                    }
                  }
                }}>
                <Text style={{ color: 'black', fontSize: 18 }}>Message</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
                handleNavigate();
                navigation.push('Profile', {
                  from: 'friends',
                  id: userData1?.item?.id,
                });
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  marginVertical: userData1?.type === 'friend' ? 15 : 0,
                  marginBottom: 15,
                }}>
                View Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (userData1?.type === 'friend') {
                  setVisible(false);
                  setCAlert({ vis: true, type: 'Unfriend' });
                } else if (userData1?.item?.is_already_requested === true) {
                  setVisible(false);
                  cancelFriendRequist();
                } else {
                  setVisible(false);
                  sendFriendRequist();
                }
              }}>
              <Text style={{ color: 'black', fontSize: 18 }}>
                {userData1?.type === 'friend'
                  ? 'Unfriend'
                  : userData1?.item?.is_already_requested === true
                  ? 'Cancel Request'
                  : 'Add Friend'}
              </Text>
            </TouchableOpacity>
            {userData1?.type === 'friend' ? (
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setCAlert({ vis: true, type: 'Block' });
                }}>
                <Text style={{ color: 'black', fontSize: 18, marginTop: 15 }}>
                  Block
                </Text>
              </TouchableOpacity>
            ) : null}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    );
  };

  function renderItem({ item, index }) {
    const isFriend = item.is_friend === false;
    const isMe = userData?.id === item?.id;
    return (
      <TouchableOpacity
        activeOpacity={isMe ? 1 : 0.7}
        onPress={() => {
          if (!isMe) {
            handleNavigate();
            navigation.push('Profile', {
              from: 'friends',
              id: item?.id,
            });
          }
        }}>
        <View style={styles.item}>
          <View style={styles.profileTitleView}>
            <Image
              source={
                isNull(item?.photo) ? Images?.usrImg : { uri: item?.photo }
              }
              style={styles.userImg}
            />
            <View style={styles.usernameView}>
              <Text numberOfLines={1} style={styles.title}>
                {item.name}
              </Text>
              <Text numberOfLines={1} style={styles.title1}>
                {item.mutual_friends_count} Mutual Friends
              </Text>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={
              !isFriend ? (isFromFriends ? 1 : 0.6) : isMe ? 1 : 0.6
            }
            onPress={(v) => {
              if (!isFriend) {
                if (isFromFriends) {
                  return null;
                } else {
                  setUserData({ item: item, type: 'friend' });
                  setItemIndex(index);
                  setXYPoint(v?.nativeEvent);
                  setTimeout(() => {
                    setVisible(true);
                  }, 100);
                }
              } else if (isMe) {
                return null;
              } else {
                setUserData({ item: item, type: 'notFriend' });
                setItemIndex(index);
                setXYPoint(v?.nativeEvent);
                setTimeout(() => {
                  setVisible(true);
                }, 100);
              }
            }}
            style={[
              styles.button,
              {
                borderWidth: !isFriend ? 0 : 1,
                backgroundColor: !isFriend
                  ? BaseColors.lightRed
                  : isMe
                  ? BaseColors.primary
                  : BaseColors.white,
                width: 90,
              },
            ]}>
            {arrIndex === index ? (
              <ActivityIndicator
                color={BaseColors.secondary}
                size="small"
                animating
              />
            ) : !isFriend ? (
              <Text style={styles.btnTxt}>Friends</Text>
            ) : isMe ? (
              <Text style={[styles.btnTxt, { color: BaseColors.white }]}>
                It's you
              </Text>
            ) : (
              <>
                {item?.is_already_requested ? null : (
                  <AIcon
                    style={styles.addIcon}
                    name="plus"
                    size={20}
                    color={BaseColors.secondary}
                  />
                )}
                <Text style={styles.btnTxt}>
                  {item?.is_already_requested ? 'Cancel' : 'Add'}
                </Text>
              </>
            )}
          </TouchableOpacity>
          {index === itemIndex ? <ModalPoup visible={visible} /> : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <RBSheet
      ref={ListRef}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      closeOnPressMask={true}
      height={Dimensions.get('window').height - (IOS ? 50 : 30)}
      customStyles={{
        draggableIcon: {
          backgroundColor: '#F3492E',
          width: 50,
        },
        container: {
          backgroundColor: BaseColors.white,
          borderTopRightRadius: 45,
          borderTopLeftRadius: 45,
        },
      }}>
      <Text style={styles.Text1}>
        {friendListObj?.pagination?.totalCount} Friends
      </Text>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {isFromFriends ? null : (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                backgroundColor: BaseColors.primary,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate('Find_Friend', { from: 'profile' });
                ListRef.current.close();
              }}>
              <Text
                style={{
                  color: BaseColors.white,
                  fontSize: 16,
                }}>
                Add Friends
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {pageLoader ? (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={BaseColors.primary} size="large" />
          </View>
        ) : (
          <FlatList
            data={friendListObj?.data}
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
        )}
      </View>
      {cAlert?.vis ? (
        <AlertModal
          loader={btnLoader}
          title=" "
          visible={cAlert.showAlert}
          setVisible={setCAlert}
          description={
            cAlert?.type === 'Unfriend'
              ? `Are you sure you want to block ${userData1?.item?.name}?`
              : `Are you sure you want to block ${userData1?.item?.name}?`
          }
          btnYTitle={cAlert?.type === 'Unfriend' ? 'Unfriend' : 'Block'}
          btnNTitle="Cancel"
          btnYPress={() => {
            cAlert?.type === 'Unfriend' ? unFriendUser() : BlockUser();
          }}
        />
      ) : null}
    </RBSheet>
  );
}
