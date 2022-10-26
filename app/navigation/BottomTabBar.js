/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { isIPhoneX } from 'react-native-status-bar-height';
import { BaseStyles, FontFamily } from '@config/theme';
import ANIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import LottieView from 'lottie-react-native';

import { useTheme } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import { CustomIcon } from '@config/LoadIcons';
import { isIOS } from 'react-native-elements/dist/helpers';

export default function BottomTabBar({ state, descriptors, navigation }) {
  const rubberBandAnimRef = useRef();
  const zoomAnimRef = useRef();
  const searchAnimRef = useRef();
  const chatAnimRef = useRef();
  const profileAnimRef = useRef();
  const partyAnimRef = useRef();
  const searchBG = useRef();
  const searchBTN = useRef();
  const colors = useTheme();
  const [inBounceAnimation, inSetBounceAnimation] = useState(null);
  const [showSearchAnimation, setShowSearchAnimation] = useState(false);

  useEffect(() => {
    const bounceCustom = {
      from: {
        top: -(Dimensions.get('window').height - 150) / 2,
        scale: 2,
      },
      to: {
        top: -(Dimensions.get('window').height + 100) / 2,
        scale: 3,
      },
    };
    if (showSearchAnimation === true) {
      if (searchBG.current) {
        searchBG.current.animate({
          0: {
            height: 70,
            width: 70,
            translateX: 0,
            translateY: 0,
            borderRadius: 50,
          },
          1: {
            height: Dimensions.get('window').height + 1000,
            width: Dimensions.get('window').width,
            // translateX: -Dimensions.get('window').height / 2,
            translateX: -(Dimensions.get('window').width / 2 - 35),
            translateY: 45,
            borderRadius: 0,
            // translateY: -Dimensions.get('window').height,
          },
        });
        searchBTN.current.animate({
          0: { top: 0, scale: 1 },
          1: {
            top: -(Dimensions.get('window').height - 150) / 2,
            scale: 2,
          },
        });
        setTimeout(() => {
          inSetBounceAnimation(bounceCustom);

          setTimeout(() => {
            navigation.navigate('NewSearch');
            inSetBounceAnimation(null);
            searchBG.current.animate({
              0: {
                height: Dimensions.get('window').height + 1000,
                width: Dimensions.get('window').width,
                // translateX: -Dimensions.get('window').height / 2,
                translateX: -(Dimensions.get('window').width / 2 - 35),
                translateY: 45,
                borderRadius: 0,
                // translateY: -Dimensions.get('window').height,
              },
              1: {
                height: 70,
                width: 70,
                translateX: 0,
                translateY: 0,
                borderRadius: 50,
              },
            });
            searchBTN.current.animate({
              0: {
                top: -(Dimensions.get('window').height - 150) / 2,
                scale: 2,
              },
              1: { top: 0, scale: 1 },
            });
            setTimeout(() => {
              setShowSearchAnimation(false);
            }, 1500);
          }, 5000);
        }, 1000);
      }
    }
  }, [navigation, showSearchAnimation]);

  const BaseColors = colors.colors;
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  // const xml = require('../assets/Images/Boottom.svg');
  // const xml = `
  //   <svg xmlns="http://www.w3.org/2000/svg" width="440" height="86.251" viewBox="0 0 440 86.251">
  //   <g id="Group_8588" data-name="Group 8588" transform="translate(-30.043 -202.99)">
  //     <path id="Path_7073" data-name="Path 7073" d="M30.543,288.741V203.559h2.37q75.489,0,150.978.012c7.1,0,12.51,3.677,16.753,8.948,2.516,3.126,4.321,6.869,6.23,10.453,6.01,11.281,15.218,18.386,27.589,20.731a39.4,39.4,0,0,0,42.749-20.583c2.183-4.244,3.868-8.822,7.562-12.082a62.215,62.215,0,0,1,5.414-4.335c3.929-2.756,8.34-3.224,13.07-3.213q74.331.169,148.661.069h2.624v85.182Z" fill="#fff" stroke="#c9c9c9" stroke-width="1"/>
  //   </g>
  // </svg>
  //   `;

  const xml = `
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 435 87" width="435" height="89">
  	<title>Group 8588-svg</title>
  	<g id="Group_8588">
  		<path id="Path_7073" class="s0" d="m0.5 85.8v-85.2h2.4q75.5 0 150.9 0c7.1 0 12.6 3.7 16.8 8.9 2.5 3.2 4.3 6.9 6.2 10.5 6 11.3 15.2 18.4 27.6 20.7 4.2 0.8 8.5 1 12.7 0.5 4.2-0.6 8.3-1.8 12.1-3.6 3.9-1.9 7.4-4.3 10.4-7.3 3.1-3 5.6-6.4 7.6-10.2 2.2-4.2 3.8-8.8 7.5-12.1q0.7-0.5 1.3-1.1 0.7-0.6 1.4-1.1 0.7-0.5 1.3-1.1 0.7-0.5 1.4-1c4-2.7 8.4-3.2 13.1-3.2q74.3 0.2 148.7 0.1h2.6v85.2z" fill="#fff" stroke="#c9c9c9" stroke-width="1" />
  	</g>
  </svg>`;

  const getIcons = (label, isFocused, index) => {
    const tabIconColor = isFocused ? BaseColors.primary : '#585858';

    switch (label) {
      case 'Party':
        return (
          <>
            <Animatable.View
              useNativeDriver
              ref={zoomAnimRef}
              style={
                {
                  // borderColor: tabIconColor,
                  // borderWidth: 1,
                  // borderRadius: 50,
                  // padding: 0.3,
                }
              }>
              <CustomIcon
                onPress={() => {
                  if (true) {
                    zoomAnimRef.current.zoomIn(2500);
                    navigation.navigate('Party');
                  }
                }}
                name="discover"
                // name={isFocused ? 'party-fill' : 'party'}
                color={tabIconColor}
                style={{ fontSize: 25, left: 13 }}
              />
              <Text
                style={{
                  color: isFocused ? BaseColors.primary : '#585858',
                  paddingTop: 4,
                  fontSize: 12,
                  fontFamily: FontFamily.medium,
                }}>
                Discover
              </Text>
            </Animatable.View>
          </>
        );
      case 'DiscoverMap':
        return (
          <Animatable.View
            useNativeDriver
            ref={rubberBandAnimRef}
            style={{ right: 20, alignItems: 'center' }}>
            <CustomIcon
              onPress={() => {
                if (true) {
                  rubberBandAnimRef.current.zoomIn(2000);
                  navigation.navigate('DiscoverMap');
                }
              }}
              // name={isFocused ? 'party-fill' : 'party'}
              name="Group-28"
              color={tabIconColor}
              style={{ fontSize: 25 }}
            />
            <Text
              style={{
                color: isFocused ? BaseColors.primary : '#585858',
                paddingTop: 4,
                fontSize: 12,
                fontFamily: FontFamily.medium,
              }}>
              Party
            </Text>
          </Animatable.View>
        );
      case 'Chat':
        return (
          <Animatable.View
            useNativeDriver
            ref={chatAnimRef}
            style={{ left: 20, alignItems: 'center' }}>
            <View>
              <View
                style={{
                  backgroundColor: BaseColors.primary,
                  position: 'absolute',
                  height: 6,
                  width: 6,
                  right: -1,
                  top: 8.5,
                  borderRadius: 20,
                }}
              />
              <CustomIcon
                onPress={() => {
                  if (true) {
                    chatAnimRef.current.zoomIn(2000);
                    navigation.navigate('Chat');
                  }
                }}
                name="Group-29"
                color={tabIconColor}
                style={{ fontSize: 25 }}
              />
            </View>
            <Text
              style={{
                color: isFocused ? BaseColors.primary : '#585858',
                paddingTop: 4,
                fontSize: 12,
                fontFamily: FontFamily.medium,
              }}>
              Chat
            </Text>
          </Animatable.View>
        );
      case 'Profile':
        return (
          <>
            <Animatable.View useNativeDriver ref={partyAnimRef}>
              <ANIcon
                onPress={() => {
                  if (true) {
                    partyAnimRef.current.zoomIn(2000);
                    navigation.navigate('Profile');
                  }
                }}
                name="user"
                style={{ fontSize: 25, left: 5 }}
                color={tabIconColor}
              />
              {/* <CustomIcon
              name={isFocused ? 'profile-active' : 'profile'}
              color={tabIconColor}
              style={{ fontSize: 25 }}
            /> */}
              <Text
                style={{
                  color: isFocused ? BaseColors.primary : '#585858',
                  paddingTop: 4,
                  fontSize: 12,
                  fontFamily: FontFamily.medium,
                }}>
                Profile
              </Text>
            </Animatable.View>
          </>
        );
    }
  };

  return (
    <View style={styles.tabContainer}>
      <View useNativeDriver ref={searchAnimRef}>
        {showSearchAnimation ? (
          <Animatable.View
            onPress={() => null}
            style={{
              zIndex: 3,
              // position: 'absolute',
              // alignSelf: 'center',
            }}>
            <Animatable.View
              ref={searchBG}
              easing={'ease-in-out'}
              style={{
                height: 70,
                width: 70,
                backgroundColor: '#F3492E',
                borderRadius: 50,
                position: 'absolute',
                zIndex: 4,
                translateX: 0,
                translateY: 0,
                left: '50%',
                marginLeft: -35,
                bottom: -18,
              }}
            />
            <Animatable.View
              ref={searchBTN}
              // easing={'ease-in-out'}
              // animation={inBounceAnimation}
              iterationCount={100}
              direction="alternate"
              style={{
                position: 'absolute',
                zIndex: 5,
                left: '50%',
                marginLeft: -35,
                marginTop: -50,
              }}>
              {/* <ANIcon
              name="search1"
              style={[
                styles.defaultIconSty,
                {
                  color: BaseColors.white,
                  fontSize: 26,
                },
              ]}
            /> */}
              <LottieView
                style={{ height: 100, width: 100 }}
                ref={(animation) => {
                  this.animation = animation;
                }}
                autoPlay
                speed={0.85}
                source={require('../assets/lottieFiles/SearchAnimation.json')}
              />
            </Animatable.View>
          </Animatable.View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            // navigation.navigate('Search');
          }}
          style={{
            alignSelf: 'center',
            backgroundColor: '#F3492E',
            borderRadius: 50,
            zIndex: 1,
            position: 'absolute',
            bottom: 46,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // setShowSearchAnimation(true);
              navigation.navigate('Tickets');
            }}>
            <FontAwesome
              name="ticket"
              style={[
                styles.defaultIconSty,
                {
                  color: BaseColors.white,
                  fontSize: 40,
                  padding: 13
                },
              ]}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={{ position: 'absolute', bottom: -5, left: -5 }}>
          <SvgXml xml={xml} width={Dimensions.get('screen').width + 20} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            textAlign: 'center',
            shadow: {
              shadowColor: BaseColors.black40,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              borderWidth: 4,
            },
          }}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{
                  flex: 1,
                  paddingBottom: isIPhoneX() ? 18 : 15,
                  alignItems: 'center',
                }}>
                {getIcons(label, isFocused, index)}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    flexDirection: 'row',
    // backgroundColor:"white",
    textAlign: 'center',
    ...BaseStyles.shadow,
  },
  iconContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: isIPhoneX ? 15 : 10,
    height: isIPhoneX ? 70 : 60,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: BaseColors.white,
  },
  defaultIconSty: {
    padding: 20,
  },
  tabContainer: {
    position: 'absolute',
    bottom: -2,
    left: 0,
    right: 0,
  },
});
