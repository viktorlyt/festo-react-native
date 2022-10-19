/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { Images } from '@config';
import FIcon from 'react-native-vector-icons/AntDesign';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Image from 'react-native-fast-image';
import { BaseColors } from '@config/theme';
import _ from 'lodash';

const WIDTH = Dimensions.get('window').width - 120;
const styles = StyleSheet.create({
  profileImgSelect: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  imageView: {
    height: 72,
    borderRadius: 6,
    width: 70,
    margin: 5,
    backgroundColor: BaseColors.white,
    overflow: 'hidden',
  },
  mainViewStyMultiple: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColors.white,
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10000,
  },
});

const CUploadImages = (props) => {
  const {
    loaderRemove,
    onPressUpload,
    uploadStyle,
    BtnViewSty,
    umImages,
    removeImage,
  } = props;
  const [isMain, setIsMain] = useState(0);
  const [selectedRemove, setSelectedRemove] = useState({});
  const arrayImage = [
    {
      id: 1,
      image: Images.addImage,
    },
    {
      id: 2,
      image: Images.addImage,
    },
    {
      id: 3,
      image: Images.addImage,
    },
    {
      id: 4,
      image: Images.addImage,
    },
    {
      id: 5,
      image: Images.addImage,
    },
  ];

  const multipleLenght =
    _.isArray(umImages) && !_.isEmpty(umImages) ? umImages.length - 1 : '-1';

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        marginBottom: 10,
        marginLeft: -2,
      }}>
      <View
        // activeOpacity={0.5}
        // onPress={onPressUpload}
        style={[styles.profileImgSelect, uploadStyle]}>
        {arrayImage.map((item, index) => {
          return !_.isEmpty(umImages) &&
            _.isArray(umImages) &&
            index <= multipleLenght ? (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={() => {
                setIsMain(index);
              }}>
              <Image
                style={[
                  styles.imageView,
                  {
                    width: WIDTH / 4,
                    borderColor: BaseColors.primary,
                    borderWidth: 2,
                  },
                ]}
                source={{
                  uri: !_.isUndefined(umImages[index].path)
                    ? umImages[index].path
                    : null,
                }}
              />

              <TouchableOpacity
                activeOpacity={0.5}
                // disabled={index === isMain ? true : false}
                onPress={() => {
                  setSelectedRemove(umImages[index]);
                  Alert.alert(
                    'Remove',
                    'Are you sure you want to remove this photo?',
                    [
                      {
                        text: 'No',
                        onPress: () => {},
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          removeImage(index, umImages[index]);
                        },
                      },
                    ],
                  );
                }}
                style={[
                  styles.mainViewStyMultiple,
                  BtnViewSty,
                  {
                    borderColor: BaseColors.primary,
                    borderWidth: 1,
                  },
                ]}>
                {loaderRemove && umImages[index] === selectedRemove ? (
                  <ActivityIndicator
                    size={10}
                    color={BaseColors.primary}
                    animating
                  />
                ) : (
                  <FIcon name={'close'} size={10} color={BaseColors.primary} />
                )}
              </TouchableOpacity>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                onPressUpload();
              }}
              style={[
                styles.imageView,
                {
                  borderStyle: 'dashed',
                  borderRadius: 6,
                  borderWidth: 1,
                  backgroundColor: BaseColors.white,
                  borderColor: BaseColors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: WIDTH / 4,
                  zIndex: 1000,
                },
              ]}>
              <MIcon name="plus" size={30} color={BaseColors.primary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CUploadImages;
