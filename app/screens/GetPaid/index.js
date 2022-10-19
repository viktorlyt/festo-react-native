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
} from 'react-native';
import styles from './styles';
import Image from 'react-native-fast-image';
import { Header } from '@components';
import { BaseColors } from '@config/theme';
import { CustomIcon } from '@config/LoadIcons';
import AIcon from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { getApiData } from '@utils/apiHelper';
import CNoData from '@components/CNoData';
import BaseSetting from '@config/setting';
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isEmpty,
  isObject,
  toNumber,
} from 'lodash';
import { Images } from '@config';
import { GetPaidCLoader } from '@components/ContentLoader';

/**
 * Module  GetPaid
 * @module  GetPaid
 *
 */

export default function GetPaid({ navigation, route }) {
  const [pageLoader, setPageLoader] = useState(true);
  const [bankData, setBankData] = useState({});
  const [historyList, setHistoryList] = useState({});

  const [refreshLoader, setRefreshLoader] = useState(false);
  const [moreLoad, setMoreLoad] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getPaidData(true);
    }, []),
  );

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
        `${BaseSetting.endpoints.getPaid}?page=${page_no}`,
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
        setBankData(response?.data?.details);
        stopLoader();
      }
    } catch (error) {
      console.log('error ===>>>', error);
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
    return (
      <CNoData titleText="No Transection" descriptionText="Records not found" />
    );
  }

  const ListHeader = ({ item, index }) => {
    return (
      <>
        <View style={styles.coinView}>
          <TouchableOpacity
            onPress={() => {
              null;
            }}
            activeOpacity={1}
            style={styles.boxView}>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={styles.coinTxt}>
              £{bankData?.total_payment || '0'}
            </Text>
            <Text style={styles.msgTxt}>Total Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              null;
            }}
            activeOpacity={1}
            style={styles.boxView}>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              style={styles.coinTxt}>
              £{bankData?.pending_payment || '0'}
            </Text>
            <Text style={styles.msgTxt}>Pending Payment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailsView}>
          <View style={styles.bankDetails}>
            <Text style={styles.detaltxtHeading}>Bank Account</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddBankAc', { data: bankData });
              }}
              activeOpacity={0.6}>
              {!isEmpty(bankData?.bank_details) ? (
                <CustomIcon
                  name="edit"
                  size={15}
                  color={BaseColors.lightBlack}
                />
              ) : (
                <AIcon name="plus" size={20} color={BaseColors.lightBlack} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.bankDetails}>
            <Text style={[styles.detaltxtHeading, { fontSize: 14 }]}>
              Bank:
            </Text>
            <Text
              style={[
                styles.detaltxtHeading,
                { fontSize: 14, color: BaseColors.lightGrey },
              ]}>
              {bankData?.bank_details?.bank_name || '-'}
            </Text>
          </View>
          <View style={styles.bankDetails}>
            <Text style={[styles.detaltxtHeading, { fontSize: 14 }]}>
              Account Name
            </Text>
            <Text
              style={[
                styles.detaltxtHeading,
                { fontSize: 14, color: BaseColors.lightGrey },
              ]}>
              {bankData?.bank_details?.account_name || '-'}
            </Text>
          </View>
          <View style={styles.bankDetails}>
            <Text style={[styles.detaltxtHeading, { fontSize: 14 }]}>
              Account Number:
            </Text>
            <Text
              style={[
                styles.detaltxtHeading,
                {
                  fontSize: 14,
                  color: BaseColors.lightGrey,
                  textAlign: 'center',
                },
              ]}>
              {!isEmpty(bankData?.bank_details?.account_number)
                ? ` ${bankData?.bank_details?.account_number}`
                : '-'}
            </Text>
          </View>
          <View style={styles.bankDetails}>
            <Text style={[styles.detaltxtHeading, { fontSize: 14 }]}>
              Account Type
            </Text>
            <Text
              style={[
                styles.detaltxtHeading,
                { fontSize: 14, color: BaseColors.lightGrey },
              ]}>
              {bankData?.bank_details?.account_type || '-'}
            </Text>
          </View>
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
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (item?.user_id) {
                navigation.push('Profile', {
                  from: 'friends',
                  id: item?.user_id,
                });
              }
            }}>
            <Image
              source={
                isEmpty(item?.photo) ? Images.usrImg : { uri: item?.photo }
              }
              style={styles?.userImg}
            />
          </TouchableOpacity>
          <View style={styles.usernameView}>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={1} style={styles.title}>
                {item?.name}
              </Text>
            </View>
            <Text numberOfLines={1} style={styles.friend}>
              {item?.party_title}
            </Text>
            <Text numberOfLines={1} style={styles.friend}>
              {item?.created_at}
            </Text>
          </View>
          <View>
            <Text style={styles.coin}>£{item?.amount}</Text>
            <Text style={styles.time}>Recive</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <Header
        title="Get Paid"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {pageLoader ? (
          <GetPaidCLoader />
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
      </View>
    </>
  );
}
