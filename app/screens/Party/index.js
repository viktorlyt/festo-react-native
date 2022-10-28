/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Linking,
  Alert,
  RefreshControl, ActivityIndicator, Dimensions, Modal, Image,
} from 'react-native';
import {cloneDeep, flattenDeep, isArray, isEmpty, toNumber} from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { DiscoverListLoader } from '@components/ContentLoader';
import { Header, DiscoverCardList, Text } from '@components';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { BaseColors } from '@config/theme';
import socketActions from '@redux/reducers/Socket/actions';
import styles from './styles';
import _ from 'lodash';
import CNoData from '@components/CNoData';
import Toast from 'react-native-simple-toast';
import nToast from 'react-native-toast-message';
import Geolocation from '@react-native-community/geolocation';
import AuthAction from '@redux/reducers/auth/actions';
import { useFocusEffect } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import AnimatedLottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated';
import PartyCard from "../../components/UI/PartyCard";
import MidModal from "../../components/UI/MidModal";
import {Images} from "../../config/images";
import AIcon from "react-native-vector-icons/AntDesign";
import {useCameraDevices} from "react-native-vision-camera";
import FormModal from "../../components/FormModal";
import ListModal from "../../components/ListModal";

/**
 * Module  DiscoverMap
 * @module  Party
 *
 */
export default function Party({ navigation, route }) {
  const { initialize } = socketActions;
  const dispatch = useDispatch();


  const IOS = Platform.OS === 'ios';
  const scrollY = new Animated.Value(0);
  const scrollTill = IOS ? 80 : 100;
  const diffClamp = Animated.diffClamp(scrollY, 0, scrollTill);

  const [moreLoadParty, setMoreLoadParty] = useState(false);
  const [partyData, setPartyData] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [locationinformation, setLocationInfo] = useState({});
  const [selected, setSelected] = useState('Created');
  const [selectedParty, setSelectedParty] = useState({});
  const [paymentModal, setPaymentModal] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [isPartyAvailable, setIsPartyAvailable] = useState([]);
  const { setUserCurrentLocation, setActiveScreen, setBottomTabSwipe } =
    AuthAction;
  const bottomTabSwipe = useSelector((state) => state.auth.bottomTabSwipe);
  const lottieViewRef2 = useRef(null);
  const [filter, setFilter] = useState(375);
  const [qrdetails, setQRDetails] = useState(false);
  const [qrScan, setQRscan] = useState(false);
  const [reqBtnLoader, setReqBtnLoader] = useState('');
  const [selectedPartyId, setSelectedPartyId] = useState(0);
  const [listLoader, setListLoader] = useState(true);
  const [joinFriendsList, setJoinFriendsList] = useState([]);
  const refJouinedSheet = useRef(null);
  const [friendModal, setFriendModal] = useState(false);
  const [buttonloader, setButtonLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);
  const [invitedFrndList, setInvitedFrndList] = useState([]);

  const optionsArray = [
    {
      id: 1,
      optionLabel: 10,
      handleClick: () => {
        setFilter(10);
      },
      iconName: '',
    },
    {
      id: 2,
      optionLabel: 50,
      handleClick: () => {
        setFilter(50);
      },
      iconName: '',
    },
    {
      id: 3,
      optionLabel: 100,
      handleClick: () => {
        setFilter(100);
      },
      iconName: '',
    },
    {
      id: 4,
      optionLabel: 250,
      handleClick: () => {
        setFilter(250);
      },
      iconName: '',
    },
    {
      id: 5,
      optionLabel: 5000,
      handleClick: () => {
        setFilter(5000);
      },
      iconName: '',
    },
  ];
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const isFocused = navigation.isFocused();
      if (isFocused && bottomTabSwipe === false) {
        dispatch(setBottomTabSwipe(true));
      }
      console.log('Discover List Screen Focused ==> ', isFocused);
    });
    return unsubscribe;
  }, [navigation, bottomTabSwipe]);

  // useEffect(() => {
  //   if (!pageLoader) {
  //     setTimeout(() => {
  //       setConfetti(true);
  //     }, 3000);
  //   }
  // }, [pageLoader]);

  useEffect(() => {
    dispatch(initialize());
    getCurrentLocationData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getPartyList();
      dispatch(setActiveScreen('party'));
    }, [locationinformation, filter]),
  );

  // this function for get party list
  async function getPartyList(type = '') {
    setPageLoader(true);
    const params = `?PartyDiscover[lat]=${
      locationinformation.lat ? locationinformation.lat : 22.6916
    }&PartyDiscover[long]=${
      locationinformation.long ? locationinformation.long : 72.8634
    }&PartyDiscover[is_map]=${0}&PartyDiscover[distance_km]=${filter}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.listParty}${params}`,
        'GET',
        {},
      );

      if (response?.status) {
        if (isArray(response?.data?.rows) && response?.data?.rows?.length > 0) {
          setPartyData(response?.data?.rows ?? {});

          // this code for handle to show No Data component by checking all parties array
          let parties = [];
          response.data.map((item) => {
            if (isArray(item.parties) && item.parties.length === 0) {
              parties.push(0);
            } else {
              parties.push(1);
            }
          });
          setIsPartyAvailable(parties);
        }
        setPageLoader(false);
        setRefreshLoader(false);

        if (type === 'reload') {
          setConfetti(true);
          lottieViewRef2.current.play();
        }
      } else {
        setPageLoader(false);
        setRefreshLoader(false);
      }
    } catch (error) {
      setPageLoader(false);
      setRefreshLoader(false);
      console.log('error1 ===>>>', error);
    }
  }

  const getCurrentLocationData = async () => {
    // console.log('get current location data');
    if (Platform.OS === 'ios') {
      Geolocation?.getCurrentPosition(
        (info) => {
          setCurrentLocation(info);
        },
        (error) => {
          setTimeout(() => {
            try {
              Alert.alert(
                'Oops!',
                'We need to location to give you results.',
                // 'DiscreetLobby need to your location for matching cards',
                [
                  {
                    text: 'Close',
                    onPress: () => {},
                  },
                  {
                    text: 'Settings',
                    onPress: () => {
                      Linking.openURL('app-settings:0');
                    },
                  },
                ],
              );
            } catch (cerr) {}
          }, 1000);
        },
        { enableHighAccuracy: false, timeout: 100000, maximumAge: 10000 },
      );
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message:
              'Festo needs your location to serve you up the best parties near you.',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Android permission granted!');
          Geolocation.getCurrentPosition(
            (info) => {
              console.log('get current position info ===> ', info);
              setCurrentLocation(info);
            },
            (err) => {
              // console.log(`ERROR(${err.code}): ${err.message}`);
              // Toast.show(`${err.message}`);
              nToast.show({
                type: 'error', // success / error
                text1: 'Error!',
                text2: err.message,
              });
            },
          );
        }
      } catch (err) {
        // Toast.show(`Something went wrong ${err}`);
        nToast.show({
          type: 'error', // success / error
          text1: 'Something went wrong',
          text2: err,
        });
      }
    }
  };

  const setCurrentLocation = async (data) => {
    const cLat =
      data && data.coords && data.coords.latitude
        ? data.coords.latitude
        : 22.6916; //37.78825
    const cLong =
      data && data.coords && data.coords.longitude
        ? data.coords.longitude
        : 72.8634; //-122.4324

    const api = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${cLat},${cLong}&key=${BaseSetting?.MAPS_API_CALL_KEY}`;
    fetch(api)
      .then((response) => response.json())
      .then((resposeJson) => {
        if (resposeJson && resposeJson.status === 'OK') {
          if (
            _.isArray(resposeJson.results) &&
            !_.isEmpty(resposeJson.results)
          ) {
            const lName = resposeJson.results[0].formatted_address;
            const value = lName.split(',');

            const count = value.length;
            const country = value[count - 1];
            const state = value[count - 2];
            const city = value[count - 3];

            const lg = {
              country: country,
              state: state,
              city: city.trim(),
              long: cLong,
              lat: cLat,
            };
            setLocationInfo(lg);
            dispatch(setUserCurrentLocation(lg));
          }
        } else {
          // Toast.show('Location Not Found!');
          nToast.show({
            type: 'error', // success / error
            text1: 'Whoops !',
            text2: 'Location Not Found!',
          });

          // default location
          const lg = {
            city: 'Mountain View',
            country: ' USA',
            lat: 22.6916,
            long: 72.8634,
            state: ' CA 94043',
          };
          dispatch(setUserCurrentLocation(lg));
        }
      })
      .catch((err) => {
        // Toast.show(`Something went wrong ${err}`);
        nToast.show({
          type: 'error', // success / error
          text1: 'Something went wrong ',
          text2: err,
        });
      });
  };

  function onRefresh() {
    setRefreshLoader(true);

    setTimeout(() => {
      getPartyList('reload');
    }, 1000);
  }

  const renderNoData = () => {
    return <CNoData titleText="Oops 😥" descriptionText="Parties not found" />;
  };

  const renderDiscoverMapListITem = ({ item, index }) => {
    return !_.isEmpty(item.parties) && _.isArray(item.parties) ? (
      <>
        <View
          style={
            {
              // marginTop: 120,
            }
          }>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}>
            <Text bold>{item.interest_name}</Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                console.log('see all ');
                navigation.navigate('DiscoverList', {
                  data: item,
                });
              }}>
              <Text color={'primary'}>{'See All'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal={false} showsHorizontalScrollIndicator={false}>
            {item.parties.slice(0, 5).map((it, ii) => {
              return (
                <Animatable.View animation="fadeInLeft" style={{ flex: 1 }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={{
                      paddingEnd: 10,
                      paddingStart: ii === 0 ? 10 : 0,
                    }}
                    onPress={() => {
                      navigation.navigate('Events', {
                        data: it,
                        fromDiscover: true,
                      });
                    }}>
                    <DiscoverCardList
                      // allparties
                      isPaid={true}
                      userName={it.host.name}
                      host="Host"
                      hostPhoto={it.host.photo}
                      event={it.title}
                      date={`${it.at_date} - ${it.from_time}`}
                      peoples={it.joining_user_count}
                      distance={Math.round(Number(it.distance))}
                      joiningUsers={it.joining_user}
                      partyImage={
                        !_.isUndefined(it.party_images[0]) &&
                        it.party_images[0].image_url
                      }
                      is_free={it?.is_free}
                    />
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </ScrollView>
        </View>
      </>
    ) : null;
  };

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
    } else if (isEmpty(partyData)) {
      return null;
    } else {
      return null;
    }
  }

  function stopLoader() {
    setPageLoader(false);
    setRefreshLoader(false);
    setPageLoader(false);
    setListLoader(false);
    setMoreLoadParty(false);
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
  }function renderFooterComponent(listdata) {
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

  function renderPartiesCard({ item, index }) {
    return (
      <View
        style={{
          padding: 5,
        }}>
        <PartyCard
          homePage={true}
          item={{...item, show_pay_btn: (item.is_free) ? 0 : 1}}
          selected={selected}
          reqBtnLoader={reqBtnLoader}
          // handleOptions={(it) => {
          //   setReviewModal(true);
          //   setRatePartyId(it.id);
          // }}
          renderPayment={(selectedPArty) => {
            setSelectedParty(selectedPArty);
            setPaymentModal(true);
          }}
          handlePartyClick={() => {
            navigation.navigate('Events', {
              data: item,
              fromProfile: true,
              // isFromFriends: isFromFriends,
              selected: selected,
            });
          }}

          handleEditParty={() => {
            navigation.navigate('CreateParty', { data: item, isEdit: true });
          }}

          handleQR={(selectedPArty) => {
            setSelectedParty(selectedPArty);
            setQRDetails(true);
          }}

          reloadPage={() => {
            getPartyList();
          }}

          handleFriendsList={(e) => {
            console.log('eeeeee',e.id)
            setSelectedPartyId(e.id);
            getJoinedList(e.id);
            refJouinedSheet.current.open();
          }}

        />
      </View>
    );
  }

  async function getMorePartyData() {
    const cPage =
      partyData && partyData.pagination && partyData.pagination.currentPage
        ? toNumber(partyData.pagination.currentPage)
        : 0;
    const tPage =
      partyData && partyData.pagination && partyData.pagination.totalPage
        ? toNumber(partyData.pagination.totalPage)
        : 0;
    if (partyData.pagination.isMore === true && cPage < tPage) {
      setMoreLoadParty(true);
      getPartyList();
    }
  }

  const RenderParties = () => {
    return (
      <View>
        <View>
          {(
            !isEmpty(partyData) ? (
              <ScrollView
                showsHorizontalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshLoader}
                    onRefresh={() => onRefresh()}
                  />
                }
              >
                <FlatList
                  data={partyData}
                  style={{
                    flexGrow: 1,
                    marginBottom: 150
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
                  // onScroll={(e) => {
                  //   scrollY.setValue(e.nativeEvent.contentOffset.y);
                  //   console.log(e.nativeEvent.contentOffset.y);
                  // }}
                />
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

  const RenderQRModal = () => (
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
  );

  return (
    <>
      <Header
        title="Discover"
        rightIcon
        rightIconName="search"
        displayOptions
        optionsArray={optionsArray}
        filterIcon
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

      {pageLoader ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BaseColors.white,
          }}>
          <DiscoverListLoader style={{ flex: 1 }} />
          <DiscoverListLoader style={{ flex: 1 }} />
        </View>
      ) : partyData.length ? (

          <View style={[styles.container]}>
            <View>
              <RenderParties />
            </View>
          </View>
      ) : (
        renderNoData()
      )}
      {confetti && (
        <AnimatedLottieView
          ref={lottieViewRef2}
          autoPlay={false}
          loop={false}
          onAnimationFinish={() => setConfetti(false)}
          autoSize
          style={{
            width: '100%',
            height: '100%',
            zIndex: 11,
            alignSelf: 'center',
            position: 'absolute',
            top: -25,
            bottom: 0,
          }}
          speed={1.5}
          source={require('../../assets/lottieFiles/confet.json')}
        />
      )}
      {qrdetails && <RenderQRModal/>}
      {renderPaymentModal()}
      <FormModal
        rbSheetRef={refJouinedSheet}
        title={`${joinFriendsList?.length} People Joined`}>
        {renderModalList(
          joinFriendsList,
          refJouinedSheet,
          'Done',
          'invited-Friend-list',
        )}
      </FormModal>
    </>
  );
}
