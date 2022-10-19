/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Image from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { isArray, isEmpty, isObject } from 'lodash';
import moment from 'moment';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-swipeable';
import Toast from 'react-native-simple-toast';
import nToast from 'react-native-toast-message';
import authActions from '@redux/reducers/auth/actions';
import { AlertModal, Header } from '@components';
import CNoData from '@components/CNoData';
import { BaseColors } from '@config/theme';
import { ChatLoader, NotificationLoader } from '@components/ContentLoader';
import BaseSetting from '@config/setting';
import CustomStoryViewer from '@components/CustomStoryViewer';
import { getApiData } from '@utils/apiHelper';
import { logout } from '../../utils/CommonFunction';
import styles from './styles';
import { Images } from '@config';
import AnimatedLottieView from 'lottie-react-native';
const refreshingHeight = 0;
/**
 * Module   Chat
 * @module   Chat
 *
 */
export default function Chat({ navigation, route }) {
  const dispatch = useDispatch();
  const storyRef = useRef(null);
  const { setActiveScreen, setActiveChatUser, setBottomTabSwipe } = authActions;
  const { userData } = useSelector((state) => state.auth);
  const socketObj = useSelector((state) => state.socket.socketObj);
  const chatData = useSelector((state) => state.socket.chatData);
  const [chatList, setChatList] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const [refreshing, setRefreshing] = useState('');
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [currentlyOpenSwipeable, setCurrentlyOpenSwipeable] = useState(null);
  const [selectedUserStory, setSelectedUserStory] = useState([]);
  const IOS = Platform.OS === 'ios';
  const [offsetY, setOffsetY] = useState(0);
  const defaultPaddingTop = 0;
  const [extraPaddingTop] = useState(new Animated.Value(defaultPaddingTop));
  const lottieViewRef = useRef(null);
  const lottieViewRef2 = useRef(null);
  useEffect(() => {
    if (refreshing === 'list') {
      Animated.timing(extraPaddingTop, {
        toValue: defaultPaddingTop + refreshingHeight,
        duration: 0,
      }).start();
      lottieViewRef.current.play(85, 230);
    } else {
      lottieViewRef.current.play(230, 311);
      // setTimeout(() => {
      //   lottieViewRef2.current.play();
      //   setTimeout(() => {
      //     Animated.timing(extraPaddingTop, {
      //       toValue: defaultPaddingTop,
      //       duration: 500,
      //       easing: Easing.elastic(1.3),
      //     }).start();
      //   }, 1000);
      // }, 400);
    }
  }, [refreshing]);

  useFocusEffect(
    useCallback(() => {
      if (isObject(socketObj) && !isEmpty(socketObj)) {
        // getChatList();
        getChatList('reload');
      } else {
        setPageLoad(false);
      }
      dispatch(setActiveScreen('chat'));
      dispatch(setActiveChatUser(null));
    }, []),
  );
  /* Let's load chat data after Socket is Loaded */
  useEffect(() => {
    if (isObject(socketObj) && !isEmpty(socketObj) && isEmpty(chatList)) {
      getChatList();
    }
  }, [socketObj]);
  useEffect(() => {
    getChatList('reload');
  }, [chatData]);
  /* On Scroll Bind Value */
  function onScroll(event) {
    const { nativeEvent } = event;
    const { contentOffset } = nativeEvent;
    const { y } = contentOffset;
    setOffsetY(y);
  }

  /* On Release Let's reload the chat */
  function onRelease() {
    if (offsetY <= -refreshingHeight && refreshing !== 'list') {
      onRefresh('list');
    }
  }

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

  // this function for get chat list
  function getChatList(type = '') {
    if (!isEmpty(socketObj)) {
      if (type !== 'reload') {
        setPageLoad(true);
      }
      setRefreshing('');
      socketObj &&
        socketObj.emit('userconnect', { userId: userData.id }, (v) => {
          if (v?.http_status_code === 401) {
            logout();
          }
          const newChatArray = v.getUser.sort(
            (x, y) => y.text_time - x.text_time,
          );
          setChatList(newChatArray);
          if (type === 'reload') {
            lottieViewRef2.current.play();
            Animated.timing(extraPaddingTop, {
              toValue: defaultPaddingTop,
              duration: 0,
            }).start();
            setTimeout(() => {
              Animated.timing(extraPaddingTop, {
                toValue: defaultPaddingTop,
                duration: 500,
                easing: Easing.elastic(1.3),
              }).start();
              setPageLoad(false);
            }, 2500);
          } else {
            setTimeout(() => {
              setPageLoad(false);
            }, 500);
          }
        });
    }
  }

  // this function for get user story
  async function getUserStory(id, uName, uImage) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.userStory}?user_id=${id}`,
        'GET',
        {},
      );

      if (response.status) {
        if (isArray(response.data) && response.data.length > 0) {
          const obj = {
            username: uName,
            profile: uImage,
            stories: response.data,
          };
          setSelectedUserStory([obj]);
          storyRef.current.handleStory();
        }
      } else {
        // Toast.show(
        //   response.message || 'Oops! Something went wrong please try again.',
        // );
        nToast.show({
          type: 'error', // success / error
          text1: 'Oops! Something went wrong please try again.',
          text2: response.message,
        });
      }
    } catch (error) {
      console.log('user story error ===', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error!',
        text2: error.toString(),
      });
    }
  }

  function onRefresh(type) {
    if (!isEmpty(socketObj)) {
      setPageLoad(true);
      setRefreshing(type);
      setChatList([]);
      setTimeout(() => {
        getChatList('reload');
      }, 1000);
    }
  }

  // this function renders empty message view
  function renderEmptyComponent() {
    return (
      <ScrollView
        contentContainerStyle={styles.centerViewStyle}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing === 'scroll'}
            colors={[BaseColors.primary]}
            tintColor={BaseColors.primary}
            onRefresh={() => onRefresh('scroll')}
          />
        }>
        <CNoData
          titleText="Chat is hungry 😋 "
          descriptionText="Go make some friends... "
        />
      </ScrollView>
    );
  }

  const renderItem = ({ item, index }) => {
    return (
      <Swipeable
        onTouchStart={(e) => {
          console.log('On Touch Start');
          dispatch(setBottomTabSwipe(false));
        }}
        onSwipeRelease={(e) => {
          console.log('On Swipe End');
          dispatch(setBottomTabSwipe(true));
        }}
        rightActionActivationDistance={10}
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
                setConfirmAlert(true);
                setSelectedChat(item);
              }}>
              <MIcon name="delete" color="red" size={36} />
            </TouchableOpacity>
          </View>,
        ]}
        onRightButtonsOpenRelease={onOpen}
        onRightButtonsCloseRelease={onClose}>
        <View key={`user_chat_${index}`} style={styles.item}>
          <View style={styles.profileTitleView}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                const id =
                  userData?.id === item?.owner_id
                    ? item?.user_id
                    : item?.owner_id;
                if (!item?.is_story) {
                  navigation.push('Profile', {
                    from: 'friends',
                    id: id,
                  });
                }
              }}>
              {item?.is_story ? (
                <TouchableOpacity
                  style={styles.storyViewStyle}
                  activeOpacity={0.8}
                  onPress={() => {
                    const id =
                      userData?.id === item?.owner_id
                        ? item?.user_id
                        : item?.owner_id;
                    getUserStory(id, item?.username, item?.user_image);
                  }}>
                  <Image
                    source={
                      item?.user_image
                        ? { uri: item.user_image }
                        : Images.usrImg
                    }
                    style={[
                      styles.userImg,
                      { borderWidth: 3, borderColor: BaseColors.white },
                    ]}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={
                    item?.user_image ? { uri: item.user_image } : Images.usrImg
                  }
                  style={styles.storyViewStyle}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate('ChatMessage', { userChat: item })
              }
              style={styles.msgContainer}>
              <View style={styles.usernameView}>
                <View style={styles.titleContainer}>
                  <Text numberOfLines={1} style={styles.title}>
                    {item?.username || ''}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.friend}>
                  {item?.text || 'Available to chat'}
                </Text>
              </View>
              <View style={styles.msgTextContainer}>
                {!isEmpty(item?.text) && !isEmpty(item?.text_time) && (
                  <Text style={styles.time}>
                    {moment(Number(item.text_time) * 1000).fromNow()}
                  </Text>
                )}
                {Number(item?.unread) > 0 && (
                  <View style={styles.badgeContainer}>
                    <Text numberOfLines={1} style={styles.badgeCount}>
                      {Number(item?.unread) > 100 ? '99+' : item?.unread}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Swipeable>
    );
  };
  /* Let's control Balloon Animation on Scroll */
  let progress = 0;
  if (offsetY <= 0) {
    progress = -(offsetY + 20) / 300;
  }

  return (
    <>
      <Header
        title="Chat 💬"
        rightIcon
        rightIconName="search"
        onRightAction={() => {
          navigation.navigate('Search');
        }}
        customSecondRight
        secondRightIcon
        secondRightIconName="notification"
        onRightSecAction={() => {
          navigation.navigate('Notifications');
        }}
      />
      <View style={styles.container}>
        <AnimatedLottieView
          ref={lottieViewRef}
          autoPlay={false}
          loop={false}
          style={{
            height: refreshingHeight,
            alignSelf: 'center',
            position: 'absolute',
            top: 28,
          }}
          source={require('@assets/lottieFiles/smile.json')}
          progress={refreshing === 'list' ? null : progress}
        />
        {pageLoad && (
          <AnimatedLottieView
            ref={lottieViewRef2}
            autoPlay={false}
            loop={false}
            autoSize
            style={{
              width: '100%',
              height: '100%',
              zIndex: 11,
              alignSelf: 'center',
              position: 'absolute',
              top: -48,
            }}
            speed={0.85}
            source={require('../../assets/lottieFiles/confet.json')}
          />
        )}
        <View style={styles.titleImgView} />
        {pageLoad && isEmpty(chatList) ? (
          <View style={styles.centerViewStyle}>
            <ChatLoader />
          </View>
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing === 'list'}
                colors={[BaseColors.primary]}
                tintColor={BaseColors.primary}
                onRefresh={() => onRefresh('list')}
              />
            }
            contentContainerStyle={styles.list}
            ListEmptyComponent={renderEmptyComponent}
            data={chatList}
            bounces={IOS ? true : false}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onScroll={onScroll}
            onResponderRelease={onRelease}
            ListHeaderComponent={
              <Animated.View
                style={{
                  paddingTop: extraPaddingTop,
                }}
              />
            }
          />
        )}
        <AlertModal
          title=" "
          loader={deleteLoader}
          visible={confirmAlert}
          setVisible={setConfirmAlert}
          description="Are you sure you want to delete this conversation?"
          btnYPress={() => {
            if (!isEmpty(socketObj)) {
              setDeleteLoader(true);
              socketObj.emit(
                'deleteConversation',
                { conv_id: selectedChat.id },
                (v) => {
                  setConfirmAlert(false);
                  setSelectedChat({});
                  setDeleteLoader(false);
                  if (!isEmpty(socketObj)) {
                    setPageLoad(true);
                    // setChatList([]);
                    setTimeout(() => {
                      getChatList();
                    }, 2000);
                  }
                },
              );
            } else {
            }
          }}
          btnYTitle={'Confirm'}
          btnNTitle={'Cancel'}
        />
        <CustomStoryViewer
          from="chat"
          ref={storyRef}
          data={selectedUserStory}
          navigation={navigation}
        />
      </View>
    </>
  );
}
