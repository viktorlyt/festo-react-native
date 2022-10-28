/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Linking,
  Animated,
  Modal,
  KeyboardAvoidingView,
  Platform, Share,
} from 'react-native';
import styles from './styles';
import Image from 'react-native-fast-image';
import ENIcon from 'react-native-vector-icons/Entypo';
import { EventContentLoader } from '@components/ContentLoader';
import FIcon from 'react-native-vector-icons/Feather';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Button,
  TextInput,
  Header,
  Text,
  ListModal,
  MidModal,
  AlertModal,
} from '@components';
import { BaseColors, FontFamily } from '@config/theme';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { Images } from '@config';
import { CustomIcon } from '@config/LoadIcons';
import _, { toNumber, cloneDeep, flattenDeep, isArray, isEmpty } from 'lodash';
import DiscoverCardList from '@components/UI/DiscoverCardList';
import Toast from 'react-native-simple-toast';
import FormModal from '@components/FormModal';
import StarRating from 'react-native-star-rating';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import AIcon from 'react-native-vector-icons/AntDesign';
import QRCodeScanner from 'react-native-qrcode-scanner';
import RenderHTML from 'react-native-render-html';
import * as Animatable from 'react-native-animatable';
import nToast from "react-native-toast-message";

/**
 * Module  Events
 * @module  Events
 *
 */

export default function Events({ navigation, route }) {
  const data = route?.params?.data;
  const fromDiscover = route?.params?.fromDiscover || false;
  const fromProfile = route?.params?.fromProfile || false;
  const navigationBack = route?.params?.navigation || false;
  const isFromFriends = route?.params?.isFromFriends || false;
  const selected = route?.params?.selected || '';
  const IOS = Platform.OS === 'ios';
  const btnArray = [
    {
      id: 1,
      label: 'Joined',
    },
    {
      id: 2,
      label: 'Created',
    },
  ];
  const refInviteFriend = useRef();
  const refJouinedSheet = useRef();
  const commentRef = useRef();
  const { userData } = useSelector((state) => state.auth);
  const screenHeight = Math.round(Dimensions.get('window').height);
  const [defaultItem, setDefaultItem] = useState({});
  const [defaultComment, setDefaultComment] = useState({});
  const [isReply, setIsReply] = useState(false);
  const [pageloader, setPageLoader] = useState(false);
  const [commentsList, setCommentList] = useState([]);
  const [commentsListLoader, setCommentListLoader] = useState(false);
  const [replyCommentList, setReplyCommentList] = useState([]);
  const [userParties, setUserParties] = useState([]);
  const [partyDetails, setPartyDetails] = useState([]);
  const [defaultButton, setDefaultButton] = useState(btnArray[0]);
  const [userHostId, setUserHostId] = useState('');
  const [userpartiesLoader, setUserPartiesLoader] = useState(false);
  const [ImageCurIndex, setImageCurIndex] = useState(1);
  const [ImageCurIndex1, setImageCurIndex1] = useState(1);
  const [reqBtnLoader, setReqBtnLoader] = useState(false);
  const [invitedFrndList, setInvitedFrndList] = useState([]);
  const [pageLoader, setPageLOad] = useState(false);
  const [buttonloader, setButtonLoader] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [joinFriendsList, setJoinFriendsList] = useState([]);
  const [moreLoad, setMoreLoad] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [comment, setComment] = useState('');
  const [reply, setReply] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [replylistLoader, setReplyListLoader] = useState(false);
  const [bool, setBool] = useState(true);
  const [paymentModal, setPaymentModal] = useState(false);
  const [qrScan, setQRscan] = useState(false);
  const [qrdetails, setQRDetails] = useState(false);
  const [cAlert, setCAlert] = useState(false);
  const [cAlert2, setCAlert2] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const isMe = userData.id === partyDetails?.host?.host_id;

  useFocusEffect(
    useCallback(() => {
      setPageLoader(true);
      getPartyDetails();
      getCommentsList();
    }, []),
  );

  useEffect(() => {
    setImageCurIndex(1);
    getUserParties();
  }, [defaultButton, userHostId]);

  function stopLoader() {
    setPageLoader(false);
    setPageLOad(false);
    setRefreshLoader(false);
    setCommentLoader(false);
    setReplyListLoader(false);
    setCommentListLoader(false);
  }

  function onRefresh(type) {
    setRefreshLoader(true);
    if (type === 'invite-friends') {
      setPageLOad(true);
      setTimeout(() => {
        getinvitedFrndList(partyDetails.id, true);
      }, 2000);
    } else if (type === 'invited-Friend-list') {
      setPageLOad(true);
      setTimeout(() => {
        getJoinedList(partyDetails.id, true);
      }, 2000);
    }
  }

  async function getMoreData(listdata, type) {
    const cPage =
      listdata && listdata.pagination && listdata.pagination.currentPage
        ? toNumber(listdata.pagination.currentPage)
        : 0;
    const tPage =
      listdata && listdata.pagination && listdata.pagination.totalPage
        ? toNumber(listdata.pagination.totalPage)
        : 0;
    if (listdata?.pagination?.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      if (type === 'invite-friends') {
        getinvitedFrndList(partyDetails.id, true);
      } else if (type === 'invited-Friend-list') {
        getJoinedList(partyDetails.id, true);
      }
    }
  }

  const onScrollEnd = (e) => {
    let pageNumber = Math.min(
      Math.max(
        Math.floor(
          e.nativeEvent.contentOffset.x / Dimensions.get('window').width + 0.5,
        ) + 1,
        0,
      ),
      userParties.length,
    );

    setImageCurIndex(pageNumber);
  };

  const onScrollEndImages = (e) => {
    let pageNumber1 = Math.min(
      Math.max(
        Math.floor(
          e.nativeEvent.contentOffset.x / Dimensions.get('window').width + 0.5,
        ) + 1,
        0,
      ),
      partyDetails?.party_images.length,
    );
    setImageCurIndex1(pageNumber1);
  };

  // get party details api
  const getPartyDetails = async () => {
    const params = `?id=${data.id}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.partyDetails}${params}`,
        'GET',
        {},
      );

      if (response?.status) {
        if (!_.isEmpty(response.data)) {
          setPartyDetails(response.data);
          setUserHostId(response?.data?.host?.host_id);
        }
      } else {
        Toast.show(response?.message);
      }
      setTimeout(() => {
        setPageLoader(false);
        setReqBtnLoader(false);
      }, 500);
    } catch (error) {
      setPageLoader(false);
      setReqBtnLoader(false);
      Toast.show(error.toString());
    }
  };

  // get comment list api
  const getCommentsList = async () => {
    const params = `?party_id=${data.id}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.commentList}${params}`,
        'GET',
        {},
      );

      if (response?.status) {
        if (!_.isEmpty(response.data)) {
          setCommentList(response.data.rows);
        }
      } else {
        Toast.show(response?.message);
      }
    } catch (error) {
      Toast.show(error.toString());
    }
  };

  // get comment list api
  const getReplyCommentsList = async (commentid) => {
    setReplyListLoader(true);
    setReplyCommentList([]);
    const params = `?parent_id=${commentid}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.commentReplyList}${params}`,
        'GET',
        {},
      );
      if (response?.status) {
        setTimeout(() => {
          if (!_.isEmpty(response.data)) {
            setReplyCommentList(response.data.rows);
          }

          stopLoader();
        }, 1000);
      } else {
        stopLoader();
        Toast.show(response?.message);
      }
    } catch (error) {
      stopLoader();
      Toast.show(error.toString());
    }
  };

  const clearData = () => {
    setDefaultItem({});
    setDefaultComment({});
    setReplyCommentList([]);
    setReply('');
    setComment('');
    setIsReply(false);
    commentRef?.current?.blur();
  };

  // add comment api call
  const addCommentApi = async () => {
    const params = {
      'PartyComment[party_id]': data?.id,
      'PartyComment[comment]': isReply ? reply.trim() : comment.trim(),
    };

    if (isReply) {
      params['PartyComment[parent_id]'] = defaultItem?.id;
    }

    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.addComment}`,
        'POST',
        params,
      );

      if (response.status) {
        // refresh data
        clearData();
        getCommentsList();
      } else {
        clearData();
        Toast.show(response?.message);
      }
      setTimeout(() => {
        stopLoader();
      }, 200);
    } catch (error) {
      clearData();
      stopLoader();
      Toast.show(error.toString());
    }
  };

  // get all user parties api
  const getUserParties = async () => {
    setUserPartiesLoader(true);
    setUserParties([]);
    const params = `?status=${
      defaultButton.id === 1 ? 2 : 1
    }&user_id=${userHostId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.userParties}${params}`,
        'GET',
        {},
      );
      console.log('response====', response);
      if (response?.status) {
        if (!_.isEmpty(response.data.rows)) {
          setUserParties(response.data.rows);
        } else {
          setUserParties([]);
        }
      } else {
        Toast.show(response?.message);
      }
      setUserPartiesLoader(false);
    } catch (error) {
      setUserPartiesLoader(false);
      Toast.show(error.toString());
    }
  };

  // request to join api
  async function requestToJoinParty() {
    setReqBtnLoader(true);
    const endpoints = `${BaseSetting.endpoints.requestToJoin}?party_id=${partyDetails.id}`;

    try {
      const response = await getApiData(endpoints, 'GET');
      if (response?.status) {
        Toast.show(response?.message);

        // refresh data
        getPartyDetails();
      } else {
        Toast.show(response?.message);
        setReqBtnLoader(false);
      }
    } catch (error) {
      Toast.show(error.toString());
      setReqBtnLoader(false);
    }
  }

  // request to join api
  async function cancelrequestParty() {
    setReqBtnLoader(true);
    const endpoints = `${BaseSetting.endpoints.cancelPartyRequest}?party_id=${partyDetails.id}&user_id=${partyDetails.host.host_id}`;
    try {
      const response = await getApiData(endpoints, 'GET');
      if (response?.status) {
        Toast.show(response?.message);

        // refresh data
        getPartyDetails();
        setReqBtnLoader(false);
      } else {
        Toast.show(response?.message);
        setReqBtnLoader(false);
      }
    } catch (error) {
      Toast.show(error.toString());
      setReqBtnLoader(false);
    }
  }

  // get invited friends list api call
  async function getinvitedFrndList(id, bool) {
    setPageLOad(true);
    setInvitedFrndList([]);
    const cPage =
      invitedFrndList &&
      invitedFrndList.pagination &&
      invitedFrndList.pagination.currentPage
        ? toNumber(invitedFrndList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.inviteFriends}?party_id=${id}`,
        'GET',
      );
      if (response.status) {
        // setInvitedFrndList(response.data.rows);
        const obj = bool ? {} : cloneDeep(invitedFrndList);

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
        setInvitedFrndList(obj.data);
      }
      stopLoader();
    } catch (error) {
      Toast.show(error.toString());
      stopLoader();
    }
  }

  // handle Invite api call
  const handleInvite = async (attendeeId) => {
    setButtonLoader(true);
    const params = `?party_id=${partyDetails.id}&attendee_id=${attendeeId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.sendPartyInvitation}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        setButtonLoader(false);
        Toast.show(response?.message);
        getinvitedFrndList(partyDetails.id, true);
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      setButtonLoader(false);
      Toast.show(error.toString());
    }
  };

  // handle cancel api call
  const handleCancel = async (userId, type) => {
    setButtonLoader(true);
    const params = `?party_id=${partyDetails.id}&user_id=${userId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelPartyRequest}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        Toast.show(response?.message);
        setButtonLoader(false);
        if (type === 'invited-Friend-list') {
          setPageLoader(true);
          setTimeout(() => {
            getJoinedList(partyDetails.id);
          }, 2000);
        } else if (type === 'invite-friends') {
          setPageLoader(true);
          setTimeout(() => {
            getinvitedFrndList(partyDetails.id);
          }, 2000);
        }
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      setButtonLoader(false);
      Toast.show(error.toString());
    }
  };

  // this function for getJoinedList  list (15 friends)
  async function getJoinedList(id, bool) {
    setPageLOad(true);
    setJoinFriendsList([]);
    const cPage =
      joinFriendsList &&
      joinFriendsList.pagination &&
      joinFriendsList.pagination.currentPage
        ? toNumber(joinFriendsList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.invitedFrndList}?party_id=${id}`,
        'GET',
      );
      if (response.status) {
        const obj = bool ? {} : cloneDeep(joinFriendsList);

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
        setJoinFriendsList(obj?.data);
      } else {
        Toast.show(response?.message);
      }
      stopLoader();
    } catch (error) {
      Toast.show(error.toString());
      stopLoader();
    }
  }

  const scanQrAPI = async (qrCode) => {
    // selectedParty
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.scanPartyQR}?party_id=${partyDetails?.id}&string=${qrCode}`,
        'GET',
      );

      if (response.status === true) {
        Toast.show(response?.message);
        setQRscan(false);
        setTimeout(() => {
          getPartyDetails();
        }, 200);
      } else {
        // setQRscan(false);
        Toast.show(response?.message);
      }
    } catch (error) {
      // setQRscan(false);
      console.log('error ===>>>', error);
      Toast.show(error.toString());
    }
  };

  const getText = () => {
    // For Text that is shorter than desired length
    if (partyDetails.note.length <= 150) return partyDetails.note;
    // If text is longer than desired length & showMore is true
    if (partyDetails.note.length > 150 && showMore) {
      return (
        <>
          <Text>{partyDetails.note}</Text>

          <Text onPress={() => setShowMore(false)} style={styles.txtShowMore}>
            ...Show Less
          </Text>
        </>
      );
    }
    // If text is longer than desired length & showMore is false
    if (partyDetails.note.length > 150) {
      return (
        <>
          <Text>{partyDetails.note.slice(0, 150)}</Text>

          <Text onPress={() => setShowMore(true)} style={styles.txtShowMore}>
            ...See More
          </Text>
        </>
      );
    }
  };

  const replyContainer = (item, subcomment = false) => {
    return fromProfile || partyDetails.is_already_joined === 1 ? (
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View style={[styles.profileImg, { height: 0 }]} />
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            setDefaultItem(item);
            setIsReply(true);
            if (subcomment) {
              commentRef?.current?.focus();
              setBool(true);
            } else {
              commentRef?.current?.focus();
              setDefaultComment(item);
              setBool(!bool);
            }
          }}
          style={{ flexDirection: 'row', marginLeft: 15 }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={{ paddingVertical: 5 }}>Reply</Text>
            <MIcon
              style={{ alignSelf: 'center' }}
              name="reply-outline"
              size={24}
              color={BaseColors.textGrey}
            />
          </View>
        </TouchableOpacity>
        {subcomment ? null : Number(item.reply_count) === 0 ? null : (
          <TouchableOpacity
            onPress={() => {
              setDefaultComment(item);
              getReplyCommentsList(item.id);
            }}
            style={{
              marginTop: 7,
            }}>
            <View>
              <Text>{`View ${
                Number(item.reply_count) > 0
                  ? `all ${item.reply_count} replies`
                  : 'reply'
              }`}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    ) : null;
  };

  const renderSubComments = (item, subcomment) => {
    return item.id === defaultComment.id &&
      !_.isEmpty(replyCommentList) &&
      _.isArray(replyCommentList)
      ? replyCommentList.map((it, ii) => {
          return (
            <View>
              <View style={[styles.rowView, { paddingStart: 50 }]}>
                <Image
                  source={
                    it.user_info.photo
                      ? { uri: it.user_info.photo }
                      : require('@assets/Images/placeholder.png')
                  }
                  style={styles.profileImg}
                />
                <View>
                  <Text numberOfLines={1} style={styles.userName}>
                    {it?.user_info?.name}
                  </Text>
                  <Text numberOfLines={3} style={styles.Host}>
                    {it.comment}
                  </Text>
                </View>
              </View>
              {replyContainer(item, subcomment)}
            </View>
          );
        })
      : null;
  };

  const renderCommentsItem = ({ item, index }) => {
    return (
      <View style={[styles.item]}>
        <View style={[styles.rowView, { paddingHorizontal: 0 }]}>
          <Image
            source={
              item.user_info.photo
                ? { uri: item.user_info.photo }
                : require('@assets/Images/placeholder.png')
            }
            style={styles.profileImg}
          />
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
            }}>
            <Text numberOfLines={1} style={styles.userName}>
              {item?.user_info?.name}
            </Text>
            <Text numberOfLines={3} style={styles.Host}>
              {item.comment}
            </Text>
          </View>
        </View>
        {replyContainer(item)}

        {replylistLoader && item.id === defaultComment.id ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            <ActivityIndicator
              animating
              size={'small'}
              color={BaseColors.primary}
            />
          </View>
        ) : (
          renderSubComments(item, true)
        )}
      </View>
    );
  };

  // display comments
  const renderComments = () => {
    return partyDetails?.is_blocked === 1 ? null : (
      <View style={{ paddingHorizontal: 5 }}>

        <ShowBtns
          show_pay_btn={(partyDetails.is_free) ? 0 : 1}
          handleInviteFriends={() => {
            getinvitedFrndList(partyDetails.id);
            refInviteFriend.current.open();
          }}
          handleSendRequast={(id, hostId, type) => {
            if (type === 'accept') {
              requestToJoinParty(id, hostId, 'accept');
            } else {
              requestToJoinParty(id, hostId, 'cancel');
            }
          }}
        />

        <Text style={styles.commentsTxt}>Comments: </Text>
        {commentsListLoader ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator
              animating
              color={BaseColors.primary}
              size={'small'}
            />
          </View>
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
            data={commentsList}
            bounces={false}
            renderItem={renderCommentsItem}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text bold>No Comments Available</Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.id}
          />
        )}
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginTop: 10,
            alignItems: 'center',
          }}>
          <TextInput
            ref={commentRef}
            style={{
              flex: 1,
              borderWidth: 1,
              marginBottom: 0,
              borderColor: BaseColors.borderColor,
              borderRadius: 8,
              marginRight: 10,
              paddingRight: 10,
            }}
            value={isReply ? reply : comment}
            placeholderTextColor={BaseColors.lightGrey}
            otherPlaceholder={isReply ? 'Type reply...' : 'Add comment...'}
            onChange={(value) => {
              if (isReply) {
                setReply(value);
              } else {
                setComment(value);
              }
            }}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            disabled={
              isEmpty(comment.trim()) && isEmpty(reply.trim()) ? true : false
            }
            style={{
              opacity:
                isEmpty(comment.trim()) && isEmpty(reply.trim()) ? 0.3 : 1,
            }}
            onPress={
              commentLoader
                ? null
                : () => {
                    // add main comment
                    setComment('');
                    setCommentLoader(true);
                    addCommentApi();
                  }
            }>
            {commentLoader ? (
              <View
                style={[
                  styles.sendIcon,
                  {
                    backgroundColor: BaseColors.primary,
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}>
                <ActivityIndicator
                  animating
                  size={28}
                  color={BaseColors.white}
                />
              </View>
            ) : (
              <FIcon
                style={[
                  styles.sendIcon,
                  {
                    backgroundColor: BaseColors.primary,
                  },
                ]}
                name="send"
                size={28}
                color={BaseColors.white}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const displayUserParties = ({ item, index }) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width - 20,
          paddingHorizontal: 5,
        }}>
        <DiscoverCardList
          allparties
          userName={item?.host.name}
          host="Host"
          hostPhoto={item?.host.photo}
          event={item?.title}
          date={`${item?.at_date} - ${item?.from_time}`}
          peoples={item?.joining_user_count}
          distance={Math.round(Number(item?.distance))}
          joiningUsers={item?.joining_user}
          partyImage={
            !_.isUndefined(item.party_images[0]) &&
            item.party_images[0].image_url
          }
          ratings={item.rating_count}
          avgRating={item.avg_rating}
        />
      </View>
    );
  };

  // display user parties
  const renderUserParties = () => {
    return fromDiscover ? (
      userpartiesLoader ? (
        <View
          style={{
            flex: 1,
          }}>
          <ActivityIndicator
            animating
            color={BaseColors.primary}
            size={'large'}
          />
        </View>
      ) : (
        <View>
          {!_.isEmpty(userParties) && _.isArray(userParties) ? (
            <FlatList
              data={userParties}
              renderItem={displayUserParties}
              horizontal={true}
              scrollEnabled={true}
              pagingEnabled={true}
              keyExtractor={(item, index) => index}
              onEndReachedThreshold={0.5}
              onMomentumScrollEnd={onScrollEnd}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <Text bold>No Parties Available</Text>
            </View>
          )}

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!_.isEmpty(userParties) && _.isArray(userParties)
              ? userParties?.map((it, ii) => {
                  return (
                    <View
                      style={{
                        marginHorizontal: 4,
                        elevation: 4,
                        borderRadius: 4,
                        height: ii === ImageCurIndex - 1 ? 8 : 6,
                        width: ii === ImageCurIndex - 1 ? 8 : 6,
                        backgroundColor:
                          ii === ImageCurIndex - 1
                            ? BaseColors.primary
                            : BaseColors.borderColor,
                      }}
                    />
                  );
                })
              : null}
          </View>
        </View>
      )
    ) : null;
  };

  const RenderImages = () => {
    return (
      <View>
        {!_.isEmpty(partyDetails?.party_images) &&
        _.isArray(partyDetails?.party_images) ? (
          <FlatList
            data={partyDetails?.party_images}
            renderItem={displayImages}
            horizontal={true}
            scrollEnabled={true}
            pagingEnabled={true}
            keyExtractor={(item, index) => index}
            onEndReachedThreshold={0.5}
            onMomentumScrollEnd={onScrollEndImages}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
            <Image
              source={require('@assets/Images/cardImg.jpeg')}
              style={styles.userImg}
            />
        )}

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {!_.isEmpty(partyDetails?.party_images) &&
          _.isArray(partyDetails?.party_images) &&
          partyDetails?.party_images?.length > 1
            ? partyDetails?.party_images?.map((it, ii) => {
                return (
                  <View
                    style={{
                      marginHorizontal: 4,
                      elevation: 4,
                      borderRadius: 4,
                      height: ii === ImageCurIndex1 - 1 ? 8 : 6,
                      width: ii === ImageCurIndex1 - 1 ? 8 : 6,
                      backgroundColor:
                        ii === ImageCurIndex1 - 1
                          ? BaseColors.primary
                          : BaseColors.borderColor,
                    }}
                  />
                );
              })
            : null}
        </View>
      </View>
    );
  };

  const onShare = async (link) => {
    try {
      const result = await Share.share({
        message: link,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  };

  const displayImages = ({ item, index }) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width - 20,
          paddingHorizontal: 0,
          overflow: 'hidden',
        }}>
        <Image
          source={
            !_.isEmpty(item?.image_url)
              ? { uri: item?.image_url }
              : require('@assets/Images/cardImg.jpeg')
          }
          style={styles.userImg}
        />
          {isMe && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CreateParty', {
                  data: partyDetails,
                  isEdit: true,
                });
              }}
              activeOpacity={0.6}
              style={{...styles.editImgStyle, right: 55}}>
              <ENIcon
                style={styles.menuIcon}
                name="edit"
                size={16}
                color={BaseColors.black}
              />
            </TouchableOpacity>
          )}

          { partyDetails?.is_free === 0 && partyDetails?.is_expired === 0 && (
            <TouchableOpacity
              onPress={() => {
                onShare(`${BaseSetting.DOMAIN_SITE_PARTY}${partyDetails?.id}`)
              } }
              activeOpacity={0.6}
              style={styles.editImgStyle}
              >
              <ENIcon
                style={styles.menuIcon}
                name="link"
                size={20}
                color={'red'}
              />
            </TouchableOpacity>
          )}

        {
          <View style={styles.paidSheetImgview}>
            <Text bold style={styles.paidImg}>
              {(partyDetails?.is_free === 1) ? "Free" : (isMe ? 'My Party' : (partyDetails?.show_qr === 1 ? 'Paid' : `£${partyDetails?.price}`))}
            </Text>
          </View>
        }
      </View>
    );
  };

  // get invited friends list api call
  async function getinvitedFrndList(id, bool) {
    // setInvitedFrndList([]);
    const cPage =
      invitedFrndList &&
      invitedFrndList.pagination &&
      invitedFrndList.pagination.currentPage
        ? toNumber(invitedFrndList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.inviteFriends}?party_id=${id}`,
        'GET',
      );
      if (response.status) {
        const obj = bool ? {} : cloneDeep(invitedFrndList);

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
        setInvitedFrndList(obj.data);
      }
      stopLoader();
    } catch (error) {
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
      stopLoader();
    }
  }

  const renderUserPartiesDetails = () => {
    return fromDiscover ? (
      <View>
        <View style={{ marginVertical: 10 }}>
          <Text
            bold
            numberOfLines={1}
            style={[styles.userName, { fontSize: 16 }]}>
            {`${partyDetails?.host?.name} Parties`}
          </Text>
        </View>
        <Text numberOfLines={3} style={[styles.details]}>
          The most recent parties the host has made and joined can be viewed,
          along with their ratings.
        </Text>
        <View style={styles.btnsView}>
          {btnArray.map((it, ii) => {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.btnTxtView,
                  {
                    borderWidth: 0.6,
                    backgroundColor:
                      it.id === defaultButton.id
                        ? BaseColors.lightRed
                        : BaseColors.white,
                    borderColor:
                      it.id === defaultButton.id
                        ? BaseColors.lightRed
                        : BaseColors.borderColor,
                  },
                ]}
                onPress={() => {
                  setDefaultButton(it);
                }}>
                <Text style={styles.btnTxt}>{it.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    ) : null;
  };

  // render modal list
  const renderModalList = (listData, listRef, btnTitle, type) => {
    return (
      <ListModal
        ListArray={listData}
        pageLoad={pageLoader}
        btnTitle={btnTitle}
        itemBtn={type}
        buttonloader={buttonloader}
        handleProfileClick={(item) => {
          listRef?.current?.close();
          navigation.push('Profile', {
            from: 'friends',
            id: item?.id,
          });
        }}
        handleMainBtn={(key) => {
          getinvitedFrndList(partyDetails.id);
          listRef?.current?.close();
          if (key === 'invite-friends' && btnTitle === 'Done') {
            setTimeout(() => {
              refInviteFriend?.current?.close();
            }, 200);
          } else {
            setTimeout(() => {
              refInviteFriend?.current?.open();
            }, 500);
          }
        }}
        handleCancel={(item) => {
          handleCancel(item.id, type);
        }}
        handleInvite={(item) => {
          handleInvite(item.id);
        }}
        renderFooterComponent={() => renderFooterComponent(listData)}
        refreshLoader={refreshLoader}
        onRefresh={() => {
          onRefresh(type);
        }}
        onEndReached={() => {
          getMoreData(listData);
        }}
      />
    );
  };

  function renderFooterComponent(listdata) {
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
    } else if (isEmpty(listdata)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  // this modal will be used in future after discussion with client
  const renderPaymentModal = () => {
    return paymentModal ? (
      <MidModal
        coin={`$${partyDetails?.price}`}
        title={'Pay Now and Join the Event'}
        description={
          'you can pay via credit/debit card and also via apple pay and paypal'
        }
        btnTxt={'Pay Now'}
        image={Images.payImg}
        btnYPress={() => {
          navigation.navigate('PaymentMethod', {
            partyData: {
              party_id: partyDetails?.id,
              title: partyDetails?.title || '',
              price: partyDetails?.price || 0,
            },
          });
          setPaymentModal(false);
        }}
        btnNPress={() => {
          setPaymentModal(false);
        }}
      />
    ) : null;
  };

  const handleQR = (selectedPArty) => {
    if (userData.id === partyDetails?.host?.host_id) {
      setQRscan(true);
    } else {
      setTimeout(() => {
        setQRDetails(true);
      }, 500);
    }
  };

  // render qr scanner
  const renderQrScanner = () => {
    const height = screenHeight - 120;
    return (
      <View
        style={{
          backgroundColor: BaseColors.white,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}>
          <View>
            <Text
              bold
              style={{
                fontSize: 20,
              }}>
              Scan QR
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setQRscan(false);
            }}
            style={{
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <AIcon name={'closecircle'} size={25} color={BaseColors.black} />
          </TouchableOpacity>
        </View>
        <QRCodeScanner
          cameraStyle={{ height: height }}
          showMarker
          onRead={(code) => {
            const obj = JSON.parse(JSON.stringify(code));
            const qrdata = obj?.data;
            scanQrAPI(qrdata);
          }}
        />
      </View>
    );
  };

  const renderQRModal = () => {
    return qrdetails ? (
      <Modal
        transparent
        visible={qrdetails}
        onRequestClose={() => setQRDetails(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Animated.View
            style={{
              flex: 1,
              width: '90%',
              backgroundColor: BaseColors.white,
              borderRadius: 20,
              margin: 20,
              elevation: 20,
              overflow: 'hidden',
            }}>
            {/* qr header */}
            <View
              style={{
                padding: 15,
                alignItems: 'center',
                backgroundColor: BaseColors.primary,
                height: 60,
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <Text
                  numberOfLines={1}
                  bold
                  color="white"
                  style={{
                    fontSize: 20,
                  }}>
                  {partyDetails.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setQRDetails(false);
                  setTimeout(() => {
                    getPartyDetails();
                  }, 200);
                }}
                style={{
                  backgroundColor: BaseColors.white,
                  borderRadius: 50,
                  width: 25,
                  height: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AIcon name={'close'} size={18} color={BaseColors.primary} />
              </TouchableOpacity>
            </View>

            {/* qr content */}
            <View
              style={{
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              <Image
                source={
                  !_.isEmpty(partyDetails?.party_images[0]?.image_url)
                    ? { uri: partyDetails?.party_images[0]?.image_url }
                    : require('@assets/Images/cardImg.jpeg')
                }
                style={{
                  alignSelf: 'center',
                  width: '100%',
                  height: Dimensions.get('window').height / 4,
                  borderRadius: 10,
                }}
              />

              <View
                style={[
                  styles.rowView,
                  { paddingHorizontal: 0, marginTop: 10 },
                ]}>
                <Image
                  source={{ uri: partyDetails?.host?.photo }}
                  style={styles.profileImg}
                />

                <View
                  style={{
                    marginLeft: 10,
                    justifyContent: 'center',
                  }}>
                  <Text numberOfLines={1} style={styles.userName}>
                    {partyDetails?.host.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.Host}>
                    {'Host'}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginVertical: 30,
                }}>
                <Image
                  source={
                    !_.isEmpty(partyDetails?.qr_code)
                      ? { uri: partyDetails?.qr_code }
                      : ''
                  }
                  style={{
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    width: Dimensions.get('window').width / 2,
                    height: Dimensions.get('window').height / 4,
                  }}
                />
              </View>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                  }}>
                  You must scan the QR code provided by the party to enter the
                  premises
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    ) : null;
  };

  const renderInviteReqBtns = () => {
    return (
      <Button
        loading={reqBtnLoader}
        style={{
          backgroundColor:
            partyDetails.is_already_requested === 1
              ? BaseColors.lightRed
              : BaseColors.primary,
        }}
        type={partyDetails.is_already_requested === 1 ? 'outlined' : 'primary'}
        onPress={() => {
          if (partyDetails?.show_pay_btn === 1) {
            setPaymentModal(true);
          } else if (partyDetails.is_already_requested === 1) {
            cancelrequestParty();
          } else {
            requestToJoinParty();
          }
        }}>
        {partyDetails?.show_pay_btn === 1
          ? 'Pay Now'
          : partyDetails.is_already_requested === 1
          ? 'Cancel Request'
          : 'Request To Join'}
      </Button>
    );
  };

  async function leaveParty() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.leaveParty}?party_id=${partyDetails.id}`,
        'GET',
      );
      if (response.status) {
        Toast.show(response?.message);
        setBtnLoader(false);
        setPageLoader(true);
        getPartyDetails();
      } else {
        console.log('No data Found');
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
        setBtnLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      // setPageLoad(false);
      setBtnLoader(false);
    }
  }

  async function cancleParty() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancleParty}?party_id=${partyDetails.id}`,
        'GET',
      );
      if (response.status) {
        Toast.show(response?.message);
        setBtnLoader(false);
        navigation.goBack();
      } else {
        console.log('No data Found');
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
        setBtnLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      // setPageLoad(false);
      setBtnLoader(false);
    }
  }
  const renderProfileButtons = () => {
    return partyDetails?.is_already_joined === 1 || isMe ? (
      <>
        <View style={styles.btnView1}>
          {
            !isMe ? (
            Number(partyDetails?.show_qr) === 0 ||
            isEmpty(partyDetails?.qr_code) ? null : (
              <View style={[styles.btnOne, { marginRight: 10 }]}>
                <Button type="outlined" onPress={() => handleQR(partyDetails)}>
                  <MIcon
                    style={[styles.pinIcon, { marginRight: 10 }]}
                    name="qrcode"
                    size={18}
                    color={BaseColors.primary}
                  />
                  {'   Party QR'}
                </Button>
              </View>
            )
          ) : (
            <View style={[styles.btnOne, { marginRight: 10 }]}>
              <Button type="outlined" onPress={() => handleQR(partyDetails)}>
                <MIcon
                  style={[styles.pinIcon, { marginRight: 10 }]}
                  name="qrcode"
                  size={18}
                  color={BaseColors.primary}
                />
                {'   Scan QR'}
              </Button>
            </View>
          )}
          <View style={[styles.btnOne]}>
            <Button
              style={{
                borderWidth: 1,
                borderColor: BaseColors.primary,
              }}
              type="primary"
              onPress={() => {
                handleInviteFriends(item);
                setPageLOad(true);
                getinvitedFrndList(partyDetails.id);
                refInviteFriend.current.open();
              }}>
              {'Invite Friends'}
            </Button>
          </View>
        </View>
        {partyDetails.is_expired === 0 &&
        partyDetails.is_started === 0 &&
        (selected === 'Current' ||
          selected === 'Joined' ||
          fromDiscover ||
          isFromFriends) &&
        !isMe ? (
          <View
            style={[
              styles.btnOne,
              {
                flex: 1,
                marginTop: 8,
              },
            ]}>
            <Button
              style={{
                borderWidth: 1,
                borderColor: BaseColors.primary,
              }}
              type="primary"
              onPress={() => {
                setCAlert(true);
              }}>
              {'Leave Party'}
            </Button>
          </View>
        ) : isMe &&
          partyDetails.is_expired === 0 &&
          partyDetails.is_started === 0 &&
          (selected === 'Created' || fromDiscover) ? (
          <View
            style={[
              styles.btnOne,
              {
                flex: 1,
                marginTop: 8,
              },
            ]}>
            <Button
              style={{
                borderWidth: 1,
                borderColor: BaseColors.primary,
              }}
              type="primary"
              onPress={() => {
                setCAlert2(true);
              }}>
              {'Cancel Party'}
            </Button>
          </View>
        ) : null}
        {cAlert ? (
          <AlertModal
            loader={btnLoader}
            title=" "
            visible={cAlert.showAlert}
            setVisible={setCAlert}
            description={
              partyDetails.is_free === 0 && partyDetails.is_refundable === 0
                ? 'Your party amount will not refund if you leave the party.'
                : 'Are you sure you want to leave this party?'
            }
            btnYTitle={'Confirm'}
            btnNTitle="Cancel"
            btnYPress={() => {
              setCAlert(false);
              leaveParty();
            }}
          />
        ) : null}
        {cAlert2 ? (
          <AlertModal
            loader={btnLoader}
            title=" "
            visible={cAlert2.showAlert}
            setVisible={setCAlert2}
            description={
              'Are you sure you want to cancel this party? \n\n If you are doing repeatedly this before starting the party then your account will be locked.'
            }
            btnYTitle={'Confirm'}
            btnNTitle="Cancel"
            btnYPress={() => {
              setCAlert2(false);
              cancleParty();
            }}
          />
        ) : null}
      </>
    ) : null;
  };

  const ShowBtns = ({ show_pay_btn, handleInviteFriends, handleSendRequast }) => {
    return (
      <View style={{height: 50}}>
        { (!isMe && partyDetails?.show_qr === 1) ? (
          <View style={styles.btnOne}>
            <Button type="outlined" onPress={() => handleQR(partyDetails)}>
              <MIcon
                style={[styles.pinIcon, { marginRight: 10 }]}
                name="qrcode"
                size={18}
                color={BaseColors.primary}
              />
              {'   Party QR'}
            </Button>
          </View>
        ) : (!isMe && show_pay_btn === 1) ||
        (Number(partyDetails?.is_expired) === 1 ||
        Number(partyDetails.is_blocked) === 1 ||
        selected === '' ? null : !isMe &&
          Number(partyDetails?.is_already_joined) === 0) ? (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                backgroundColor:
                  partyDetails?.is_already_requested === 0
                    ? BaseColors.primary
                    : BaseColors.lightRed,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderWidth: partyDetails?.is_already_requested === 0 ? 0 : 1,
                borderColor:
                  partyDetails?.is_already_requested === 0
                    ? BaseColors.white
                    : BaseColors.primary,
              }}
              onPress={() => {
                if (show_pay_btn === 1) {
                  setPaymentModal(true);
                } else if (partyDetails?.is_already_requested === 0) {
                  handleSendRequast(partyDetails?.id, partyDetails?.host?.host_id, 'accept');
                } else {
                  handleSendRequast(partyDetails?.id, partyDetails?.host?.host_id, 'cancel');
                }
              }}>
              {reqBtnLoader === partyDetails?.id ? (
                <ActivityIndicator
                  color={
                    partyDetails?.is_already_requested === 0
                      ? BaseColors.white
                      : BaseColors.secondary
                  }
                  size="small"
                  animating
                />
              ) : (
                <Text
                  style={{
                    color:
                      partyDetails?.is_already_requested === 0
                        ? BaseColors.white
                        : BaseColors.primary,
                    fontSize: 16,
                  }}>
                  {show_pay_btn === 1
                    ? 'Pay Now'
                    : partyDetails?.is_already_requested === 0
                      ? 'Request to Join'
                      : 'Cancel Request'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (isMe) ? (
          <View style={styles.btnView1}>
            {selected === 'Current' || selected === 'Joined' ? (
              <View style={styles.btnOne}>
                <Button type="outlined" onPress={() => handleQR(partyDetails)}>
                  <MIcon
                    style={[styles.pinIcon, { marginRight: 10 }]}
                    name="qrcode"
                    size={18}
                    color={BaseColors.primary}
                  />
                  {'   Party QR'}
                </Button>
              </View>
            ) : (
              <View style={styles.btnOne}>
                <Button type="outlined" onPress={() => handleQR(partyDetails)}>
                  <MIcon
                    style={[styles.pinIcon, { marginRight: 10 }]}
                    name="qrcode"
                    size={18}
                    color={BaseColors.primary}
                  />
                  {'   Scan QR'}
                </Button>
              </View>
            )}
            <View
              style={styles.btnOne}>
              <Button
                type="primary"
                onPress={() => {
                  handleInviteFriends(partyDetails);
                }}>
                {'Invite Friends'}
              </Button>
            </View>
          </View>
        ) : null}
        {
          isMe &&
          selected === 'Created' &&
          partyDetails.is_expired === 0 &&
          partyDetails.is_started === 0 ? (
            <View style={[styles.btnView1, {}]}>
              <View
                style={styles.btnOne}
              >
                <Button
                  type="primary"
                  onPress={() => {
                    setCAlert(true);
                  }}>
                  {'Cancel Party'}
                </Button>
              </View>
            </View>
          ) : null}
      </View>
    )
  }

  return (
    <>
      <Header
        title={data.title}
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => {
          if (navigationBack) {
            navigation.popToTop();
          } else {
            navigation.goBack();
          }
          setDefaultComment({});
        }}
      />
      <KeyboardAvoidingView
        behavior={IOS ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.container}>
          {pageloader ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: BaseColors.white,
              }}>
              <EventContentLoader />
            </View>
          ) : qrScan ? (
            renderQrScanner()
          ) : (
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled">
              <View style={styles.firstView}>
                <RenderImages />

                {partyDetails.distance ? (
                  <View style={styles.menuIconView}>
                    <ENIcon
                      style={styles.menuIcon}
                      name="location-pin"
                      size={15}
                      color={BaseColors.black}
                    />
                    <Text style={styles.locationTxt}>
                      {`${Math.round(Number(partyDetails?.distance))} KM`}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.HeaderRowView}>
                  <TouchableOpacity
                    onPress={() => {
                      if (isMe) {
                        return null;
                      } else {
                        navigation.push('Profile', {
                          from: 'friends',
                          id: partyDetails?.host?.host_id,
                        });
                      }
                    }}
                    activeOpacity={isMe ? 1 : 0.6}
                    style={{
                      flexDirection: 'row',
                      flex: 2,
                      alignItems: 'center',
                    }}>
                    <Image
                      source={
                        !_.isEmpty(partyDetails?.host?.photo)
                          ? { uri: partyDetails?.host?.photo }
                          : require('@assets/Images/avatar.png')
                      }
                      style={styles.profileImg}
                    />
                    <View style={{}}>
                      <Text numberOfLines={1} style={styles.userName}>
                        {partyDetails?.host?.name}
                      </Text>
                      <Text numberOfLines={1} style={styles.Host}>
                        {'Host'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={partyDetails?.is_blocked === 1 ? 1 : 0.5}
                    onPress={
                      partyDetails?.is_blocked === 1
                        ? null
                        : () => {
                            getJoinedList(partyDetails.id);
                            refJouinedSheet.current.open();
                          }
                    }
                    style={styles.imgsView}>
                    {!_.isEmpty(partyDetails?.joining_user) &&
                    _.isArray(partyDetails?.joining_user)
                      ? partyDetails?.joining_user?.map((it, ii) => {
                          return (
                            <Image
                              source={
                                !_.isEmpty(it)
                                  ? { uri: it }
                                  : require('@assets/Images/avatar.png')
                              }
                              style={[
                                styles.imgOne,
                                {
                                  marginLeft: ii > 0 ? -16 : 0,
                                },
                              ]}
                            />
                          );
                        })
                      : null}
                    {partyDetails.joining_user_count > 2 ? (
                      <View
                        style={[
                          styles.imgOne,
                          {
                            backgroundColor: '#585858',
                            marginLeft: -16,
                            alignItems: 'center',
                            justifyContent: 'center',
                          },
                        ]}>
                        <Text style={styles.addPerson}>{`${
                          Number(partyDetails?.joining_user_count) - 2
                        } + `}</Text>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>
                <View style={styles.HeaderRowView}>
                  <FIcon
                    style={styles.addIcon}
                    name="calendar"
                    size={25}
                    color={BaseColors.primary}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <Text numberOfLines={1} style={styles.dateTime}>
                      {`${partyDetails.at_date} - ${partyDetails.from_time}`}
                    </Text>
                    <Text bold numberOfLines={1} style={styles.dateTime}>
                      {'To'}
                    </Text>
                    <Text numberOfLines={1} style={styles.dateTime}>
                      {`${partyDetails.to_time}`}
                    </Text>
                  </View>
                </View>
                {partyDetails?.is_free === 0 ? (
                  <View style={styles.HeaderRowView}>
                    <CustomIcon
                      style={[styles.addIcon, { paddingRight: 10 }]}
                      name="price"
                      size={20}
                      color={BaseColors.primary}
                    />
                    <Text
                      bold
                      numberOfLines={1}
                      style={[styles.details, { fontFamily: FontFamily.bold }]}>
                      {partyDetails?.is_free === 0
                        ? `£${
                            partyDetails?.price === null
                              ? 0
                              : partyDetails?.price
                          }`
                        : 'Free'}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.HeaderRowView}>
                  <Text
                    numberOfLines={6}
                    style={[
                      styles.details,
                      { fontFamily: FontFamily.bold, fontSize: 16 },
                    ]}>
                    {'Age Limit: '}
                    <Text
                      bold
                      style={{
                        fontFamily: FontFamily.regular,
                      }}>{`${partyDetails.min_age} To ${partyDetails.max_age}`}</Text>
                  </Text>
                </View>
                <View
                  style={[
                    styles.HeaderRowView,
                    {
                      paddingVertical: 0,
                    },
                  ]}>
                  <Text
                    bold
                    style={{
                      marginRight: 10,
                    }}>
                    Ratings
                  </Text>
                  <StarRating
                    disabled
                    maxStars={5}
                    rating={partyDetails.avg_rating}
                    fullStarColor={BaseColors.primary}
                    emptyStarColor={BaseColors.lightRed}
                    starSize={30}
                    starStyle={{ margin: 2 }}
                    halfStarEnabled={true}
                  />
                </View>
                <Text
                  bold
                  style={{
                    marginRight: 10,
                    paddingHorizontal: 5,
                  }}>
                  Notes
                </Text>
                {partyDetails?.note ? (
                  <View style={{ flex: 1, paddingHorizontal: 5 }}>
                    <RenderHTML source={{ html: partyDetails?.note }} />
                  </View>
                ) : null}
                <View
                  style={{
                    justifyContent: 'center',
                    marginTop: 10,
                    marginBottom: 20,
                    paddingHorizontal: 5,
                    position: 'relative',
                  }}>
                  <Image
                    style={{
                      width: '100%',
                      height: 150,
                      alignSelf: 'center',
                      borderRadius: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }}
                    source={{
                      uri: `https://maps.googleapis.com/maps/api/staticmap?&zoom=20&size=600x300&maptype=roadmap&center=${partyDetails?.location_lat},${partyDetails?.location_lng}&key=${BaseSetting?.MAPS_API_CALL_KEY}`,
                      // uri: `https://maps.googleapis.com/maps/api/staticmap?&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7Clabel:C%7C${partyDetails?.location_lat},${partyDetails?.location_lng}&key=${BaseSetting?.MAPS_API_CALL_KEY}`,
                    }}
                  />
                  <Animatable.Image
                    animation="bounce"
                    iterationCount={'infinite'}
                    duration={2000}
                    direction="alternate"
                    source={require('@assets/Images/map_marker.png')}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      height: 40,
                      width: 40,
                      elevation: 15,
                      marginLeft: -20,
                      marginTop: -30,
                    }}
                  />

                  <TouchableOpacity //22.5645, 72.9289
                    onPress={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${partyDetails?.location_lat},${partyDetails?.location_lng}`;
                      Linking.openURL(url);
                    }}
                    style={{
                      color: '#F3492E',
                      backgroundColor: BaseColors.primary,
                      borderRadius: 40,
                      padding: 10,
                      position: 'absolute',
                      right: 10,
                      top: 10,
                    }}>
                    <ENIcon
                      style={styles.menuIcon}
                      name="direction"
                      size={25}
                      color={BaseColors.white}
                    />
                  </TouchableOpacity>
                </View>
                {selected === 'Created' ||
                partyDetails?.is_expired === 1 ||
                partyDetails?.is_blocked === 1
                  ? null
                  : partyDetails?.is_already_joined === 0 && !isMe
                  ? renderInviteReqBtns()
                  : renderProfileButtons()}

                {renderUserPartiesDetails()}
                {renderUserParties()}
                {renderComments()}
              </View>

              {renderPaymentModal()}
              {renderQRModal()}
              <FormModal rbSheetRef={refInviteFriend} title={'Invite Friends'}>
                {renderModalList(
                  invitedFrndList,
                  refInviteFriend,
                  'Done',
                  'invite-friends',
                )}
              </FormModal>

              <FormModal
                rbSheetRef={refJouinedSheet}
                title={`${joinFriendsList.length} People Invites`}>
                {renderModalList(
                  joinFriendsList,
                  refJouinedSheet,
                  'Invite More Friends',
                  'invited-Friend-list',
                )}
              </FormModal>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
