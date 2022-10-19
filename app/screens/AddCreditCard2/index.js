/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import styles from './styles';
import Image from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EIcon from 'react-native-vector-icons/Entypo';
import { Header, AlertModal, Button } from '@components';
import { BaseColors } from '@config/theme';
import { getApiData } from '@utils/apiHelper';
import CNoData from '@components/CNoData';
import BaseSetting from '@config/setting';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isObject,
  toNumber,
} from 'lodash';
import { Images } from '@config';
import { BiilingCLoader } from '@components/ContentLoader';

/**
 * Module  GetPaid
 * @module  GetPaid
 *
 */

export default function GetPaid({ navigation, route }) {
  const IOS = Platform.OS === 'ios';
  const [pageLoader, setPageLoader] = useState(true);
  const [cardData, setCardData] = useState({});
  const [historyList, setHistoryList] = useState({});

  const [cAlert, setCAlert] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);

  const [refreshLoader, setRefreshLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPageLoader(true);
      getPaidData(true);
    }, []),
  );

  // Delete Account Function
  async function deleteCard() {
    setBtnLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.deleteCard}?token=${cardData?.id}`,
        'GET',
      );
      if (response.status) {
        setCAlert(false);
        Toast.show(response?.message);
        getPaidData(true);
        setBtnLoader(false);
      } else {
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

  // this function for get card List
  async function getCardList() {
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.cardList}`,
        'GET',
      );

      if (response.status === true) {
        setCardData(response?.data);
        stopLoader();
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      stopLoader();
    }
  }

  // this function for get paid data
  async function getPaidData(bool) {
    const cPage =
      historyList &&
      historyList.pagination &&
      historyList.pagination.currentPage
        ? toNumber(historyList.pagination.currentPage)
        : 0;

    let page_no = 0;
    if (bool === true) {
      page_no = 1;
    } else {
      page_no = cPage + 1;
    }

    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.getPaymentHistory}?page=${page_no}`,
        'GET',
      );
      if (response.status === true) {
        if (
          isObject(response) &&
          !isEmpty(response) &&
          response.status === true
        ) {
          const obj = bool ? {} : cloneDeep(historyList);

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
          setHistoryList(obj);
        }
        getCardList();
      } else {
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
        stopLoader();
      }
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      stopLoader();
    }
  }

  function stopLoader() {
    setPageLoader(false);
    setRefreshLoader(false);
    setMoreLoad(false);
  }

  async function getMoreData() {
    const cPage =
      historyList &&
      historyList.pagination &&
      historyList.pagination.currentPage
        ? toNumber(historyList.pagination.currentPage)
        : 0;
    const tPage =
      historyList && historyList.pagination && historyList.pagination.totalPage
        ? toNumber(historyList.pagination.totalPage)
        : 0;
    if (historyList.pagination.isMore === true && cPage < tPage) {
      setMoreLoad(true);
      getPaidData(false);
    }
  }

  function renderFooterComponent() {
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
    } else if (isEmpty(historyList)) {
      return null;
    } else {
      return <View style={styles.listFooterView} />;
    }
  }

  function onRefresh() {
    setRefreshLoader(true);
    setPageLoader(true);
    setTimeout(() => {
      getPaidData(true);
    }, 2000);
  }

  function renderEmptyComponent() {
    return <CNoData />;
  }

  const ListHeader = ({ item, index }) => {
    return (
      <>
        <View style={styles.cardView}>
          {isEmpty(cardData) ? (
            <Button
              style={styles.addBtn}
              type="outlined"
              onPress={() => {
                navigation.navigate('AddCreditCard');
              }}>
              <EIcon style={styles.addIcon} name="plus" size={20} />
              <Text style={{ color: BaseColors.black }}>
                Add Credit Card/Debit Card
              </Text>
            </Button>
          ) : (
            <>
              <Image
                source={require('@assets/Images/creditImg.png')}
                style={styles.cardImg}
              />
              <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={styles.cardDetailsView}>
                  <View>
                    <Text style={styles.nameTxt}>
                      {IOS ? cardData?.brand : cardData?.name || '-'}
                    </Text>
                    <Text style={[styles.nameTxt, { fontSize: 12 }]}>
                      Credit Card
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      isEmpty(cardData)
                        ? navigation.navigate('AddCreditCard')
                        : setCAlert(true);
                    }}
                    activeOpacity={0.6}>
                    <MIcon
                      style={styles.menuIcon}
                      name={isEmpty(cardData) ? 'pencil' : 'delete'}
                      size={20}
                      color={BaseColors.white}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.numTxt}>
                  **** **** **** {cardData?.last4}
                </Text>
                <View style={[styles.cardDetailsView]}>
                  <View>
                    <Text style={[styles.nameTxt, { fontSize: 12 }]}>
                      Expiry Date
                    </Text>
                    <Text style={[styles.nameTxt, { fontSize: 14 }]}>
                      {`${cardData?.exp_month}/${cardData?.exp_year}`}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.nameTxt, { fontSize: 12 }]}>CVV</Text>
                    <Text style={[styles.nameTxt, { fontSize: 14 }]}>***</Text>
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
        <View style={styles.bankDetails}>
          <Text style={styles.detaltxtHeading}>History</Text>
        </View>
      </>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.item]}>
        <View style={styles.profileTitleView}>
          <Image
            source={
              isEmpty(item?.party_photo)
                ? Images.PartyImg
                : { uri: item?.party_photo }
            }
            style={styles.userImg}
          />
          <View style={styles.usernameView}>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={1} style={styles.title}>
                {item?.party_title || '-'}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.friend}>
              Host: {item?.party_host || '-'}
            </Text>
            <Text numberOfLines={1} style={styles.friend}>
              {item?.date || '-'}
            </Text>
          </View>
          <View>
            <Text style={styles.coin}>{item?.amount || '0'}</Text>
            <Text style={styles.time}>Paid</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <Header
        title="Credit Card/Debit Card"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {pageLoader ? (
          <BiilingCLoader />
        ) : (
          <FlatList
            data={historyList?.data}
            horizontal={false}
            scrollsToTop={false}
            renderItem={renderItem}
            refreshing={refreshLoader}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={renderEmptyComponent}
            ListFooterComponent={renderFooterComponent}
            refreshControl={
              <RefreshControl
                colors={[BaseColors.primary]}
                tintColor={BaseColors.primary}
                refreshing={refreshLoader}
                onRefresh={() => {
                  onRefresh();
                }}
              />
            }
            onEndReached={getMoreData}
            onEndReachedThreshold={0.5}
          />
        )}
        <AlertModal
          loader={btnLoader}
          title=" "
          visible={cAlert}
          setVisible={setCAlert}
          description={'Are you sure you want to delete card?'}
          btnYTitle={'Delete'}
          btnNTitle="Cancel"
          btnYPress={() => {
            deleteCard();
          }}
        />
      </View>
    </>
  );
}
