/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import MapView, { Marker, Callout, Heatmap } from 'react-native-maps';
import { isArray } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Header, DiscoverMapList } from '@components';
import { mapStyle } from '@config/staticData';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import FIcon from 'react-native-vector-icons/Feather';
import { BaseColors, FontFamily } from '@config/theme';
import styles from './styles';
import _, { isEmpty } from 'lodash';
import { useFocusEffect } from '@react-navigation/native';
import AuthAction from '@redux/reducers/auth/actions';

/**
 * Module  DiscoverMap
 * @module  DiscoverMap
 *
 */
export default function DiscoverMap({ navigation, route }) {
  const dispatch = useDispatch();
  const IOS = Platform.OS === 'ios';
  const { setActiveScreen } = AuthAction;
  const { currentLocation } = useSelector((state) => state.auth);

  const [partyData, setPartyData] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [heatMapData, setHeatMapData] = useState([]);
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
  useFocusEffect(
    useCallback(() => {
      getPartyList();
    }, [currentLocation, filter]),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(setActiveScreen('map'));
    }, []),
  );

  // this function for get party list
  async function getPartyList() {
    setPageLoader(true);
    const params = `?PartyDiscover[lat]=${
      currentLocation?.lat || 22.5645
    }&PartyDiscover[long]=${
      currentLocation?.long || 72.9289
    }&PartyDiscover[is_map]=${0}&PartyDiscover[distance_km]=${filter}`;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.listParty}${params}`,
        'GET',
        {},
      );

      if (response?.status) {
        if (
          !isEmpty(response.data) &&
          isArray(response.data.rows) &&
          response.data.rows.length > 0
        ) {
          setPageLoader(false);
          setPartyData(response.data.rows);
          setHeatMapData(response?.data?.heat_data || []);
        } else {
          setPageLoader(false);
        }
      } else {
        setPageLoader(false);
      }
    } catch (error) {
      setPageLoader(false);
      console.log('error1 ===>>>', error);
    }
  }

  // render map
  const renderMap = () => {
    const { height, width } = Dimensions.get('window');
    const LATITUDE_DELTA = 0.9;
    const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
    return (
      <>
        <MapView
          style={styles.mapStyle}
          customMapStyle={mapStyle}
          showsUserLocation
          zoomEnabled={true}
          provider="google"
          zoomControlEnabled={true}
          showsBuildings
          maxZoomLevel={50}
          minZoomLevel={2}
          initialRegion={{
            latitude: !_.isEmpty(currentLocation)
              ? currentLocation?.lat
              : 22.5645,
            longitude: !_.isEmpty(currentLocation)
              ? currentLocation?.long
              : 72.9289,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {isArray(heatMapData) &&
            heatMapData.length > 0 &&
            heatMapData.map((item, index) => {
              if (Number(item?.party_count) > 1) {
                return (
                  <Marker
                    style={{ zIndex: index + 5 }}
                    anchor={{ x: -0.2, y: 3.2 }}
                    key={`marker_${item?.latitude}_${index}`}
                    coordinate={{
                      latitude: Number(item.latitude || 0),
                      longitude: Number(item.longitude || 0),
                    }}>
                    <View
                      style={{
                        backgroundColor: BaseColors.primary,
                        borderRadius: 60,
                        width: 20,
                        height: 20,
                        borderColor: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        zIndex: 11111,
                        elevation: 1,
                      }}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'white',
                          textAlign: 'center',
                          justifyContent: 'center',
                          fontFamily: FontFamily.bold,
                        }}>
                        {item?.party_count}
                      </Text>
                    </View>
                  </Marker>
                );
              }
              return null;
            })}
          {isArray(partyData) &&
            partyData?.length > 0 &&
            partyData?.map((item, index) => {
              const party_image = item?.party_images[0];
              return (
                <>
                  <Marker
                    style={{ zIndex: index }}
                    key={`marker_${item?.location_lat}_${index}`}
                    coordinate={{
                      latitude: Number(item.location_lat || 0),
                      longitude: Number(item.location_lng || 0),
                    }}>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}>
                      <View style={styles.markerImage}>
                        <Image
                          source={{ uri: party_image?.image_url }}
                          style={styles.imgmain}
                        />
                      </View>
                      <View
                        style={{
                          transform: [{ rotate: '180deg' }],
                          width: 0,
                          height: 0,
                          backgroundColor: 'transparent',
                          borderStyle: 'solid',
                          borderLeftWidth: 9,
                          borderRightWidth: 9,
                          borderBottomWidth: 18,
                          borderLeftColor: 'transparent',
                          borderRightColor: 'transparent',
                          borderBottomColor: BaseColors.white,
                          bottom: 5,
                        }}
                      />
                    </View>
                    <Callout
                      tooltip
                      onPress={() => {
                        navigation.navigate('Events', {
                          data: item,
                          fromDiscover: true,
                        });
                      }}>
                      <DiscoverMapList
                        data={item}
                        image={item?.party_images}
                        peopleImg={item?.host?.photo}
                        userName={item?.host?.name || ''}
                        host="Host"
                        event={item?.title || ''}
                        date={item.at_date}
                        fromTime={item?.from_time}
                        is_free={item?.is_free}
                        price={item?.price}
                        peoples={item?.joining_user}
                        joinedUsers={item?.joining_user_count || 0}
                      />
                    </Callout>
                  </Marker>
                  {isArray(heatMapData) && !isEmpty(heatMapData) ? (
                    <Heatmap
                      points={heatMapData}
                      radius={IOS ? 80 : 50}
                      opacity={0.3}
                      maxIntensity={100}
                      gradientSmoothing={15}
                      heatmapMode={'POINTS_DENSITY'}
                      gradient={{
                        colors: IOS
                          ? [
                              'rgba(0,255,255,0)',
                              'rgba(0,255,255,0.6)',
                              'rgba(144,238,144,0.8)',
                              'rgba(255,255,0,0.5)',
                              'rgba(255,165,0,0.5)',
                              'rgba(255,0,0,0.8)',
                            ]
                          : [
                              'rgba(0,255,255,0.6)',
                              'rgba(144,238,144,0.8)',
                              'rgba(255,255,0,0.5)',
                              'rgba(255,165,0,0.5)',
                              'rgba(255,0,0,0.8)',
                            ],
                        startPoints: IOS
                          ? [0.01, 0.1, 0.25, 0.5, 0.75, 1]
                          : [0.1, 0.25, 0.5, 0.75, 1],
                        colorMapSize: 2000,
                      }}
                    />
                  ) : null}
                </>
              );
            })}
        </MapView>
      </>
    );
  };

  return (
    <>
      <Header
        title="Party 🌐"
        rightIcon
        // displayOptions
        // optionsArray={optionsArray}
        // filterIcon
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

      {pageLoader ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: BaseColors.white,
          }}>
          <ActivityIndicator
            animating
            size="large"
            color={BaseColors.primary}
          />
        </View>
      ) : (
        <View style={styles.container}>
          {renderMap()}
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              padding: 12,
              bottom: 200,
              backgroundColor: BaseColors.primary,
              position: 'absolute',
              right: 20,
              borderRadius: 50,
            }}
            onPress={() => {
              // refRBSheet.current.open();
              navigation.navigate('CreateParty');
            }}>
            <FIcon name="plus" color="#fff" size={35} />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
