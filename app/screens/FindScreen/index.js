import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { BaseColors,FontFamily } from '@config/theme';
import styles from './styles';
import { Button } from '@components';
import { Images } from '@config';

export default function FindScreen({ navigation }) {
  const confettiRef = useRef();
  return (
    <>
      <View style={styles.mainview}>
        <View style={{}}>
          <Image source={Images.find} style={styles.img1} />
        </View>
      </View>
      <View style={styles.btmView}>
        <View style={styles.view2}>
          <Text style={styles.txt1}>Find Friends</Text>
          <Text style={styles.txt2}>
            Add some friends and see more {'\n'}
            parties of your friends
          </Text>
        </View>
      </View>
     

      <View style={styles.btnView}>
        <Button
          type="primary"
          onPress={() => {
           
            navigation.navigate('Find_Friend');
          }}>
          Continue
        </Button>
        
      </View>
    </>
  );
}
