/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ToggleSwitch from 'toggle-switch-react-native';
import Image from 'react-native-fast-image';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IIcon from 'react-native-vector-icons/Ionicons';
import EIcon from 'react-native-vector-icons/Entypo';
import { EventRegister } from 'react-native-event-listeners';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import { getStatusBarHeight, isIPhoneX } from 'react-native-status-bar-height';
import { getApiData } from '@utils/apiHelper';
import {
  IconComponent,
  Text,
  CAlert,
  TabSwitch,
  LightBoxContainer,
} from '@components';
import BaseSetting from '@config/setting';
import { Images } from '@config';
import {
  logout,
  PutSPProfileOnlineStatus,
  shareRefferal,
  handleMode,
} from '@utils/CommonFunction';
import { isEmpty, size } from 'lodash';
import { navigationRef } from 'app/navigation/NavigationService';
import PackageVersion from '../../package.json';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { NativeModules } from 'react-native';
import { translate } from 'app/lang/Translate';
import AuthAction from '@redux/reducers/auth/actions';
// import AlertModal from '@components/Alert';
const { StatusBarManager } = NativeModules;

let version = PackageVersion.version;
const iconSize = 25;
const IOS = Platform.OS === 'ios';
let headerHeight;
if (!IOS) {
  headerHeight = 55;
} else if (IOS && isIPhoneX()) {
  headerHeight = 90;
} else {
  headerHeight = 70;
}

export default function SideDrawer({ navigation, state, navigator }) {
  const dispatch = useDispatch();
  const colors = useTheme();
  const BaseColors = colors.colors;

  const { setDarkmode } = AuthAction;

  const { userData, userType, coins, darkmode } = useSelector(
    (state) => state.auth,
  );
  console.log('🚀🚀🚀🚀 ~ SideDrawer ~ userData', userData.onlineStatus);
  const { fcmToken } = useSelector((state) => state.notification);

  const [myCountry, setMyCountry] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(darkmode);
  const [visible, setVisible] = useState(false);
  const isProvider = userType === 'provider';
  let firstName = userData.firstName ? userData.firstName : '';
  let lastName = userData.lastName ? userData.lastName : '';
  const switchOptions = [
    { id: 1, name: translate('available') },
    { id: 0, name: translate('nonAvailable') },
  ];
  const [activeMenu, setActiveMenu] = useState('');

  const currentSwitch = switchOptions.find(
    (c) => c.id === userData?.onlineStatus,
  );
  console.log(
    '🚀 ~ file: SideDrawer.js ~ line 68 ~ SideDrawer ~ currentSwitch',
    currentSwitch,
  );

  const [activeSwitch, setActiveSwitch] = useState(currentSwitch);
  const [imagePath, setImagePath] = useState(
    userData?.profileImage
      ? userData.profileImage
      : 'https://icon-library.com/images/user-icon-image/user-icon-image-17.jpg',
  );
  console.log('🚀🚀🚀🚀 ~ SideDrawer ~ imagePath', imagePath);

  const onInviteHandler = async (item) => {
    console.log('onInviteShareClickHandler>>', item);
    let sharedData = '';
    if (item != undefined) {
      sharedData = item;
    }
    if (sharedData != '') {
      await shareRefferal(sharedData);
    }
  };

  const MenuList = [
    {
      display: !isProvider, //ONLY FOR CUSTOMER Not For Provider
      title: translate('subcriptionTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="add-circle-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === 1 ? { color: BaseColors.primary } : {},
          ]}
        />
      ),
      action: () => {
        setActiveMenu(1);
        navigation.closeDrawer();
        navigation.navigate('Subscription');
      },
    },
    {
      display: !isProvider,
      title: translate('editProfileTitle'),
      icon: (
        <MCIcon
          size={iconSize}
          name="account-edit-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === 2 ? { color: BaseColors.primary } : {},
          ]}
        />
      ),
      action: () => {
        setActiveMenu(2);
        navigation.closeDrawer();
        navigation.navigate('MyProfile');
      },
    },
    {
      display: true,
      title: translate('inviteFriendTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="share-social"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 1 : 3)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),
      action: () => {
        isProvider ? setActiveMenu(1) : setActiveMenu(3);
        navigation.closeDrawer();
        navigation.navigate('Invite');
        // onInviteHandler(userData?.referral_Code || '');
      },
    },
    {
      display: true,
      title: translate('contactUsTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="chatbox-ellipses-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 2 : 4)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),

      action: () => {
        isProvider ? setActiveMenu(2) : setActiveMenu(4);
        navigation.navigate('ContactUs');
        navigation.closeDrawer();
      },
    },
    {
      display: true,
      title: translate('AboutTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="information-circle-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 3 : 5)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),
      action: () => {
        isProvider ? setActiveMenu(3) : setActiveMenu(5);
        navigation.closeDrawer();
        navigation.navigate('About');
      },
    },
    {
      display: true,
      title: translate('changeLanguageTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="language-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 4 : 6)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),
      action: () => {
        isProvider ? setActiveMenu(4) : setActiveMenu(6);
        navigation.closeDrawer();
        navigation.navigate('ChangeLanguage');
      },
    },
    {
      display: true,
      title: translate('changePasswordTitle'),
      icon: (
        <IIcon
          size={iconSize}
          name="lock-open-outline"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 5 : 7)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),
      action: () => {
        isProvider ? setActiveMenu(5) : setActiveMenu(7);
        navigation.closeDrawer();
        navigation.navigate('ChangePassword', { from: 'drawer' });
      },
    },
    {
      display: true,
      title: 'Dark Mode',
      icon: (
        <MCIcon
          size={iconSize}
          name="theme-light-dark"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === (isProvider ? 1 : 3)
              ? { color: BaseColors.primary }
              : {},
          ]}
        />
      ),
      action: () => {
        // navigation.navigate('Dashboard');
        navigation.closeDrawer();
      },
    },
    {
      display: true,
      title: translate('logoutTitle'),
      icon: (
        <MCIcon
          size={iconSize}
          name="logout"
          style={[
            {
              marginRight: 15,
              color: BaseColors.lightBlack,
            },
            activeMenu === 8 ? { color: BaseColors.primary } : {},
          ]}
        />
      ),
      action: () => {
        setVisible(!visible);
      },
    },
  ];

  useFocusEffect(
    useCallback(() => {
      setActiveMenu('');
      setImagePath(
        userData?.profileImage
          ? userData.profileImage
          : 'https://icon-library.com/images/user-icon-image/user-icon-image-17.jpg',
      );
      const currentSwitch = switchOptions.find(
        (c) => c.id === userData?.onlineStatus,
      );
      setActiveSwitch(currentSwitch);
    }, [userData, darkmode]),
  );

  useEffect(() => {
    (async () => {
      if (isEmpty(userData)) {
        return '';
      }
      const allCountries = await getAllCountries();
      const result = await allCountries.find(
        (c) => c.name === userData?.country,
      );
      setMyCountry(result);

      const currentSwitch = switchOptions.find(
        (c) => c.id === userData?.onlineStatus,
      );
      setActiveSwitch(currentSwitch);
    })();
  }, [userData]);

  const logOutNew = async () => {
    // try {
    let resp = await getApiData(
      `${BaseSetting.endpoints.logOut}?uuid=${fcmToken}`,
      'GET',
    );
    logout();
  };

  // const handleLogout = () => {
  //   CAlert(
  //     translate('doYouWantToLogout'),
  //     translate('logoutTitle'),
  //     () => {
  //       navigationRef?.current?.reset({
  //         index: 0,
  //         routes: [{ name: 'Login' }],
  //       });
  //       logOutNew();
  //     },
  //     () => {
  //       null;
  //     },
  //     translate('yes'),
  //     translate('no'),
  //   );
  // };
  const openAlert = (listView) => {
    if (listView.id === 1) {
      CAlert(
        translate('areYouSureYouWantToSwitchToAvailable'),
        translate('alert'),
        () => {
          tabSwitchHandle(listView.id);
        },
        () => {
          setActiveSwitch({ id: 1 });
        },
        translate('yes'),
        translate('no'),
      );
    } else {
      CAlert(
        translate('areYouSureYouWantToSwitchToNonAvailable'),
        translate('alert'),
        () => {
          tabSwitchHandle(listView.id);
        },
        () => {
          setActiveSwitch({ id: 0 });
        },
        translate('yes'),
        translate('no'),
      );
    }
  };

  const tabSwitchHandle = async (id) => {
    // setActiveSwitch({ id: id });
    try {
      const Onlinedata = {
        id: userData.id,
        onlineStatus: userData.onlineStatus,
      };
      console.log('OnlineOffline data', Onlinedata);
      let response = await PutSPProfileOnlineStatus(Onlinedata);
      setActiveSwitch({ id: userData.onlineStatus });
    } catch (error) {}
  };

  const tabSwitchHandleA = () => {
    setActiveSwitch({ id: 0 });
  };

  const renderTab = () => {
    return (
      <View style={styles.tabview}>
        <TabSwitch
          tabs={switchOptions}
          activeTab={activeSwitch}
          tabSize={Dimensions.get('window').width * 0.7}
          subTabSize={Dimensions.get('window').width / 3}
          onTabChange={(listView) => {
            activeSwitch.id === listView.id ? null : openAlert(listView);
          }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: BaseColors.white,
        paddingTop: IOS ? getStatusBarHeight() : 0,
        height: headerHeight,
        overflow: 'hidden',
      }}>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: BaseColors.primary,
          opacity: isDarkMode ? 1 : 0.08,
          position: 'absolute',
          right: -30,
          bottom: -60,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
          color: 'red',
        }}
      />
      <View
        style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: BaseColors.primary,
          opacity: isDarkMode ? 0.3 : 0.08,
          position: 'absolute',
          right: -55,
          bottom: -90,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
        }}
      />
      <View
        style={{
          width: 260,
          height: 260,
          borderRadius: 130,
          backgroundColor: BaseColors.primary,
          opacity: isDarkMode ? 0.2 : 0.09,
          position: 'absolute',
          left: -70,
          top: -50,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
          color: 'red',
        }}
      />
      <View
        style={{
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: BaseColors.primary,
          opacity: 0.08,
          position: 'absolute',
          left: -100,
          top: -85,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
          color: 'red',
        }}
      />
      <View
        style={{
          width: 420,
          height: 420,
          borderRadius: 210,
          backgroundColor: BaseColors.primary,
          opacity: 0.08,
          position: 'absolute',
          left: -130,
          top: -120,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
          color: 'red',
        }}
      />
      <View
        style={{
          width: 500,
          height: 500,
          borderRadius: 250,
          backgroundColor: BaseColors.primary,
          opacity: 0.08,
          position: 'absolute',
          left: -160,
          top: -155,
          alignItems: 'center',
          justifyContent: 'center',
          // zIndex: 11,
          color: 'red',
        }}
      />
      <View
        containerStyle={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 45,
          paddingHorizontal: 20,
          borderBottomWidth: 0.8,
          borderColor: BaseColors.inactive,
        }}
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingVertical: 45,
          paddingHorizontal: 20,
          // borderBottomWidth: 0.8,
          borderColor: BaseColors.inactive,
          // backgroundColor: 'red',
        }}>
        <TouchableOpacity
          // onPress={() =>
          //   isProvider
          //     ? navigation.openDrawer()
          //     : navigationRef?.current?.navigate('MyProfile')
          // }
          activeOpacity={1}>
          <LightBoxContainer
            navigator={navigator}
            children={() => {
              return (
                <Image
                  source={{
                    uri: imagePath,
                  }}
                  style={styles.profilePic}
                />
              );
            }}
          />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            top: 10,
            right: 0,
            padding: 5,
            paddingRight: 10,
            marginVertical: 4,
            // borderRadius: 6,
            borderTopStartRadius: 20,
            borderBottomStartRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: BaseColors.primary,
          }}>
          <IconComponent name={Images.coin} size={24} style={styles.coinIcon} />
          <Text color={BaseColors.lightBlack}>
            {userData?.coin ? userData.coin : 0}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            isProvider
              ? navigation.openDrawer()
              : navigationRef?.current?.navigate('MyProfile')
          }
          style={styles.nameContainer}
          // onPress={() => navigationRef?.current?.navigate('MyProfile')}
          activeOpacity={1}>
          <Text
            type="title"
            color="black"
            numberOfLines={2}
            style={{
              fontWeight: '700',
              fontSize: 20,
              color: BaseColors.lightBlack,
            }}>
            {`${firstName} ${lastName}`}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {myCountry && (
              <>
                <CountryPicker
                  countryCode={myCountry?.cca2}
                  withFlagButton={true}
                  visible={false}
                  modalProps={{ visible: false }}
                  flagSize={2}
                  theme={{
                    fontSize: 10,
                    flagSize: '20',
                    color: BaseColors.lightBlack,
                  }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: BaseColors.lightBlack,
                  }}>
                  {myCountry?.cca2}
                </Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.switchview}>{isProvider ? renderTab() : null}</View>
      <View style={styles.listMenuView}>
        <FlatList
          bounces={false}
          data={MenuList.filter((m) => m.display)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => item.action()}
              style={[styles.menuRow]}>
              <View style={{ flexDirection: 'row' }}>
                {item.icon}
                <Text
                  type="subHeading"
                  // onPress={() => item.action()}
                  style={{}}
                  color={
                    index + 1 === activeMenu
                      ? BaseColors.primary
                      : BaseColors.lightBlack
                  }>
                  {item.title}
                </Text>
              </View>
              {item.title === 'Logout' ? null : item.title === 'Dark Mode' ? (
                <ToggleSwitch
                  size="medium"
                  isOn={isDarkMode}
                  onToggle={(val) => {
                    setIsDarkMode(val);
                    handleMode(val, navigationRef);
                    navigation.closeDrawer();
                    console.log(val);
                  }}
                  onColor={BaseColors.whiteColor}
                  labelStyle={{ marginRight: 15 }}
                  thumbOnStyle={{
                    backgroundColor: BaseColors.primary,
                    marginRight: 15,
                  }}
                  thumbOffStyle={{
                    backgroundColor: BaseColors.white,
                    marginRight: 15,
                  }}
                  trackOnStyle={{
                    borderWidth: 1,
                    backgroundColor: BaseColors.white,
                    borderColor: BaseColors.primary,
                    marginRight: 15,
                  }}
                  trackOffStyle={{
                    borderWidth: 1,
                    borderColor: '#ecf0f1',
                    marginRight: 15,
                  }}
                />
              ) : (
                <EIcon
                  name="chevron-thin-right"
                  size={16}
                  style={[
                    {
                      color: BaseColors.lightBlack,
                    },
                    index + 1 === activeMenu
                      ? { color: BaseColors.primary }
                      : {},
                  ]}
                />
              )}
            </TouchableOpacity>
          )}
        />
        {/* <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleLogout()}
          style={styles.menuRowLast}>
          <FIcon size={iconSize} name="log-out" style={[styles.listIcon]} />
          <Text
            type="subHeading"
            color={BaseColors.lightBlack}
            style={{ fontWeight: '700' }}>
            Logout
          </Text>
        </TouchableOpacity> */}
        <Text
          style={{
            paddingBottom: isIPhoneX ? 20 : 10,
            fontWeight: '700',
            color: BaseColors.textSecondary,
            fontSize: 16,
            textAlign: 'center',
          }}>
          {translate('version')} : {version}
        </Text>
      </View>
      {/* {
        <AlertModal
          visible={visible}
          setVisible={setVisible}
          heading={translate('logoutTitle')}
          message={translate('doYouWantToLogout')}
          btnOne={'YES'}
          btnTwo={'NO'}
          onPressOne={() => {
            navigationRef?.current?.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
            logOutNew();
            setVisible(!visible);
          }}
          onPressTwo={() => {
            console.log('CANCELLED');
            setVisible(!visible);
          }}
        />
      } */}
    </View>
  );
}

const styles = StyleSheet.create({
  drawerMenuLayout: {
    flex: 1,
    // alignItems: 'center',
    // backgroundColor: BaseColors.white,
    paddingTop: IOS ? getStatusBarHeight() : 0,
    height: headerHeight,
    overflow: 'hidden',
  },
  headerMenuView: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 45,
    paddingHorizontal: 20,
    borderBottomWidth: 0.8,
    // borderColor: BaseColors.inactive,
  },
  listMenuView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  profilePic: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  nameContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  menuRow: {
    flexDirection: 'row',
    // paddingHorizontal: 20,
    // paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  menuRowLast: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    // borderTopWidth: 0.7,
    // borderColor: BaseColors.borderColor,
    width: '100%',
  },
  listIcon: {
    marginRight: 15,
    // color: BaseColors.lightBlack,
  },
  arrowIcon: {
    // color: BaseColors.lightBlack,
  },
  coinIcon: {
    marginRight: 4,
  },
  coinsRow: {
    position: 'absolute',
    top: 10,
    right: 0,
    padding: 5,
    paddingRight: 10,
    marginVertical: 4,
    // borderRadius: 6,
    borderTopStartRadius: 20,
    borderBottomStartRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: BaseColors.primary,
  },
  tabview: {
    // backgroundColor: 'red',
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 10,
  },
  switchview: {
    width: '100%',
    paddingVertical: 5,
    // backgroundColor: 'red',
    marginTop: -30,
    paddingBottom: 15,
  },
});
