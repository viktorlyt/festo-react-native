/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Header, DiscoverCardList } from '@components';
import styles from './styles';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import _ from 'lodash';
import CNoData from '@components/CNoData';
import { DiscoverListContentLoader } from '@components/ContentLoader';
import { useDispatch, useSelector } from 'react-redux';
import * as Animatable from 'react-native-animatable';

/**
 * Module  DiscoverList
 * @module  DiscoverList
 *
 */

export default function DiscoverList({ navigation, route }) {
  const data = route?.params?.data;
  const [partylist, setPartyList] = useState([]);
  const [pageLoad, setPageLoad] = useState(true);
  const dispatch = useDispatch();
  const { currentLocation, setBottomTabSwipe } = useSelector(
    (state) => state.auth,
  );
  const bottomTabSwipe = useSelector((state) => state.auth.bottomTabSwipe);

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

  useEffect(() => {
    if (data.key !== 'other') {
      getAllPartyData();
    } else {
      setPartyList(data.parties);
      setPageLoad(false);
    }
  }, []);

  const getAllPartyData = async () => {
    setPageLoad(true);
    const params = `?PartyDiscover[lat]=${
      currentLocation?.lat ? currentLocation?.lat : 22.6916
    }&PartyDiscover[long]=${
      currentLocation?.long ? currentLocation?.long : 72.8634
    }&PartyDiscover[distance_km]=353&PartyDiscover[interest]=${
      data.interest_id
    }`;
    console.log('params -======>>>>>> ', params);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.seeAll}${params}`,
        'GET',
        {},
      );

      if (response?.status) {
        if (
          !_.isEmpty(response.data.rows) &&
          _.isArray(response.data.rows) &&
          response.data.rows.length > 0
        ) {
          setPartyList(response.data.rows);
        }
      }
      setPageLoad(false);
    } catch (error) {
      console.log('error1 ===>>>', error);
      setPageLoad(false);
    }
  };

  const renderPartyItem = ({ item, index }) => {
    return (
      <Animatable.View animation="fadeInUp">
        <View
          style={{
            // backgroundColor:"red",

            width: Dimensions.get('window').width - 40,
          }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              navigation.navigate('Events', { data: item, fromDiscover: true });
            }}>
            <DiscoverCardList
              allparties
              userName={item.host.name}
              host="Host"
              hostPhoto={item.host.photo}
              event={item.title}
              date={`${item.at_date} - ${item.from_time}`}
              peoples={item.joining_user_count}
              distance={Math.round(Number(item.distance))}
              joiningUsers={item.joining_user}
              partyImage={
                !_.isUndefined(item.party_images[0]) &&
                item.party_images[0].image_url
              }
              is_free={item?.is_free}
            />
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  };

  const renderNoData = () => {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <CNoData
          titleText="Oops 😥"
          descriptionText="The thing you've been looking for isn't here..."
        />
      </View>
    );
  };

  return (
    <>
      <Header
        leftIcon
        leftIconName={'arrowleft'}
        title={data.interest_name}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {pageLoad ? (
          <Animatable.View animation="fadeInUp" style={{ flex: 1 }}>
            <DiscoverListContentLoader />
          </Animatable.View>
        ) : !_.isEmpty(partylist) && _.isArray(partylist) ? (
          <FlatList
            style={{
              flex: 1,
            }}
            contentContainerStyle={{ paddingBottom: 20, alignItems: 'center' }}
            showsVerticalScrollIndicator={false}
            data={partylist}
            renderItem={renderPartyItem}
          />
        ) : (
          renderNoData()
        )}
      </View>
    </>
  );
}
