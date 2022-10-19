/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import styles from './styles';
import * as Animatable from 'react-native-animatable';
import FIcon from 'react-native-vector-icons/Feather';
import { TextInput, CHeader, Text, DiscoverCardList } from '@components';
import Carousel from 'react-native-snap-carousel';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import BaseSetting from '@config/setting';
import _, { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator } from 'react-native-paper';
import MIcon from 'react-native-vector-icons/Ionicons';
import authActions from '@redux/reducers/auth/actions';
import { ListContentLoader } from '@components/ContentLoader';
import { Images } from '@config/images';
import AIcon from 'react-native-vector-icons/AntDesign';
import CNoData from '@components/CNoData';
import { useFocusEffect } from '@react-navigation/native';
/**
 * Module   Search
 * @module   Search
 *
 */

export default function NewSearch({ navigation, route }) {
  const IOS = Platform.OS === 'ios';
  const dispatch = useDispatch();
  const { setActiveScreen } = authActions;
  const [search, setSearch] = useState('');
  const [searchLoader, setSearchLoader] = useState(true);
  // const { userData } = useSelector((state) => state.auth);
  const [defaultItem, setDefaultItem] = useState({});
  const [removeSearchLoader, setRemoveSearchLoader] = useState('');
  const { currentLocation } = useSelector((state) => state.auth);
  const [partyTitleErr, setPartyTitleErr] = useState(false);
  const [partyTitleErrTxt, setPartyTitleErrTxt] = useState('');
  const [isFocused, setIsfocused] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [dummyArr, setDummyArr] = useState([]);
  const seachRef = useRef();

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveScreen('search'));
    }, []),
  );

  useEffect(() => {
    if (isFocused) {
      if (search.length >= 2) {
        searchList(search);
      } else if (search.length === 0) {
        setPartyTitleErr(false);
      } else {
        setPartyTitleErr(true);
        setPartyTitleErrTxt('Please enter min 2 characters to search');
        searchList('');
      }
    } else {
      searchList('');
    }
  }, [search]);

  useEffect(() => {
    seachRef?.current?.blur();
  }, []);

  const stopLoader = () => {
    setSearchLoader(false);
  };

  // search list api call
  const searchList = async (searchText) => {
    // setSearchLoader(true);
    const params = `?lat=${
      currentLocation?.lat ? currentLocation?.lat : 22.700001
    }&long=${
      currentLocation?.long ? currentLocation?.long : 72.870003
    }&search=${searchText}`;

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.searchList}${params}`,
        'GET',
      );
      if (
        _.isObject(response) &&
        !_.isEmpty(response) &&
        response.status === true
      ) {
        setSearchData(response?.data);
        const arr = [...response?.data?.party_details];
        if (arr.length > 0) {
          arr.push({});
        }
        setDummyArr(arr);
      } else {
        Toast.show(response?.message);
      }
      stopLoader();
    } catch (error) {
      setSearch('');
      stopLoader();
      Toast.show(error.toString());
    }
  };

  // search text
  const searchDataApi = async (searchText) => {
    setSearchLoader(true);
    const params = `?search=${searchText}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.search}${params}`,
        'GET',
      );

      if (
        _.isObject(response) &&
        !_.isEmpty(response) &&
        response.status === true
      ) {
        searchList(searchText);
      } else {
        Toast.show(response?.message);
      }
      stopLoader();
    } catch (error) {
      stopLoader();
      Toast.show(error.toString());
    }
  };

  // this function for removing recent search item
  const removeRecentSearch = async (id) => {
    const params = `?id=${id}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.removeSearch}${params}`,
        'GET',
      );

      if (response.status) {
        searchList('');
      } else {
        Toast.show(response?.message);
      }
      setRemoveSearchLoader('');
    } catch (error) {
      Toast.show(error.toString());
      setRemoveSearchLoader('');
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
        searchList('');
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
        searchList('');
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

  // search input container
  //  const isLast

  const renderPartyData = ({ item, index }) => {
    const isLast = index === dummyArr.length - 1;

    return isLast ? null : (
      <View
        style={{
          width: Dimensions.get('window').width - 40,
          alignSelf: 'center',
          paddingTop: 100,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Events', { data: item, fromDiscover: true });
          }}>
          <DiscoverCardList
            allparties
            userName={item?.host?.name}
            host="Host"
            hostPhoto={item?.host?.photo}
            event={item?.title}
            date={`${item?.at_date} - ${item?.from_time}`}
            peoples={item?.joining_user_count}
            distance={Math.round(Number(item?.distance))}
            joiningUsers={item?.joining_user}
            partyImage={
              !_.isUndefined(item?.party_images[0]) &&
              item?.party_images[0]?.image_url
            }
          />
        </TouchableOpacity>
      </View>
    );
  };

  // render parties
  const renderParties = () => {
    return (
      <View
        style={{
          paddingTop: 100,
          backgroundColor: BaseColors.primary,
          flex: 1,
        }}>
        {!_.isEmpty(dummyArr) && _.isArray(dummyArr) && dummyArr.length > 0 ? (
          <Animatable.View animation="fadeInUp" style={{ flex: 1 }}>
            <View
              style={{
                width: Dimensions.get('window').width / -40,
                // alignSelf: 'center',
              }}>
              <Carousel
                bounces={false}
                layout={'tinder'}
                layoutCardOffset={`18`}
                data={dummyArr}
                renderItem={renderPartyData}
                sliderWidth={Dimensions.get('screen').width}
                itemWidth={Dimensions.get('screen').width}
                onSnapToItem={(index) => {
                  if (index === dummyArr.length - 1) {
                    navigation.goBack();
                  }
                }}
              />
            </View>

            <View style={{ flex: 1, paddingTop: 50 }}>
              <Text
                // bold
                numberOfLines={2}
                adjustsFontSizeToFit={true}
                style={{
                  fontSize: 18,
                  color: BaseColors.white,
                  justifyContent: 'center',
                  textAlign: 'center',
                }}>
                Swipe Left to discard the party and choose the party of your
                choice
              </Text>
            </View>
            {/* <FlatList
              data={searchData?.party_details}
              renderItem={renderPartyData}
            /> */}
          </Animatable.View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit={true}
              style={{
                fontSize: 18,
                color: BaseColors.white,
                textAlign: 'center',
              }}>
              Oops 😥 The thing you've been looking for isn't here...
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <CHeader
        // title="Searchh"
        leftIcon
        whiteHeader
        customeIconSty={{ color: 'white' }}
        visible={false}
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {searchLoader ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* <ListContentLoader /> */}
          </View>
        ) : !_.isEmpty(searchData) && _.isObject(searchData) ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            {(!_.isEmpty(searchData?.people_data) &&
              _.isArray(searchData?.people_data)) ||
            (!_.isEmpty(searchData?.party_details) &&
              _.isArray(searchData?.party_details)) ? (
              <View style={{ flex: 1 }}>{renderParties()}</View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CNoData
                  titleText="Oops 😥"
                  descriptionText="The thing you've been looking for isn't here..."
                />
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>
    </>
  );
}
