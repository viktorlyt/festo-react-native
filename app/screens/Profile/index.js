/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
  Modal,
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';
import { AlertModal } from '@components';
import styles from './styles';
import SIcon from 'react-native-vector-icons/SimpleLineIcons';
import { Camera } from 'react-native-vision-camera';
import FIcon from 'react-native-vector-icons/Feather';
import IIcon from 'react-native-vector-icons/Ionicons';
import { Text, Header, ListModal, MidModal, Button } from '@components';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { CustomIcon } from '@config/LoadIcons';
import { BaseColors } from '@config/theme';
import FriendListModal from '@components/FriendListModal';
import { useFocusEffect } from '@react-navigation/native';
import _, {
  isArray,
  isEmpty,
  isObject,
  cloneDeep,
  toNumber,
  flattenDeep,
  findIndex,
} from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import PartyCard from '@components/UI/PartyCard';
import SelectPhotoModal from '@components/SelectPhotoModal';
import DiscoverCardList from '@components/UI/DiscoverCardList';
import Toast from 'react-native-simple-toast';
import nToast from 'react-native-toast-message';
import Popover from 'react-native-popover-view';
import { useDispatch, useSelector } from 'react-redux';
import AIcon from 'react-native-vector-icons/AntDesign';
import CamIcon from 'react-native-vector-icons/Fontisto';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Images } from '@config';
import authActions from '@redux/reducers/auth/actions';
import CNoData from '@components/CNoData';
import FormModal from '@components/FormModal';
import ImagePreview from '@components/ImagePreview';
import { ProfileContentLoader } from '@components/ContentLoader';
import { useCameraDevices } from 'react-native-vision-camera';
import Stories from '../../libs/react-native-stories-media';
import { log } from 'react-native-reanimated';

/**
 * Module  Profile
 * @module  Profile
 *
 */

export default function Profile({ navigation, route }) {
  const hideHeader = () => {
    // Function to change navigation options
    navigation.setOptions({ headerShown: false });
  };
  const scrollY = new Animated.Value(0);
  const scrollTill = IOS ? 80 : 100;
  const diffClamp = Animated.diffClamp(scrollY, 0, scrollTill);
  const translateY = diffClamp.interpolate({
    inputRange: [0, scrollTill],
    outputRange: [0, -scrollTill],
  });
  //  scrollY.interpolate
  const from = route?.params?.from || '';
  const isFromFriends = from === 'friends';
  const IOS = Platform.OS === 'ios';
  const dispatch = useDispatch();
  const { setActiveScreen } = authActions;
  const { userData } = useSelector((state) => state.auth);
  const socketObj = useSelector((state) => state.socket.socketObj);
  const [cAlert, setCAlert] = useState({});
  const [paymentModal, setPaymentModal] = useState(false);
  const userId = route?.params?.id || '';
  const [data, setData] = useState({});
  const [image, setImage] = useState('');
  const [myInterest, setMyInterest] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);

  const [Parties, setParties] = useState({});
  const [selected, setSelected] = useState('Created');
  const [partiesListLoad, setPartiesListLoad] = useState(false);
  const [btnLoader, setBtnLoader] = useState('');
  const [friendModal, setFriendModal] = useState(false);

  const [listLoader, setListLoader] = useState(true);
  const [selectedPartyId, setSelectedPartyId] = useState(0);
  const [buttonloader, setButtonLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);
  const [moreLoadParty, setMoreLoadParty] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [invitedFrndList, setInvitedFrndList] = useState([]);
  const [reviewModal, setReviewModal] = useState(false);
  const [joinFriendsList, setJoinFriendsList] = useState([]);
  const [btnRateLoader, setBtnRateLoader] = useState(false);
  const [ratePartyId, setRatePartyId] = useState('');
  const [partyRating, setPartyRating] = useState(3);
  const [reqBtnLoader, setReqBtnLoader] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const [defaultITem, setDefaultItem] = useState({});
  const [xyPoint, setXYPoint] = useState({});
  const [qrdetails, setQRDetails] = useState(false);
  const [selectedParty, setSelectedParty] = useState({});
  const [qrScan, setQRscan] = useState(false);
  const [bool, setBool] = useState(true);
  const [cameraView, setCameraView] = useState(false);
  const [storyList, setStoryList] = useState([]);
  const [storyArrList, setStoryLArrist] = useState({});
  const [uploadType, setUploadType] = useState('');
  const [storyLoader, setStoryLoader] = useState(false);
  const devices = useCameraDevices();
  const device = devices.back;
  const [captureImg, setCaptureImg] = useState({});
  const [captureImgSize, setCaptureImgSize] = useState(null);
  const [preview, setPreview] = useState(false);
  const nWidth = BaseSetting.nWidth;
  const refRBSheet = useRef(null);
  const ListRef = useRef(null);
  const refJouinedSheet = useRef(null);
  const refInviteFriend = useRef(null);
  const cameraRef = useRef(null);
  const [openIcons, setopenIcons] = useState(false);
  const PartiesTabs = [
    { id: 2, name: 'Created' },
    { id: 3, name: 'Joined' },
  ];
  const screenHeight = Math.round(Dimensions.get('window').height);

  useEffect(async () => {
    console.log('sucessssssssssssssssssssssssssssss');
    const devices = await Camera.getAvailableCameraDevices();
    console.log('getAvailableCameraDevices => ', devices);
  }, []);

  useEffect(() => {
    if (!isEmpty(captureImg)) {
      setPreview(true);
    }
  }, [captureImg]);

  // this function for handle statusbar
  useFocusEffect(
    useCallback(async () => {
      setBool(true);
      getInterestList();
      getStoryList();
      dispatch(setActiveScreen('profile'));
      return async () => {
        setQRscan(false);
      };
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setPartiesListLoad(true);
      setTimeout(() => {
        MyParties(true);
      }, 200);
    }, [selected, userId]),
  );

  // this function for get story list
  async function getStoryList() {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.userStoryList,
        'GET',
      );

      if (response.status && isObject(response?.data)) {
        setStoryLArrist(response?.data.user_story);
        if (
          isArray(response?.data?.friends_story) &&
          response?.data?.friends_story.length > 0
        ) {
          const { user_story } = response?.data;
          // if (
          //   !isEmpty(user_story) &&
          //   isArray(user_story?.stories) &&
          //   user_story?.stories.length > 0
          // ) {
          const arr = [...response?.data?.friends_story];
          arr.splice(0, 0, user_story);
          setStoryList(arr);
          // } else {
          //   setStoryList(response.data.friends_story);
          // }
        } else {
          const { user_story } = response?.data;
          // if (
          //   !isEmpty(user_story) &&
          //   isArray(user_story?.stories) &&
          //   user_story?.stories.length > 0
          // ) {
          const arr = [];
          arr.push(user_story);
          setStoryList(arr);
          // }
        }
      }
    } catch (error) {
      console.log('Stories not found!')
    }
  }

  const openCamera = () => {
    ImagePicker.openCamera({
      width: 200,
      height: 200,
      cropping: uploadType === 'story' ? false : true,
      cropperCircleOverlay: uploadType === 'story' ? false : true,
      mediaType: 'photo',
    }).then((image) => {
      refRBSheet.current.close();

      const imgFile = {
        uri: image?.path,
        name: image?.path.substr(image?.path.lastIndexOf('/') + 1),
        type: image.mime,
      };
      if (uploadType === 'story') {
        uploadStory(imgFile, image?.size);
      } else {
        UpdateImage(imgFile);
      }
      setUploadType('');
    });
  };

  // function for openGallery
  const openGallery = (type = '') => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      cropping: uploadType === 'story' ? false : true,
      cropperCircleOverlay: uploadType === 'story' ? false : true,
      mediaType: 'photo',
    }).then((image) => {
      refRBSheet.current.close();
      const imgFile = {
        uri: image?.path,
        name: image?.path.substr(image?.path.lastIndexOf('/') + 1),
        type: image.mime,
      };
      if (type === 'story') {
        setCaptureImg(imgFile);
        setCaptureImgSize(image?.size);
      } else if (uploadType === 'story') {
        setCameraView(false);
        uploadStory(imgFile, image?.size);
      } else {
        UpdateImage(imgFile);
      }
      setUploadType('');
    });
  };

  // this function for upload story
  async function uploadStory(file, size) {
    setCameraView(false);
    setStoryLoader(true);
    console.log('size===>', size);
    try {
      const response = await getApiDataProgress(
        BaseSetting.endpoints.userAddStory,
        'POST',
        {
          'Story[url]': file,
          'Story[size]': size || 10000,
        },
      );

      if (response.status) {
        getStoryList();
        nToast.show({
          type: 'success', // success / error
          text1: "It's Done 😀!",
          text2: 'Your story is uploaded. 🚀',
        });
      } else {
        // Toast.show(response.message);
        nToast.show({
          type: 'error', // success / error
          text1: "Couldn't upload the story! Oh Snap! 😔",
          text2: response.message,
        });
      }
      setStoryLoader(false);
    } catch (error) {
      console.log('upload story error ===', error);
      // Toast.show(error.toStirng());
      nToast.show({
        type: 'error', // success / error
        text1: 'Oh Snap! 😔',
        text2: error.toStirng(),
      });
      setStoryLoader(false);
    }
  }

  const optionsArray = [
    {
      id: 1,
      optionTitle: 'Select from Gallery',
      handleClick: openGallery,
      optionIcon: 'photo',
    },
    {
      id: 1,
      optionTitle: 'Open Camera',
      handleClick: openCamera,
      optionIcon: 'camera',
    },
  ];

  //API Call for UpdateImage
  async function UpdateImage(file) {
    setImageLoader(true);
    try {
      const data1 = {
        'ImageForm[photo]': file,
      };

      const resp = await getApiData(
        BaseSetting.endpoints.editImg,
        'POST',
        data1,
      );
      if (resp?.status) {
        setImage(resp?.data);
        setImageLoader(false);
        // Toast.show(resp?.message);
        nToast.show({
          type: 'success', // success / error
          text1: "Hurrah , it's Done !",
          text2: resp?.message,
        });
      } else {
        // Toast.show(resp?.message);
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: resp?.message,
        });

        setImageLoader(false);
      }
    } catch (error) {
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
      setImageLoader(false);
    }
  }

  function partyCountDown(da, ti) {
    // const x = setInterval(() => {
    const hg = moment(`${da} ${ti}`).toLocaleString();
    const hhu = new Date(hg).getTime();
    const Today = new Date().getTime();

    const distance = hhu - Today;
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    var formattedNumber = ('0' + minutes).slice(-2);
    const count = `${days} days, ${hours}:${formattedNumber}:${seconds}`;

    if (distance < 0) {
      // clearInterval(x);
      return 'Finished';
    } else {
      return count;
    }
    // }, 1000);
  }

  function renderFooterComponentLoader() {
    if (moreLoadParty) {
      return (
        <View style={styles.loaderFooterView}>
          <ActivityIndicator
            size={'small'}
            animating
            color={BaseColors.primary}
          />
        </View>
      );
    } else if (isEmpty(Parties)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  // this function for MyParties
  async function MyParties(bool) {
    const cPage =
      Parties && Parties.pagination && Parties.pagination.currentPage
        ? toNumber(Parties.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }

    const key = selected === 'Created' ? 1 : 2;
    const endPoints = isFromFriends
      ? `${BaseSetting.endpoints.userParties}?status=${key}&user_id=${userId}&page=${page_no}`
      : `${BaseSetting.endpoints.myParties}?status=${key}&page=${page_no}`;
    try {
      const response = await getApiData(endPoints, 'GET');
      if (
        isObject(response) &&
        !isEmpty(response) &&
        response.status === true
      ) {
        const obj = bool ? {} : cloneDeep(Parties);

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
        setParties(obj);
      }
      stopLoader();
    } catch (error) {
      console.log('error ===>>>', error);
      stopLoader();
    }
  }

  // this function for MyProfileData
  async function MyProfileData(interestList1) {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.myProfileData,
        'GET',
      );
      console.log('response===>>>', response);
      if (response?.status) {
        setData(response.data);
        const int = response?.data?.interest;
        let arr = [];
        int.map((item, index) => {
          interestList1.filter((v) =>
            v.value === item ? arr.push(v) : v.value === item,
          );
        });
        setMyInterest(arr);
        setImage(response?.data?.photo);
        setPageLoader(false);
      } else {
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });

        setPageLoader(false);
      }
    } catch (error) {
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
      console.log('error ===>>>', error);
      setPageLoader(false);
    }
  }

  // this function for UserProfileData
  async function UserProfileData(interestList1) {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.userDetail}?user_id=${userId}`,
        'GET',
      );
      if (response?.status) {
        setData(response.data);
        const int = response?.data?.user_interests;
        let arr = [];
        int.map((item, index) => {
          interestList1.filter((v) =>
            v.value === item ? arr.push(v) : v.value === item,
          );
        });
        setMyInterest(arr);
        setImage(response?.data?.photo);
        setPageLoader(false);
      } else {
        console.log('No data Found');
        setPageLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      setPageLoader(false);
    }
  }

  // this function for get interests list
  async function getInterestList() {
    setPageLoader(true);
    try {
      const response = await getApiData(
        BaseSetting.endpoints.interestList,
        'GET',
        {},
      );

      if (response?.status && _.isArray(response?.data)) {
        const interestList1 = response?.data;
        if (isFromFriends) {
          UserProfileData(interestList1);
        } else {
          MyProfileData(interestList1);
        }
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
    }
  }

  // this function for get users list
  async function sendFriendRequist() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.addFriend}?user_id=${userId}`,
        'GET',
      );

      if (response?.status) {
        UserProfileData();
      } else {
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
      setBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);

      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
      setBtnLoader(false);
    }
  }

  // this function for get users list
  async function cancelFriendRequist() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelFriend}?user_id=${userId}`,
        'GET',
      );

      if (response.status) {
        UserProfileData();
        setBtnLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      setBtnLoader(false);
    }
  }

  // request to join api
  async function requestToJoinParty(id, hostId, type) {
    setReqBtnLoader(id);
    const endpoints =
      type === 'accept'
        ? `${BaseSetting.endpoints.requestToJoin}?party_id=${id}`
        : `${BaseSetting.endpoints.cancelPartyRequest}?party_id=${id}&user_id=${hostId}`;
    try {
      const response = await getApiData(endpoints, 'GET');
      if (response?.status) {
        // refresh data
        const fIndex = findIndex(Parties.data, (item) => item.id === id);
        if (fIndex > -1) {
          const arr = { ...Parties };
          if (type === 'accept') {
            arr.data[fIndex].is_already_requested = 1;
          } else {
            arr.data[fIndex].is_already_requested = 0;
          }
          setParties(arr);
        }
        // Toast.show(response?.message);
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀! ',
          text2: response?.message,
        });
      } else {
        // Toast.show(response?.message);
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });
      }
      setReqBtnLoader('');
    } catch (error) {
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
      setReqBtnLoader('');
    }
  }

  // handle cancel api call
  const handleCancel = async (userId, type) => {
    setButtonLoader(true);
    const params = `?party_id=${selectedPartyId}&user_id=${userId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancelPartyRequest}${params}`,
        'GET',
        {},
      );
      if (response.status) {
        // Toast.show(response?.message);
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀! ',
          text2: response?.message,
        });
        setButtonLoader(false);
        if (type === 'invited-Friend-list') {
          setListLoader(true);
          setTimeout(() => {
            getJoinedList(selectedPartyId);
          }, 2000);
        } else if (type === 'invite-friends') {
          // this code find index and update key data to perticular index from list array
          const fIndex = findIndex(
            invitedFrndList,
            (item) => item.id === userId,
          );

          if (fIndex > -1) {
            const arr = [...invitedFrndList];
            arr[fIndex].is_invited_by_me = 0;
            setInvitedFrndList(arr);
          }
        }
      } else {
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
    } catch (error) {
      setButtonLoader(false);

      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
    }
  };

  // handle Invite api call
  const handleInvite = async (attendeeId) => {
    setButtonLoader(true);
    const params = `?party_id=${selectedPartyId}&attendee_id=${attendeeId}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.sendPartyInvitation}${params}`,
        'GET',
        {},
      );
      if (response?.status) {
        setButtonLoader(false);
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀! ',
          text2: response?.message,
        });

        // this code find index and update key data to perticular index from list array
        const fIndex = findIndex(
          invitedFrndList,
          (item) => item.id === attendeeId,
        );

        if (fIndex > -1) {
          const arr = [...invitedFrndList];
          arr[fIndex].is_invited_by_me = 1;
          setInvitedFrndList(arr);
        }
      } else {
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message || 'Something went wrong! Please try again',
        });
      }
    } catch (error) {
      setButtonLoader(false);
      // Toast.show(error.toString());
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
    }
  };

  // this function for getJoinedList  list (15 friends)
  async function getJoinedList(id, bool) {
    setListLoader(true);
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
        // Toast.show(response?.message);
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });
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

  // add party ratings api
  const addPartyRating = async () => {
    setBtnRateLoader(true);
    const params = {
      'PartyReview[party_id]': ratePartyId,
      'PartyReview[rating]': partyRating,
    };
    try {
      const response = await getApiDataProgress(
        `${BaseSetting.endpoints.addPartyRatings}`,
        'POST',
        params,
      );
      if (response.status) {
        // refresh data
        MyParties(true);
        setBtnRateLoader(false);
        setReviewModal(false);
        setPartyRating(3); // default value set

        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀!',
          text2: response?.message,
        });
      }
    } catch (error) {
      setBtnRateLoader(false);
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
    }
  };

  // this function for block user
  async function BlockUser() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.BlockUser}?uid2=${defaultITem?.id}`,
        'GET',
      );

      if (response.status === true) {
        setCAlert({});
        // getFriendList(true);
        getInterestList();
        // Toast.show(response?.message);
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀!',
          text2: response?.message,
        });
      } else {
        setCAlert({});
        // Toast.show(response?.message);
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });
      }
      setBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
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
        `${BaseSetting.endpoints.unFriendUser}?uid2=${defaultITem?.id}`,
        'GET',
      );

      if (response.status === true) {
        setCAlert({});
        // getFriendList(true);
        getInterestList();
        // Toast.show(response?.message);
        nToast.show({
          type: 'success', // success / error
          text1: 'Hurrah 😀!',
          text2: response?.message,
        });
      } else {
        setCAlert({});

        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });
      }
      setBtnLoader(false);
    } catch (error) {
      console.log('error ===>>>', error);
      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });

      setBtnLoader(false);
    }
  }

  const scanQrAPI = async (qrCode) => {
    // selectedParty
    const params = `?party_id=${selectedParty?.id}&string=${qrCode}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.scanPartyQR}${params}`,
        'GET',
      );

      if (response.status === true) {
        // Toast.show(response?.message);
        nToast.show({
          type: 'Success', // success / error
          text1: 'Hurrah 😀!',
          text2: response?.message,
        });
        setQRscan(false);
        setTimeout(() => {
          MyParties(true);
        }, 200);
      } else {
        // setQRscan(false);
        // Toast.show(response?.message);
        nToast.show({
          type: 'error', // success / error
          text1: 'Error ! 😔',
          text2: response?.message,
        });
      }
    } catch (error) {
      // setQRscan(false);
      console.log('error ===>>>', error);

      nToast.show({
        type: 'error', // success / error
        text1: 'Error ! 😔',
        text2: error.toString(),
      });
    }
  };

  function onRefresh(type) {
    setRefreshLoader(true);
    setListLoader(true);
    setTimeout(() => {
      if (type === 'invited-Friend-list') {
        getJoinedList(selectedPartyId, true);
      } else if (type === 'invite-friends') {
        setListLoader(true);
        getinvitedFrndList(selectedPartyId, true);
      }
    }, 2000);
  }

  function stopLoader() {
    setPageLoader(false);
    setRefreshLoader(false);
    setMoreLoad(false);
    setPageLoader(false);
    setListLoader(false);
    setPartiesListLoad(false);
    setMoreLoadParty(false);
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
    if (listdata.pagination.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      if (type === 'invite-friends') {
        setListLoader(true);
        getinvitedFrndList(selectedPartyId, true);
      } else if (type === 'invited-Friend-list') {
        getJoinedList(selectedPartyId, true);
      }
    }
  }

  async function getMorePartyData() {
    const cPage =
      Parties && Parties.pagination && Parties.pagination.currentPage
        ? toNumber(Parties.pagination.currentPage)
        : 0;
    const tPage =
      Parties && Parties.pagination && Parties.pagination.totalPage
        ? toNumber(Parties.pagination.totalPage)
        : 0;
    if (Parties.pagination.isMore === true && cPage < tPage) {
      setMoreLoadParty(true);
      MyParties(false);
    }
  }

  // this function for unfriend user
  function handleUnfriendUser(item) {
    setShowPopover(false);
    setTimeout(
      () => {
        setCAlert({
          vis: true,
          type: 'Unfriend',
          message: `Are you sure, you want to unfriend ${item.name}?`,
        });
      },
      IOS ? 1000 : 200,
    );
  }

  // this function for block user
  function handleblockUser(item) {
    setShowPopover(false);
    setTimeout(
      () => {
        setCAlert({
          vis: true,
          type: 'Block',
          message: `Are you sure you want to block ${item.name}?`,
        });
      },
      IOS ? 1000 : 200,
    );
  }

  const renderMyInterests = () => {
    return !_.isEmpty(myInterest) && _.isArray(myInterest) ? (
      <View style={styles.firstView}>
        <View style={styles.IconrowView}>
          <Text style={styles.nameTxt} numberOfLines={1}>
            My Interest
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.push('AddIntrest', {
                from: 'profile',
                data: data?.interest,
              });
            }}>
            <SIcon
              style={styles.menuIcon}
              name="pencil"
              size={15}
              color={BaseColors.lightBlack}
            />
          </TouchableOpacity>
        </View>
        {/* {pageLoader ? (
          <View style={styles.loaderView}>
            <ActivityIndicator color={BaseColors.primary} size="large" />
          </View>
        ) : ( */}
        <ScrollView contentContainerStyle={styles.scoll}>
          {myInterest?.map((item, index) => {
            return (
              <TouchableOpacity style={styles.btnTxtView} activeOpacity={0.8}>
                <Text style={styles.btnTxt}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {/* )} */}
      </View>
    ) : null;
  };

  const renderProfileDetails = () => {
    return (
      <View>
        <View style={styles.firstView}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            {imageLoader ? (
              <View style={[styles.profile, { justifyContent: 'center' }]}>
                <ActivityIndicator
                  animating
                  size="large"
                  color={BaseColors.primary}
                />
              </View>
            ) : (
              <View style={styles.profile}>
                <Image
                  source={
                    !_.isEmpty(image)
                      ? { uri: image }
                      : require('@assets/Images/placeholder.png')
                  }
                  resizeMode={'cover'}
                  style={styles.avatarSty}
                />
                {isFromFriends ? null : (
                  <TouchableOpacity
                    onPress={() => refRBSheet.current.open()}
                    style={[
                      styles.camBtnView,
                      {
                        right: -10,
                        bottom: 20,
                      },
                    ]}>
                    <CustomIcon
                      name="camera-o"
                      size={20}
                      color={BaseColors.lightBlack}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={[styles.IconrowView, { paddingBottom: 10 }]}>
            <Text style={styles.nameTxt} numberOfLines={1}>
              {data.first_name} {data.last_name}
            </Text>
            {isFromFriends ? null : (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('Create_Profile', {
                    data: data,
                    from: 'Profile',
                  });
                }}>
                <CustomIcon
                  name="edit"
                  size={15}
                  color={BaseColors.lightBlack}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text
            numberOfLines={2}
            style={[styles.details, { paddingHorizontal: 0 }]}>
            {data.bio_description}
          </Text>
          {data?.is_friend ? (
            <View style={styles.btnView1}>
              <View style={styles.btnOne1}>
                <Button
                  type="outlined"
                  onPress={() => {
                    if (
                      isObject(data?.chat_data) &&
                      !isEmpty(data?.chat_data)
                    ) {
                      const { user_id, chat_data, first_name, photo } = data;
                      const obj = {
                        id: chat_data?.id || '',
                        sender_id: userData?.id,
                        owner_id: userData?.id,
                        receiver_id: user_id,
                        user_id: user_id,
                        conversation_id: chat_data?.token || '',
                        username: first_name,
                        photo,
                      };

                      if (chat_data?.exist) {
                        socketObj?.emit(
                          'userconnect',
                          { userId: userData.id },
                          (v) => {
                            const arrayData = v.getUser;
                            const value = arrayData.find(
                              (i) => i.conv_token == chat_data?.token,
                            );
                            if (!isEmpty(value)) {
                              setShowPopover(false);
                              navigation.navigate('ChatMessage', {
                                userChat: value,
                              });
                            }
                          },
                        );
                      } else {
                        socketObj?.emit('conversation', obj, (v) => {
                          setShowPopover(false);
                          navigation.navigate('ChatMessage', {
                            userChat: v,
                          });
                        });
                      }
                    }
                  }}>
                  {'Message'}
                </Button>
              </View>
              <View
                style={[
                  styles.btnOne1,
                  {
                    marginLeft: 10,
                  },
                ]}>
                <Button
                  type="primary"
                  onPress={() => {
                    setFriendModal(true);
                    ListRef.current.open();
                  }}>
                  {'Friends'}
                </Button>
              </View>
            </View>
          ) : data?.is_already_requested ? (
            <View style={{ flex: 1, marginTop: 10 }}>
              <TouchableOpacity
                activeOpacity={0.6}
                style={{
                  backgroundColor: BaseColors.lightRed,
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 12,
                }}
                onPress={() => {
                  cancelFriendRequist();
                }}>
                {btnLoader ? (
                  <ActivityIndicator
                    color={BaseColors.secondary}
                    size="small"
                    animating
                  />
                ) : (
                  <Text
                    style={{
                      color: BaseColors.primary,
                      fontSize: 16,
                    }}>
                    Cancel Request
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : data.is_already_requested === false ? (
            <View style={{ flex: 1, marginTop: 10 }}>
              <Button
                type="primary"
                onPress={() => {
                  sendFriendRequist();
                }}>
                {btnLoader ? (
                  <ActivityIndicator
                    color={BaseColors.white}
                    size="small"
                    animating
                  />
                ) : (
                  'Add Friend'
                )}
              </Button>
            </View>
          ) : null}
        </View>
        {!isFromFriends && (
          <View style={[styles.firstView, { paddingHorizontal: 0 }]}>
            <View style={styles.storyTitleSection}>
              <Text style={styles.storyTitle} numberOfLines={1}>
                Stories
              </Text>

              {/* {device && (
                  <Camera
                  cameraPermission
                    device={device}
                    isActive={true}
                    useCameraDevices
                    style={{position:"absolute"}}
                  />
                )} */}
              {storyLoader ? (
                <ActivityIndicator
                  style={{ zIndex: 1111 }}
                  color={BaseColors.primary}
                  size="small"
                />
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    // refRBSheet.current.open();
                    setCameraView(true);
                    setopenIcons(true);
                    setUploadType('story');
                  }}>
                  <IIcon name="add-circle" style={styles.addIconStyle} />
                </TouchableOpacity>
              )}
            </View>
            {isArray(storyList) && storyList.length > 0 ? (
              <View style={{}}>
                <Stories
                  data={storyList}
                  userId={userData.id}
                  loader={storyLoader}
                  navigation={navigation}
                  openCamera={() => {
                    setCameraView(true);
                    setopenIcons(true);
                    setUploadType('story');
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 10,
                }}>
                {isArray(storyList) && storyList.length === 0 && storyLoader ? (
                  <ActivityIndicator color={BaseColors.primary} size="small" />
                ) : (
                  <Text style={{ fontSize: 16 }}>
                    No Stories from your friends
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
        <View style={styles.firstView}>
          {isFromFriends ? null : (
            <View style={styles.secRowView}>
              <FIcon
                style={styles.addIcon}
                name="smartphone"
                size={20}
                color={BaseColors.primary}
              />
              <Text numberOfLines={1} style={styles.details}>
                {data.phone}
              </Text>
            </View>
          )}
          {isFromFriends && data.is_friend === false ? (
            <View style={{ height: '100%', alignItems: 'center' }}>
              <Text bold> You are not friend with this user</Text>
            </View>
          ) : (
            <>
              <View style={styles.secRowView}>
                <CustomIcon
                  name="gender"
                  size={20}
                  color={BaseColors.primary}
                />
                <View style={{}}>
                  <Text numberOfLines={1} style={styles.details}>
                    {data.gender}
                  </Text>
                </View>
              </View>
              <View style={styles.secRowView}>
                <CustomIcon
                  name="calender-active"
                  size={20}
                  color={BaseColors.primary}
                />
                <View style={{}}>
                  <Text numberOfLines={1} style={styles.details}>
                    {data.birth_date}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    );
  };

  // this modal will be used in future after discussion with client
  const renderPaymentModal = () => {
    return paymentModal ? (
      <MidModal
        coin={`$${selectedParty?.price || 0}`}
        title={'Pay Now and Join the Event'}
        description={
          'you can pay via credit/debit card and also via apple pay and paypal'
        }
        btnTxt={'Pay Now'}
        image={Images.payImg}
        btnYPress={() => {
          navigation.navigate('PaymentMethod', {
            partyData: {
              party_id: selectedParty?.id,
              title: selectedParty?.title || '',
              price: selectedParty?.price || 0,
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

  function renderPartiesCard({ item, index }) {
    return (
      <View
        style={{
          padding: 5,
        }}>
        <PartyCard
          item={item}
          from={isFromFriends}
          selected={selected}
          reqBtnLoader={reqBtnLoader}
          handleOptions={(it) => {
            setReviewModal(true);
            setRatePartyId(it.id);
          }}
          renderPayment={(selectedPArty) => {
            setSelectedParty(selectedPArty);
            setPaymentModal(true);
          }}
          handlePartyClick={() => {
            navigation.navigate('Events', {
              data: item,
              fromProfile: true,
              isFromFriends: isFromFriends,
              selected: selected,
            });
          }}
          handleQR={(selectedPArty) => {
            setSelectedParty(selectedPArty);
            if (selected === 'Current' || selected === 'Joined') {
              setTimeout(() => {
                setQRDetails(true);
              }, 500);
            } else {
              setQRscan(true);
            }
          }}
          handleInviteFriends={() => {
            setSelectedPartyId(item.id);
            setListLoader(true);
            getinvitedFrndList(item.id);
            refInviteFriend.current.open();
          }}
          handleInterestClick={() => {
            console.log('handleInterestClick ======>>>> ');
          }}
          handleFriendsList={(e) => {
            setSelectedPartyId(e.id);
            getJoinedList(e.id);
            refJouinedSheet.current.open();
          }}
          handleSendRequast={(id, hostId, type) => {
            if (type === 'accept') {
              requestToJoinParty(id, hostId, 'accept');
            } else {
              requestToJoinParty(id, hostId, 'cancel');
            }
          }}
          handleEditParty={() => {
            navigation.navigate('CreateParty', { data: item, isEdit: true });
          }}
          reloadPage={() => {
            MyParties(true);
          }}
        />
      </View>
    );
  }

  const renderFriendsList = () => {
    return isFromFriends && data.is_friend === false ? null : (
      <View style={styles.slideContainer}>
        <View style={styles.slideTitleContainer}>
          <Text style={styles.nameTxt}>Friends</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setFriendModal(true);
                ListRef.current.open();
              }}
              style={{ marginLeft: 10 }}>
              {/* {!isEmpty(data?.friends) ? ( */}
              <Text
                style={[styles.headingTxt, { color: BaseColors.lightGrey }]}>
                See All
              </Text>
              {/* ) : null} */}
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
            paddingHorizontal: 10,
            alignItems: 'center',
          }}>
          {isArray(data?.friends) && !isEmpty(data?.friends) ? (
            data?.friends.map((item, index) => {
              const arr = item.name.split(' ');
              const isMe = Number(userData?.id) === Number(item?.id);
              return (
                <>
                  <Popover
                    popoverStyle={{
                      borderRadius: 8,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                    }}
                    offset={xyPoint?.pageY > nWidth ? 20 : -20}
                    placement={xyPoint?.pageY > nWidth ? 'top' : 'bottom'}
                    isVisible={item.id === defaultITem.id ? showPopover : false}
                    onRequestClose={() => setShowPopover(false)}
                    from={
                      <TouchableOpacity
                        activeOpacity={isMe || isFromFriends ? 1 : 0.7}
                        onPress={(v) => {
                          if (isFromFriends) {
                            setShowPopover(false);
                            if (bool && !isMe) {
                              setBool(false);
                              navigation.push('Profile', {
                                from: 'friends',
                                id: item?.id,
                              });
                              // setBool(true);
                            }
                          } else if (!isMe) {
                            setXYPoint(v?.nativeEvent);
                            setDefaultItem(item);
                            setTimeout(() => {
                              setShowPopover(true);
                            }, 200);
                          }
                        }}
                        key={`friends_${index}`}
                        style={{
                          marginHorizontal: 10,
                          alignItems: 'center',
                        }}>
                        <Image
                          source={
                            !isEmpty(item?.photo)
                              ? { uri: item?.photo }
                              : require('@assets/Images/placeholder.png')
                          }
                          style={styles.profileImg}
                        />
                        <Text style={styles.frindesName}>{arr[0]}</Text>
                      </TouchableOpacity>
                    }>
                    <View style={{}}>
                      <TouchableOpacity
                        onPress={() => {
                          if (
                            isObject(item?.chat_data) &&
                            !isEmpty(item?.chat_data)
                          ) {
                            const { id, chat_data, name, photo } = item;
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

                            if (chat_data?.exist) {
                              socketObj?.emit(
                                'userconnect',
                                { userId: userData.id },
                                (v) => {
                                  const arrayData = v.getUser;
                                  const value = arrayData.find(
                                    (i) => i.conv_token == chat_data?.token,
                                  );
                                  if (!isEmpty(value)) {
                                    setShowPopover(false);
                                    navigation.navigate('ChatMessage', {
                                      userChat: value,
                                    });
                                  }
                                },
                              );
                            } else {
                              socketObj?.emit('conversation', obj, (v) => {
                                setShowPopover(false);
                                navigation.navigate('ChatMessage', {
                                  userChat: v,
                                });
                              });
                            }
                          }
                        }}>
                        <View style={styles.modalRowView}>
                          <Text style={styles.modelTxt}>Message</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowPopover(false);
                          navigation.push('Profile', {
                            from: 'friends',
                            id: item?.id,
                          });
                        }}>
                        <View style={styles.modalRowView}>
                          <Text style={styles.modelTxt}>View Profile</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowPopover(false);
                          if (item?.is_friend === true) {
                            handleUnfriendUser(item);
                          } else if (item?.is_already_requested === true) {
                            setShowPopover(false);
                            cancelFriendRequist();
                          } else {
                            setShowPopover(false);
                            sendFriendRequist();
                          }
                        }}>
                        <View style={styles.modalRowView}>
                          <Text style={styles.modelTxt}>Unfriend</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleblockUser(item)}>
                        <View style={styles.modalRowView}>
                          <Text style={styles.modelTxt}>Block</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </Popover>
                </>
              );
            })
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: 20,
              }}>
              <Text style={{ fontSize: 16 }}>No friends</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderParties = () => {
    return (
      <View>
        <View style={styles.rowView}>
          <Text style={styles.nameTxt} numberOfLines={1}>
            {isFromFriends ? 'Parties' : 'My Parties'}
          </Text>
        </View>
        <View style={styles.tabContainer}>
          {PartiesTabs?.map((item, index) => {
            return index === 0 &&
              isFromFriends &&
              data.is_friend === false ? null : (
              <TouchableOpacity
                key={`parties_tab_${item.id}`}
                style={[
                  styles.btnTxtView,
                  {
                    flex: 1,
                    backgroundColor:
                      selected === item.name
                        ? BaseColors.lightRed
                        : BaseColors.white,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelected(item.name);
                }}>
                <Text style={[styles.btnTxt]}>{item?.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {partiesListLoad ? (
          <View style={styles.loaderView}>
            <ActivityIndicator
              style={{ marginBottom: 30 }}
              color={BaseColors.primary}
              size="large"
            />
          </View>
        ) : (
          <View style={{ paddingBottom: isFromFriends ? 0 : 80 }}>
            {isFromFriends && data.is_friend === false ? (
              !isEmpty(Parties) ? (
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}>
                  {Parties?.map((it, ii) => {
                    return (
                      <View
                        style={{
                          width: Dimensions.get('window').width - 30,
                          paddingHorizontal: 5,
                        }}>
                        <DiscoverCardList
                          item={it}
                          allparties
                          userName={it?.host.name}
                          host="Host"
                          hostPhoto={it?.host.photo}
                          event={it?.title}
                          date={`${it?.at_date} - ${it?.from_time}`}
                          peoples={it?.joining_user_count}
                          distance={Math.round(Number(it?.distance))}
                          joiningUsers={it?.joining_user}
                          partyImage={it?.party_image}
                          ratings={it.rating_count}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              ) : (
                <View
                  style={{
                    height: 300,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/* <Text bold style={{ fontSize: 14 }}>
                    No Parties Available
                  </Text> */}
                  <CNoData
                    titleText="Oops 😥"
                    descriptionText="Parties not found"
                  />
                </View>
              )
            ) : (
              <FlatList
                data={Parties?.data}
                style={{
                  flexGrow: 1,
                }}
                renderItem={renderPartiesCard}
                onEndReached={() => {
                  getMorePartyData();
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooterComponentLoader}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        height: 300,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <Text bold style={{ fontSize: 14 }}>
                        No Parties Available
                      </Text> */}
                      <CNoData
                        titleText="Whoops! 😥"
                        descriptionText="Parties not found"
                      />
                    </View>
                  );
                }}
                onScroll={(e) => {
                  scrollY.setValue(e.nativeEvent.contentOffset.y);
                  console.log(e.nativeEvent.contentOffset.y);
                }}
              />
            )}
          </View>
        )}
      </View>
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

  // render modal list
  const renderModalList = (listData, listRef, btnTitle, type) => {
    return (
      <ListModal
        ListArray={listData}
        pageLoad={listLoader}
        btnTitle={btnTitle}
        itemBtn={type}
        buttonloader={buttonloader}
        handleMainBtn={() => {
          listRef.current.close();
          setFriendModal(false);
        }}
        handleCancel={(item) => {
          handleCancel(item.id, type);
        }}
        handleInvite={(item) => {
          handleInvite(item.id);
        }}
        handleProfileClick={(item) => {
          listRef?.current?.close();
          setFriendModal(false);
          navigation.push('Profile', {
            from: 'friends',
            id: item?.id,
          });
        }}
        renderFooterComponent={() => renderFooterComponent(listData)}
        refreshLoader={refreshLoader}
        onRefresh={() => {
          onRefresh(type);
        }}
        onEndReached={() => {
          getMoreData(listData, type);
        }}
      />
    );
  };

  // ratings modal
  const renderReviewModal = () => {
    return reviewModal ? (
      <MidModal
        title={'Rate the Party'}
        description={'How would you rate this party?'}
        btnTxt={'Done'}
        secondBtnText={'Skip'}
        ratings={partyRating}
        btnLoader={btnRateLoader}
        partyRated={(rating) => {
          setPartyRating(rating);
        }}
        btnYPress={() => {
          // navigation.navigate('PaymentMethod');
          addPartyRating();
        }}
        btnNPress={() => {
          setReviewModal(false);
        }}
      />
    ) : null;
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
              marginTop: IOS ? 45 : 20,
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
                  paddingTop: 100,
                }}>
                <Text
                  numberOfLines={1}
                  bold
                  color="white"
                  style={{
                    fontSize: 20,
                  }}>
                  {selectedParty.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setQRDetails(false);
                  setTimeout(() => {
                    MyParties(true);
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
                  !_.isEmpty(selectedParty?.party_images[0]?.image_url)
                    ? { uri: selectedParty?.party_images[0]?.image_url }
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
                  source={{ uri: selectedParty?.host?.photo }}
                  style={styles.profileImg}
                />

                <View
                  style={{
                    marginLeft: 10,
                    justifyContent: 'center',
                  }}>
                  <Text numberOfLines={1} style={styles.userName}>
                    {selectedParty?.host.name}
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
                    !_.isEmpty(selectedParty?.qr_code)
                      ? { uri: selectedParty?.qr_code }
                      : ''
                  }
                  style={{
                    resizeMode: 'contain',
                    alignSelf: 'center',
                    width: '100%',
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
            paddingTop: IOS ? 100 : 0,
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

  navigation.setOptions({ tabBarVisible: !cameraView });
  return (
    <>
      {device && cameraView ? (
        <>
          <Camera
            photo={true}
            cameraPermission
            device={device}
            ref={cameraRef}
            isActive={true}
            enableZoomGesture={false}
            enableAutoStabilization
            useCameraDevices
            style={[StyleSheet.absoluteFill, { zIndex: 11111 }]}
            onError={(error) => console.log('error =====', error)}
          />
          {openIcons && (
            <>
              <View
                style={{
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  top: 50,
                  zIndex: 11111,
                  left: 10,
                }}>
                <TouchableOpacity onPress={() => setCameraView(false)}>
                  <IIcon name="arrow-back" size={40} color={BaseColors.white} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  left: 0,
                  right: 0,
                  position: 'absolute',
                  zIndex: 11111,
                  bottom: 40,
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#FF7F6A',
                    borderColor: 'white',
                    borderWidth: 4,
                    width: 75,
                    height: 75,
                    borderRadius: 50,
                  }}
                  onPress={async () => {
                    try {
                      console.log('camera ref ====', cameraRef);
                      // const photo = await cameraRef?.current?.takeSnapshot({
                      //   quality: 85,
                      //   skipMetadata: true,
                      // });
                      // const photo = await cameraRef.current.takePhoto({
                      //   flash: 'on',
                      // });
                      if (
                        cameraRef &&
                        cameraRef?.current &&
                        cameraRef?.current?.takePhoto
                      ) {
                        const photo = await cameraRef?.current?.takePhoto({
                          // qualityPrioritization: 'quality',
                          flash: 'off',
                          enableAutoRedEyeReduction: true,
                        });
                        console.log('clicked photo ====', photo);
                        const imgFile = {
                          uri: photo?.path,
                          name: photo?.path.substr(
                            photo?.path.lastIndexOf('/') + 1,
                          ),
                          type: photo.mime,
                        };
                        setCaptureImg(imgFile);
                        setCaptureImgSize(photo.size || 30);
                        // uploadStory(imgFile);
                      }
                    } catch (e) {
                      console.log('camera error ====', e);
                      if (e instanceof CameraCaptureError) {
                        switch (e.code) {
                          case 'capture/file-io-error':
                            console.error('Failed to write photo to disk!');
                            break;
                          default:
                            console.error(e);
                            break;
                        }
                      }
                    }
                    // uploadStory(imgFile);
                  }}>
                  <Text style={{ color: '#FF7F6A' }}>.</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: 'white',
                  position: 'absolute',
                  zIndex: 11111,
                  padding: 8,
                  left: 30,
                  bottom: 50,
                  borderRadius: 10,
                }}>
                <TouchableOpacity onPress={() => openGallery('story')}>
                  <CamIcon
                    style={styles.addIcon}
                    name="photograph"
                    size={30}
                    color={'#FF7F6A'}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <Animated.View
          style={{
            transform: [{ translateY: translateY }],
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 11,
          }}>
          <Header
            title={
              isFromFriends
                ? `${data?.first_name || ''} ${data?.last_name || ''}`
                : `${
                    data?.gender === 'Male'
                      ? 'Profile 👨'
                      : data?.gender === 'Female'
                      ? 'Profile 👩'
                      : data?.gender === 'Other'
                      ? 'Profile  ⚧️ '
                      : 'Profile'
                  }`
            }
            leftIcon={isFromFriends ? true : false}
            rightIcon={isFromFriends ? false : true}
            antIcon
            rightIconName="setting"
            leftIconName={isFromFriends ? 'arrowleft' : ''}
            onBackPress={isFromFriends ? () => navigation.goBack() : null}
            onRightAction={() => {
              navigation.navigate('Settings', {
                data: data,
              });
            }}
            onTitlePress={() => {
              console.log('hello');
            }}
          />
        </Animated.View>
      )}
      {pageLoader ? (
        <View style={{ flexGrow: 1 }}>
          <ProfileContentLoader />
        </View>
      ) : qrScan ? (
        renderQrScanner()
      ) : (
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={(e) => {
            scrollY.setValue(e.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          <View style={[styles.container]}>
            {renderProfileDetails()}
            {renderMyInterests()}
            {renderFriendsList()}
            <View
              style={[
                styles.bottomView,
                { paddingBottom: isFromFriends ? 0 : 20 },
              ]}>
              {isFromFriends && data.is_friend === false
                ? null
                : renderParties()}
            </View>
          </View>
        </ScrollView>
      )}
      <SelectPhotoModal
        refRBSheet={refRBSheet}
        title={uploadType === 'story' ? 'Story' : 'Profile'}
        optionsArray={optionsArray}
        handleOpenGallery={() => {
          openGallery();
        }}
        handleOpenCamera={() => {
          openCamera();
        }}
      />
      <FriendListModal
        ListRef={ListRef}
        navigation={navigation}
        handleNavigate={() => {
          ListRef.current.close();
          setFriendModal(false);
        }}
        userId={data?.user_id}
        modalVisible={friendModal}
        isFromFriends={isFromFriends}
      />
      <FormModal
        rbSheetRef={refJouinedSheet}
        title={`${joinFriendsList.length} People Joined`}>
        {renderModalList(
          joinFriendsList,
          refJouinedSheet,
          'Done',
          'invited-Friend-list',
        )}
      </FormModal>

      <FormModal rbSheetRef={refInviteFriend} title={'Invite Friends'}>
        {renderModalList(
          invitedFrndList,
          refInviteFriend,
          'Done',
          'invite-friends',
        )}
      </FormModal>

      {renderReviewModal()}
      {renderQRModal()}
      {renderPaymentModal()}
      {cAlert?.vis ? (
        <AlertModal
          loader={btnLoader}
          title=" "
          visible={cAlert.vis}
          setVisible={() => setCAlert({ vis: '', message: '', type: '' })}
          description={cAlert.message || 'Are you sure you want to block?'}
          btnYTitle={cAlert?.type === 'Unfriend' ? 'Unfriend' : 'Block'}
          btnNTitle="Cancel"
          btnYPress={() => {
            cAlert?.type === 'Unfriend' ? unFriendUser() : BlockUser(); //unFriendUser()
          }}
        />
      ) : null}
      {preview && (
        <ImagePreview
          visible={preview}
          handleModal={() => {
            setPreview(false);
            setCaptureImg({});
            setCaptureImgSize(null);
          }}
          imageData={captureImg}
          uploadStory={(v) => {
            setPreview(false);
            uploadStory(v, captureImgSize);
          }}
        />
      )}
    </>
  );
}
