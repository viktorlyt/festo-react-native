import React, { Children, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import FIcon from 'react-native-vector-icons/Feather';
import ANIcon from 'react-native-vector-icons/AntDesign';
import EIcon from 'react-native-vector-icons/EvilIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { getStatusBarHeight } from 'react-native-safearea-height';
import { useTheme } from '@react-navigation/native';
import Image from 'react-native-fast-image';
import { Images } from '@config';
import { BaseColors } from '@config/theme';
import Popover from 'react-native-popover-view';
import { CustomIcon } from '@config/LoadIcons';
import _, { isEmpty } from 'lodash';
import TextTicker from 'react-native-text-ticker';

const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  mainCon: {
    width: '100%',
    height: IOS ? 70 : 60,
    marginTop: IOS ? getStatusBarHeight() - 30 : 0,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: IOS ? 18 : 10,
    paddingHorizontal: 15,
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
    fontSize: 24,
  },
  textColor: {
    textAlign: 'left',
    width: '80%',
    fontWeight: '700',
    fontSize: 18,
  },
  save: {
    fontSize: 16,
  },
  iconStyle: { fontSize: 24, color: '#FFF' },
  imgStyle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 10,
    marginBottom: IOS ? 0 : 5,
  },
  modelTxt: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: BaseColors.textGrey,
    fontSize: 16,
  },
  modalRowView: {
    paddingHorizontal: 25,
    textAlign:"center",
    justifyContent:"center",
    alignItems:"center"
  },
});

/**
 *Header component
 * @function Header
 *
 */
export default function Header(props) {
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
    onRightSecAction = () => null,
    customeIconSty = {},
    handleBlock = () => null,
    handleDeleteChat = () => null,
    customeIconRightSty = {},
    otherLeftIconViewSty = {},
    image = false,
    imageUrl = '',
    antIcon = false,
    iicon = false,
    micon = false,
    filterIcon = false,
    fromContact = false,
    onPressHeader = () => null,
    whiteHeader = false,
    customSecondRight = false,
    isCenterTitle = false,
    optionsArray = [],
    displayOptions = false,
  } = props;
  const [upPopover, setUpPopver] = useState(false);

  return (
    <>
      <StatusBar
        backgroundColor={'#0000'}
        barStyle={whiteHeader ? 'dark-content' : 'light-content'}
        translucent
      />
      <LinearGradient
        style={{ paddingTop: IOS ? 0 : getStatusBarHeight() }}
        colors={
          whiteHeader
            ? [BaseColors.white, BaseColors.white]
            : [BaseColors.secondary, BaseColors.primary]
        }
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 1 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPressHeader ? onPressHeader : null}
          style={[styles.mainCon, otherCon]}>
          {leftIcon ? (
            <View style={styles.leftIconView}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={onBackPress}
                style={otherLeftIconViewSty}>
                <ANIcon
                  name={leftIconName}
                  style={[
                    styles.iconStyle,
                    {
                      color: whiteHeader ? BaseColors.black : BaseColors.white,
                    },
                    customeIconSty,
                  ]}
                />
              </TouchableOpacity>
            </View>
          ) : null}
          {image ? (
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
          ) : null}
          {title !== '' && (
            <View
              style={{
                flex: 1,
                alignItems: isCenterTitle ? 'center' : null,
              }}>
              <TextTicker
                duration={10000}
                loop={true}
                scroll
                bounce={false}
                repeatSpacer={0}
                marqueeDelay={2000}
                numberOfLines={1}
                style={{
                  ...styles.textColor,
                  color: whiteHeader ? BaseColors.black : BaseColors.white,
                  marginRight: 50,
                  paddingLeft: leftIcon
                    ? 15
                    : isCenterTitle && !leftIcon
                    ? 40
                    : 0,
                  textAlign: isCenterTitle ? 'center' : null,
                }}>
                {title}
              </TextTicker>
            </View>
          )}
          {rightIcon && (
            <TouchableOpacity activeOpacity={0.5} onPress={onRightAction}>
              {!isEmpty(rightText) ? (
                <Text
                  style={{
                    color: whiteHeader ? BaseColors.black : BaseColors.white,
                    textAlign: isCenterTitle ? 'center' : null,
                  }}>
                  {rightText}
                </Text>
              ) : antIcon ? (
                <ANIcon
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
                <FIcon
                  name={rightIconName}
                  style={[
                    styles.defaultIconSty,
                    {
                      color: whiteHeader ? BaseColors.black : BaseColors.white,
                      paddingRight: secondRightIcon ? 15 : 0,
                    },

                    customeIconRightSty,
                  ]}
                />
              )}
            </TouchableOpacity>
          )}
          {secondRightIcon ? (
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
          ) : null}
          {displayOptions ? (
            <Popover
              popoverStyle={{ borderRadius: 8 }}
              placement="bottom"
              isVisible={upPopover}
              displayAreaInsets={{
                top: 0,
              }}
              onRequestClose={() => setUpPopver(false)}
              from={
                <TouchableOpacity
                  activeOpacity={0.3}
                  onPress={() => {
                    setUpPopver(true);
                  }}>
                  {filterIcon ? (
                    <ANIcon
                      name={'filter'}
                      style={[
                        styles.defaultIconSty,
                        {
                          paddingLeft: 10,
                          color: whiteHeader
                            ? BaseColors.black
                            : BaseColors.white,
                        },
                        secondRightIconStyle,
                      ]}
                    />
                  ) : (
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
                  )}
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
                        {`${item?.optionLabel} Km `}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </Popover>
          ) : null}
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
}
