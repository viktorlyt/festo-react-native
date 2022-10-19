import React, { Children, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import ANIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '@react-navigation/native';
import Image from 'react-native-fast-image';
import { Images } from '@config';
import { BaseColors } from '@config/theme';
import { SvgXml } from 'react-native-svg';
import Popover from 'react-native-popover-view';
import { CustomIcon } from '@config/LoadIcons';
import _, { isEmpty } from 'lodash';

const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  mainCon: {
    width: '100%',
    height: IOS ? 95 : 100,
    marginTop: IOS ? getStatusBarHeight() - 35 : 0,
    position: IOS ? 'absolute' : 'absolute',
    elevation: 100,
    marginLeft: 10,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 11111,
    paddingTop: IOS ? 10 : 10,
    paddingHorizontal: 8,
    paddingVertical:25
  },
  titleCon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftBtnCon: {
    width: 55,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  defaultIconSty: {
    fontSize: IOS ? 25 : 25,
  },
  textColor: {
    textAlign: 'left',
    fontWeight: '700',
    fontSize: 18,
  },
  save: {
    fontSize: 16,
  },
  iconStyle: { fontSize: 30, color: '#FFF' },
  imgStyle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 10,
    marginBottom: -8,
  },
  modelTxt: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: BaseColors.textGrey,
    fontSize: 16,
  },
  modalRowView: {
    paddingHorizontal: 20,
  },
});

/**
 *Header component
 * @function CHeader
 *
 */
export default function CHeader(props) {
  const colors = useTheme();
  const BaseColors = colors.colors;

  const {
    title = '',
    leftIcon = false,
    rightText = '',
    leftIconName = '',
    rightIcon = false,
    onBackPress = () => null,
    otherCon = {},
    rightIconName = '',
    secondRightIcon = false,
    secondRightIconName = '',
    secondRightIconStyle = {},
    onRightAction = () => null,
    leftAction = () => null,
    onRightSecAction = () => null,
    customeIconSty = {},
    handleBlock = () => null,
    handleDeleteChat = () => null,
    customeIconRightSty = {},
    leftIconStyle = {},
    otherLeftIconViewSty = {},
    image = false,
    imageUrl = '',
    antIcon = false,
    iicon = false,
    micon = false,
    eIcon = false,
    visible = true,
    fromContact = false,
    onPressHeader = () => null,
    whiteHeader = false,
    customRight = false,
    customleft = false,
    isCenterTitle = false,
    optionsArray = [],
    displayOptions = false,
    onTitlePress = () => null,
  } = props;
  const [upPopover, setUpPopver] = useState(false);
  const rubberBandAnimRef = useRef();

  // const xml = require('../assets/Images/Boottom.svg');
  const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1800" height="470.088" viewBox="0 0 1800 470.088">
  <g id="Group_9728" data-name="Group 9728" transform="translate(834 22)">
    <path id="Path_62806" data-name="Path 62806" d="M-651.3,448.088-834,448V-22H966V448c-61,0-181.889-.037-181.889-.037s-2.824-1.474-3.8-2.006c-6.718-3.65-11.9-8.8-13.839-16.267-1.786-6.887-2.549-14.033-4-21.015-15.093-72.607-79.747-125.047-155.029-124.981q-541.382.475-1082.765.16c-49.005.005-89.769,18.543-121.627,55.755-20.757,24.246-33.155,52.347-36.18,84.382-.717,7.6-4.3,15.3-10.489,20.011a19.125,19.125,0,0,1-4.127,2.578,9.243,9.243,0,0,1-1.5.719A4.78,4.78,0,0,0-651.3,448.088Z" fill="#e73827"/>
  </g>
</svg>



  `;

  return (
    <>
      <View style={{ zIndex: 1111111 }}>
        <StatusBar
          backgroundColor={'#0000'}
          barStyle={whiteHeader ? 'light-content' : 'dark-content'}
          translucent
        />
        {visible ? (
          <View style={{ position:IOS? 'absolute':"absolute", top: -20 }}>
            <SvgXml
              xml={xml}
              width={Dimensions.get('screen').width}
              height={Dimensions.get('screen').width / 3 - (IOS ? 30 : 28)}
              style={{ Top: -160 }}
            />
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressHeader ? onPressHeader : null}
          style={[styles.mainCon, otherCon]}>
          {leftIcon ? (
            <View style={{}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onBackPress}
                style={[otherLeftIconViewSty, { width: 80, zIndex: 111111 }]}>
                {eIcon ? (
                  <EIcon
                    name={leftIconName}
                    style={[
                      styles.iconStyle,
                      {
                        fontSize:34,
                        color: whiteHeader
                          ? BaseColors.black
                          : BaseColors.white,
                      },
                      customeIconSty,
                    ]}
                  />
                ) : (
                  <ANIcon
                    name={leftIconName}
                    style={[
                      styles.iconStyle,
                      {
                        color: whiteHeader
                          ? BaseColors.black
                          : BaseColors.white,
                      },
                      customeIconSty,
                    ]}
                  />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: 80 }} />
          )}
          {image ? (
            <TouchableOpacity activeOpacity={1} onPress={onTitlePress}>
              <Image
                source={
                  fromContact
                    ? Images.logo
                    : {
                        uri: imageUrl
                          ? imageUrl
                          : 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg',
                      }
                }
                style={styles.imgStyle}
              />
            </TouchableOpacity>
          ) : null}
          {title !== '' && (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                flex: 1,
                alignItems: isCenterTitle ? 'center' : null,
                paddingVertical: 6,
                justifyContent: 'center',
              }}
              onPress={onTitlePress}>
              <Animatable.View
                // useNativeDriver
                ref={rubberBandAnimRef}>
                <TouchableOpacity
                  activeOpacity={0}
                  onPress={() => {
                    if (true) {
                      rubberBandAnimRef.current.rubberBand(2500);
                    }
                  }}>
                  <Text
                    adjustsFontSizeToFit={true}
                    numberOfLines={1}
                    style={{
                      ...styles.textColor,
                      color: whiteHeader ? BaseColors.black : BaseColors.white,
                      zIndex: 1111,
                      // color: 'black',
                      top: IOS ? 17 : 15,

                      right: IOS ? 0 : 0,
                      backgroundColor: IOS ? '#0000' : '#0000',
                      paddingLeft: leftIcon
                        ? 15
                        : isCenterTitle && !leftIcon
                        ? 40
                        : 0,
                      justifyContent: 'center',
                      textAlign: 'center',
                      fontSize: 28,
                      color: 'red',
                      textShadowColor: 'white',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 4,
                    }}>
                    {title}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            </TouchableOpacity>
          )}
          {rightIcon ? (
            <TouchableOpacity
              style={{ width: 80, zIndex: 111111, alignItems: 'flex-end' }}
              activeOpacity={0.5}
              onPress={onRightAction}>
              {customRight ? (
                <CustomIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? BaseColors.black : '#FFF',
                      zIndex: 111111,
                      // elevation: 22,
                    },
                    secondRightIconStyle,
                  ]}
                />
              ) : antIcon ? (
                <ANIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? '#FFF' : '#FFF',
                      paddingRight: secondRightIcon ? 10 : 0,
                    },

                    customeIconRightSty,
                  ]}
                />
              ) : iicon ? (
                <IIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? BaseColors.black : BaseColors.white,
                      paddingRight: secondRightIcon ? 10 : 0,
                    },

                    customeIconRightSty,
                  ]}
                />
              ) : micon ? (
                <MIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? BaseColors.black : BaseColors.white,
                      paddingRight: secondRightIcon ? 10 : 0,
                    },

                    customeIconRightSty,
                  ]}
                />
              ) : (
                <EIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? BaseColors.black : '#FFF',
                      paddingRight: secondRightIcon ? 10 : 0,
                    },

                    customeIconRightSty,
                  ]}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }}></View>
          )}
          {/* {secondRightIcon ? (
  <TouchableOpacity activeOpacity={0.5} onPress={onRightSecAction}>
    {customSecondRight ? (
      <CustomIcon
        name={secondRightIconName}
        style={[
          styles.defaultIconSty,
          {
            color: whiteHeader ? BaseColors.black : BaseColors.white,
          },
          secondRightIconStyle,
        ]}
      />
    ) : antIcon ? (
      <ANIcon
        name={secondRightIconName}
        style={[
          styles.defaultIconSty,
          {
            color: whiteHeader ? BaseColors.black : BaseColors.white,
          },
          secondRightIconStyle,
        ]}
      />
    ) : iicon ? (
      <IIcon
        name={secondRightIconName}
        style={[
          styles.defaultIconSty,
          {
            color: whiteHeader ? BaseColors.black : BaseColors.white,
          },
          secondRightIconStyle,
        ]}
      />
    ) : micon ? (
      <MIcon
        name={secondRightIconName}
        style={[
          styles.defaultIconSty,
          {
            color: whiteHeader ? BaseColors.black : BaseColors.white,
          },
          secondRightIconStyle,
        ]}
      />
    ) : (
      <EIcon
        name={secondRightIconName}
        style={[
          styles.defaultIconSty,
          {
            color: whiteHeader ? BaseColors.black : BaseColors.white,
          },
          secondRightIconStyle,
        ]}
      />
    )}
  </TouchableOpacity>
) : null} */}
          {displayOptions ? (
            <Popover
              popoverStyle={{ borderRadius: 8 }}
              offset={IOS ? 0 : -20}
              placement="bottom"
              isVisible={upPopover}
              displayAreaInsets={{
                top: 0,
              }}
              onRequestClose={() => setUpPopver(false)}
              from={
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setUpPopver(true);
                  }}>
                  <MIcon
                    name={'dots-vertical'}
                    style={[
                      styles.defaultIconSty,
                      {
                        color: whiteHeader
                          ? BaseColors.black
                          : BaseColors.white,
                      },
                      secondRightIconStyle,
                    ]}
                  />
                </TouchableOpacity>
              }>
              {/* show model   */}
              {optionsArray?.map((item, index) => {
                return (
                  <View style={styles.modalRowView}>
                    <TouchableOpacity
                      onPress={() => {
                        setUpPopver(false);
                        if (item?.handleClick) {
                          item?.handleClick();
                        }
                      }}
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {!_.isEmpty(item.iconName) ? (
                        <CustomIcon
                          name={item.iconName}
                          style={[
                            styles.defaultIconSty,
                            {
                              color: BaseColors.primary,
                            },
                          ]}
                        />
                      ) : null}
                      <Text style={[styles.modelTxt, { marginLeft: 10 }]}>
                        {item?.optionLabel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </Popover>
          ) : null}
        </TouchableOpacity>
      </View>
    </>
  );
}
