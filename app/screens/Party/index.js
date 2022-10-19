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
  RefreshControl,
} from 'react-native';
import { isArray } from 'lodash';
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

/**
 * Module  DiscoverMap
 * @module  Party
 *
 */
export default function Party({ navigation, route }) {
  const { initialize } = socketActions;
  const dispatch = useDispatch();
  const [partyData, setPartyData] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [locationinformation, setLocationInfo] = useState({});
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [isPartyAvailable, setIsPartyAvailable] = useState([]);
  const { setUserCurrentLocation, setActiveScreen, setBottomTabSwipe } =
    AuthAction;
  const bottomTabSwipe = useSelector((state) => state.auth.bottomTabSwipe);
  const lottieViewRef2 = useRef(null);
  const [filter, setFilter] = useState(375);
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

      console.log(response)

      if (response?.status) {
        if (isArray(response.data) && response.data.length > 0) {
          setPartyData(response.data);

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

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
      ) : isPartyAvailable.includes(1) ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={partyData}
          contentContainerStyle={[styles.container]}
          renderItem={renderDiscoverMapListITem}
          ListEmptyComponent={renderNoData}
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
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              colors={[BaseColors.primary]}
              tintColor={BaseColors.primary}
              refreshing={refreshLoader}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }>
          {renderNoData()}
        </ScrollView>
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
    </>
  );
}
