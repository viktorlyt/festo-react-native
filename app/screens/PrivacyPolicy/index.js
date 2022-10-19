import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';
// import { CHeaderr } from '@components';
import Header from '@components/UI/Header';
import WebView from 'react-native-webview';
import BaseSetting from '@config/setting';
import { getApiData } from '@utils/apiHelper';
import { isEmpty } from 'lodash';
import Toast from 'react-native-simple-toast';
import CNoData from '@components/CNoData';
import { BaseColors } from '@config/theme';

export default function PrivacyPolicy({ navigation }) {
  const [policyDetail, setPolicyDetail] = useState({});
  const [pageLoader, setPageLoader] = useState(true);
  const defaultStyle = `
  <style>
  html, body {overflow-x: 'hidden'; word-break: 'break-all';color: ${BaseColors.lightBlack};background-color:${BaseColors.white};  white-space: 'no-wrap'}img {display: inline; height: auto; max-width: 100%;}
  </style>`;

  const defaultHead = `<meta name="viewport" content="width=device-width, initial-scale=1">${defaultStyle}`;
  useEffect(() => {
    getPolicyData();
  }, []);

  // this function for get PrivacyPolicy data
  async function getPolicyData() {
    setPageLoader(true);
    try {
      const response = await getApiData(
        `${BaseSetting.endpoints.getPages}?slug=privacy_policy`,
        'GET',
      );
      if (response?.status) {
        setPolicyDetail(response?.data?.app_body || '');
      } else {
        console('Error');
        Toast.show(
          response?.message || 'Something went wrong! Please try again',
        );
      }
      setPageLoader(false);
    } catch (error) {
      console.log('getPolicyData ~ error', error);
      setPageLoader(false);
    }
  }
  // this function for render loader
  function renderLoader() {
    return (
      <View style={styles.loaderView}>
        <ActivityIndicator color={BaseColors.primary} size="large" />
      </View>
    );
  }
  return (
    <>
      <Header
        title="Privacy Policy"
        leftIcon
        leftIconName="arrowleft"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        {pageLoader ? renderLoader() : null}
        {!isEmpty(policyDetail) ? (
          <WebView
            originWhitelist={['*']}
            source={{
              html: !isEmpty(policyDetail)
                ? `${defaultHead}${policyDetail}`
                : '',
            }}
            style={{ backgroundColor: BaseColors.white }}
            scrollEnabled
            scalesPageToFit={false}
            showsVerticalScrollIndicator={false}
            onLoadEnd={() => setPageLoader(false)}
          />
        ) : (
          isEmpty(policyDetail) &&
          !pageLoader && (
            <View style={styles.loaderView}>
              <CNoData />
            </View>
          )
        )}
      </View>
    </>
  );
}
