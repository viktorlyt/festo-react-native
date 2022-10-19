/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Text, Button, AlertModal } from '@components';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import ENIcon from 'react-native-vector-icons/Entypo';
import Image from 'react-native-fast-image';
import { isEmpty, isNull, _ } from 'lodash';
import { Images } from '@config';
import { useSelector } from 'react-redux';
import { BaseColors, FontFamily } from '@config/theme';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CustomIcon } from '@config/LoadIcons';
import RenderHTML from 'react-native-render-html';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import Toast from 'react-native-simple-toast';

const PartyCard = (props) => {
  const {
    item,
    from,
    selected,
    handleInviteFriends,
    handleQR,
    handleInterestClick,
    handlePartyClick,
    handleFriendsList,
    handleSendRequast,
    handleEditParty,
    handleOptions,
    reqBtnLoader,
    renderPayment,
    reloadPage,
  } = props;

  const [optionVisible, setOptionVisible] = useState(false);
  const hostDetails = _.has(item, 'host_info') ? item?.host_info : item?.host;
  const { userData } = useSelector((state) => state.auth);
  const isMe = Number(userData?.id) === Number(item?.host?.host_id);
  const [cAlert, setCAlert] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const btnsItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          handleInterestClick(item);
        }}
        style={
          ([styles.btnTxtView],
          {
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 20,
            marginLeft: index === 0 ? 10 : 0,
            marginRight: 10,
            backgroundColor: BaseColors.offWhite,
          })
        }>
        <Text
          style={
            ([styles.btnTxt],
            {
              fontSize: 14,
              fontFamily: FontFamily.medium,
              color: BaseColors.lightBlack,
            })
          }>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  async function cancleParty() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cancleParty}?party_id=${item.id}`,
        'GET',
      );
      if (response.status) {
        Toast.show(response?.message);
        setBtnLoader(false);
        reloadPage();
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
      setBtnLoader(false);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePartyClick}
      style={styles.item}>
      <View
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}>
        <Image
          source={
            isEmpty(item?.party_images[0]?.image_url)
              ? Images.eventImg
              : { uri: item?.party_images[0]?.image_url }
          }
          style={styles.userImg}
        />
        <View style={styles.menuIconView}>
          {optionVisible ? (
            <TouchableOpacity
              onPress={() => {
                setOptionVisible(false);
                handleOptions(item);
              }}
              activeOpacity={0.6}
              style={{
                backgroundColor: '#fff',
                padding: 5,
                top: 0,
                right: 5,
                borderRadius: 8,
              }}>
              <Text>Rate this party</Text>
            </TouchableOpacity>
          ) : null}
          {selected === 'Joined' &&
          !from &&
          Number(item.is_already_rated) === 0 &&
          item.is_expired === 1 ? (
            <TouchableOpacity
              onPress={() => setOptionVisible(!optionVisible)}
              activeOpacity={0.6}
              style={{
                paddingVertical: 5,
                borderRadius: 5,
                backgroundColor: BaseColors.white,
              }}>
              <ENIcon
                style={styles.menuIcon}
                name="dots-three-vertical"
                size={18}
                color={BaseColors.black}
              />
            </TouchableOpacity>
          ) : selected === 'Created' &&
            Number(item?.is_editable) === 1 &&
            isMe ? (
            <TouchableOpacity
              onPress={handleEditParty}
              activeOpacity={0.6}
              style={{
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 15,
                backgroundColor: BaseColors.white,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.6,
                shadowRadius: 20,
                elevation: 6,
              }}>
              <ENIcon
                style={styles.menuIcon}
                name="edit"
                size={16}
                color={BaseColors.black}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        {item?.is_free === 0 ? (
          <View style={styles.paidSheetImgview}>
            <Text bold style={styles.paidImg}>
              Paid
            </Text>
          </View>
        ) : null}
        {!_.isEmpty(item?.interests) && _.isArray(item?.interests) ? (
          <View
            style={{
              position: 'absolute',
              bottom: 10,
            }}>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={btnsItem}
              data={item?.interests}
              // ListFooterComponent={footerRenderItem}
              // contentContainerStyle={styles.Sec_list}
              bounces={false}
              keyExtractor={(item) => item.id}
            />
          </View>
        ) : null}
      </View>

      <View style={[styles.rowView, { justifyContent: 'space-between' }]}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            source={
              isNull(hostDetails?.photo)
                ? Images?.usrImg
                : { uri: hostDetails?.photo }
            }
            style={styles.profileImg}
          />
          <View
            style={{
              marginLeft: 10,
            }}>
            <Text
              bold
              numberOfLines={1}
              style={[
                styles.userName,
                { fontSize: 14, fontFamily: FontFamily.bold },
              ]}>
              {hostDetails?.name}
            </Text>
            <Text numberOfLines={1} style={styles.Host}>
              Host
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={item.is_blocked === 1 ? 1 : 0.5}
          onPress={item.is_blocked === 1 ? null : () => handleFriendsList(item)}
          style={styles.imgsView}>
          {item?.joining_user.slice(0, 2)?.map((it, ii) => {
            return (
              <Image
                source={
                  !_.isEmpty(it)
                    ? { uri: it }
                    : require('@assets/Images/avatar.png')
                }
                style={[
                  styles.imgOne,
                  {
                    marginLeft: ii > 0 ? -16 : 0,
                  },
                ]}
              />
            );
          })}

          {item?.joining_user_count > 2 ? (
            <View
              style={[
                styles.imgOne,
                {
                  backgroundColor: '#585858',
                  marginLeft: -16,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <Text style={styles.addPerson}>{`${
                item.joining_user_count - 2
              } +`}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <Text numberOfLines={1} style={styles.caption}>
        {item?.title}
      </Text>
      <View style={styles.commomFlex}>
        <CustomIcon
          style={[styles.addIcon, { paddingRight: 12 }]}
          name="party"
          size={22}
          color={BaseColors.primary}
        />
        <Text numberOfLines={1} bold>
          {item?.party_type === 0 ? 'Public Party' : 'Private Party'}
        </Text>
      </View>
      <View style={styles.commomFlex}>
        <CustomIcon
          style={[styles.addIcon, { paddingRight: 10 }]}
          name="price"
          size={15}
          color={BaseColors.primary}
        />
        <Text
          bold
          numberOfLines={1}
          style={[styles.details, { fontFamily: FontFamily.bold }]}>
          {item?.is_free === 0 ? ` £${item?.price}` : 'Free'}
        </Text>
      </View>
      <View style={styles.commomFlex}>
        <CustomIcon
          style={[styles.addIcon, { paddingRight: 10 }]}
          name="calender-active"
          size={22}
          color={BaseColors.primary}
        />

        <Text numberOfLines={1} style={styles.details}>
          {item?.at_date} - {item?.from_time}
        </Text>
      </View>
      {selected === 'Current' || selected === 'Joined' ? (
        <View style={styles.commomFlex}>
          <CustomIcon
            style={[styles.addIcon, { paddingRight: 12, paddingLeft: 2 }]}
            name="timer"
            size={22}
            color={BaseColors.primary}
          />
          {item?.is_expired === 1 ? (
            <Text numberOfLines={1} bold style={{ color: BaseColors.primary }}>
              Party finished
            </Text>
          ) : item?.is_expired === 0 &&
            item?.is_started === 0 &&
            item?.days_left > 0 ? (
            <Text numberOfLines={1} bold style={{ color: BaseColors.primary }}>
              {`${item?.days_left || 0} Days Left`}
            </Text>
          ) : item?.is_expired === 0 &&
            item?.is_started === 0 &&
            item?.days_left === 0 ? (
            <Text numberOfLines={1} bold style={{ color: BaseColors.primary }}>
              This party is going to take place today!
            </Text>
          ) : item?.is_expired === 0 && item?.is_started === 1 ? (
            <Text numberOfLines={1} bold style={{ color: BaseColors.primary }}>
              Party is started
            </Text>
          ) : null}
        </View>
      ) : null}
      <View style={[styles.commomFlex, { overflow: 'hidden' }]}>
        <CustomIcon
          style={[styles.addIcon, { paddingRight: 12, paddingLeft: 4 }]}
          name="marker"
          size={22}
          color={BaseColors.primary}
        />
        <Text numberOfLines={2} style={{ flex: 1 }}>
          {item?.location}
        </Text>
      </View>
      <View style={styles.rowView}>
        <Text numberOfLines={3} style={[styles.details, { paddingTop: 15 }]}>
          <Text style={{ fontFamily: FontFamily.bold }}>Note:-</Text>
        </Text>
      </View>
      {isNull(item?.note) ? (
        '  -'
      ) : (
        <View style={{ flex: 1, marginBottom: 10 }} numberOfLines={3}>
          <RenderHTML source={{ html: item?.note }} />
        </View>
      )}
      {Number(item?.is_expired) === 1 ||
      Number(item.is_blocked) === 1 ||
      selected === '' ? null : !isMe &&
        from &&
        Number(item?.is_already_joined) === 0 ? (
        <View style={{ marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={{
              backgroundColor:
                item?.is_already_requested === 0
                  ? BaseColors.primary
                  : BaseColors.lightRed,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 10,
              borderWidth: item?.is_already_requested === 0 ? 0 : 1,
              borderColor:
                item?.is_already_requested === 0
                  ? BaseColors.white
                  : BaseColors.primary,
            }}
            onPress={() => {
              if (item?.show_pay_btn === 1) {
                renderPayment(item);
              } else if (item?.is_already_requested === 0) {
                handleSendRequast(item?.id, item?.host?.host_id, 'accept');
              } else {
                handleSendRequast(item?.id, item?.host?.host_id, 'cancel');
              }
            }}>
            {reqBtnLoader === item?.id ? (
              <ActivityIndicator
                color={
                  item?.is_already_requested === 0
                    ? BaseColors.white
                    : BaseColors.secondary
                }
                size="small"
                animating
              />
            ) : (
              <Text
                style={{
                  color:
                    item?.is_already_requested === 0
                      ? BaseColors.white
                      : BaseColors.primary,
                  fontSize: 16,
                }}>
                {item?.show_pay_btn === 1
                  ? 'Pay Now'
                  : item?.is_already_requested === 0
                  ? 'Request to Join'
                  : 'Cancel Request'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : isMe ? (
        <View style={styles.btnView}>
          {from ? null : selected === 'Current' || selected === 'Joined' ? (
            <View style={styles.btnOne}>
              <Button type="outlined" onPress={() => handleQR(item)}>
                <MIcon
                  style={[styles.pinIcon, { marginRight: 10 }]}
                  name="qrcode"
                  size={18}
                  color={BaseColors.primary}
                />
                {'   Party QR'}
              </Button>
            </View>
          ) : (
            <View style={styles.btnOne}>
              <Button type="outlined" onPress={() => handleQR(item)}>
                <MIcon
                  style={[styles.pinIcon, { marginRight: 10 }]}
                  name="qrcode"
                  size={18}
                  color={BaseColors.primary}
                />
                {'   Scan QR'}
              </Button>
            </View>
          )}
          <View
            style={[
              styles.btnOne,
              {
                marginLeft: from
                  ? 0
                  : selected === 'Current' || selected === 'Created'
                  ? item?.show_qr === 0 || !_.has(item, 'qr_code')
                    ? 2
                    : 10
                  : 10,
              },
            ]}>
            <Button
              style={{
                borderWidth: 1,
                borderColor: BaseColors.primary,
              }}
              type="primary"
              onPress={() => {
                handleInviteFriends(item);
              }}>
              {'Invite Friends'}
            </Button>
          </View>
        </View>
      ) : null}
      {isMe &&
      selected === 'Created' &&
      item.is_expired === 0 &&
      item.is_started === 0 ? (
        <View
          style={[
            styles.btnOne,
            {
              flex: 1,
              marginTop: 8,
            },
          ]}>
          <Button
            style={{
              borderWidth: 1,
              borderColor: BaseColors.primary,
            }}
            type="primary"
            onPress={() => {
              setCAlert(true);
            }}>
            {'Cancel Party'}
          </Button>
        </View>
      ) : null}
      {cAlert ? (
        <AlertModal
          loader={btnLoader}
          title=" "
          visible={cAlert.showAlert}
          setVisible={setCAlert}
          description={
            'Are you sure you want to cancel this party? \n\n If you are doing repeatedly this before starting the party then your account will be locked.'
          }
          btnYTitle={'Confirm'}
          btnNTitle="Cancel"
          btnYPress={() => {
            setCAlert(false);
            cancleParty();
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export default PartyCard;
