/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { includes, isArray, isEmpty } from 'lodash';
import { Button, Header } from '@components';
import { BaseColors, FontFamily } from '@config/theme';
import { getApiData, getApiDataProgress } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import styles from './styles';
import { useDispatch } from 'react-redux';
import AuthAction from '@redux/reducers/auth/actions';

/**
 * Module  AddIntrest
 * @module  AddIntrest
 *
 */
export default function AddIntrest({ navigation, route }) {
  const dispatch = useDispatch();
  const from = route?.params?.from || '';
  const profileData = route?.params?.data || '';
  const [pageLoad, setPageLoad] = useState(true);
  const [itemSelectedList, setItemSelectedList] = useState([]);
  const [lists, setLists] = useState([]);
  const [btnLoad, setBtnLoad] = useState(false);
  const { setInterestList } = AuthAction;

  useEffect(() => {
    getInterestList();
    if (from === 'profile' && !isEmpty(profileData) && isArray(profileData)) {
      setItemSelectedList(profileData);
    }
  }, []);

  // this function for get interests list
  async function getInterestList() {
    setPageLoad(true);
    try {
      const response = await getApiData(
        BaseSetting.endpoints.interestList,
        'GET',
        {},
      );

      if (response.status && isArray(response?.data)) {
        setLists(response.data);
        dispatch(setInterestList(response.data));
      }
      setPageLoad(false);
    } catch (error) {
      console.log('error ===>>>', error);
      setPageLoad(false);
    }
  }

  // this function handles select and deselect intrest
  const itemSelected = (val) => {
    const selectedList = [...itemSelectedList];
    const index = selectedList.findIndex((d) => d === val);
    if (index >= 0) {
      selectedList.splice(index, 1);
    } else {
      selectedList.push(val);
    }
    setItemSelectedList(selectedList);
  };

  // this function checks validation
  function validation() {
    if (isArray(itemSelectedList) && itemSelectedList.length > 4) {
      addIntrest();
    } else {
      Toast.show('Please select at least five party');
    }
  }

  // this function for add intrest
  async function addIntrest() {
    setBtnLoad(true);
    const obj = {};
    if (isArray(itemSelectedList) && itemSelectedList.length > 0) {
      itemSelectedList.map((item, index) => {
        obj[`UserInterest[${index}]`] = item;
      });
    }

    try {
      const response = await getApiDataProgress(
        BaseSetting.endpoints.addIntrest,
        'POST',
        obj,
      );

      if (response.status) {
        Toast.show(response?.message);
        // if (from === 'otp') {
        //   navigation.navigate('FindScreen');
        // } else {
        //   navigation.goBack();
        // }
        if (from === 'profile') {
          navigation.goBack();
        } else {
          navigation.navigate('FindScreen');
        }
      } else {
        Toast.show(response?.message);
      }
      setBtnLoad(false);
    } catch (error) {
      console.log('error ===>>>', error);
      Toast.show(error.toString());
      setBtnLoad(false);
    }
  }

  return (
    <>
      <View
        style={from === 'profile' ? styles.mainContainer : styles.container}>
        {from === 'profile' ? (
          <Header
            title="Edit Interest"
            leftIcon
            leftIconName="arrowleft"
            onBackPress={() => navigation.goBack()}
          />
        ) : (
          <>
            <View style={styles.titleImgView} />
            <Text style={[styles.headingTxt, { fontFamily: FontFamily.bold }]}>
              Add your interest
            </Text>
            <Text
              style={[
                styles.headingTxt,
                {
                  fontSize: 15,
                  color: BaseColors.textGrey,
                  paddingHorizontal: 20,
                  marginBottom: 10,
                },
              ]}>
              You are almost done! Select at least 5 Party so we can show you
              more parties you like.
            </Text>
          </>
        )}
        {pageLoad ? (
          <View style={styles.loaderView}>
            <ActivityIndicator color={BaseColors.primary} size="large" />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={[
              styles.scoll,
              from === 'profile' ? { padding: 20 } : {},
            ]}>
            {isArray(lists) &&
              lists.length > 0 &&
              lists.map((item) => {
                return (
                  <TouchableOpacity
                    key={`intrest_${item?.value}`}
                    onPress={() => itemSelected(item.value)}
                    style={[
                      styles.btnTxtView,
                      {
                        backgroundColor: includes(itemSelectedList, item.value)
                          ? BaseColors.primary
                          : BaseColors.white,
                        borderColor: includes(itemSelectedList, item.value)
                          ? BaseColors.primary
                          : BaseColors.borderColor,
                      },
                    ]}
                    activeOpacity={0.4}>
                    <Text
                      style={[
                        styles.btnTxt,
                        {
                          color: includes(itemSelectedList, item.value)
                            ? BaseColors.white
                            : BaseColors.textGrey,
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        )}
      </View>
      {isArray(lists) && lists.length > 0 && (
        <View style={styles.btnView}>
          <Button type="primary" onPress={validation} loading={btnLoad}>
            {from === 'profile' ? 'Save' : 'Done'}
          </Button>
        </View>
      )}
    </>
  );
}
