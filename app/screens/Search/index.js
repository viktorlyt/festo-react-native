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
import FIcon from 'react-native-vector-icons/Feather';
import { TextInput, Header, Text, DiscoverCardList } from '@components';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';
import BaseSetting from '@config/setting';
import _ from 'lodash';
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

export default function Search({ navigation, route }) {
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
  const searchInputContainer = () => {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        <View style={[styles.searchSection]}>
          <TextInput
            autoFocus={false}
            ref={seachRef}
            style={styles.inputStyle}
            inputStyle={IOS ? {} : { height: 48 }}
            onChange={(text) => {
              if (text.length >= 2 || text.length === 0) {
                setPartyTitleErr(false);
              } else {
                setPartyTitleErr(true);
              }
              setSearch(text);
            }}
            underlineColorAndroid="transparent"
            value={search}
            autoCapitalize={false}
            placeholderTextColor={'#4b4848'}
            otherPlaceholder={'Search Friends and Parties'}
            onSubmit={() => {
              searchDataApi(search);
            }}
            onBlur={() => setIsfocused(false)}
            onTouchStart={() => setIsfocused(true)}
          />
          <TouchableOpacity
            style={styles.searchIcon}
            activeOpacity={0.5}
            onPress={() => {
              searchDataApi(search);
            }}>
            <FIcon name="search" size={24} color={BaseColors.borderColor} />
          </TouchableOpacity>
        </View>
        {partyTitleErr ? (
          <Text
            style={{
              color: BaseColors.primary,
              marginTop: -15,
              marginBottom: 10,
            }}>
            {partyTitleErrTxt}
          </Text>
        ) : null}
      </View>
    );
  };

  // render recent search item
  const renderRecentSearchItem = ({ item, index }) => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          flexDirection: 'row',
          marginVertical: 10,
        }}>
        <View>
          <FIcon name="search" size={24} color={BaseColors.borderColor} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 10,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              setSearch(item.search);
              searchDataApi(item.search);
              setPartyTitleErr(false);
            }}
            style={{
              flex: 1,
            }}>
            <Text bold color={BaseColors.borderColor}>
              {item.search}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={
              removeSearchLoader === index
                ? null
                : () => {
                    removeRecentSearch(item.id);
                    setRemoveSearchLoader(index);
                  }
            }>
            {removeSearchLoader === index ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator
                  animating
                  color={BaseColors.borderColor}
                  size={'small'}
                />
              </View>
            ) : (
              <MIcon name="close" size={20} color={BaseColors.borderColor} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // render recent search
  const renderRecentSearch = () => {
    return (
      <View>
        {!_.isEmpty(searchData?.recent_search) &&
        _.isArray(searchData?.recent_search) ? (
          <View
            style={{
              marginTop: 10,
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                bold
                style={{
                  fontSize: 18,
                }}>
                Recent Search
              </Text>
              {/* <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  console.log('see all recent search =======>>>>> ');
                }}>
                <Text
                  color={BaseColors.primary}
                  style={{
                    fontSize: 18,
                  }}>
                  See All
                </Text>
              </TouchableOpacity> */}
            </View>

            <FlatList
              data={searchData?.recent_search}
              renderItem={renderRecentSearchItem}
            />
          </View>
        ) : null}
      </View>
    );
  };

  // people you may know
  const renderPeopleYouMayKnow = () => {
    return (
      <View style={{ paddingHorizontal: 20 }}>
        {!_.isEmpty(searchData?.people_data) &&
        _.isArray(searchData?.people_data) ? (
          <View>
            <Text
              bold
              style={{
                fontSize: 18,
              }}>
              People You May Know
            </Text>
            {searchData?.people_data?.map((item, index) => {
              const isFriend = item?.is_friend;
              const isRequested = item?.is_requested;
              return (
                <View style={styles.item}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Profile', {
                        from: 'friends',
                        id: item?.id,
                      });
                    }}
                    activeOpacity={0.6}
                    style={styles.profileTitleView}>
                    <Image
                      source={
                        _.isNull(item?.photo)
                          ? Images?.usrImg
                          : { uri: item?.photo }
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
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={isFriend ? 1 : 0.6}
                    onPress={() => {
                      if (isFriend === false) {
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
                        borderWidth: isRequested ? 0 : 1,
                        backgroundColor: isRequested
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
                      <Text style={styles.btnTxt}>Cancel Request</Text>
                    ) : isFriend ? (
                      <Text color={BaseColors.white} style={[styles.btnTxt]}>
                        Friends
                      </Text>
                    ) : (
                      <>
                        <AIcon
                          style={styles.addIcon}
                          name="plus"
                          size={20}
                          color={BaseColors.secondary}
                        />
                        <Text style={styles.btnTxt}>Add</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
            <TouchableOpacity
              activeOpacity={0.6}
              style={{
                backgroundColor: BaseColors.lightRed,
                borderRadius: 6,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
                borderWidth: 0,
                borderColor: BaseColors.lightRed,
                marginVertical: 10,
              }}
              onPress={() => {
                navigation.navigate('SeeAllPeople');
              }}>
              <Text
                bold
                style={{
                  color: BaseColors.primary,
                  fontSize: 16,
                }}>
                {'See All'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };

  const renderPartyData = ({ item, index }) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width - 40,
          alignSelf: 'center',
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
      <View>
        {!_.isEmpty(searchData?.party_details) &&
        _.isArray(searchData?.party_details) ? (
          <View>
            <Text
              bold
              style={{
                fontSize: 18,
                paddingHorizontal: 20,
              }}>
              Recommended for you
            </Text>

            <FlatList
              data={searchData?.party_details}
              renderItem={renderPartyData}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <>
      <Header
        title="Search"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {searchInputContainer()}
        {searchLoader ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ListContentLoader />
          </View>
        ) : !_.isEmpty(searchData) && _.isObject(searchData) ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderRecentSearch()}
            {(!_.isEmpty(searchData?.people_data) &&
              _.isArray(searchData?.people_data)) ||
            (!_.isEmpty(searchData?.party_details) &&
              _.isArray(searchData?.party_details)) ? (
              <View>
                {renderPeopleYouMayKnow()}
                {renderParties()}
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <CNoData 
                  titleText="Errr...Error404?"
                  descriptionText=" Nothing found. 😲"
                />
              </View>
            )}
          </ScrollView>
        ) : null}
      </View>
    </>
  );
}
