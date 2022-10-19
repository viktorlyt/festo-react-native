/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Text } from '@components';
import { View, TouchableOpacity } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import AIcon from 'react-native-vector-icons/AntDesign';
import styles from './styles';
import { BaseColors } from '@config/theme';
import _ from 'lodash';

const SelectPhotoModal = (props) => {
  const { refRBSheet, title, optionsArray } = props;

  return (
    <RBSheet
      ref={refRBSheet}
      closeOnDragDown={true}
      closeOnPressMask={true}
      height={250}
      dragFromTopOnly={true}
      customStyles={{
        wrapper: {},
        draggableIcon: {
          backgroundColor: '#F3492E',
          width: 50,
        },
        container: {
          backgroundColor: 'white',
          borderTopRightRadius: 45,
          borderTopLeftRadius: 45,
        },
      }}>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          fontSize: 20,
          fontWeight: '700',
          paddingVertical: 10,
        }}>
        {title}
      </Text>

      {!_.isEmpty(optionsArray) && _.isArray(optionsArray)
        ? optionsArray.map((it, ii) => {
            return (
              <View>
                <TouchableOpacity activeOpacity={0.5} onPress={it.handleClick}>
                  <View style={styles.modalRowView}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <FAIcon
                        style={styles.leftIcon}
                        size={25}
                        color={BaseColors.textGrey}
                        name={it.optionIcon}
                      />
                      <View
                        style={{
                          marginLeft: 10,
                        }}>
                        <Text style={[styles.modelTxt]}>{it.optionTitle}</Text>
                      </View>
                    </View>
                    <AIcon
                      size={20}
                      color={BaseColors.borderColor}
                      name="right"
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })
        : null}
    </RBSheet>
  );
};

export default SelectPhotoModal;
