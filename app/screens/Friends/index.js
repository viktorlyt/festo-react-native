/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import styles from './styles';
import { Button, Header, AlertModal } from '@components';
import { BaseColors } from '@config/theme';
import AIcon from 'react-native-vector-icons/AntDesign';
import Image from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import { getApiData } from '@utils/apiHelper';
import BaseSetting from '@config/setting';
import CNoData from '@components/CNoData';
import { isEmpty } from 'lodash';
import { Images } from '@config';

/**
 * Module   Friends
 * @module   Friends
 *
 */

const ModalPoup = ({ visible, children }) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(true);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ scale: scaleValue }] },
          ]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};
export default function Friends({ navigation, route }) {
  const [cAlert, setCAlert] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [userFriList, setuserFriList] = useState([]);

  useEffect(() => {
    getUserFriList();
  }, []);

  // this function for userFriendList  list
  async function getUserFriList() {
    setPageLoad(true);
    try {
      const response = await getApiData(
        BaseSetting.endpoints.totalFriends,
        'GET',
      );
      console.log(response);
      if (response.status) {
        setuserFriList(response.data.rows);
      } else {
        console.log('No data Found');
        setPageLoad(false);
      }
      setPageLoad(false);
    } catch (error) {
      console.log('error ===>>>', error);
      setPageLoad(false);
    }
  }
  function renderEmptyComponent() {
    return <CNoData titleText="Oops! 😜" descriptionText="Go make some new friends" />;
  }
  const refRBSheet = useRef();

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.item}>
        <View style={styles.profileTitleView}>
          <Image
            source={
              isEmpty(item?.photo) ? Images?.usrImg : { uri: item?.photo }
            }
            style={styles.userImg}
          />
          <View style={styles.usernameView}>
            <Text numberOfLines={1} style={styles.title}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.friend}>
              Friend
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => setVisible(true)}
          style={[
            styles.button,
            {
              borderWidth: item.type === 'Add' ? 1 : 0,
              backgroundColor:
                item.type === 'Add' ? BaseColors.white : BaseColors.lightRed,
            },
          ]}>
          {item.type === 'Add' ? (
            <>
              <AIcon
                style={styles.addIcon}
                name="plus"
                size={20}
                color={BaseColors.secondary}
              />

              <Text style={styles.btnTxt}>Add</Text>
            </>
          ) : (
            <Text style={styles.btnTxt}>Friends</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Header title="" />

      <View style={styles.container}>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          height={Dimensions.get('window').height - 30}
          customStyles={{
            wrapper: {
              // backgroundColor: BaseColors.primary,
            },
            draggableIcon: {
              backgroundColor: '#F3492E',
              width: 50,
            },
            container: {
              backgroundColor: BaseColors.white,
              borderTopRightRadius: 45,
              borderTopLeftRadius: 45,
            },
          }}>
          <View style={{}}>
            <Text style={styles.Text1}>345 Friends</Text>
          </View>

          {pageLoad ? (
            <>
              <View style={styles.loaderView}>
                <ActivityIndicator color={BaseColors.primary} size="large" />
              </View>
            </>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
              data={userFriList}
              bounces={false}
              renderItem={renderItem}
              ListEmptyComponent={renderEmptyComponent}
              keyExtractor={(item) => item.id}
            />
          )}
          <View style={styles.btnView}>
            <Button
              type="primary"
              onPress={() => {
                refRBSheet.current.close();
                navigation.navigate('Chat');
              }}>
              Done
            </Button>
          </View>
        </RBSheet>
        {cAlert ? (
          <AlertModal
            title=" "
            visible={cAlert.showAlert}
            setVisible={setCAlert}
            description={cAlert.message || 'Are you sure you want to block?'}
            btnYTitle={'Block'}
            btnNTitle={"Don't Block"}
          />
        ) : null}
        <View style={styles.btnView}>
          <Button type="primary" onPress={() => refRBSheet.current.open()}>
            Total Friend
          </Button>
        </View>
        <View style={{ flex: 1 }}>
          <ModalPoup visible={visible}>
            <View
              style={{
                alignItems: 'flex-start',
                paddingLeft: 10,
                paddingRight: 10,
              }}>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={{ color: 'black', fontSize: 18 }}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text
                  style={{ color: 'black', fontSize: 18, marginVertical: 15 }}>
                  View Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Text style={{ color: 'black', fontSize: 18 }}>Unfriend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  setCAlert(true);
                }}>
                <Text
                  style={{ color: 'black', fontSize: 18, marginVertical: 15 }}>
                  Block
                </Text>
              </TouchableOpacity>
            </View>
          </ModalPoup>
        </View>
      </View>
    </>
  );
}
