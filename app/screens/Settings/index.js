/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';

import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import VersionNumber from 'react-native-version-number';
import styles from './styles';
import { Header, Button, AlertModal, ListModal } from '@components';
import FormModal from '@components/FormModal';
import EIcon from 'react-native-vector-icons/EvilIcons';
import { BaseColors, FontFamily } from '@config/theme';
import ToggleSwitch from 'toggle-switch-react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-simple-toast';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import { logout } from '@utils/CommonFunction';
import { useSelector } from 'react-redux';
import { RadioButton } from 'react-native-paper';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isNull,
  isObject,
  toNumber,
} from 'lodash';
/**
 * Module  Settings
 * @module  Settings
 *
 */

export default function Settings({ navigation, route }) {
  const refRBSheet = useRef();
  const Blocksheet = useRef();
  const profileData = route?.params?.data || {};
  const { fcmToken } = useSelector((state) => state.notification);

  const [cAlert, setCAlert] = useState(false);
  const [checked, setChecked] = useState('');

  //Loaders
  const [pageLoader, setPageLoader] = useState(false);
  const [buttonloader, setButtonLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const [blockList, setBlockList] = useState([]);
  // const [arrIndex, setArrIndex] = useState('');
  const [moreLoad, setMoreLoad] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [refreshLoader, setRefreshLoader] = useState(false);

  const [dropDownData, setDropDownData] = useState([]);
  const [notificationData, setNotificationData] = useState(
    profileData?.user_setting,
  );

  const [SettingsTabs, setSettingsTabs] = useState([
    {
      id: 1,
      title: 'All notification',
      action: 'all_notification',
      isOn: false,
    },
    {
      id: 2,
      title: 'Party Invite',
      action: 'party_invite',
      isOn: false,
    },
    {
      id: 3,
      title: 'Upcoming Parties',
      action: 'upcoming_party',
      isOn: false,
    },
  ]);

  const BtmTabs = [
    {
      id: 1,
      title: 'Get Paid',
      iconName: 'arrow-right',
      action: 'GetPaid',
      CustomRight: true,
    },
    {
      id: 2,
      title: 'Billing',
      iconName: 'arrow-right',
      action: 'AddCreditCard2',
      CustomRight: false,
      from: 'privacy',
    },
    {
      id: 3,
      title: 'Block List',
      iconName: 'arrow-right',
      action: 'BlockList',
      CustomRight: false,
      from: 'help',
    },
    {
      id: 4,
      title: 'Logout',
      CustomRight: false,
      action: 'Intro',
      from: 'help',
    },
  ];

  useEffect(() => {
    getBlockList();
    getDropDownData();
  }, []);

  useEffect(() => {
    const dummyArr = [...SettingsTabs];
    dummyArr.map((item, index) => {
      if (isNull(notificationData)) {
        item.isOn = false;
      } else {
        if (item?.action === 'all_notification') {
          if (Number(notificationData?.all_notification) === 1) {
            item.isOn = true;
          } else {
            item.isOn = false;
          }
        } else if (item?.action === 'party_invite') {
          if (Number(notificationData?.party_invite) === 1) {
            item.isOn = true;
          } else {
            item.isOn = false;
          }
        } else if (item?.action === 'upcoming_party') {
          if (Number(notificationData?.upcoming_party) === 1) {
            item.isOn = true;
          } else {
            item.isOn = false;
          }
        }
      }
    });
    setSettingsTabs(dummyArr);
  }, [notificationData]);

  function stopLoader() {
    setPageLoad(false);
    setRefreshLoader(false);
    setMoreLoad(false);
  }

  // this function for getBlockList  list
  async function getBlockList(bool) {
    setPageLoader(true);
    const cPage =
      blockList && blockList.pagination && blockList.pagination.currentPage
        ? toNumber(blockList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.blockList}?page=${page_no}`,
        'GET',
      );
      if (
        isObject(response) &&
        !isEmpty(response) &&
        response.status === true
      ) {
        setPageLoader(false);
        const obj = bool ? {} : cloneDeep(blockList);

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
        setBlockList(obj);
      }
      stopLoader();
    } catch (error) {
      console.log('error ===>>>', error);
      stopLoader();
    }
  }

  // this function for unBlock user
  async function unBlockUser(id) {
    setButtonLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.unblockUser}?user_id=${id}`,
        'GET',
      );
      if (response.status === true) {
        setButtonLoader(false);
        // setArrIndex('');
        Toast.show(response?.message);
        getBlockList(true);
      } else {
        setButtonLoader(false);
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      setButtonLoader(false);
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      // setArrIndex('');
    }
  }

  // this function for getDropDownData
  async function getDropDownData() {
    try {
      const response = await getApiData(
        BaseSetting.endpoints.getDropDown,
        'GET',
      );
      if (
        response.status === true &&
        isArray(response?.data?.reasons) &&
        !isEmpty(response?.data?.reasons)
      ) {
        setDropDownData(response?.data?.reasons);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      // setArrIndex('');
    }
  }

  // Delete Account Function
  async function deleteAccount() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.deleteAccount}?delete_reason_id=${checked}`,
        'GET',
      );
      if (response.status) {
        Toast.show(response?.message);
        logout();
        setBtnLoader(false);
      } else {
        console.log('No data Found');
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
        setBtnLoader(false);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setPageLoad(false);
      setBtnLoader(false);
    }
  }

  // Logout Account Function
  async function LogoutAccount() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.logOut}?uuid=${fcmToken}`,
        'GET',
      );
      logout();
      setBtnLoader(false);
      console.log('res====', response?.message);
    } catch (error) {
      console.log('error ===>>>', error);
      setPageLoad(false);
      setBtnLoader(false);
    }
  }

  // Delete Account Function
  async function changeNotification(type, isOn) {
    const value = isOn ? 0 : 1;
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.notification}?type=${type}&value=${value}`,
        'GET',
      );
      if (response.status) {
        setNotificationData(response?.data);
      }
    } catch (error) {
      console.log('error ===>>>', error);
      setPageLoad(false);
    }
  }

  async function getMoreData(listdata) {
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
      getBlockList(false);
    }
  }

  function onRefresh() {
    setRefreshLoader(true);
    setPageLoad(true);
    setTimeout(() => {
      getBlockList(true);
    }, 2000);
  }

  function renderFooterComponent(listdata) {
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

  // render block list
  const renderBlockList = (listData, listRef, btnTitle, type) => {
    return (
      <ListModal
        ListArray={listData}
        pageLoad={pageLoader}
        btnTitle={btnTitle}
        itemBtn={type}
        buttonloader={buttonloader}
        handleUnblock={(item) => {
          console.log('handleMainBtn =====>>>> ');
          unBlockUser(item.id);
        }}
        renderFooterComponent={() => renderFooterComponent(listData)}
        refreshLoader={refreshLoader}
        onRefresh={() => {
          onRefresh(type);
        }}
        onEndReached={() => {
          getMoreData(listData);
        }}
      />
    );
  };

  function renderBlockListModal() {
    return (
      <FormModal
        rbSheetRef={Blocksheet}
        title={`${(blockList?.data && blockList?.data?.length) || 0
          } People Blocked`}>
        {renderBlockList(blockList?.data, Blocksheet, '', 'block-list')}
      </FormModal>
    );
  }

  function deleteAltert() {
    if (isEmpty(checked.toString())) {
      Toast.show('Please select reasone');
    } else {
      refRBSheet.current.close();
      setCAlert({ vis: true, type: 'delete' });
    }
  }

  function renderDeleteReasoneModal() {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={450}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            backgroundColor: '#F3492E',
            width: 50,
          },
          container: {
            backgroundColor: 'white',
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
          },
        }}>
        <Text style={styles.Texto}>Why you want to delete account?</Text>
        <ScrollView style={styles.Vieww}>
          {dropDownData.map((item, index) => {
            return (
              <View style={styles.rowView}>
                <RadioButton
                  color="#F3492E"
                  value={checked === item?.label}
                  status={checked === item?.label ? 'checked' : 'unchecked'}
                  onPress={() => setChecked(item?.label)}
                />
                <Text style={styles.textQuestion}>{item?.value}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.btnView}>
          <View style={styles.btnOne}>
            <Button
              type="outlined"
              onPress={() => {
                deleteAltert();
              }}>
              Continue
            </Button>
          </View>
          <View style={styles.btnOne}>
            <Button
              type="primary"
              onPress={() => {
                refRBSheet.current.close();
              }}>
              Back to Festo
            </Button>
          </View>
        </View>
      </RBSheet>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: BaseColors.white }}>
      <Header
        title="Settings"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
        antIcon
        rightIcon
        rightIconName="infocirlceo"
        onRightAction={() => {
          navigation.navigate('PrivacyPolicy');
        }}
      />
      <ScrollView style={styles.container}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.heading}>Notification</Text>
          <Text style={styles.subHeading} numberOfLines={2}>
            which notification you allow we are sending this to your mobile
            phone
          </Text>
        </View>
        {SettingsTabs.map((item, index) => (
          <View style={styles.tabNameView}>
            <Text numberOfLines={1} style={styles.tabText}>
              {item.title}
            </Text>
            <ToggleSwitch
              size="small"
              isOn={item.isOn}
              onToggle={() => {
                changeNotification(item?.action, item?.isOn);
              }}
              thumbOnStyle={{
                backgroundColor: BaseColors.secondary,
              }}
              trackOnStyle={{
                borderWidth: 0.9,
                backgroundColor: BaseColors.white,
                borderColor: BaseColors.primary,
              }}
              thumbOffStyle={{
                backgroundColor: BaseColors.lightGrey,
              }}
              trackOffStyle={{
                borderWidth: 0.9,
                borderColor: BaseColors.lightGrey,
              }}
            />
          </View>
        ))}

        {BtmTabs.map((item, index) => (
          <View
            style={[
              styles.BottomTabs,
              {
                marginTop: index === 0 ? 10 : 0,
                borderBottomWidth: index === 3 ? 0 : 0.6,
                borderTopWidth: index === 0 ? 0.6 : 0,
              },
            ]}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => {
                if (index === 2) {
                  Blocksheet.current.open();
                } else if (index === 3) {
                  setCAlert({ vis: true, type: 'logout' });
                } else {
                  navigation.navigate(item.action, { from: 'settings' });
                }
              }}
              activeOpacity={0.2}>
              <Text numberOfLines={1} style={styles.btmtabText}>
                {item.title}
              </Text>
              <View style={styles.rightIcon}>
                <EIcon
                  name={item.iconName}
                  style={{
                    fontSize: 28,
                    color: BaseColors.black,
                    fontFamily: FontFamily.bold,
                  }}
                  onPress={() => {
                    navigation.navigate(item.action, { from: 'settings' });
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View
        style={{
          bottom: 30,
          left: 20,
        }}>
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          activeOpacity={0.6}>
          <Text style={styles.btmTxt}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.versionText}>
        <Text style={[styles.btmTxt, { color: '#9E9E9E' }]}>
          {`Version ${VersionNumber.appVersion} (${VersionNumber.buildVersion})`}
        </Text>
      </View>
      {cAlert.vis ? (
        <AlertModal
          loader={btnLoader}
          title=" "
          visible={cAlert.showAlert}
          setVisible={setCAlert}
          description={
            cAlert?.type === 'delete'
              ? 'Are you sure you want to delete account?'
              : 'Are you sure you want to logout?'
          }
          btnYTitle={cAlert?.type === 'delete' ? 'Delete' : 'Logout'}
          btnNTitle="Cancel"
          btnYPress={() => {
            cAlert?.type === 'delete' ? deleteAccount() : LogoutAccount();
          }}
        />
      ) : null}
      {renderDeleteReasoneModal()}
      {renderBlockListModal()}
    </View>
  );
}
