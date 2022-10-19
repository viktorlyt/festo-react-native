/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { Text } from '@components';
import {
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Button } from '@components';
import Image from 'react-native-fast-image';
import styles from './styles';
import { BaseColors } from '@config/theme';
import CNoData from '@components/CNoData';
import _, { isEmpty } from 'lodash';
import { ListContentLoader } from '@components/ContentLoader';
import { Images } from '@config';
import { useSelector } from 'react-redux';

const ListModal = (props) => {
  const {
    ListArray,
    pageLoad,
    btnTitle,
    handleMainBtn,
    itemBtn,
    handleInvite,
    handleCancel,
    handleFriends,
    handleUnblock,
    handleJoined,
    buttonloader,
    renderFooterComponent,
    onRefresh,
    refreshLoader,
    onEndReached,
    handleProfileClick,
  } = props;

  const [selectedItem, seSelectedItem] = useState({});
  const { userData } = useSelector((state) => state.auth);

  const renderItem = ({ item, index }) => {
    const isMe = Number(userData?.id) === Number(item?.id);
    const itemBtnTitle =
      itemBtn === 'invite-friends'
        ? item.is_invited_by_me === 1
          ? 'Cancel'
          : 'Invite'
        : itemBtn === 'friends-list'
        ? 'Friends'
        : itemBtn === 'block-list'
        ? 'Unblock'
        : itemBtn === 'invited-Friend-list'
        ? 'Joined'
        : '';

    return (
      <View style={styles.item}>
        <TouchableOpacity
          activeOpacity={isMe ? 1 : 1}
          style={styles.profileTitleView}
          onPress={() => {
            if (isMe) {
              return null;
            } else {
              // handleProfileClick(item);
            }
          }}>
          <Image
            source={
              isEmpty(item?.photo) ? Images?.usrImg : { uri: item?.photo }
            }
            // source={require('@assets/Images/profile.jpeg')}
            style={styles.ProfileImg}
          />
          <View style={styles.usernameView}>
            <Text numberOfLines={1} style={styles.userName}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={styles.friend}>
              Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={itemBtn === 'invited-Friend-list' ? 1 : 0.5}
          onPress={
            buttonloader
              ? null
              : () => {
                  seSelectedItem(item);
                  if (itemBtn === 'invite-friends') {
                    if (item.is_invited_by_me === 1) {
                      handleCancel(item);
                    } else {
                      handleInvite(item);
                    }
                  } else if (itemBtn === 'friends-list') {
                    handleFriends();
                  } else if (itemBtn === 'block-list') {
                    handleUnblock(item);
                  } else if (itemBtn === 'invited-Friend-list') {
                    return null;
                  }
                }
          }
          style={[
            styles.joinbutton,
            {
              borderWidth:
                item.is_invited_by_me === 1 ||
                item?.status ||
                itemBtn === 'block-list'
                  ? 0
                  : 1,
              backgroundColor:
                item.is_invited_by_me === 1 ||
                item?.status ||
                itemBtn === 'block-list'
                  ? BaseColors.lightRed
                  : BaseColors.white,
            },
          ]}>
          {buttonloader && item.id === selectedItem.id ? (
            <View style={{ paddingHorizontal: 15 }}>
              <ActivityIndicator
                animating
                color={BaseColors.primary}
                size={'small'}
              />
            </View>
          ) : (
            <Text style={styles.btnTxt}>{itemBtnTitle}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  function renderEmptyComponent() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CNoData />
      </View>
    );
  }
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={styles.titleImgView} />
      {pageLoad ? (
        <>
          <View style={styles.loaderView}>
            <ListContentLoader />
          </View>
        </>
      ) : !_.isEmpty(ListArray) && _.isArray(ListArray) ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          data={ListArray}
          bounces={false}
          renderItem={renderItem}
          renderFooterComponent={renderFooterComponent}
          keyExtractor={(item) => item.id}
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
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
      ) : (
        renderEmptyComponent()
      )}
      {itemBtn === 'block-list' ? null : (
        <View style={styles.listBtn}>
          <Button type="primary" onPress={() => handleMainBtn(itemBtn)}>
            {btnTitle}
          </Button>
        </View>
      )}
    </View>
  );
};

export default ListModal;
