/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { isArray, isBoolean } from 'lodash';
import { BaseColors } from '../../config/theme';
import { StoryType } from './src';

const { CubeNavigationHorizontal } = require('react-native-3dcube-navigation');
import IIcon from 'react-native-vector-icons/MaterialIcons';

import StoryContainer from './src/StoryContainer';
import { useSelector } from 'react-redux';

type Props = {
  data: StoryType[];
  containerAvatarStyle?: StyleSheet.Styles;
  avatarStyle?: StyleSheet.Styles;
  titleStyle?: StyleSheet.Styles;
  textReadMore?: string;
  userId?: Number;
  loader?: Boolean;
  from?: string;
  openCamera?: Function;
  navigation?: Function;
};

const Stories = (props: Props) => {
  const { userData } = useSelector((state) => state.auth);
  console.log('userData', userData.id);
  console.log(props);
  console.log('====================================');
  const [isModelOpen, setModel] = useState(false);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentScrollValue, setCurrentScrollValue] = useState(0);
  const modalScroll = useRef(null);

  const onStorySelect = (index) => {
    setCurrentUserIndex(index);
    setModel(true);
  };

  const onStoryClose = () => {
    setModel(false);
  };

  const onStoryNext = (isScroll: boolean) => {
    const newIndex = currentUserIndex + 1;
    const isUser = props?.data[currentUserIndex].user_id === props.userId;
    if (isBoolean(isUser) && isUser) {
      setModel(false);
    } else if (props.data.length - 1 > currentUserIndex) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        //erro aqui
        try {
          modalScroll.current.scrollTo(newIndex, true);
        } catch (e) {
          console.warn('error=>', e);
        }
      }
    } else {
      setModel(false);
    }
  };

  const onStoryPrevious = (isScroll: boolean) => {
    const newIndex = currentUserIndex - 1;
    if (currentUserIndex > 0) {
      setCurrentUserIndex(newIndex);
      if (!isScroll) {
        modalScroll.current.scrollTo(newIndex, true);
      }
    }
  };

  const onScrollChange = (scrollValue) => {
    if (currentScrollValue > scrollValue) {
      onStoryNext(true);
      console.log('next');
      setCurrentScrollValue(scrollValue);
    }
    if (currentScrollValue < scrollValue) {
      onStoryPrevious(false);
      console.log('previous');
      setCurrentScrollValue(scrollValue);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={props.data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        renderItem={({ item, index }) => {
          const uName = item?.username?.split(' ');
          const lIndex = props?.data?.length - 1;
          return (
            <View
              style={{
                marginLeft: props.from === 'chat' ? 0 : index === 0 ? 20 : 15,
                marginRight:
                  props.from === 'chat' ? 0 : lIndex === index ? 20 : 0,
              }}>
              {userData.id === item.user_id && (
                <View style={styles.addIconStyle}>
                  <IIcon
                    name="add"
                    style={{
                      fontSize: 18,
                      color: '#FFF',
                      marginLeft: 1,
                      marginTop: 1,
                    }}
                    onPress={() => {
                      // refRBSheet.current.open();
                      if (props.openCamera) {
                        props.openCamera();
                      }
                      console.log('heloooooooooooooo');
                    }}
                  />
                </View>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (isArray(item?.stories) && item?.stories.length > 0) {
                    onStorySelect(index);
                  } else if (props.openCamera) {
                    props.openCamera();
                  }
                }}
                style={styles.imgContainer}>
                <View style={[styles.superCircle, props.containerAvatarStyle]}>
                  <Image
                    style={[styles.circle, props.avatarStyle]}
                    source={{ uri: item.profile }}
                  />

                  {props.loader && props.userId === item.user_id && (
                    <View style={styles.loaderView}>
                      <ActivityIndicator
                        color={BaseColors.primary}
                        size="small"
                      />
                    </View>
                  )}
                </View>
                {props.from === 'chat' ? null : (
                  <Text style={[styles.title, props.titleStyle]}>
                    {uName[0] || ''}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <Modal
        animationType="slide"
        transparent={false}
        visible={isModelOpen}
        style={styles.modal}
        onShow={() => {
          if (currentUserIndex > 0) {
            modalScroll.current.scrollTo(currentUserIndex, false);
          }
        }}
        onRequestClose={onStoryClose}>
        <CubeNavigationHorizontal
          callBackAfterSwipe={(g) => onScrollChange(g)}
          ref={modalScroll}
          style={styles.container}>
          {props.data.map((item, index) => (
            <StoryContainer
              key={item.title}
              onClose={onStoryClose}
              onStoryNext={onStoryNext}
              onStoryPrevious={onStoryPrevious}
              dataStories={item}
              isNewStory={index !== currentUserIndex}
              textReadMore={props.textReadMore}
              handleModal={(id) => {
                console.log('id ===>>', id);
                if (props.userId !== id) {
                  setModel(false);
                  props.navigation.push('Profile', {
                    from: 'friends',
                    id: id,
                  });
                }
              }}
            />
          ))}
        </CubeNavigationHorizontal>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  boxStory: {
    marginLeft: 15,
  },
  ItemSeparator: { height: 1, backgroundColor: '#ccc' },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,255)',
    paddingBottom: 5,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  superCircle: {
    borderWidth: 3,
    borderColor: BaseColors.primary,
    borderRadius: 60,
    height: 55,
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: { alignItems: 'center' },
  modal: {
    flex: 1,
  },
  title: {
    marginTop: 4,
    textAlign: 'center',
  },
  loaderView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconStyle: {
    zIndex: 10,
    elevation: 25,
    position: 'absolute',
    top: 32,
    right: 0,
    backgroundColor: BaseColors.primary,
    borderRadius: 13,
    height: 23,
    width: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Stories;
